import { data } from "./_data.js";

// Vercel serverless function -> GET /api/data
export default function handler(req, res) {
  res.status(200).json(data);
}