const MLB_STATS_API_ORIGIN = "https://statsapi.mlb.com/api/v1";

function sendJson(res, status, payload) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default async function handler(req, res) {
  const date = Array.isArray(req.query.date) ? req.query.date[0] : req.query.date;
  if (!validDate(date)) {
    sendJson(res, 400, { error: "Valid date is required" });
    return;
  }

  const upstream = new URL(`${MLB_STATS_API_ORIGIN}/schedule`);
  upstream.searchParams.set("sportId", "1");
  upstream.searchParams.set("date", date);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(upstream, { headers: { accept: "application/json" }, signal: controller.signal }).finally(() => clearTimeout(timer));
    const body = await response.text();
    res.status(response.status);
    res.setHeader("content-type", response.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(body);
  } catch {
    sendJson(res, 502, { error: "MLB schedule request failed" });
  }
}
