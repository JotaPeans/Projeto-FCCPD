import { Elysia } from "elysia";
import { SQL } from "bun";
import { createClient } from "redis";

// Configuração do PostgreSQL (Banco de Dados)

async function waitForPostgres(db: SQL) {
  while (true) {
    try {
      await db`SELECT 1`;
      console.log("Postgres conectado");
      break;
    } catch {
      console.log("Aguardando Postgres iniciar...");
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

const db = new SQL("postgres://root:root@challenge_3_database:5432/postgres");

// Aguarda Postgres ficar pronto
await waitForPostgres(db);

// Cria tabela se não existir
await db`
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE
    );
`;

// Insere 1 registro se a tabela estiver vazia
const rows = await db`SELECT COUNT(*) FROM usuarios`;
if (Number(rows[0].count) === 0) {
  await db`INSERT INTO usuarios (nome, email) VALUES ('joao', 'joao@inicial.com')`;   
}

// ===========================================================

// Configuração do Redis (Cache)
const redis = createClient({ url: "redis://challenge_3_cache:6379" });

redis.on("error", (err) => console.error("Redis error:", err));
await redis.connect();

// ===========================================================

// Web
new Elysia()
  .get("/", async () => {
    const items = await db`SELECT * FROM usuarios`;
    const hits = await redis.incr("hits");

    return {
      mensagem: "Servidor OK",
      acessos: hits,
      dados: items,
    };
  })
  .listen(3000);

console.log("Server running on http://localhost:3000");
