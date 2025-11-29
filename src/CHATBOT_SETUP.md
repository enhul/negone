# NegOne AI Chatbot - OpenAI Integration Setup Guide

## Overview
The NegOne chatbot has been integrated with OpenAI's ChatGPT API to provide real-time, intelligent responses to users about fitness, nutrition, mental health, and wellness.

## What's Been Implemented

### 1. **Chatbot Component** (`/src/components/Chatbot.tsx`)
- Floating chat button in the bottom-right corner
- Real-time messaging interface with smooth animations
- Integration with OpenAI's GPT-3.5-turbo model
- Mongolian language support
- Loading states and error handling

### 2. **Features**
- ✅ Real-time responses from ChatGPT
- ✅ Empathetic, supportive tone
- ✅ Personalized health and wellness advice
- ✅ Available on all pages
- ✅ Beautiful UI with animations
- ✅ Mobile responsive
- ✅ Message history during session

## Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the API key (you'll only see it once!)

### Step 2: Add Environment Variable

Create a `.env.local` file in the root of your project (same level as `package.json`):

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

Replace `sk-your-api-key-here` with your actual OpenAI API key.

### Step 3: Verify Setup

The chatbot should now be:
1. ✅ Available on all pages (floating button in bottom-right)
2. ✅ Responding with real ChatGPT responses
3. ✅ Speaking in Mongolian
4. ✅ Providing health and wellness advice

## How It Works

### User Flow
1. User clicks the floating chat button (💬 icon)
2. Chat window opens with greeting message
3. User types a question
4. Message is sent to OpenAI API
5. ChatGPT generates a response
6. Response appears in the chat window
7. User can continue the conversation

### System Prompt
The chatbot uses a system prompt that defines its personality:
- **Role**: NegOne AI - Health & Wellness Assistant for Women
- **Language**: Mongolian
- **Tone**: Empathetic, encouraging, supportive
- **Expertise**: Fitness, nutrition, mental health, self-love

### API Integration
- **Model**: GPT-3.5-turbo (fast and cost-effective)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (concise responses)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`

## Cost Considerations

### Pricing
- GPT-3.5-turbo: ~$0.0005 per 1K input tokens, ~$0.0015 per 1K output tokens
- Average conversation: ~100-200 tokens per exchange
- Estimated cost: $0.001-0.002 per user message

### Budget Management
1. Set up usage limits in OpenAI dashboard
2. Monitor API usage regularly
3. Consider implementing rate limiting if needed

## Troubleshooting

### Issue: "API key not found"
**Solution**: 
- Verify `.env.local` file exists in project root
- Check that `VITE_OPENAI_API_KEY` is set correctly
- Restart the development server

### Issue: "401 Unauthorized"
**Solution**:
- Verify API key is correct
- Check that API key hasn't been revoked
- Ensure API key has proper permissions

### Issue: "Rate limit exceeded"
**Solution**:
- Wait a few minutes before retrying
- Consider implementing request throttling
- Check OpenAI dashboard for usage limits

### Issue: Responses in English instead of Mongolian
**Solution**:
- The system prompt specifies Mongolian
- If still happening, try asking in Mongolian first
- Check OpenAI API status

## Customization

### Change the System Prompt
Edit the `SYSTEM_PROMPT` in `/src/components/Chatbot.tsx`:

```typescript
const SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Change the Model
Replace `'gpt-3.5-turbo'` with:
- `'gpt-4'` (more powerful, more expensive)
- `'gpt-4-turbo'` (faster GPT-4)
- `'gpt-3.5-turbo-16k'` (longer context)

### Adjust Response Length
Change `max_tokens` value (default: 500):
```typescript
max_tokens: 300, // Shorter responses
max_tokens: 1000, // Longer responses
```

### Adjust Creativity
Change `temperature` value (default: 0.7):
- `0.0` = Deterministic, factual
- `0.7` = Balanced (default)
- `1.0` = Creative, varied

## Security Best Practices

1. **Never commit API key to git**
   - Use `.env.local` (already in `.gitignore`)
   - Use environment variables in production

2. **Rotate API keys regularly**
   - Delete old keys from OpenAI dashboard
   - Generate new ones periodically

3. **Monitor usage**
   - Check OpenAI dashboard daily
   - Set up billing alerts

4. **Rate limiting**
   - Consider implementing per-user rate limits
   - Prevent abuse and excessive costs

## Production Deployment

### For Wix Deployment
1. Add environment variable in Wix dashboard:
   - Go to **Settings > Environment Variables**
   - Add `VITE_OPENAI_API_KEY` with your API key
   
2. Ensure `.env.local` is in `.gitignore`

3. Test thoroughly before going live

### Environment Variables in Different Environments
```
Development: .env.local
Production: Wix Dashboard > Environment Variables
Staging: Wix Dashboard > Environment Variables (staging)
```

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

- **OpenAI Documentation**: https://platform.openai.com/docs
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Status Page**: https://status.openai.com/
- **Community Forum**: https://community.openai.com/

## Next Steps

1. ✅ Set up OpenAI API key
2. ✅ Test the chatbot
3. ✅ Monitor usage and costs
4. ✅ Customize system prompt if needed
5. ✅ Deploy to production

## File Locations

- **Chatbot Component**: `/src/components/Chatbot.tsx`
- **Layout Integration**: `/src/components/Layout.tsx`
- **Environment Setup**: `/src/env.d.ts`
- **This Guide**: `/src/CHATBOT_SETUP.md`

---

**Last Updated**: November 29, 2025
**Status**: ✅ Ready for Production
