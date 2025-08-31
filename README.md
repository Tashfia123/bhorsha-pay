# Bhorosha-Pay (ভরসা-প) 🌊
### A Hybrid Blockchain Crowdfunding Platform for Disaster Relief

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple.svg)](https://sepolia.etherscan.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)

---

## 🌟 Overview

**Bhorosha-Pay** is a revolutionary blockchain-based crowdfunding platform specifically designed to tackle disaster relief challenges in Bangladesh. By combining transparency, security, and accessibility, we bridge the gap between local and international donors while ensuring every contribution reaches those who need it most.

### 🎯 Mission
To create a transparent, secure, and efficient crowdfunding ecosystem that empowers communities during disasters while building trust between donors and beneficiaries.

### 📊 Market Opportunity
- **$96B/year** estimated crowdfunding opportunity in developing economies (World Bank, 2025)
- **70%** of population unaware of crowdfunding beyond charity
- **58%** of entrepreneurs avoid crowdfunding due to fraud concerns

---

## ✨ Key Features

### 🔐 **Hybrid Blockchain Architecture**
- **Public Ethereum** for transparency and global accessibility
- **Private Hyperledger Fabric** for secure data and regulatory compliance
- **Smart Contract Automation** for milestone-based fund release

### 💳 **Dual Payment Integration**
- **bKash Integration** for local Bangladeshi donors
- **MetaMask/Ethereum** support for international cryptocurrency donations
- **No third-party payment processing** - direct peer-to-peer transactions

### 🤖 **AI-Powered Security**
- **Fraud Detection** using pattern recognition
- **NID Verification** with document authenticity checks
- **Multi-layered Verification** system with human validators

### 📈 **Real-Time Analytics**
- **Live Dashboard** with donation tracking
- **Transaction History** via Etherscan integration
- **Donor Leaderboards** and campaign progress monitoring
- **Ethereum Price Updates** for accurate conversion rates

### 🛡️ **Trust & Transparency**
- **End-to-End Audit Trail** for complete accountability
- **Milestone-Based Escrow** with multi-party approval
- **Campaign Verification Badges** for authentic fundraisers
- **Real-time Tracking** of every donation

---

## 🏗️ Tech Stack

### **Blockchain & Web3**
- **Solidity** - Smart contract development
- **Hardhat** - Development framework
- **ThirdWeb SDK** - Web3 integration
- **Ethereum (Sepolia Testnet)** - Blockchain network
- **EtherJS** - Ethereum interaction library

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

### **Frontend**
- **React.js** - User interface
- **MetaMask** - Wallet integration
- **Axios** - API communication

### **External APIs**
- **CoinGecko API** - Cryptocurrency rates
- **CryptoCompare API** - Crypto news
- **bKash API** - Mobile financial services

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bhorosha-pay.git
   cd bhorosha-pay
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies (if separate)
   cd client && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/bhorosha-pay
   JWT_SECRET=your_jwt_secret_key
   COINGECKO_API_KEY=your_coingecko_api_key
   CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
   PORT=8080
   ```

4. **Deploy Smart Contracts**
   ```bash
   cd web3
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. **Start the application**
   ```bash
   # Start backend server
   npm run dev
   
   # Start frontend (in another terminal)
   cd client && npm start
   ```

### 🔧 Configuration

#### MongoDB Setup
Ensure MongoDB is running and accessible at the configured URI. The application will automatically connect using the connection string in `config/db.js`.

#### File Upload Configuration
- NID documents are stored in `uploads/nid/` directory
- Maximum file size: 10MB
- Supported formats: JPG, PNG, GIF
- Files are automatically validated and processed

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration with NID verification
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/me` - Get user profile
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset confirmation

### Admin Endpoints
- `GET /api/v1/admin/dashboard-stats` - System statistics
- `GET /api/v1/admin/users` - User management with filtering
- `PUT /api/v1/admin/users/:id/approve` - Approve user verification
- `PUT /api/v1/admin/users/:id/reject` - Reject user application
- `GET /api/v1/admin/analytics` - System analytics and trends

### Blog Endpoints
- `GET /api/v1/blog/all` - Get all blogs
- `POST /api/v1/blog/create` - Create new blog post
- `GET /api/v1/blog/:id` - Get specific blog
- `PUT /api/v1/blog/:id` - Update blog (author only)
- `DELETE /api/v1/blog/:id` - Delete blog (author only)
- `POST /api/v1/blog/:id/comment` - Add comment to blog

### Payment Endpoints
- `POST /api/v1/payment/bkash` - Record bKash payment
- `GET /api/v1/payment/bkash/user` - Get user's payment history
- `GET /api/v1/payment/bkash/campaign/:id` - Get campaign payments

---

## 🎯 Target Market

### **Primary Users**
- **Disaster-Affected Individuals** - Immediate aid seekers for shelter, food, and rebuilding
- **Local Donors** - Contributing via bKash mobile financial services
- **International Donors** - Using Ethereum blockchain for global contributions
- **NGOs & CSR Initiatives** - Seeking transparent resource channels

### **Business Market**
- **Verified NGOs** and startups running charitable campaigns
- **Campaign Creators** seeking advanced analytics and promotion tools
- **Corporations** managing CSR (Corporate Social Responsibility) initiatives
- **Conscious Changemakers** leading community-driven relief efforts

---

## 💰 Revenue Model

### Platform Fees
- **2.5%** for charitable campaigns
- **6-7%** success fees for for-profit campaigns

### Premium Services
- **Creator Pro Subscriptions** with tiered plans for:
  - Advanced analytics and insights
  - Enhanced promotional tools
  - Priority customer support
  - Campaign optimization features

### Future Expansion
- **Bhorosha Capital** (Year 4+) - Equity-based fundraising platform

---

## 🏆 Competitive Advantages

### **Unique Value Propositions**
1. **First blockchain-based crowdfunding platform** specifically for disaster relief in Bangladesh
2. **Hybrid payment system** supporting both local (bKash) and international (crypto) donations
3. **AI-powered fraud detection** with pattern recognition
4. **Multi-layered verification** including NID document validation
5. **Complete transparency** with end-to-end audit trails
6. **Smart contract escrow** with milestone-based fund release

### **vs Traditional Platforms**
- ❌ **Traditional NGOs**: Lack transparency and real-time tracking
- ❌ **Social Media Campaigns**: No verification, security concerns
- ❌ **Existing Crowdfunding**: Not tailored for disaster relief, no blockchain benefits

---

## 🗺️ Roadmap

### **Phase 1: Beta Launch (0-6 months)**
- ✅ Deploy KYC onboarding system
- ✅ Integrate bKash payment gateway
- ✅ Implement milestone-based escrow
- 🎯 Target: 1,000+ early users, ৳1 Cr donations

### **Phase 2: Platform Enhancement (6-12 months)**
- 🔄 Verified campaign system
- 🔄 Validator dashboards
- 🔄 Digital donor receipts
- 🎯 Target: ৳10 Cr+ donations, 10,000+ donors

### **Phase 3: Scale & Expansion (1-2 years)**
- 📋 Creator Pro subscriptions
- 🏢 Corporate CSR partnerships
- 🎯 Target: 50+ NGOs onboarded

### **Phase 4: Advanced Features (2-3 years)**
- 💳 Loan Mode (donor-backed microloans)
- 🌍 Global platform presence
- 🎯 Target: $50M+ GMV annually

### **Phase 5: Diversification (3+ years)**
- 🏥 Medical and educational campaigns
- 💼 Bhorosha Capital (equity crowdfunding)
- 🌐 International market expansion

---

## 🏗️ Architecture

### **Application Components**
```
Frontend (React) → API Gateway → Backend Services → Database (MongoDB)
                              ↓
Smart Contracts (Ethereum) → Web3 Integration → Wallet Services
                              ↓
External APIs → Payment Gateway (bKash) → Blockchain Explorer
```

### **Security Layers**
1. **Authentication** - JWT-based with secure password hashing
2. **Authorization** - Role-based access control (RBAC)
3. **Data Validation** - Input sanitization and type checking
4. **File Security** - Image validation and secure storage
5. **Blockchain Security** - Smart contract audit trails

---

## 👥 Team

**Team Uttoron** - Building the future of transparent crowdfunding

- **Mehnaz Tamanna Oyeshi** - Islamic University of Technology
- **Shefayat E Shams Adib** - Islamic University of Technology  
- **Arian Rahman** - Bangladesh University of Engineering & Technology
- **Tashfia Hassan** - Islamic University of Technology
- **Arunima Chakrabarty** - Institute of Business Administration, DU

---

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation for API changes
- Ensure smart contracts are properly tested

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🚨 Disclaimer

This platform is currently in development and testing phase. Please use testnet tokens for transactions during the beta period. Always verify campaign authenticity before donating.

---

<div align="center">
  <h3>Building Trust, One Donation at a Time</h3>
  <p><strong>By Team Uttoron</strong></p>
</div>
