const ODDS_API_ORIGIN = "https://api.the-odds-api.com/v4";
const FALLBACK_ODDS_API_KEY = "bab454819e9526707fa520d801f7ea7c";

function sendJson(res, status, payload) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  const apiKey = process.env.ODDS_API_KEY || FALLBACK_ODDS_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "ODDS_API_KEY is not configured" });
    return;
  }

  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const path = pathParts.join("/");
  if (!path || path.includes("..") || path.startsWith("/")) {
    sendJson(res, 400, { error: "Invalid odds path" });
    return;
  }

  const upstream = new URL(`${ODDS_API_ORIGIN}/${path}`);
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path" || key.toLowerCase() === "apikey") continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item != null) upstream.searchParams.append(key, String(item));
    }
  }
  upstream.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(upstream, { headers: { accept: "application/json" } });
    const body = await response.text();
    res.status(response.status);
    res.setHeader("content-type", response.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(body);
  } catch (error) {
    sendJson(res, 502, { error: "Odds API request failed" });
  }
}
