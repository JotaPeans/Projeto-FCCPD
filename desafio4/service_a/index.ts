import { Elysia } from "elysia";

const USERS_MOCK = [
  { id: 1, name: "John Doe", email: "john@doe.com", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: 2, name: "Tico teco", email: "tico@teco.com", createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000) },
];

new Elysia()
  .get("/users", () => {
    const log = `Client requested server at ${new Date().toLocaleString()}`;
    console.log("[GET] /users ->", log);
    return USERS_MOCK;  
  })
  .listen(8080);
