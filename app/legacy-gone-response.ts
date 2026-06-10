const legacyGoneHeaders = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex, noarchive",
};

export function createLegacyGoneResponse() {
  return new Response("This legacy route has been permanently removed.", {
    status: 410,
    headers: legacyGoneHeaders,
  });
}

export function createLegacyGoneHeadResponse() {
  return new Response(null, {
    status: 410,
    headers: legacyGoneHeaders,
  });
}
