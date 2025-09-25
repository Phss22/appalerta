// api/apac-rain.js
export default async function handler(req, res) {
  try {
    const { service, ...rest } = req.query;
    if (!service) return res.status(400).json({ error: 'Parâmetro "service" obrigatório' });

    const url = `${service}/query?` + new URLSearchParams({
      f: 'json',
      returnGeometry: 'false',
      outFields: '*',
      orderByFields: 'ultima_atualizacao DESC',
      resultRecordCount: '1',
      ...rest
    }).toString();

    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy APAC falhou', detail: String(e) });
  }
}
