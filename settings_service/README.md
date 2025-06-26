# Shop Service

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
- [API Endpoints (Phase 1)](#api-endpoints-phase-1)
- [Testing (Phase 1)](#testing-phase-1)
- [Project Structure](#project-structure)
- [Configuration (Phase 1)](#configuration-phase-1)

## About

This service will be responsible for handling shop-related functionalities. Currently, it's in its initial setup phase.

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (usually comes with Node.js)
- Docker (optional, for containerized deployment)
- Access to a PostgreSQL database instance.

### Installation

1.  **Clone the repository (if not already done):**
    ```bash
    # Assuming you are in the root of the monorepo
    cd shop_service
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

1.  **Using Docker Compose (recommended):**
    The service is included in the main `docker-compose.yml` file at the root of the monorepo.
    To start all services, including the shop_service:
    ```bash
    docker-compose up -d shop_service # Or `docker-compose up -d` for all
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

-   `GET /`: Returns a welcome message: "Shop Service is running! (Phase 1)"
-   `GET /api/shop/info`: Returns shop information along with the current database time:
    ```json
    {
      "message": "Shop information with current DB time",
      "databaseTime": "YYYY-MM-DDTHH:mm:ss.sssZ"
    }
    ```

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

## Project Structure

(A brief overview of the directory structure will be here - standard Express/TS layout)
```
shop_service/
├── Dockerfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
└── tests/
```

## Configuration

Service configuration is managed in `src/config/config.ts`. Environment variables are used for critical settings.

### Environment Variables

The following environment variables are used by the service:

-   `NODE_ENV`: The runtime environment (e.g., `development`, `production`, `test`). Defaults to `development`.
-   `PORT`: The port on which the service will listen. Defaults to `3000`.
-   `DB_HOST`: Hostname of the PostgreSQL database server.
-   `DB_PORT`: Port of the PostgreSQL database server. Defaults to `5432`.
-   `DB_USER`: Username for connecting to the PostgreSQL database.
-   `DB_PASSWORD`: Password for the specified database user.
-   `DB_NAME`: The name of the PostgreSQL database to connect to (e.g., `ShopDb`).

When running with Docker Compose (`docker-compose.yml` in the root), these database variables are pre-configured to connect to the `postgres-db` service.

### Database Setup

The service requires a PostgreSQL database named `ShopDb` (or as configured by `DB_NAME`).
The user specified (`DB_USER`) must have permissions to connect to this database and perform standard operations.

If the `ShopDb` database does not exist, it needs to be created manually or via an initialization script in the PostgreSQL service. The `keycloakadmin` user (used by default in docker-compose) typically has privileges to create databases. You can connect to the PostgreSQL instance (e.g., using Adminer on port 8082 or `psql` available in the `postgres-db` container) and execute:
```sql
CREATE DATABASE "ShopDb";
```
Ensure the `keycloakadmin` user has appropriate permissions on this new database, or grant them:
```sql
GRANT ALL PRIVILEGES ON DATABASE "ShopDb" TO keycloakadmin;
```
(Adjust grants as per security requirements; `ALL PRIVILEGES` is broad for development).
