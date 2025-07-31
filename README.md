# 🍳 Smart Recipe Generator

A modern, AI-powered recipe generation application built with Next.js, Google Gemini AI, and n8n workflows. Create delicious recipes from your available ingredients and get personalized cooking assistance through an intelligent chatbot.

## ✨ Features

### 🎯 Core Functionality
- **AI Recipe Generation** - Create recipes from your specific ingredients using Google Gemini AI
- **Smart Chat Assistant** - Get cooking tips, substitutions, and recipe modifications
- **High-Quality Food Images** - Automatic Pexels integration for beautiful recipe photos
- **Dietary Preferences** - Support for vegetarian, vegan, gluten-free, keto, dairy-free, and halal
- **User Authentication** - Secure Google OAuth integration with NextAuth.js
- **Recipe Management** - Save, organize, and manage your favorite recipes
- **Search & Filter** - Find recipes by ingredients, tags, or dietary preferences

### 🚀 Technical Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB Atlas with Mongoose
- **AI Integration**: Google Gemini 2.5 Pro via n8n workflows
- **Authentication**: NextAuth.js with Google OAuth
- **Image Service**: Pexels API for high-quality food photography
- **Deployment**: Vercel-ready configuration

### 💰 Cost Optimized
- **Free Tier Compatible** - Optimized for Google Gemini's generous free tier
- **Efficient Token Usage** - Smart prompt engineering for maximum value
- **Free Image Service** - Pexels integration for professional food images
- **Scalable Architecture** - Ready for production deployment

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Google Gemini API key
- Google OAuth credentials
- Pexels API key (free)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Asjad4234/Nexium_Asjad_GrandProject.git
   cd Nexium_Asjad_GrandProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `env.example` to `.env.local` and fill in your credentials:
   ```env
   # Database (MongoDB Atlas)
   MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/your-database
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   
   # AI Services
   GEMINI_API_KEY=your-gemini-api-key-here
   NEXT_PUBLIC_PEXELS_API_KEY=your-pexels-api-key-here
   
   # N8N Workflow URLs
   N8N_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/generate-recipe
   N8N_CHAT_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/chat-assistant
   
   # App Settings
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   API_REQUEST_LIMIT=100
   ```

4. **Set up n8n workflow**
   - Import `My workflow (1).json` to your n8n instance
   - Configure Google Gemini credentials
   - Activate the workflow
   - Copy the webhook URLs to your environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
smart-recipe-generator/
├── src/
│   ├── components/          # React components
│   │   ├── Recipe_Creation/ # Recipe generation UI
│   │   ├── Recipe_Display/  # Recipe viewing components
│   │   ├── Hero_Sections/   # Landing page components
│   │   ├── Profile_Information/ # User profile components
│   │   └── Hooks/           # Custom React hooks
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/            # API endpoints
│   │   └── auth/           # Authentication pages
│   ├── models/             # MongoDB schemas
│   ├── lib/                # Utility libraries (AI, DB, etc.)
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Helper functions
│   ├── data/               # Static data files
│   ├── assets/             # Static assets
│   └── styles/             # Global styles
├── docs/                   # Documentation and guides
├── public/                 # Static assets and images
├── My workflow (1).json    # n8n workflow configuration
├── env.example             # Environment variables template
├── package.json            # Dependencies and scripts
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # Vercel deployment configuration
```

## 🔧 N8N Workflow Setup

### Current Workflow Features
- **Recipe Generation**: Uses Google Gemini AI to create recipes from specific ingredients
- **Chat Assistant**: Provides cooking guidance and recipe modifications
- **Image Integration**: Automatically adds relevant food images to recipes
- **Error Handling**: Robust error handling and fallback mechanisms

### Setup Instructions
1. **Import workflow** `My workflow (1).json` to n8n.cloud or local n8n instance
2. **Configure Google Gemini credentials** with your API key
3. **Activate the workflow** (ensure the toggle is green)
4. **Get webhook URLs** for recipe generation and chat assistant
5. **Update environment variables** with the webhook URLs

## 🎯 How It Works

### Recipe Generation Process
1. **Select Ingredients** - Choose from your available ingredients
2. **Set Preferences** - Specify dietary restrictions and preferences
3. **AI Processing** - Google Gemini AI creates personalized recipes
4. **Image Addition** - Pexels provides beautiful food photography
5. **Save & Share** - Store your recipes and share with others

### Chat Assistant Features
- **Recipe-specific guidance** - Ask questions about any saved recipe
- **Cooking tips** - Get professional cooking advice
- **Ingredient substitutions** - Find alternatives for missing ingredients
- **Nutritional information** - Learn about recipe health benefits
- **Cooking techniques** - Master new cooking methods

## 🚀 Deployment

### Vercel 
Deployed to https://nexium-asjad-final.vercel.app/Home

### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://your-app.vercel.app
```

### Performance Metrics
- **Recipe Generation**: 3-8 seconds (AI processing + image fetch)
- **Chat Response**: 1-3 seconds
- **Image Loading**: Instant (Pexels CDN)
- **Page Load**: < 2 seconds (optimized Next.js)

## 🔒 Security Features

- **OAuth Authentication** - Secure Google login
- **API Key Protection** - Server-side API calls only
- **Input Validation** - Robust data validation
- **Rate Limiting** - Prevents API abuse
- **Environment Variables** - Secure credential management

## 📚 Documentation

- **`docs/AGENTS.md`** - Development guidelines for AI assistants
- **`docs/FRONTEND-SETUP-GUIDE.md`** - Detailed setup instructions
- **`docs/gpt.md`** - General project information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Powerful recipe generation
- **Pexels** - Beautiful food photography
- **NextAuth.js** - Secure authentication
- **n8n** - Workflow automation
- **MongoDB Atlas** - Reliable database hosting




