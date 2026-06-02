export const config = { runtime: "edge" };

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KEY = "anjie_jobs";

async function kvGet() {
  const r = await fetch(`${KV_URL}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  const d = await r.json();
  return d.result ? JSON.parse(d.result) : [];
}

async function kvSet(jobs) {
  await fetch(`${KV_URL}/set/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(jobs))
  });
}

export default async function handler(req) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") return new Response(null, { headers });

  if (req.method === "GET") {
    const jobs = await kvGet();
    return new Response(JSON.stringify(jobs), { headers });
  }

  if (req.method === "POST") {
    const body = await req.json();
    await kvSet(body.jobs);
    return new Response(JSON.stringify({ ok: true }), { headers });
  }

  return new Response("Method not allowed", { status: 405, headers });
}
