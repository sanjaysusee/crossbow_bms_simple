#!/bin/bash

echo "🚀 BMS Control Application - Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "bms-frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo ""
print_status "Starting deployment process..."

# Step 1: Build Frontend
echo ""
print_status "Step 1: Building Frontend..."
cd bms-frontend

if npm run build; then
    print_status "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Step 2: Build Backend
echo ""
print_status "Step 2: Building Backend..."
cd ../backend/bms-proxy

if npm run build; then
    print_status "Backend build successful!"
else
    print_error "Backend build failed!"
    exit 1
fi

# Go back to root
cd ../..

echo ""
print_status "Build process completed successfully!"
echo ""
echo "🎯 Next Steps:"
echo "1. Deploy frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'bms-frontend'"
echo ""
echo "2. Deploy backend to Railway:"
echo "   - Go to railway.app"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'backend/bms-proxy'"
echo ""
echo "3. Set environment variables:"
echo "   - Frontend: REACT_APP_API_BASE_URL=https://your-backend-url.railway.app/api"
echo "   - Backend: NODE_ENV=production, PORT=4000"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
print_status "Deployment script completed! 🚀"
