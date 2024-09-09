# Account Transactions Checker

A Node.js application for checking Ethereum account transactions using Alchemy SDK and Ethers SDK.

## Prerequisites

- Node.js (version 14.x or higher recommended)
- npm (version 6.x or higher recommended)
- PostgreSQL database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/maykelxyz/account-tx-checker.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Fill in the required values in `.env`:
     - `ALCHEMY_API_KEY`: Your Alchemy API key
     - `DB_USER`: PostgreSQL database user
     - `DB_HOST`: PostgreSQL database host
     - `DB_DATABASE`: PostgreSQL database name
     - `DB_PASSWORD`: PostgreSQL database password
     - `SECRET_SALT`: A secret salt for encryption
     - `PORT`: (Optional) Port for the server to run on (default: 3000)

## Development

To start the development server:

```
npm run dev
```

This will start the server on the specified port (default is 3000).

## Production

To run the server in production mode:

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

This will compile the TypeScript code and start the server in production mode.

## API Endpoints

- `GET /accounts/:accountId/transactions`: Get transactions for a specific account
- `POST /accounts/createUser`: Create a new user
  - Example request body:
    ```json
    {
        "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    }
    ```
- `GET /accounts/getAllUsers`: Get all users
