import { createServer } from "http";

const backendUrl = "https://api.themoviedb.org";

createServer((req, res) => {
  console.log(req.url);
  fetch(backendUrl + req.url!).then(
    (r) => {
      console.log(r);
    },
    (e) => {
      console.log(e);
    },
  );
  res.end();
}).listen(8000);
