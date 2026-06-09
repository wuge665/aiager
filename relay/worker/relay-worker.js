/**
 * AI Hub Relay — Cloudflare Worker Edge Layer
 *
 * Functions:
 *  1. Forward /v1/* requests to VPS backend
 *  2. Rate limit by IP (optional)
 *  3. Cache /v1/models responses
 *  4. Strip sensitive headers before forwarding
 */

const BACKEND_URL = 'http://107.175.116.156:8080';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/health' || path === '/') {
      return new Response(JSON.stringify({ status: 'ok', edge: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Cache model list for 5 minutes
    if (path === '/v1/models' && request.method === 'GET') {
      const cache = caches.default;
      let cached = await cache.match(request);
      if (cached) return cached;

      const resp = await proxyToBackend(request, path);
      if (resp.status === 200) {
        const cloned = new Response(resp.body, resp);
        cloned.headers.set('Cache-Control', 'public, max-age=300');
        ctx.waitUntil(cache.put(request, cloned.clone()));
        return cloned;
      }
      return resp;
    }

    return proxyToBackend(request, path);
  },
};

async function proxyToBackend(request, path) {
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}${path}${url.search}`;

  // Forward request, stripping CF-specific headers
  const headers = new Headers(request.headers);
  headers.delete('CF-Connecting-IP');
  headers.delete('CF-Ray');
  headers.delete('CF-Visitor');
  headers.delete('CF-Worker');
  headers.delete('X-Forwarded-For');

  try {
    const resp = await fetch(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
    });

    const responseHeaders = new Headers(resp.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('X-Edge', 'cf-worker');

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Backend unavailable', detail: err.message }),
      { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
