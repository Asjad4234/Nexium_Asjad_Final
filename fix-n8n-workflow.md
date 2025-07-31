# N8N Workflow Fix Guide

## 🔍 Problem Identified

Your n8n workflow is receiving requests (200 status) but returning empty responses, causing the recipe creation to stop at 6-8%.

## 🛠️ Step-by-Step Fix

### 1. Check Workflow Status in N8N

1. Go to https://asjad4234.app.n8n.cloud/workflows
2. Find "My workflow" 
3. **IMPORTANT**: Make sure the workflow is **ACTIVE** (green toggle)
4. If inactive, click the toggle to activate it

### 2. Check Gemini API Credentials

1. Go to Settings > Credentials in n8n
2. Find "Google Gemini(PaLM) Api account"
3. Click on it to edit
4. Verify the API key is correct: `AIzaSyAIii9rc0W68KaFTNeHhHkNrcnW8PXT8DE`
5. Test the credentials if there's a test button

### 3. Check Execution History

1. Go to "My workflow" 
2. Click on the "Executions" tab
3. Look for recent executions
4. **Red status** = failed execution
5. Click on failed executions to see error details

### 4. Fix Webhook Configuration

**Current Issue**: Chat webhook has mismatched path and webhookId

**Fix in N8N**:
1. Open "My workflow" in n8n editor
2. Find the "Chat Webhook Trigger" node
3. Change the webhookId from `chat-assistant-updated` to `chat-assistant`
4. Or change the path from `chat-assistant` to `chat-assistant-updated`
5. Save the workflow

### 5. Test Workflow Manually

1. In n8n workflow editor, click "Execute Workflow"
2. Use this test data:
```json
{
  "ingredients": ["chicken", "garlic", "onion"],
  "dietaryPreferences": ["gluten-free"],
  "userId": "test-user",
  "sessionId": "test-123"
}
```
3. Check if the workflow completes successfully
4. Look for any error messages in the execution

### 6. Check AI Agent Configuration

1. Find the "AI Agent1" node in your workflow
2. Verify the prompt format is correct
3. Check that it's connected to the "Google Gemini Chat Model1"
4. Ensure the memory buffer is properly connected

### 7. Update Environment Variables (if needed)

If you changed the webhook IDs, update your `.env.local`:

```env
N8N_WEBHOOK_URL=https://asjad4234.app.n8n.cloud/webhook/generate-recipe
N8N_CHAT_WEBHOOK_URL=https://asjad4234.app.n8n.cloud/webhook/chat-assistant-updated
```

### 8. Test the Fix

Run this command to test after making changes:

```bash
node test-production-n8n.js
```

## 🚨 Common Issues & Solutions

### Issue 1: Workflow Not Active
- **Symptom**: 404 errors or empty responses
- **Solution**: Activate the workflow in n8n

### Issue 2: Invalid API Credentials
- **Symptom**: AI Agent fails silently
- **Solution**: Check and update Gemini API key

### Issue 3: Webhook Path Mismatch
- **Symptom**: Chat webhook not working
- **Solution**: Align path and webhookId

### Issue 4: Memory Buffer Issues
- **Symptom**: AI Agent doesn't respond properly
- **Solution**: Check memory buffer connections

## 📊 Expected Behavior

After fixing:
- Recipe webhook should return JSON with `{recipe: {...}, success: true}`
- Chat webhook should return JSON with `{reply: "...", success: true}`
- Response time should be 3-5 seconds
- No empty responses

## 🔧 Alternative: Simplified Workflow

If the current workflow is too complex, consider creating a simpler version:

1. Webhook Trigger → Parse Input → AI Agent → Return Response
2. Remove memory buffer and complex parsing
3. Use direct JSON response from AI Agent

## 📞 Next Steps

1. Follow the steps above in order
2. Test after each major change
3. Check n8n execution logs for specific errors
4. If issues persist, consider recreating the workflow with a simpler structure

## 🎯 Success Criteria

- ✅ Workflow is active
- ✅ Gemini API credentials are valid
- ✅ Webhook paths match webhookIds
- ✅ Manual execution works
- ✅ API calls return valid JSON responses
- ✅ Recipe creation completes successfully 