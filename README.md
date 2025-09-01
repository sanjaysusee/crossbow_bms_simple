# 🏢 BMS Control System

A comprehensive Building Management System (BMS) with a simplified frontend interface and secure backend proxy service.

## 🚀 Features

### Frontend (React + TypeScript + Material-UI)
- **Simplified Control Interface**: Clean, single-screen layout with essential controls
- **AC Control**: On/Off switches for AC systems
- **Temperature Management**: Set and monitor temperature settings
- **Schedule Control**: Configure automatic on/off schedules
- **Real-time Status**: Live temperature and system status display
- **Professional UI**: Modern Material-UI design with animations
- **Responsive Design**: Works on all screen sizes

### Backend (NestJS + TypeScript)
- **BMS Proxy Service**: Secure intermediary between frontend and BMS system
- **Session Management**: Automatic session recovery and maintenance
- **API Integration**: RESTful API endpoints for all BMS operations
- **Security**: Environment-based configuration with no hardcoded secrets
- **Error Handling**: Comprehensive error handling and logging

## 🛡️ Security Features

- **Environment Variables**: No hardcoded credentials
- **Configuration Service**: Centralized configuration management
- **Session Validation**: Secure session handling and timeout management
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: Type-safe API payloads

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   BMS System    │
│   (React)       │◄──►│   (NestJS)       │◄──►│   (External)    │
│                 │    │   (Proxy)        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control
- **BMS Access**: Valid credentials for the target BMS system

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/sanjaysusee/crossbow_bms_simple.git
cd crossbow_bms_simple
```

### 2. Backend Setup
```bash
cd backend/bms-proxy

# Install dependencies
npm install

# Copy environment configuration
cp env.example .env

# Edit .env with your BMS credentials
nano .env

# Start the backend service
npm run start
```

### 3. Frontend Setup
```bash
cd ../bms-frontend

# Install dependencies
npm install

# Copy environment configuration
cp env.example .env

# Edit .env with your configuration
nano .env

# Start the frontend application
npm start
```

## ⚙️ Configuration

### Backend Environment Variables
```bash
# BMS API Configuration
BMS_BASE_URL=https://bmsdev.chakranetwork.com:8080
BMS_USERNAME=crossbow
BMS_PASSWORD=crossbow@123

# Server Configuration
PORT=4000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-here
COOKIE_SECRET=your-cookie-secret-here
```

### Frontend Environment Variables
```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:4000/api
REACT_APP_BMS_USERNAME=crossbow
REACT_APP_BMS_PASSWORD=crossbow@123

# Build Configuration
GENERATE_SOURCEMAP=false
REACT_APP_VERSION=1.0.0
```

## 🔧 Development

### Backend Development
```bash
cd backend/bms-proxy

# Development mode with auto-reload
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test
```

### Frontend Development
```bash
cd bms-frontend

# Development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📡 API Endpoints

### Authentication
- `POST /api/login` - Authenticate with BMS system

### BMS Control
- `POST /api/set-temp` - Set temperature
- `POST /api/control-ac` - Control AC on/off
- `POST /api/get-current-status` - Get current BMS status
- `POST /api/vfd-stats` - Get VFD statistics
- `POST /api/set-schedule-status` - Set schedule status
- `POST /api/set-schedule-time` - Set schedule times

### Health Check
- `GET /api/health` - Service health status

## 🚀 Deployment

### Backend Deployment (Render)
```bash
# The backend includes render.yaml for automatic deployment
# Deploy to Render with zero configuration
```

### Frontend Deployment
```bash
# Build the application
npm run build

# Deploy the build folder to your hosting service
```

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly** in production
4. **Enable HTTPS** in production environments
5. **Validate all inputs** on both frontend and backend
6. **Monitor API usage** for suspicious activity

## 🐛 Troubleshooting

### Common Issues

1. **Session Timeout**: The system automatically handles session recovery
2. **CORS Errors**: Ensure backend is running and accessible
3. **Login Failures**: Verify BMS credentials in environment variables
4. **Build Errors**: Check Node.js version compatibility

### Debug Mode
```bash
# Enable debug logging
REACT_APP_ENABLE_DEBUG_LOGGING=true
LOG_LEVEL=debug
```

## 📚 Project Structure

```
bms-control/
├── backend/
│   └── bms-proxy/
│       ├── src/
│       │   ├── auth/           # Authentication service
│       │   ├── config/         # Configuration service
│       │   ├── proxy/          # BMS proxy service
│       │   └── common/         # Shared types
│       ├── env.example         # Environment template
│       └── package.json
├── bms-frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API services
│   │   ├── config/             # Configuration
│   │   └── types/              # TypeScript types
│   ├── env.example             # Environment template
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software developed by CrossbowSec.

## 👥 Development Team

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: NestJS + TypeScript + Axios
- **Architecture**: Microservices with proxy pattern
- **Security**: Environment-based configuration

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**Built with ❤️ and ☕ by the CrossbowSec team**
