# 🔍 Troubleshooting Guide: Why Popular Tags Work But Other Features Don't

## 🎯 The Issue

**Popular Tags are loading** but **other functionality isn't working**. This indicates a **partial system failure** where some components work while others don't.

## 🔍 Root Cause Analysis

### **Why Popular Tags Work**
Popular Tags work because they only require:
- ✅ **MongoDB connection** (to fetch existing recipe tags)
- ✅ **Basic API endpoint** (`/api/get-recipes`)
- ✅ **No authentication required** for tag fetching
- ✅ **No external dependencies** (OpenAI, n8n, etc.)

### **Why Other Features Don't Work**
Other features fail because they require additional dependencies:

1. **Recipe Generation** → Requires **OpenAI API + n8n workflow**
2. **Chat Assistant** → Requires **OpenAI API + n8n workflow**  
3. **User Authentication** → Requires **Google OAuth credentials**
4. **Recipe Saving** → Requires **MongoDB + authentication**
5. **Recipe Display** → Requires **MongoDB + authentication**

## 🚨 Most Likely Issues

### **1. Missing Environment Variables**
You need a `.env.local` file with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/nexium-recipes

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# N8N Workflow URLs
N8N_WEBHOOK_URL=http://localhost:5678/webhook/generate-recipe
N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/chat-assistant-updated

# App Settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_REQUEST_LIMIT=100
```

### **2. MongoDB Not Running**
- **Popular Tags**: Work with existing data
- **Other features**: Need active MongoDB connection

### **3. n8n Not Running**
- **Recipe Generation**: ❌ Fails without n8n
- **Chat Assistant**: ❌ Fails without n8n

### **4. OpenAI API Issues**
- **Recipe Generation**: ❌ Fails without OpenAI
- **Chat Assistant**: ❌ Fails without OpenAI

## 🧪 Diagnostic Steps

### **Step 1: Check Environment Variables**
```bash
# Check if .env.local exists
ls -la .env.local

# If it doesn't exist, create it:
cp env.example .env.local
# Then edit .env.local with your actual values
```

### **Step 2: Check MongoDB**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Or check if you can connect to your MongoDB URI
```

### **Step 3: Check n8n**
```bash
# Check if n8n is running
curl http://localhost:5678

# If not running, start it:
npx n8n start
```

### **Step 4: Check OpenAI**
```bash
# Test OpenAI API key (replace with your key)
curl -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

### **Step 5: Check Browser Console**
Open browser dev tools and check for errors:
- **Network tab**: Failed API calls
- **Console tab**: JavaScript errors
- **Application tab**: Missing environment variables

## 🔧 Quick Fixes

### **Fix 1: Create Environment File**
```bash
# Create .env.local from example
cp env.example .env.local

# Edit with your actual values
nano .env.local
```

### **Fix 2: Start Required Services**
```bash
# Start MongoDB (if local)
mongod

# Start n8n
npx n8n start

# Start your app
npm run dev
```

### **Fix 3: Configure Credentials**
1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Google OAuth**: Set up in [Google Cloud Console](https://console.cloud.google.com/)
3. **n8n**: Import workflow and configure OpenAI credentials

## 📊 Feature Dependency Matrix

| Feature | MongoDB | OpenAI | n8n | Google OAuth | Status |
|---------|---------|--------|-----|--------------|--------|
| **Popular Tags** | ✅ | ❌ | ❌ | ❌ | ✅ Working |
| **Recipe Display** | ✅ | ❌ | ❌ | ✅ | ❌ Likely failing |
| **Recipe Generation** | ✅ | ✅ | ✅ | ✅ | ❌ Likely failing |
| **Chat Assistant** | ✅ | ✅ | ✅ | ✅ | ❌ Likely failing |
| **User Auth** | ❌ | ❌ | ❌ | ✅ | ❌ Likely failing |

## 🚨 Common Error Messages

### **MongoDB Errors**
```
❌ MongoDB connection error
❌ Failed to fetch recipes
❌ Please add your Mongo URI to .env.local
```

### **OpenAI Errors**
```
❌ OpenAI API error: Invalid API key
❌ Failed to generate recipe via n8n
❌ N8N webhook URL not configured
```

### **Authentication Errors**
```
❌ NEXTAUTH_URL not configured
❌ Google OAuth credentials missing
❌ Authentication failed
```

## 🎯 Priority Fix Order

1. **Create `.env.local`** (highest priority)
2. **Start MongoDB** 
3. **Configure OpenAI API key**
4. **Start n8n workflow**
5. **Configure Google OAuth**

## 🔍 Debug Commands

```bash
# Check environment variables
echo $MONGO_URI
echo $OPENAI_API_KEY

# Check if services are running
netstat -ano | findstr :27017  # MongoDB
netstat -ano | findstr :5678   # n8n
netstat -ano | findstr :3000   # Next.js

# Test API endpoints
curl http://localhost:3000/api/get-recipes
curl http://localhost:3000/api/generate-recipes
```

## 📝 Next Steps

1. **Create `.env.local`** with your actual credentials
2. **Start all required services** (MongoDB, n8n)
3. **Configure API keys** (OpenAI, Google OAuth)
4. **Test each feature** systematically
5. **Check browser console** for specific errors

## 🆘 Still Having Issues?

If you're still having problems after following this guide:

1. **Check browser console** for specific error messages
2. **Verify all environment variables** are set correctly
3. **Ensure all services** are running (MongoDB, n8n)
4. **Test API endpoints** individually
5. **Check network connectivity** to external services

---

**The key insight**: Popular Tags work because they only need MongoDB, while other features need additional services (OpenAI, n8n, authentication) that may not be properly configured or running. 