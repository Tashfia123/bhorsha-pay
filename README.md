# BlockFunder - Decentralized Crowdfunding Platform

BlockFunder is a decentralized crowdfunding platform built on blockchain technology that allows users to create and donate to campaigns transparently and securely.

## Project Overview

This project consists of three main components:
- **Backend**: A Node.js Express server providing API endpoints for authentication and blog functionality
- **Frontend**: A React-based client application built with Vite, Material UI, and TailwindCSS
- **Blockchain**: Smart contracts for crowdfunding functionality using Solidity and Hardhat

## Features

- User authentication system
- Campaign creation and management
- Secure donation functionality via blockchain
- Blog/news section
- Responsive UI with Material UI components
- Transparent fund tracking

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Morgan (logging)
- CORS

### Frontend
- React.js
- Vite
- Material UI
- TailwindCSS
- Chart.js
- React Router
- Framer Motion
- Thirdweb SDK

### Blockchain
- Solidity
- Hardhat
- Ethers.js
- Thirdweb

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB instance
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blockfunder_DeCENTRALIZED
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Install blockchain dependencies:
   ```bash
   cd ../web3
   npm install
   ```

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8080
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   NODE_ENV=development
   ```

### Running the Application

1. Start the backend server:
   ```bash
   # From the root directory
   npm run server
   ```

2. Start the frontend application:
   ```bash
   # From the root directory
   cd client
   npm run dev
   ```

3. Deploy the smart contract (optional, for development):
   ```bash
   # From the web3 directory
   npm run deploy
   ```

Alternatively, on Windows, you can use:
```bash
start-client.bat
```

## Smart Contract

The project includes a CrowdFunding smart contract that handles:
- Campaign creation with owner, title, description, target amount, deadline, and image
- Donation functionality
- Tracking of donations and donors
- Retrieval of campaign information

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Blogs
- `GET /api/v1/blogs` - Get all blogs
- `POST /api/v1/blogs` - Create new blog
- `GET /api/v1/blogs/:id` - Get blog by ID
- `PUT /api/v1/blogs/:id` - Update blog
- `DELETE /api/v1/blogs/:id` - Delete blog

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please reach out to the project maintainers. 