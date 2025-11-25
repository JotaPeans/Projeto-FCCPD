# Projeto-FCCPD

## Desafio 1: containers em Rede

Este desafio configura dois containers Docker que se comunicam por meio de uma rede bridge personalizada, garantindo isolamento entre eles. Um dos serviços executa um servidor construído com Bun e Elysia, enquanto o outro consiste em um script que realiza requisições via curl dentro de um while true, com intervalos de 5 segundos. O Docker Compose foi utilizado para criar simultaneamente tanto a rede quanto os serviços.

### INSTRUÇÕES DE EXECUÇÃO

**Pré requisitos**: Docker e Docker Compose instalados.

1. Navegue até o diretório do desafio ( `desafio1` )
2. Abra um novo terminal e digite `docker compose up` para iniciar o modo interativo e visualizar os logs em tempo real.

Rodando o comando, será possível ver os logs do servidor e do cliente, mostrando as requisições sendo feitas a cada 5 segundos.

Para encerrar a execução, use `Ctrl + C`

---

### ARQUITETURA

**Rede**: Uma rede do tipo bridge chamada `challenge-network-1` foi criada pra conectar exclusivamente esses dois containers.

**Container 1 (servidor)**: Usa a imagem `oven/bun:latest`. Essa imagem foi usada porque o servidor é construído com Bun, um runtime moderno para JavaScript e TypeScript. Além disso, o servidor web foi construído com Elysia, um framework web leve e rápido.

**Container 2 (cliente)**: Usa a imagem `alpine/curl`. Executa um script em shell que realiza uma requisição HTTP na rota '/' no container `challenge_server_1` a cada 5 segundos.

---

### DECISÕES TÉCNICAS

Docker compose: Foi usado o docker compose para facilitar a orquestração dos dois containers, garantindo a criação, também, da rede `challenge-network-1`, que conecta os dois serviços.

Nomes de serviço como DNS: Para acessar um serviço que está sendo executado em outro container docker, é necessário usar o nome do serviço como DNS. Nesse caso, o cliente está acessando o servidor usando o nome `challenge_server_1`, atravéz da rede `challenge-network-1`.

Imagem Alpine: Foi usado uma versão alpine para o cliente, já que o curl é uma ferramenta leve e eficiente para fazer requisições HTTP.

---

## Desafio 2: Volumes e Persistência de Dados

Esse desafio documenta a implementação e comprovação da **persistência de dados** para um banco de dados PostgreSQL utilizando **volumes nomeados** do Docker. O projeto também incluiu o uso de um container secundário para acessar os dados através da rede Docker, simulando um ambiente de aplicação (desafio opcional). O objetivo é comprovar que os dados sobrevivem mesmo após a remoção e recriação do container.

### INSTRUÇÕES DE EXECUÇÃO

**Pré-requisitos**: Docker e Docker Compose instalados.

1.  Navegue até o diretório do desafio ( `desafio2` )

2.  Inicie os containers com o compose:
    ```bash
    docker compose up -d
    ```
3.  **Criação dos Dados:** Acessar o banco e inserir os dados de teste.

    ```bash
    docker exec -it challenge_2_database psql -U root -d postgres -c "CREATE TABLE IF NOT EXISTS usuarios (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL UNIQUE);"
    ```

4.  Inserir os dados de teste.

    ```bash
    docker exec -it challenge_2_database psql -U root -d postgres -c "INSERT INTO usuarios (nome, email) VALUES ('João', 'joao@example.com');"
    ```

    4.1. Verificar se o dado foi inserido corretamente.

    ```bash
    docker exec -it challenge_2_database psql -U root -d postgres -c "SELECT * FROM usuarios;"
    ```

5.  **Teste de Persistência:** Verificar se os dados persistem mesmo após a remoção e recriação do container.

    ```bash
    docker compose down
    docker compose up -d
    docker exec -it challenge_2_database psql -U root -d postgres -c "SELECT * FROM usuarios;"
    ```

---

### ARQUITETURA

**Volume**: `challenge_2_database_volume` é usado para persistir os dados do PostgreSQL. Ele está mapeado para o diretório `/var/lib/postgresql/data` do container principal.

**Database**: Usa a imagem `postgres:17-alpine`. Responsável por armazenar e gerenciar os dados. Persistindo os dados no volume `challenge_2_database_volume`.

---

### DECISÕES TÉCNICAS

**Volumes Nomeados:** A escolha por volumes nomeados é a forma recomendada pelo Docker para persistência de dados, mesmo após a remoção do container. Eles são gerenciados pelo Docker e sobrevivem aos comandos `docker rm` e `docker compose down`, garantindo que os dados não sejam perdidos.

**Comprovação da Persistência:** O fluxo de parar, remover e recriar o container `challenge_2_database` prova que o volume `challenge_2_database_volume` está persistindo os dados, mesmo após a remoção do container.

---

## Desafio 3: Docker Compose Orquestrando Serviços

Este desafio tem como objetivo principal utilizar o Docker Compose para orquestrar e gerenciar três serviços interconectados, sendo eles: `challenge_3_web`, `challenge_3_database` e `challenge_3_cache`. A proposta é garantir que cada componente seja configurado corretamente, incluindo variáveis de ambiente, volumes para persistência de dados e uma rede dedicada que permita a comunicação entre eles. O serviço `challenge_3_web` depende diretamente do banco de dados PostgreSQL e do cache Redis, e o Compose é responsável por coordenar essas dependências, inicializar os containers na ordem correta e assegurar que todo o ambiente funcione como uma aplicação integrada.

---

### INSTRUÇÕES DE EXECUÇÃO

**Pré-requisitos**: Docker e Docker Compose instalados.

1.  Navegue até o diretório do desafio ( `desafio3` )
2.  Inicie os containers em modo _detached_ (segundo plano):
    ```bash
    docker compose up
    ```
3.  **Teste de Comunicação:** Acesse o container web pelo navegador utilizando a url `http://localhost:3000`:

    Ou pode ser acessado pelo terminal executando o comando:

    ```curl
    curl http://localhost:3000
    ```

    O resultado esperado é um json contendo uma mensagem de que o servidor está OK, um contador de acessos, e os dados que foram inseridos no banco de dados.

    O contador de acessos se faz pelo uso do cache Redis, rodando no container `challenge_3_cache`, que é incrementado a cada requisição.

    Já os dados se faz pelo uso do banco de dados PostgreSQL, rodando no container `challenge_3_database`, que é persistido no volume `challenge_3_database_volume`.

Para encerrar a execução e remover containers/rede: `docker compose down -v`

---

### ARQUITETURA

Rede: Uma rede do tipo bridge chamada `challenge_3_database_volume` foi criada para conectar os três serviços.

Container 1 (Database): Usa a imagem `postgres:17-alpine`. Serviço de banco de dados **PostgreSQL**.

Container 2 (Cache): Usa a imagem `redis:alpine`. Serviço de **Cache Redis**.

Container 3 (Web): Usa a imagem `oven/bun:latest`. Essa imagem foi usada porque o servidor é construído com Bun. Além disso, o servidor web foi construído com Elysia, proporcionando acesso web na porta `3000` na rota `/`.

---

### DECISÕES TÉCNICAS

**Docker Compose e Orquestração:** Foi utilizado para definir toda a infraestrutura do desafio de forma declarativa, garantindo que cada serviço, `challenge_3_web`, `challenge_3_database` e `challenge_3_cache`, seja criado com suas respectivas configurações, redes, volumes e variáveis de ambiente.

**Dependências (`depends_on`):** O serviço `challenge_3_web` foi configurado com depends_on: [`challenge_3_database`, `challenge_3_cache`].
Isso assegura que o PostgreSQL e o Redis sejam iniciados antes que a aplicação web tente subir, evitando falhas de conexão durante a inicialização.

**Nomes de serviço como DNS:** Dentro da rede Docker (`challenge_3_network`), o container `challenge_3_web` utiliza os nomes dos serviço `challenge_3_database` e `challenge_3_cache` como hostnames para realizar acesso aos outros serviços localizados em outros containers.
Assim, o servidor web acessa:

**Serviço Web com Bun + Elysia:** O container `challenge_3_web` é construído a partir da imagem base definida no Dockerfile (que utiliza oven/bun:latest).
Essa escolha foi feita porque o servidor foi desenvolvido utilizando Bun e o framework Elysia, permitindo alta performance e inicialização rápida. A aplicação expõe a rota `/` na porta `3000`, que é mapeada para o host pelo Compose.

---