import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { isDirectRun, loadOptionalEnvFiles } from "./growth-lib.mjs";

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.input ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
    input: options.input,
    cwd: options.cwd ?? process.cwd(),
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed: ${(result.stderr || result.stdout || "").trim()}`,
    );
  }

  return result.stdout.trim();
}

function inferRepository() {
  const explicit = process.env.GITHUB_REPOSITORY;
  if (explicit) {
    return explicit;
  }

  const remoteUrl = runCommand("git", ["config", "--get", "remote.origin.url"]);
  const httpsMatch = remoteUrl.match(/github\.com[/:]([^/]+\/[^/.]+)(?:\.git)?$/i);
  if (httpsMatch) {
    return httpsMatch[1];
  }

  throw new Error("Could not infer GitHub repository from remote.origin.url.");
}

function readTrimmedEnv(name) {
  return String(process.env[name] ?? "").trim();
}

function readServiceAccountSecretValue() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    return Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const filePath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    return fs.readFileSync(filePath, "utf8");
  }

  return "";
}

function readOAuthSecretValues() {
  const clientId = readTrimmedEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = readTrimmedEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const refreshToken = readTrimmedEnv("GOOGLE_OAUTH_REFRESH_TOKEN");
  const providedCount = [clientId, clientSecret, refreshToken].filter(Boolean).length;

  if (providedCount === 0) {
    return null;
  }

  if (providedCount !== 3) {
    throw new Error(
      "Incomplete Google OAuth credentials. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN before pushing secrets.",
    );
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
  };
}

function setSecret(repo, name, value) {
  runCommand("gh", ["secret", "set", name, "-R", repo], { input: value });
}

function setVariable(repo, name, value) {
  runCommand("gh", ["variable", "set", name, "-R", repo, "--body", value]);
}

export function pushGrowthSecrets() {
  loadOptionalEnvFiles();

  const repo = inferRepository();
  const propertyId = String(process.env.GA4_PROPERTY_ID ?? "").trim();
  const measurementId = String(process.env.GA4_MEASUREMENT_ID ?? "").trim();
  const siteUrl = String(process.env.GSC_SITE_URL ?? "").trim();
  const serviceAccountJson = readServiceAccountSecretValue().trim();
  const oauthSecrets = readOAuthSecretValues();
  const updatedSecrets = [];
  const updatedVariables = [];

  if (propertyId) {
    setVariable(repo, "GA4_PROPERTY_ID", propertyId);
    updatedVariables.push("GA4_PROPERTY_ID");
  }

  if (measurementId) {
    setVariable(repo, "GA4_MEASUREMENT_ID", measurementId);
    updatedVariables.push("GA4_MEASUREMENT_ID");
  }

  if (siteUrl) {
    setVariable(repo, "GSC_SITE_URL", siteUrl);
    updatedVariables.push("GSC_SITE_URL");
  }

  if (serviceAccountJson) {
    setSecret(repo, "GOOGLE_SERVICE_ACCOUNT_JSON", serviceAccountJson);
    updatedSecrets.push("GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  if (oauthSecrets) {
    setSecret(repo, "GOOGLE_OAUTH_CLIENT_ID", oauthSecrets.clientId);
    setSecret(repo, "GOOGLE_OAUTH_CLIENT_SECRET", oauthSecrets.clientSecret);
    setSecret(repo, "GOOGLE_OAUTH_REFRESH_TOKEN", oauthSecrets.refreshToken);
    updatedSecrets.push(
      "GOOGLE_OAUTH_CLIENT_ID",
      "GOOGLE_OAUTH_CLIENT_SECRET",
      "GOOGLE_OAUTH_REFRESH_TOKEN",
    );
  }

  const optionalVariables = [
    "GROWTH_GA4_END_OFFSET_DAYS",
    "GROWTH_GSC_END_OFFSET_DAYS",
    "GSC_SEARCH_TYPE",
  ];

  for (const name of optionalVariables) {
    const value = String(process.env[name] ?? "").trim();
    if (!value) {
      continue;
    }

    setVariable(repo, name, value);
    updatedVariables.push(name);
  }

  if (updatedSecrets.length === 0 && updatedVariables.length === 0) {
    throw new Error(
      "No growth secrets or variables were found in environment or .env.local.",
    );
  }

  return {
    repo,
    updatedSecrets,
    updatedVariables,
  };
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  try {
    const result = pushGrowthSecrets();
    console.log(`Growth secrets pushed to ${result.repo}`);
    console.log(`Secrets: ${result.updatedSecrets.join(", ")}`);
    console.log(
      `Variables: ${result.updatedVariables.length > 0 ? result.updatedVariables.join(", ") : "none"}`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
