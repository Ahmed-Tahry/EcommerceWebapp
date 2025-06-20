# Shop Service

This is the Shop Service for the e-commerce platform, built with Express.js and TypeScript.

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Service](#running-the-service)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Docker](#docker)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Configuration](#configuration)

## About

This service is responsible for handling shop-related functionalities.
(Further details about the service's role can be added here).

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (usually comes with Node.js)
- Docker (optional, for containerized deployment)

### Installation

1.  **Clone the repository (if not already done):**
    ```bash
    git clone <repository-url>
    cd <path-to-repo>/shop_service
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Service

### Development Mode

To run the service in development mode with hot-reloading (using nodemon):

```bash
npm run dev
```

The service will typically be available at `http://localhost:3000`.

### Production Mode

1.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```
    This will compile the TypeScript files from `src/` into JavaScript files in the `dist/` directory.

2.  **Start the service:**
    ```bash
    npm start
    ```

### Docker

This service can also be run using Docker. Ensure Docker is installed and running.

1.  **Build the Docker image (if not using docker-compose):**
    From the `shop_service` directory:
    ```bash
    docker build -t shop-service .
    ```

2.  **Run the Docker container (if not using docker-compose):**
    ```bash
    docker run -p 3000:3000 shop-service
    ```

3.  **Using Docker Compose (recommended):**
    The service is included in the main `docker-compose.yml` file at the root of the monorepo.
    To start all services, including the shop_service:
    ```bash
    docker-compose up -d
    ```
    To start only the shop_service (if defined to be runnable independently or with its dependencies):
    ```bash
    docker-compose up -d shop_service
    ```

## Scripts

The `package.json` file includes the following scripts:

-   `npm start`: Starts the production server (after building).
-   `npm run dev`: Starts the development server with nodemon.
-   `npm run build`: Compiles TypeScript to JavaScript.
-   `npm test`: Runs tests using Vitest.
-   `npm run test:watch`: Runs tests in watch mode using Vitest.
-   `npm run coverage`: Runs tests and generates a coverage report.

## API Endpoints

Currently, the service has the following basic endpoints:

-   `GET /`: Returns a welcome message: "Shop Service is running!"
-   `GET /api/shop/info`: Returns placeholder shop information: `{ "message": "Shop information placeholder" }`

(More endpoints will be documented here as they are added.)

## Testing

Tests are written using [Vitest](https://vitest.dev/) and can be found in the `tests/` directory.

-   To run all tests once:
    ```bash
    npm test
    ```
-   To run tests in watch mode:
    ```bash
    npm run test:watch
    ```
-   To generate a test coverage report (output to `./coverage` directory):
    ```bash
    npm run coverage
    ```

## Project Structure

```
shop_service/
├── Dockerfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── coverage/      # Test coverage reports (generated)
├── dist/          # Compiled JavaScript output (generated)
├── node_modules/  # Node.js dependencies (generated)
├── src/           # TypeScript source code
│   ├── app.ts         # Express application setup
│   ├── index.ts       # Application entry point (imports server.ts)
│   ├── server.ts      # HTTP server setup and start
│   ├── config/        # Configuration files (e.g., config.ts)
│   ├── controllers/   # Request handlers (e.g., shop.controller.ts)
│   ├── middlewares/   # Custom Express middlewares
│   ├── models/        # Data models/interfaces (e.g., shop.model.ts)
│   ├── routes/        # API route definitions (e.g., index.ts, shop.routes.ts)
│   ├── services/      # Business logic (e.g., shop.service.ts)
│   ├── types/         # Custom TypeScript types (e.g., types.ts)
│   └── utils/         # Utility functions
└── tests/         # Test files (e.g., shop.test.ts)
```

## Configuration

Service configuration can be managed in `src/config/config.ts`. Environment variables are used for settings like `NODE_ENV` and `PORT`.
(Details on specific environment variables and configuration options can be added here.)
