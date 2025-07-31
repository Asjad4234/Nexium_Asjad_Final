# Pexels API Integration Guide for n8n Workflow

## 🍽️ Overview

This guide helps you update your n8n workflow to use Pexels API instead of Unsplash for recipe images. Pexels provides a reliable, free API with high-quality food images.

## 📋 Prerequisites

1. **Pexels API Key**: Get your free API key from [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. **n8n Workflow Access**: Access to your current n8n workflow
3. **Environment Variables**: Add `PEXELS_API_KEY` to your n8n environment variables

## 🔧 Step-by-Step Integration

### Step 1: Get Pexels API Key

1. Go to [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Click "Get Started" or "Sign Up"
3. Create a free account
4. Go to your dashboard
5. Copy your API key

### Step 2: Update n8n Environment Variables

In your n8n instance, add the following environment variable:
```
PEXELS_API_KEY=your_actual_pexels_api_key_here
```

### Step 3: Replace Unsplash API Nodes

#### Current Unsplash Node (to be replaced):
```json
{
  "url": "https://api.unsplash.com/photos/random",
  "method": "GET",
  "headers": {
    "Authorization": "Client-ID {{ $env.UNSPLASH_ACCESS_KEY }}"
  },
  "qs": {
    "query": "food",
    "orientation": "landscape"
  }
}
```

#### New Pexels Node:
```json
{
  "url": "https://api.pexels.com/v1/search",
  "method": "GET",
  "headers": {
    "Authorization": "{{ $env.PEXELS_API_KEY }}",
    "Content-Type": "application/json"
  },
  "qs": {
    "query": "food",
    "per_page": "1",
    "orientation": "landscape"
  }
}
```

### Step 4: Update Image URL Extraction

#### Current Unsplash Response Processing:
```javascript
// Unsplash response structure
{
  "urls": {
    "regular": "https://images.unsplash.com/photo-1234567890/..."
  }
}
```

#### New Pexels Response Processing:
```javascript
// Pexels response structure
{
  "photos": [
    {
      "src": {
        "medium": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        "large": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
      }
    }
  ]
}
```

### Step 5: Update Recipe Generation Logic

Replace the image URL assignment in your recipe generation:

```javascript
// Old Unsplash logic
const imageUrl = unsplashResponse.urls.regular;

// New Pexels logic
const imageUrl = pexelsResponse.photos[0].src.medium; // or .large for higher quality
```

## 🎯 Recommended Search Terms

Use these food-related search terms for better recipe images:

```javascript
const FOOD_SEARCH_TERMS = [
  'food',
  'cooking',
  'recipe',
  'delicious',
  'homemade',
  'fresh food',
  'healthy food',
  'gourmet',
  'cuisine',
  'meal',
  'dish',
  'ingredients',
  'cooking ingredients',
  'fresh ingredients',
  'organic food',
  'home cooking',
  'kitchen',
  'chef',
  'restaurant food',
  'traditional food'
];
```

## 🔄 Complete n8n Node Configuration

### HTTP Request Node for Pexels:

```json
{
  "name": "Get Recipe Image from Pexels",
  "type": "n8n-nodes-base.httpRequest",
  "position": [x, y],
  "parameters": {
    "url": "https://api.pexels.com/v1/search",
    "method": "GET",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "httpHeaderAuth": {
      "name": "Authorization",
      "value": "{{ $env.PEXELS_API_KEY }}"
    },
    "options": {
      "qs": {
        "query": "{{ $json.recipeType || 'food' }}",
        "per_page": "1",
        "orientation": "landscape"
      }
    }
  }
}
```

### Set Node for Image URL:

```json
{
  "name": "Set Recipe Image URL",
  "type": "n8n-nodes-base.set",
  "position": [x, y],
  "parameters": {
    "values": {
      "string": [
        {
          "name": "imgLink",
          "value": "{{ $json.photos[0].src.medium }}"
        }
      ]
    }
  }
}
```

## 🚀 Advanced Features

### 1. Dynamic Search Based on Recipe Type

```javascript
// In your recipe generation logic
const searchTerm = getSearchTermFromRecipe(recipeName);
const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=1`);
```

### 2. Fallback Images

```javascript
// If Pexels API fails, use fallback images
const fallbackImages = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
];

const imageUrl = pexelsResponse.photos?.[0]?.src?.medium || 
  fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
```

### 3. Image Quality Selection

```javascript
// Choose image quality based on use case
const imageQuality = useCase === 'thumbnail' ? 'small' : 'medium';
const imageUrl = pexelsResponse.photos[0].src[imageQuality];
```

## 🔍 Testing Your Integration

### Test API Connection:

```bash
curl -H "Authorization: YOUR_PEXELS_API_KEY" \
     "https://api.pexels.com/v1/search?query=food&per_page=1"
```

### Expected Response:

```json
{
  "photos": [
    {
      "id": 1234567,
      "width": 4000,
      "height": 3000,
      "url": "https://www.pexels.com/photo/food-1234567/",
      "photographer": "Photographer Name",
      "photographer_url": "https://www.pexels.com/@photographer",
      "src": {
        "original": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg",
        "large2x": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "large": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "medium": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&h=350",
        "small": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&h=130",
        "portrait": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        "landscape": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        "tiny": "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150"
      }
    }
  ],
  "total_results": 12345,
  "page": 1,
  "per_page": 1,
  "next_page": "https://api.pexels.com/v1/search?query=food&per_page=1&page=2"
}
```

## ⚠️ Important Notes

1. **Rate Limits**: Pexels free tier allows 200 requests per hour
2. **Image Attribution**: Include photographer attribution when possible
3. **Image Sizes**: Use appropriate image sizes for your use case
4. **Caching**: Implement caching to reduce API calls
5. **Error Handling**: Always handle API failures gracefully

## 🎉 Benefits of Pexels Integration

- ✅ **Reliable API**: No more 503 errors
- ✅ **High Quality**: Professional food photography
- ✅ **Free Tier**: 200 requests/hour for free
- ✅ **Fast CDN**: Optimized image delivery
- ✅ **Rich Metadata**: Photographer info, multiple sizes
- ✅ **No Watermarks**: Clean, professional images

## 🔗 Useful Links

- [Pexels API Documentation](https://www.pexels.com/api/)
- [Pexels API Examples](https://www.pexels.com/api/documentation/)
- [n8n HTTP Request Node](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.httpRequest/)
- [n8n Environment Variables](https://docs.n8n.io/hosting/environment-variables/environment-variables/) 