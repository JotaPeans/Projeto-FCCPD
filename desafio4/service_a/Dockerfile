FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY . .

RUN bun install

CMD ["bun", "run", "index.js"]
