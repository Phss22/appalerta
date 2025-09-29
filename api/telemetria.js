// api/telemetria.js
let LAST = {}; // { [device_id]: { data, received_at } }

export default async function handler(req, res) {
  // CORS básico (se testar no navegador)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const body = req.body && typeof req.body === 'object'
        ? req.body
        : JSON.parse(req.body || '{}');

      const device_id = String(body.device_id || 'unknown');
      LAST[device_id] = { data: body, received_at: Date.now() };

      // cache de 0s (sempre o mais recente)
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ ok: true, stored: device_id });
    } catch (e) {
      return res.status(400).json({ ok: false, error: String(e) });
    }
  }

  if (req.method === 'GET') {
    // ?id=heltec-01 para um device específico
    const { id } = req.query || {};
    const out = id ? (LAST[id] || null) : LAST;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(out);
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
