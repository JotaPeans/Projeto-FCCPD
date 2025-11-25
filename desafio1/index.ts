import { Elysia } from "elysia";

new Elysia()
  .get("/", () => {
    const log = `Client requested server at ${new Date().toISOString()}`;
    console.log("[GET] / ->", log);
    return "";
  })
  .listen(8080);
