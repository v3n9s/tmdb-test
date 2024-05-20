import { createServer } from "http";

createServer((req, res) => {
  res.end();
}).listen(process.env["PORT"] ?? 8000);
