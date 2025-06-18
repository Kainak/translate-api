# API de Tradução Assíncrona

Este projeto implementa uma API de tradução de textos que funciona de forma assíncrona, utilizando uma arquitetura baseada em microserviços com workers para processamento em segundo plano.

[![Node.js](https://img.shields.io/badge/Node.js-18-blue?logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-green?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-blue?logo=mongodb)](https://www.mongodb.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-orange?logo=rabbitmq)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)](https://www.docker.com/)

## Arquitetura

O sistema é composto por quatro componentes principais que rodam em contêineres Docker:

1.  **API**: Um serviço Node.js/Express responsável por receber as requisições de tradução. Ele valida os dados, cria um registro no MongoDB com o status `pending` e publica uma mensagem na fila do RabbitMQ.
2.  **Translation Worker**: Um worker Node.js que consome as mensagens da fila. Ele processa a tradução utilizando uma API externa, atualiza o status do trabalho no MongoDB para `processing` e, ao finalizar, para `completed` ou `failed`.
3.  **RabbitMQ**: Atua como message broker, gerenciando a fila de traduções e garantindo a comunicação desacoplada entre a API e o Worker.
4.  **MongoDB**: Utilizado como banco de dados para persistir o estado e o resultado de cada solicitação de tradução.

## Como Funciona o Fluxo de Tradução

1.  O cliente envia uma requisição `POST /translations` com o texto a ser traduzido e o idioma de destino.
2.  A API cria um novo job de tradução no MongoDB com o status `pending` e retorna imediatamente um `requestId`.
3.  A API publica uma mensagem contendo o `requestId`, o texto e o idioma na fila do RabbitMQ.
4.  O Worker, que está escutando a fila, consome a mensagem.
5.  O Worker atualiza o status do job para `processing` no MongoDB.
6.  O Worker realiza a chamada para a API de tradução externa.
7.  Após receber o resultado, o Worker atualiza o job no MongoDB com o texto traduzido e o status `completed`. Em caso de erro, o status é `failed`.
8.  O cliente pode usar o `requestId` para consultar o status da tradução a qualquer momento através da rota `GET /translations/:requestId`.

## Tecnologias

-   **Backend**: Node.js, Express.js
-   **Banco de Dados**: MongoDB com Mongoose
-   **Mensageria**: RabbitMQ com amqplib
-   **Containerização**: Docker e Docker Compose
-   **Documentação**: Swagger
-   **Tradução**: `@vitalets/google-translate-api`

## Pré-requisitos

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto, copiando o conteúdo abaixo. Estes são os valores padrão para o ambiente de desenvolvimento com Docker Compose.

    ```dotenv
    # Variáveis da Aplicação
    PORT=4040
    # MongoDB
    DATABASE=mongodb://mongodb:27017/translations
    # RabbitMQ
    RABBITMQ=amqp://rabbitmq
    ```

3.  **Suba os contêineres:**
    Execute o comando abaixo para construir as imagens e iniciar todos os serviços em segundo plano.

    ```bash
    docker-compose up --build -d
    ```

4.  **Pronto!**
    A API estará disponível em `http://localhost:4040`.
    A documentação estará disponível em 'http://localhost:4040/swagger/'

## Endpoints da API

### `POST /translations`

Inicia um novo trabalho de tradução.

-   **Body (raw/json):**
    ```json
    {
      "text": "Hello world",
      "to": "pt"
    }
    ```

-   **Resposta de Sucesso (202 Accepted):**
    A API retorna imediatamente o ID da requisição, que pode ser usado para consultar o status.
    ```json
    {
      "requestId": "1b38cd7e-bf79-4372-8d41-0bc80960f3e6",
      '"status": "queued"
    }
    ```

### `GET /translations/:requestId`

Verifica o status e o resultado de um trabalho de tradução.

-   **Parâmetros da URL:**
    -   `requestId`: O ID retornado na criação do trabalho.

-   **Resposta de Sucesso (200 OK):**
    -   **Pendente:**
        ```json
        {
          "requestId": "9b36be2a-e03d-43a8-9fbe-84bf4806838e",
          "status": "processing",
          "createdAt": "2025-06-17T23:31:59.806Z"
        }
        ```
    -   **Completo:**
        ```json
        {
          "requestId": "9b36be2a-e03d-43a8-9fbe-84bf4806838e",
          "status": "completed",
          "createdAt": "2025-06-17T23:31:59.806Z",
          "originalText": "Hello Word"
          "translatedText": "Olá mundo"
        }
        ```