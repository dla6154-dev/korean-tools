import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { ROOT_DIR, ensureDir, isDirectRun, loadOptionalEnvFiles } from "./growth-lib.mjs";

const DEFAULT_AUTH_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token";
const DEFAULT_REDIRECT_URI = "http://localhost:3000/auth/callback";
const DEFAULT_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

function getArgValue(args, name) {
  const flag = `--${name}`;
  const index = args.indexOf(flag);
  if (index === -1) {
    return "";
  }

  return args[index + 1] ?? "";
}

function hasFlag(args, name) {
  return args.includes(`--${name}`);
}

function readTrimmedEnv(name) {
  return String(process.env[name] ?? "").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveClientConfig(args) {
  const envClientId = readTrimmedEnv("GOOGLE_OAUTH_CLIENT_ID");
  const envClientSecret = readTrimmedEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const envRedirectUri = readTrimmedEnv("GOOGLE_OAUTH_REDIRECT_URI");

  if (envClientId && envClientSecret) {
    return {
      clientId: envClientId,
      clientSecret: envClientSecret,
      redirectUri: envRedirectUri || DEFAULT_REDIRECT_URI,
      authUri: DEFAULT_AUTH_URI,
      tokenUri: DEFAULT_TOKEN_URI,
    };
  }

  const clientSecretPath = getArgValue(args, "client-secret") || readTrimmedEnv("GOOGLE_OAUTH_CLIENT_SECRET_PATH");
  if (!clientSecretPath) {
    throw new Error(
      "Missing OAuth client config. Pass --client-secret <path> or set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.",
    );
  }

  const resolvedPath = path.resolve(clientSecretPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`OAuth client secret file not found: ${resolvedPath}`);
  }

  const payload = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  const client = payload.web ?? payload.installed;
  if (!client?.client_id || !client?.client_secret) {
    throw new Error("OAuth client secret file must contain a web or installed client definition.");
  }

  return {
    clientId: client.client_id,
    clientSecret: client.client_secret,
    redirectUri:
      getArgValue(args, "redirect-uri") ||
      envRedirectUri ||
      client.redirect_uris?.[0] ||
      DEFAULT_REDIRECT_URI,
    authUri: client.auth_uri || DEFAULT_AUTH_URI,
    tokenUri: client.token_uri || DEFAULT_TOKEN_URI,
  };
}

function validateRedirectUri(redirectUri) {
  const url = new URL(redirectUri);
  const supportedHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

  if (url.protocol !== "http:" || !supportedHosts.has(url.hostname)) {
    throw new Error(
      `Redirect URI must be a local http callback such as ${DEFAULT_REDIRECT_URI}. Received: ${redirectUri}`,
    );
  }

  return url;
}

function buildAuthUrl(config, scopes) {
  const state = crypto.randomBytes(24).toString("hex");
  const url = new URL(config.authUri);

  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);

  return {
    state,
    url: url.toString(),
  };
}

async function exchangeCodeForTokens({ code, config }) {
  const response = await fetch(config.tokenUri, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange OAuth code: ${response.status} ${errorText}`);
  }

  return response.json();
}

function upsertEnvValues(filePath, values) {
  ensureDir(path.dirname(filePath));
  const lines = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").split(/\r?\n/) : [];

  for (const [key, value] of Object.entries(values)) {
    const nextLine = `${key}=${value}`;
    const matcher = new RegExp(`^\\s*(?:export\\s+)?${escapeRegExp(key)}=`);
    const existingIndex = lines.findIndex((line) => matcher.test(line));

    if (existingIndex >= 0) {
      lines[existingIndex] = nextLine;
    } else {
      lines.push(nextLine);
    }
  }

  while (lines.length > 0 && lines.at(-1) === "") {
    lines.pop();
  }

  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

export async function authorizeGrowthOAuth(args = process.argv.slice(2), options = {}) {
  loadOptionalEnvFiles();

  const config = resolveClientConfig(args);
  const redirectUrl = validateRedirectUri(config.redirectUri);
  const scopes = DEFAULT_SCOPES;
  const envFilePath = path.resolve(getArgValue(args, "env-file") || path.join(ROOT_DIR, ".env.local"));
  const writeEnv = hasFlag(args, "write-env");
  const authUrlFile = getArgValue(args, "auth-url-file");
  const timeoutMs = Number.parseInt(getArgValue(args, "timeout-ms") || "", 10) || 10 * 60 * 1000;
  const { state, url } = buildAuthUrl(config, scopes);

  if (authUrlFile) {
    const resolvedAuthUrlFile = path.resolve(authUrlFile);
    ensureDir(path.dirname(resolvedAuthUrlFile));
    fs.writeFileSync(resolvedAuthUrlFile, `${url}\n`, "utf8");
  }

  if (typeof options.onReady === "function") {
    await options.onReady({
      authUrl: url,
      envFilePath,
      scopes,
      writeEnv,
    });
  }

  const tokenPayload = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.close(() => {
        reject(new Error(`Timed out waiting for OAuth callback after ${timeoutMs}ms.`));
      });
    }, timeoutMs);

    const server = http.createServer(async (request, response) => {
      try {
        const requestUrl = new URL(request.url || "/", config.redirectUri);
        if (requestUrl.pathname !== redirectUrl.pathname) {
          response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
          response.end("Not found.");
          return;
        }

        const returnedState = requestUrl.searchParams.get("state");
        const code = requestUrl.searchParams.get("code");
        const error = requestUrl.searchParams.get("error");

        if (error) {
          throw new Error(`Google OAuth returned an error: ${error}`);
        }

        if (!code || returnedState !== state) {
          throw new Error("Invalid OAuth callback state or missing authorization code.");
        }

        const tokens = await exchangeCodeForTokens({ code, config });
        if (!tokens.refresh_token) {
          throw new Error(
            "Google did not return a refresh token. Revoke the prior grant or repeat the flow with a new consent.",
          );
        }

        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end("<html><body><h1>Growth OAuth connected.</h1><p>You can close this window.</p></body></html>");
        clearTimeout(timer);
        server.close(() => resolve(tokens));
      } catch (error) {
        response.writeHead(500, { "content-type": "text/html; charset=utf-8" });
        response.end("<html><body><h1>OAuth failed.</h1><p>Return to Codex for details.</p></body></html>");
        clearTimeout(timer);
        server.close(() => reject(error));
      }
    });

    server.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    server.listen(Number(redirectUrl.port || 80), redirectUrl.hostname);
  });

  const result = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    refreshToken: tokenPayload.refresh_token,
    scope: tokenPayload.scope,
  };

  if (writeEnv) {
    upsertEnvValues(envFilePath, {
      GOOGLE_OAUTH_CLIENT_ID: result.clientId,
      GOOGLE_OAUTH_CLIENT_SECRET: result.clientSecret,
      GOOGLE_OAUTH_REFRESH_TOKEN: result.refreshToken,
      GOOGLE_OAUTH_REDIRECT_URI: result.redirectUri,
    });
  }

  return {
    authUrl: url,
    envFilePath,
    scope: result.scope,
    writeEnv,
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  authorizeGrowthOAuth(process.argv.slice(2), {
    onReady: ({ authUrl }) => {
      console.log(`Open this URL to approve Growth OAuth:\n${authUrl}`);
    },
  })
    .then((result) => {
      if (result.writeEnv) {
        console.log(`Saved OAuth credentials to ${path.relative(process.cwd(), result.envFilePath)}`);
      }
      console.log(`Scopes: ${result.scope || DEFAULT_SCOPES.join(" ")}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}
