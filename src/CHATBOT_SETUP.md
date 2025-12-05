# NegOne AI Chatbot - Groq Integration Setup Guide

## Overview
The NegOne chatbot has been integrated with Groq's API to provide real-time, intelligent responses to users about fitness, nutrition, mental health, and wellness.

## What's Been Implemented

### 1. **Chatbot Component** (`/src/components/Chatbot.tsx`)
- Floating chat button in the bottom-right corner
- Real-time messaging interface with smooth animations
- Integration with OpenAI's GPT-3.5-turbo model via secure backend API
- Mongolian language support
- Loading states and error handling

### 2. **Backend API Route** (`/src/pages/api/chat.ts`)
- Secure server-side API endpoint
- Handles all Groq API calls
- Protects API key from exposure
- Error handling and rate limiting

### 3. **Features**
- ✅ Real-time responses from Groq API
- ✅ Empathetic, supportive tone
- ✅ Personalized health and wellness advice
- ✅ Available on all pages
- ✅ Beautiful UI with animations
- ✅ Mobile responsive
- ✅ Message history during session
- ✅ Secure API key handling

## Setup Instructions

### Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new API key**
5. Copy the API key (you'll only see it once!)

### Step 2: Add Environment Variable

**For Local Development:**
Create a `.env.local` file in the root of your project (same level as `package.json`):

```env
GROQ_API_KEY=gsk-your-api-key-here
```

Replace `gsk-your-api-key-here` with your actual Groq API key.

**For Production (Wix Deployment):**
1. Go to **Settings > Environment Variables** in Wix Dashboard
2. Add `GROQ_API_KEY` with your API key value
3. The API key will be securely stored and available to your backend

### Step 3: Verify Setup

The chatbot should now be:
1. ✅ Available on all pages (floating button in bottom-right)
2. ✅ Responding with real ChatGPT responses
3. ✅ Speaking in Mongolian
4. ✅ Providing health and wellness advice
5. ✅ API key is secure (never exposed to frontend)

## How It Works

### Architecture
The chatbot uses a **secure backend API pattern**:

```
Frontend (Chatbot.tsx)
    ↓
    POST /api/chat
    ↓
Backend API (pages/api/chat.ts)
    ↓
    OpenAI API
    ↓
Backend API (returns response)
    ↓
Frontend (displays response)
```

### User Flow
1. User clicks the floating chat button (💬 icon)
2. Chat window opens with greeting message
3. User types a question
4. Message is sent to `/api/chat` endpoint
5. Backend API calls OpenAI with secure API key
6. ChatGPT generates a response
7. Backend returns response to frontend
8. Response appears in the chat window
9. User can continue the conversation

### System Prompt
The chatbot uses a system prompt that defines its personality:
- **Role**: NegOne AI - Health & Wellness Assistant for Women
- **Language**: Mongolian
- **Tone**: Empathetic, encouraging, supportive
- **Expertise**: Fitness, nutrition, mental health, self-love

### API Integration
- **Model**: Mixtral-8x7b-32768 (fast and cost-effective)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (concise responses)
- **Endpoint**: `/api/chat` (backend route)
- **Groq Endpoint**: `https://api.groq.com/openai/v1/chat/completions` (server-side only)

## Cost Considerations

### Pricing
- Groq API: Free tier available with generous limits
- Average conversation: ~100-200 tokens per exchange
- Estimated cost: Free or minimal for most use cases

### Budget Management
1. Monitor API usage in Groq console
2. Check rate limits and quotas
3. Consider implementing rate limiting if needed

## Troubleshooting

### Issue: "API key not found" or "API key not configured"
**Solution**: 
- Verify `.env.local` file exists in project root
- Check that `GROQ_API_KEY` is set correctly (not `VITE_GROQ_API_KEY`)
- Restart the development server
- Check that the environment variable is being read by the backend

### Issue: "401 Unauthorized"
**Solution**:
- Verify API key is correct in `.env.local`
- Check that API key hasn't been revoked in Groq console
- Ensure API key has proper permissions (should have chat completion access)
- Try regenerating a new API key

### Issue: "Rate limit exceeded"
**Solution**:
- Wait a few minutes before retrying
- Check Groq console for usage limits
- Consider implementing request throttling on the frontend
- Upgrade your Groq plan if needed

### Issue: Responses in English instead of Mongolian
**Solution**:
- The system prompt specifies Mongolian
- If still happening, try asking in Mongolian first
- Check Groq API status

### Issue: Chatbot not responding at all
**Solution**:
- Check browser console for errors (F12 > Console)
- Check server logs for API errors
- Verify `/api/chat` endpoint is accessible
- Ensure `GROQ_API_KEY` environment variable is set
- Try a simple test message like "Сайн байна уу"

### Issue: CORS errors
**Solution**:
- This should not happen as the API call is server-side
- If you see CORS errors, the frontend is trying to call OpenAI directly
- Ensure the frontend is calling `/api/chat` endpoint, not OpenAI API directly

## Customization

### Change the System Prompt
Edit the `SYSTEM_PROMPT` in `/src/pages/api/chat.ts`:

```typescript
const SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Change the Model
Replace `'mixtral-8x7b-32768'` with in `/src/pages/api/chat.ts`:
- `'llama-2-70b-chat'` (alternative model)
- `'gemma-7b-it'` (smaller model)

### Adjust Response Length
Change `max_tokens` value in `/src/pages/api/chat.ts` (default: 500):
```typescript
max_tokens: 300, // Shorter responses
max_tokens: 1000, // Longer responses
```

### Adjust Creativity
Change `temperature` value in `/src/pages/api/chat.ts` (default: 0.7):
- `0.0` = Deterministic, factual
- `0.7` = Balanced (default)
- `1.0` = Creative, varied

## Security Best Practices

1. **API Key Protection** ✅
   - API key is stored on the backend only
   - Never exposed to frontend/browser
   - Use `.env.local` for local development (already in `.gitignore`)
   - Use environment variables in production

2. **Rotate API keys regularly**
   - Delete old keys from OpenAI dashboard
   - Generate new ones periodically

3. **Monitor usage**
   - Check OpenAI dashboard daily
   - Set up billing alerts
   - Monitor API usage in backend logs

4. **Rate limiting**
   - Backend API handles rate limiting from OpenAI
   - Consider implementing per-user rate limits
   - Prevent abuse and excessive costs

5. **Input Validation**
   - Backend validates all incoming messages
   - Prevents injection attacks
   - Sanitizes user input before sending to OpenAI

## Production Deployment

### For Wix Deployment
1. Add environment variable in Wix dashboard:
   - Go to **Settings > Environment Variables**
   - Add `GROQ_API_KEY` with your API key
   
2. Ensure `.env.local` is in `.gitignore`

3. Test thoroughly before going live

### Environment Variables in Different Environments
```
Development: .env.local (GROQ_API_KEY=gsk-...)
Production: Wix Dashboard > Environment Variables (GROQ_API_KEY=gsk-...)
Staging: Wix Dashboard > Environment Variables (staging) (GROQ_API_KEY=gsk-...)
```

### Important Notes for Production
- The API key is stored securely on the server
- The frontend never has access to the API key
- All OpenAI API calls happen on the backend
- The backend validates and sanitizes all requests
- Rate limiting is handled by OpenAI's API

## Testing

### Test the Chatbot
1. Open the site
2. Click the floating chat button
3. Ask a question like:
   - "Фитнесийн хувьд сайн зөвлөгөө өгөөрэй"
   - "Эрүүл хооллолтын талаар ямар мэдээлэл байна вэ?"
   - "Сэтгэлзүйн эрүүл мэндийн талаар ярьж болох уу?"

### Expected Behavior
- ✅ Chat window opens smoothly
- ✅ Messages appear in real-time
- ✅ Responses are in Mongolian
- ✅ Responses are relevant to health/wellness
- ✅ No errors in browser console

## Support & Resources

- **Groq Documentation**: https://console.groq.com/docs
- **API Reference**: https://console.groq.com/docs/api-reference
- **Status Page**: https://status.groq.com/
- **Community Forum**: https://community.groq.com/

## Next Steps

1. ✅ Set up OpenAI API key
2. ✅ Test the chatbot
3. ✅ Monitor usage and costs
4. ✅ Customize system prompt if needed
5. ✅ Deploy to production

## File Locations

- **Chatbot Component**: `/src/components/Chatbot.tsx`
- **Backend API Route**: `/src/pages/api/chat.ts` ⭐ **NEW**
- **Layout Integration**: `/src/components/Layout.tsx`
- **Environment Setup**: `/src/env.d.ts`
- **This Guide**: `/src/CHATBOT_SETUP.md`

## Quick Start Checklist

- [ ] Get Groq API key from https://console.groq.com/
- [ ] Create `.env.local` file in project root
- [ ] Add `GROQ_API_KEY=gsk-your-key-here` to `.env.local`
- [ ] Restart development server
- [ ] Test chatbot by clicking the floating button
- [ ] Ask a question in Mongolian
- [ ] Verify response appears in real-time
- [ ] Check browser console for any errors
- [ ] Monitor Groq console for usage

## Common Questions

**Q: Is my API key safe?**
A: Yes! The API key is stored on the backend server only and never exposed to the frontend. All API calls happen server-side.

**Q: How much will this cost?**
A: Groq offers a free tier with generous limits. Most use cases are free or very low cost.

**Q: Can I use a different model?**
A: Yes, change the model in `/src/pages/api/chat.ts` from `'mixtral-8x7b-32768'` to other available Groq models.

**Q: What if the API key is wrong?**
A: You'll get a 401 error. Check your API key in the Groq console and update `.env.local`.

**Q: Can users see my API key?**
A: No, the API key is only on the server. Users cannot access it through the browser.

**Q: How do I monitor usage?**
A: Check your Groq console at https://console.groq.com/

---

**Last Updated**: November 29, 2025
**Status**: ✅ Ready for Production
**Architecture**: Secure Backend API Pattern
