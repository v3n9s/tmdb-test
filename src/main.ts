import { createServer } from "http";

const backendUrl = "https://api.themoviedb.org";

createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.end();
    return;
  }
  console.log(req.url);
  res.setHeader("content-type", "application/json");
  fetch(backendUrl + req.url!).then(
    async (r) => {
      console.log(r);
      res.end(await r.text());
    },
    (e) => {
      console.log(e);
      res.end();
    },
  );
}).listen(process.env["PORT"] ?? 8000);
