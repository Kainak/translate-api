# 翻訳 API (API de Tradução)

Este projeto implementa uma API de tradução de textos construída com Node.js. A arquitetura utiliza um worker assíncrono para processar as traduções, garantindo que a API permaneça responsiva e desacoplada da lógica de processamento.

A comunicação entre a API e o worker é gerenciada por uma fila de mensagens com RabbitMQ, e os resultados são persistidos em um banco de dados MongoDB.

## ✨ Funcionalidades

-   **API REST**: Interface para submeter textos para tradução e consultar o status.
-   **Processamento Assíncrono**: As traduções são processadas em segundo plano por um worker dedicado.
-   **Fila de Mensagens**: RabbitMQ para uma comunicação robusta e escalável entre os serviços.
-   **Persistência de Dados**: MongoDB para armazenar as solicitações e seus resultados.
-   **Ambiente Containerizado**: Docker e Docker Compose para orquestrar os serviços (API, worker, RabbitMQ, MongoDB).

## 🚀 Tecnologias Utilizadas

-   **Backend**: Node.js, Express.js
-   **Banco de Dados**: MongoDB com Mongoose
-   **Fila de Mensagens**: RabbitMQ com amqplib
-   **Containerização**: Docker
-   **Validação**: Yup

## 📂 Estrutura do Projeto

```
.
├── api/                # Contém o código da API (Express)
│   ├── controllers/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── translation-worker/ # Contém o código do worker assíncrono
│   └── worker.js
├── .env.example        # Arquivo de exemplo para variáveis de ambiente
├── docker-compose.yaml # Orquestração dos containers
├── Dockerfile          # Definição do container da aplicação
└── package.json        # Dependências e scripts do projeto
```

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/) (v18 ou superior)
-   [Docker](https://www.docker.com/get-started/) e [Docker Compose](https://docs.docker.com/compose/install/)

## 🏁 Como Começar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, copiando o `.env.example`. Preencha as variáveis, especialmente a sua connection string do MongoDB Atlas.
    ```bash
    cp .env.example .env
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie os serviços com Docker Compose:**
    Este comando irá construir as imagens e iniciar os containers da API, do worker, do RabbitMQ e do MongoDB.
    ```bash
    docker-compose up -d --build
    ```

## 📜 Scripts NPM

-   `npm run start:api`: Inicia o servidor da API.
-   `npm run start:worker`: Inicia o worker de tradução.
-   `npm run start:api:watch`: Inicia a API em modo de desenvolvimento (reinicia ao salvar).
-   `npm run start:worker:watch`: Inicia o worker em modo de desenvolvimento.
-   `npm run swagger:gen`: Gera (ou atualiza) a documentação da API com base nos comentários das rotas.

## Endpoints da API

O prefixo base para todos os endpoints é `/translations`.

### `POST /`

Cria uma nova solicitação de tradução.

**Request Body:**

```json
{
  "text": "Hello, world!",
  "targetLanguage": "pt"
}
```

**Success Response (202 Accepted):**

```json
{
  "message": "Request received and is being processed.",
  "requestId": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

### `GET /:requestId`

Verifica o status e o resultado de uma tradução.

**URL Params:**

-   `requestId` (string, required): O ID da solicitação retornado no endpoint de criação.

**Success Response (200 OK):**

```json
{
  "status": "completed",
  "originalText": "Hello, world!",
  "translatedText": "Olá, Mundo!"
}
```



