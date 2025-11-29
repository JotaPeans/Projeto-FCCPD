import { Elysia } from "elysia";

const URL = process.env.SERVICE_A_URL;

type UserType = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

new Elysia()
  .get("/", async () => {
    const log = `Client requested server at ${new Date().toISOString()}`;
    console.log("[GET] / ->", log);
    
    const response = await fetch(URL + "/users");
    const data: UserType[] = await response.json() as any;

    const infos = data.map(
      (user) =>
        `O usuário ${user.name} (${user.email}) foi criado em ${new Date(user.createdAt).toLocaleString()}`
    );

    return {
      infos,
    };
  })
  .listen(8080);
