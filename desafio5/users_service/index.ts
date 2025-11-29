import { Elysia } from "elysia";

const USERS_MOCK = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "Tico teco",
    email: "tico@email.com",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
  },
  {
    id: 3,
    name: "Tico teco 2",
    email: "tico2@email.com",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: "Whinderson",
    email: "whinderson@email.com",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: 5,
    name: "Julia",
    email: "julia@email.com",
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
  },
];

new Elysia()
  .get("/users", () => {
    const log = `Client requested server at ${new Date().toLocaleString()}`;
    console.log("[GET] /users ->", log);
    
    return {
      data: USERS_MOCK,
    };
  })
  .listen(8080);

console.log("Users service is running on port 8080");
