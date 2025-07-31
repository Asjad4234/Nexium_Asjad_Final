# 🚀 Frontend Setup and n8n Configuration Guide

## 📋 Quick Overview

This guide will help you:
1. Start your Next.js frontend
2. Configure n8n workflow URLs
3. Test the integration between frontend and n8n

## 🚀 Step 1: Start the Frontend

### **Install Dependencies** (if not already done)
```bash
npm install
```

### **Start Development Server**
```bash
npm run dev
```

### **Check Frontend is Running**
- Open browser to: `http://localhost:3000`
- You should see your recipe generator homepage
- The app will redirect to `/Home` automatically

## 🔧 Step 2: Configure n8n Workflow URLs

### **Create Environment File**
Create a `.env.local` file in your project root:

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

# N8N Workflow URLs (IMPORTANT: Update these with your actual n8n URLs)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/generate-recipe
N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/chat-assistant-updated

# App Settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_REQUEST_LIMIT=100
```

### **Get Your n8n Webhook URLs**

1. **Start n8n** (if not already running):
   ```bash
   npx n8n start
   ```

2. **Import Your Workflow**:
   - Open `http://localhost:5678` in your browser
   - Import `My workflow 3 (1).json`
   - Configure OpenAI credentials
   - Activate the workflow

3. **Copy Webhook URLs**:
   - In n8n, click on the webhook nodes
   - Copy the URLs that appear
   - They should look like:
     ```
     http://localhost:5678/webhook/generate-recipe
     http://localhost:5678/webhook/chat-assistant-updated
     ```

4. **Update Environment File**:
   - Replace the URLs in `.env.local` with your actual n8n URLs
   - If your n8n is running on a different port or host, update accordingly

## 🧪 Step 3: Test the Integration

### **Test Recipe Generation**
1. Go to `http://localhost:3000/CreateRecipe`
2. Add some ingredients (e.g., "chicken", "pasta", "tomato sauce")
3. Select dietary preferences
4. Click "Generate Recipe"
5. Check if the recipe is generated successfully

### **Test Chat Assistant**
1. Go to any recipe detail page
2. Look for the chat assistant feature
3. Ask a cooking question
4. Check if you get a helpful response

### **Check API Endpoints**
You can also test the APIs directly:

```bash
# Test Recipe Generation API
curl -X POST http://localhost:3000/api/generate-recipes \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": [
      {"name": "chicken breast", "quantity": "2 pieces"},
      {"name": "pasta", "quantity": "200g"}
    ],
    "dietaryPreferences": ["gluten-free"]
  }'

# Test Chat Assistant API
curl -X POST http://localhost:3000/api/chat-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I make this recipe vegetarian?",
    "recipeId": "test-recipe-123"
  }'
```

## 🔍 Step 4: Troubleshooting

### **Frontend Issues**

1. **Port 3000 Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use a different port
   npm run dev -- -p 3001
   ```

2. **Environment Variables Not Loading**
   - Make sure `.env.local` is in the project root
   - Restart the development server
   - Check for typos in variable names

3. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

### **n8n Integration Issues**

1. **n8n Not Running**
   ```bash
   npx n8n start
   ```

2. **Webhook URLs Not Working**
   - Check if n8n workflow is active
   - Verify webhook URLs in n8n UI
   - Test webhooks directly in n8n

3. **OpenAI API Errors**
   - Check OpenAI credentials in n8n
   - Verify API key is valid
   - Check API usage limits

### **Database Issues**

1. **MongoDB Not Connected**
   - Start MongoDB service
   - Check connection string in `.env.local`
   - Verify database exists

## 📊 Step 5: Verify Everything is Working

### **Checklist**
- ✅ Frontend loads at `http://localhost:3000`
- ✅ n8n is running at `http://localhost:5678`
- ✅ Workflow is imported and active
- ✅ Environment variables are set correctly
- ✅ Recipe generation works
- ✅ Chat assistant responds
- ✅ No console errors

### **Expected URLs**
- **Frontend**: `http://localhost:3000`
- **n8n**: `http://localhost:5678`
- **Recipe API**: `http://localhost:3000/api/generate-recipes`
- **Chat API**: `http://localhost:3000/api/chat-assistant`

## 🔗 Useful Commands

```bash
# Start frontend
npm run dev

# Start n8n
npx n8n start

# Test n8n workflow
node test-workflow-3.js

# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :5678

# Kill processes on ports
npx kill-port 3000 5678
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_WEBHOOK_URL` | Recipe generation webhook | `http://localhost:5678/webhook/generate-recipe` |
| `N8N_CHAT_WEBHOOK_URL` | Chat assistant webhook | `http://localhost:5678/webhook/chat-assistant-updated` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/nexium-recipes` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `NEXTAUTH_URL` | NextAuth.js URL | `http://localhost:3000` |

## 🎯 Next Steps

Once everything is working:
1. Test all features thoroughly
2. Configure authentication (Google OAuth)
3. Set up production environment variables
4. Deploy to your preferred platform

---

**Need help?** Check the console logs in both frontend and n8n for error messages! 