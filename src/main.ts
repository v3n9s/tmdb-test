import { createServer, request } from "http";
import { config } from "./config.js";
import { routes } from "./routes.js";

createServer((req, res) => {
  const requestMethod = req.method as string;
  const host = req.headers.host ?? config.HOST;
  const url = new URL(req.url as string, "http://" + host);

  const matchedRoute = routes.find((route) =>
    route.matcher({ method: requestMethod, pathname: url.pathname }),
  );

  if (!matchedRoute) {
    res.writeHead(404).end();
    return;
  }

  const searchParamsObject = Object.fromEntries(url.searchParams);
  if (!matchedRoute.validate({ pathname: url.pathname, searchParamsObject })) {
    res.writeHead(400).end();
    return;
  }

  const targetUrl = new URL(
    req.url as string,
    matchedRoute.baseUrl ?? config.API_BASE_URL,
  );

  const proxiedRequest = request(
    targetUrl,
    {
      method: requestMethod,
      headers: { authorization: "Bearer " + config.API_TOKEN },
    },
    (proxidResponse) => {
      res.writeHead(
        proxidResponse.statusCode as number,
        proxidResponse.headers,
      );
      proxidResponse.pipe(res);
    },
  );

  req.pipe(proxiedRequest);
}).listen(config.PORT);
