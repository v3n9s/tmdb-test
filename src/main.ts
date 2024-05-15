import { createServer } from "http";

const backendUrl = "https://api.themoviedb.org";

createServer((req, res) => {
  console.log(req.url);
  res.setHeader("content-type", "application/json");
  fetch(backendUrl + req.url!).then(
    (r) => {
      console.log(r);
      res.end(JSON.stringify(r));
    },
    (e) => {
      console.log(e);
      res.end(JSON.stringify(e));
    },
  );
}).listen(8000);
