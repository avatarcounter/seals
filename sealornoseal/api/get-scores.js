export default async function handler(req, res) {
  const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
  const response = await fetch(`http://dreamlo.com{PUBLIC_KEY}/json`);
  const data = await response.json();
  res.status(200).json(data);
}
