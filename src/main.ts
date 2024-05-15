import { createServer } from "http";

const backendUrl = "https://api.themoviedb.org";

createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.end();
    return;
  }

  console.log(req.url);
  fetch(backendUrl + req.url!, {
    headers: {
      accept: "application/json",
      authorization: "Bearer " + process.env["API_TOKEN"]!,
    },
  }).then(
    async (r) => {
      res.writeHead(r.status, [...r.headers]);
      res.end(await r.text());
    },
    (e) => {
      console.log(e);
      res.writeHead(500);
      res.end();
    },
  );
}).listen(process.env["PORT"] ?? 8000);
