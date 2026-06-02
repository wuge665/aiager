const RELAY_URL = 'http://107.175.116.156:8088/publish';
const RELAY_KEY = 'aiager-relay-2026-secret';

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'GET') {
    return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data = await request.json();
    if (!data || !data.title || !data.content) {
      return new Response(JSON.stringify({ error: 'title and content required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const relayRes = await fetch(RELAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': RELAY_KEY },
      body: JSON.stringify(data)
    });

    const relayData = await relayRes.json();
    if (!relayRes.ok) {
      return new Response(JSON.stringify({ error: relayData.error || 'relay failed' }), { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    return new Response(JSON.stringify({
      success: relayData.success,
      wordpress: relayData.wordpress,
      newsEntry: relayData.newsEntry,
      wpResult: relayData.wpResult,
      ghResult: relayData.ghResult
    }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
