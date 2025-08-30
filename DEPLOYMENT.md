# 🚀 BMS Control Application - Deployment Guide

## 📋 **Prerequisites**
- Node.js 16+ installed
- Git repository set up
- GitHub account (for automatic deployments)

---

## 🎯 **Deployment Strategy: Vercel + Railway (Recommended)**

### **Frontend (React) → Vercel**
### **Backend (NestJS) → Railway**

---

## 🎨 **Step 1: Deploy Frontend to Vercel**

### **1.1 Prepare Frontend for Production**
```bash
cd bms-frontend
npm run build
```

### **1.2 Deploy to Vercel**
1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `bms-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### **1.3 Set Environment Variables**
In Vercel dashboard, add:
```
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app/api
```

### **1.4 Deploy**
- Click "Deploy"
- Vercel will automatically deploy on every Git push

---

## ⚙️ **Step 2: Deploy Backend to Railway**

### **2.1 Prepare Backend for Production**
```bash
cd backend/bms-proxy
npm install
npm run build
```

### **2.2 Deploy to Railway**
1. **Go to [railway.app](https://railway.app)** and sign up/login
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**
5. **Configure deployment:**
   - **Root Directory**: `backend/bms-proxy`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`

### **2.3 Set Environment Variables**
In Railway dashboard, add:
```
NODE_ENV=production
PORT=4000
```

### **2.4 Get Your Backend URL**
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Copy this URL

---

## 🔗 **Step 3: Connect Frontend to Backend**

### **3.1 Update Frontend Environment**
In Vercel, update:
```
REACT_APP_API_BASE_URL=https://your-app-name.railway.app/api
```

### **3.2 Redeploy Frontend**
- Push changes to GitHub
- Vercel will auto-deploy

---

## 🌐 **Alternative Deployment Options**

### **Option B: Netlify + Render**
- **Frontend**: [netlify.com](https://netlify.com)
- **Backend**: [render.com](https://render.com)

### **Option C: GitHub Pages + Heroku**
- **Frontend**: GitHub Pages (free)
- **Backend**: Heroku (free tier discontinued)

---

## 📱 **Step 4: Test Your Deployed App**

### **4.1 Test Frontend**
- Visit your Vercel URL
- Check if the app loads correctly

### **4.2 Test Backend**
- Test API endpoints: `https://your-backend-url.railway.app/api/health`
- Check if BMS integration works

### **4.3 Test Full Flow**
- Login functionality
- Temperature control
- Schedule management
- Reports section

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. CORS Errors**
- Ensure backend allows your frontend domain
- Check Railway environment variables

#### **2. API Connection Failed**
- Verify `REACT_APP_API_BASE_URL` is correct
- Check if backend is running on Railway

#### **3. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed

#### **4. Environment Variables Not Working**
- Restart deployment after adding variables
- Check variable names (must start with `REACT_APP_`)

---

## 📊 **Monitoring & Maintenance**

### **Vercel Dashboard**
- View deployment status
- Monitor performance
- Check error logs

### **Railway Dashboard**
- Monitor backend performance
- Check resource usage
- View application logs

---

## 🚀 **Automatic Deployments**

### **Frontend (Vercel)**
- Automatically deploys on every Git push
- Preview deployments for pull requests

### **Backend (Railway)**
- Automatically deploys on every Git push
- Manual deployment option available

---

## 💰 **Cost Breakdown**

### **Free Tier Limits:**
- **Vercel**: Unlimited projects, 100GB bandwidth/month
- **Railway**: $5 credit/month (usually covers small apps)
- **Total**: ~$5/month for production-ready hosting

---

## 🎉 **Success!**

Your BMS Control application is now:
- ✅ **Hosted on Vercel** (Frontend)
- ✅ **Hosted on Railway** (Backend)
- ✅ **Automatically deploying** on code changes
- ✅ **Production-ready** with proper environment configuration
- ✅ **Accessible worldwide** via your custom URLs

---

## 🔗 **Next Steps**

1. **Custom Domain**: Add your own domain to Vercel
2. **SSL Certificate**: Automatically handled by Vercel/Railway
3. **Monitoring**: Set up alerts for downtime
4. **Backup**: Regular database backups (if applicable)

---

## 📞 **Need Help?**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Create issues in your repository
