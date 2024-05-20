import { z } from "zod";
import { config } from "./config.js";

type Validator = {
  matcher: (arg: { method: string; pathname: string }) => boolean;
  validate: (arg: {
    pathname: string;
    searchParamsObject: { [k: string]: string };
  }) => boolean;
  baseUrl?: string;
};

export const routes: Validator[] = [
  {
    matcher: ({ method, pathname }) => {
      return method === "GET" && pathname === "/api/3/discover/movie";
    },
    validate: ({ searchParamsObject }) => {
      const searchParamsSchema = z
        .object({
          language: z.string().optional(),
          page: z.coerce.number().int().optional(),
          primary_release_year: z.coerce.number().int().optional(),
          sort_by: z.string().optional(),
          "vote_average.gte": z.coerce.number().optional(),
          "vote_average.lte": z.coerce.number().optional(),
          with_genres: z.string().optional(),
        })
        .strict();

      return searchParamsSchema.safeParse(searchParamsObject).success;
    },
  },
  {
    matcher: ({ method, pathname }) => {
      return method === "GET" && pathname === "/api/3/genre/movie/list";
    },
    validate: ({ searchParamsObject }) => {
      const searchParamsSchema = z
        .object({
          language: z.string().optional(),
        })
        .strict();

      return searchParamsSchema.safeParse(searchParamsObject).success;
    },
  },
  (() => {
    const staticPathPart = "/api/3/movie/";
    return {
      matcher: ({ method, pathname }) => {
        return method === "GET" && pathname.startsWith(staticPathPart);
      },
      validate: ({ pathname, searchParamsObject }) => {
        const pathSchema = z.coerce.number();
        const pathArg = pathname.slice(staticPathPart.length);
        const searchParamsSchema = z
          .object({
            append_to_response: z.string().optional(),
            language: z.string().optional(),
          })
          .strict();

        return (
          pathSchema.safeParse(pathArg).success &&
          searchParamsSchema.safeParse(searchParamsObject).success
        );
      },
    };
  })(),
  (() => {
    const staticPathPart = "/image/t/p/";
    return {
      matcher: ({ method, pathname }) => {
        return method === "GET" && pathname.startsWith(staticPathPart);
      },
      validate: ({ pathname }) => {
        const pathSchema = z.tuple([
          z.string(),
          z.union([z.string().endsWith(".png"), z.string().endsWith(".svg")]),
        ]);

        return pathSchema.safeParse(
          pathname.slice(staticPathPart.length).split("/"),
        ).success;
      },
      baseUrl: config.IMAGES_BASE_URL,
    };
  })(),
];
