import { createServer } from "http";

console.log(process.env["HOST"]);
console.log(process.env["TARGET_HOST"]);

createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.end();
    return;
  }

  console.log(req.headers.host, req.url);

  const targetUrl = new URL(
    req.url as string,
    "http://" +
      req.headers.host!.replace(
        new RegExp(`${process.env["HOST"]!}$`),
        process.env["TARGET_HOST"]!,
      ),
  );

  console.log(targetUrl.href);

  fetch(targetUrl, {
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
