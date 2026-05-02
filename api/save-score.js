export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { name, score } = req.body;
  const PRIVATE_KEY = "waBsY9hwf0urcEpwwn8rLw1Z2xYyPvZEqGdwAay68VqQ";
  await fetch(`http://dreamlo.com{PRIVATE_KEY}/add/${encodeURIComponent(name)}/${score}`);
  res.status(200).json({ success: true });
}
