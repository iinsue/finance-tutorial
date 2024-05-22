import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// c 는 context 라는 의미
app
  .get("/hello", (c) => {
    return c.json({
      message: "Hello Next.js!",
    });
  })
  .get(
    "/hello/:test",
    zValidator(
      "param",
      z.object({
        test: z.number(),
      })
    ),
    (c) => {
      const { test } = c.req.valid("param");

      return c.json({
        message: "Hello World",
        test: test,
      });
    }
  )
  .post(
    "/create/:postId",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        userId: z.string(),
      })
    ),
    zValidator(
      "param",
      z.object({
        postId: z.number(),
      })
    ),
    (c) => {
      const { name, userId } = c.req.valid("json");
      const { postId } = c.req.valid("param");

      return c.json({});
    }
  );

// file based routing
export const GET = handle(app);
export const POST = handle(app);
