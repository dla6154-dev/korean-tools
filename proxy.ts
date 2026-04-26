import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "rate-snap.com";
const LEGACY_HOST = "www.rate-snap.com";

export function proxy(request: NextRequest) {
  const hostname =
    request.headers.get("host")?.split(":")[0] ?? request.nextUrl.hostname;

  if (hostname === LEGACY_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    url.port = "";

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
