const ODDS_API_ORIGIN = "https://api.the-odds-api.com/v4";
const ODDS_API_FALLBACK_KEY = "0a9a20c6b8b08c7cec9ed49704a8ffab";

function deriveOddsPath(req) {
  const rawPath = req.query.target ?? req.query.path ?? req.query["...path"] ?? req.query[0];
  const pathParts = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];
  const queryPath = pathParts.join("/");
  if (queryPath) return queryPath;
  return decodeURIComponent((req.url || "").split("?")[0].replace(/^\/api\/odds\/?/, ""));
}

function sendJson(res, status, payload) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

function candidateApiKeys() {
  const keys = [];
  if (ODDS_API_FALLBACK_KEY) keys.push(ODDS_API_FALLBACK_KEY);
  if (process.env.ODDS_API_KEY && process.env.ODDS_API_KEY !== ODDS_API_FALLBACK_KEY) {
    keys.push(process.env.ODDS_API_KEY);
  }
  return keys;
}

function buildUpstream(path, query, apiKey) {
  const upstream = new URL(ODDS_API_ORIGIN + "/" + path);
  for (const [key, value] of Object.entries(query)) {
    if (key === "target" || key === "path" || key === "...path" || key === "0" || key.toLowerCase() === "apikey") continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item != null) upstream.searchParams.append(key, String(item));
    }
  }
  upstream.searchParams.set("apiKey", apiKey);
  return upstream;
}

export default async function handler(req, res) {
  const keys = candidateApiKeys();
  if (!keys.length) {
    sendJson(res, 500, { error: "ODDS_API_KEY is not configured" });
    return;
  }

  const path = deriveOddsPath(req);
  if (!path || path.includes("..") || path.startsWith("/")) {
    sendJson(res, 400, { error: "Invalid odds path" });
    return;
  }

  try {
    let response = null;
    let body = "";
    for (const apiKey of keys) {
      response = await fetch(buildUpstream(path, req.query, apiKey), { headers: { accept: "application/json" } });
      body = await response.text();
      if (response.status !== 401 && response.status !== 403) break;
    }

    res.status(response.status);
    res.setHeader("content-type", response.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    for (const header of ["x-requests-remaining", "x-requests-used", "x-requests-last"]) {
      const value = response.headers.get(header);
      if (value != null) res.setHeader(header, value);
    }
    res.end(body);
  } catch (error) {
    sendJson(res, 502, { error: "Odds API request failed" });
  }
}
