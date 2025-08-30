#!/bin/bash

echo "🚀 BMS Control - Render Free Hosting Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "bms-frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo ""
print_status "Starting Render deployment preparation..."

# Step 1: Build Frontend
echo ""
print_status "Step 1: Building Frontend for Render..."
cd bms-frontend

if npm run build; then
    print_status "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Step 2: Build Backend
echo ""
print_status "Step 2: Building Backend for Render..."
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
echo "🎯 Next Steps for Render Deployment:"
echo ""
echo "1. 🚀 Deploy Backend to Render:"
echo "   - Go to render.com and sign up with GitHub"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory: 'backend/bms-proxy'"
echo "   - Build Command: 'npm install && npm run build'"
echo "   - Start Command: 'npm run start:prod'"
echo "   - Plan: Free"
echo "   - Health Check Path: '/api/health'"
echo ""
echo "2. 🎨 Deploy Frontend to Render:"
echo "   - Click 'New +' → 'Static Site'"
echo "   - Connect same GitHub repository"
echo "   - Set Root Directory: 'bms-frontend'"
echo "   - Build Command: 'npm install && npm run build'"
echo "   - Publish Directory: 'build'"
echo "   - Add Environment Variable:"
echo "     REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com/api"
echo ""
echo "3. 🔗 Connect Frontend to Backend:"
echo "   - Copy your backend URL from Render"
echo "   - Update frontend environment variable"
echo "   - Redeploy frontend"
echo ""
echo "4. 🧪 Test Your Deployed App:"
echo "   - Test frontend: https://your-frontend-name.onrender.com"
echo "   - Test backend: https://your-backend-name.onrender.com/api/health"
echo ""
echo "📖 See RENDER_DEPLOYMENT.md for detailed instructions"
echo ""
print_warning "Note: Backend will sleep after 15 minutes of inactivity"
print_warning "First request after sleep may take 30-60 seconds"
echo ""
print_status "Render deployment preparation completed! 🚀"
echo ""
print_info "Your app will be 100% FREE forever on Render! 🎉"
