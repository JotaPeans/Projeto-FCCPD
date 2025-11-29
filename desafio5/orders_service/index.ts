import { Elysia } from "elysia";

const ORDERS_MOCK = [
  {
    id: 1,
    userId: 1,
    product: "JBL Boombox 4",
    quantity: 2,
    totalPrice: 2800.0,
  },
  { id: 2, userId: 2, product: "IPhone 16", quantity: 1, totalPrice: 8000.0 },
  {
    id: 3,
    userId: 3,
    product: "Apple Watch Series 9",
    quantity: 3,
    totalPrice: 4000.0,
  },
  {
    id: 4,
    userId: 4,
    product: "Apple AirPods Pro",
    quantity: 2,
    totalPrice: 1800.0,
  },
  {
    id: 5,
    userId: 5,
    product: "Macbook air M4",
    quantity: 1,
    totalPrice: 11500.0,
  },
];

new Elysia()
  .get("/orders", async () => {
    const log = `Client requested server at ${new Date().toISOString()}`;
    console.log("[GET] /orders ->", log);

    return {
      data: ORDERS_MOCK,
    };
  })
  .listen(8080);

console.log("Orders service is running on port 8080");
