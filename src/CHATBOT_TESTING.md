# NegOne AI Chatbot - Testing & Debugging Guide

## Testing the Chatbot

### Step 1: Local Testing

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the application**
   - Navigate to `http://localhost:3000` (or your dev server URL)

3. **Click the floating chat button**
   - Look for the pink/purple circle button in the bottom-right corner
   - Click it to open the chat window

4. **Send a test message**
   - Type: "Сайн байна уу" (Hello)
   - Click the send button or press Enter
   - Wait for the response

### Step 2: Verify API Connection

**Check if the API is working:**

1. Open browser Developer Tools (F12)
2. Go to **Network** tab
3. Send a message in the chatbot
4. Look for a request to `/api/chat`
5. Check the response:
   - Status should be `200`
   - Response should contain the bot's message

**Example successful response:**
```json
{
  "message": "Сайн байна уу! Би NegOne AI туслах юм. Та эрүүл мэнд, фитнес, хооллолт, сэтгэлзүйн талаар асуулт байвал асууж болно."
}
```

### Step 3: Check for Errors

**In Browser Console (F12 > Console):**
- Look for any red error messages
- Common errors:
  - `Failed to fetch /api/chat` - Backend API not responding
  - `API key not found` - Environment variable not set
  - `401 Unauthorized` - API key is invalid

**In Server Logs:**
- Check terminal where you ran `npm run dev`
- Look for error messages from the API route
- Check for OpenAI API errors

## Test Cases

### Test 1: Basic Greeting
**Input:** "Сайн байна уу"
**Expected:** Bot responds with a greeting in Mongolian

### Test 2: Fitness Question
**Input:** "Фитнесийн хувьд сайн зөвлөгөө өгөөрэй"
**Expected:** Bot provides fitness advice in Mongolian

### Test 3: Nutrition Question
**Input:** "Эрүүл хооллолтын талаар ямар мэдээлэл байна вэ?"
**Expected:** Bot provides nutrition advice in Mongolian

### Test 4: Mental Health Question
**Input:** "Сэтгэлзүйн эрүүл мэндийн талаар ярьж болох уу?"
**Expected:** Bot provides mental health advice in Mongolian

### Test 5: Long Conversation
**Input:** Multiple messages in sequence
**Expected:** Bot maintains context and responds appropriately

### Test 6: Empty Message
**Input:** Click send without typing
**Expected:** Nothing happens, no error

### Test 7: Very Long Message
**Input:** A very long message (500+ characters)
**Expected:** Bot processes and responds normally

## Debugging

### Issue: API Returns 401 Unauthorized

**Cause:** API key is missing or invalid

**Debug Steps:**
1. Check `.env.local` file exists in project root
2. Verify `OPENAI_API_KEY=sk-...` is set correctly
3. Copy-paste the key from OpenAI dashboard again
4. Restart the development server
5. Check OpenAI dashboard that the key hasn't been revoked

**Test the API key directly:**
```bash
# In terminal, test if the API key works
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer sk-your-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Issue: API Returns 429 Rate Limited

**Cause:** Too many requests to OpenAI API

**Debug Steps:**
1. Wait 1-2 minutes before trying again
2. Check OpenAI dashboard for usage limits
3. Verify you haven't exceeded your monthly quota
4. Consider upgrading your OpenAI plan

### Issue: API Returns 500 Internal Server Error

**Cause:** Backend API error

**Debug Steps:**
1. Check server logs in terminal
2. Verify OpenAI API is responding
3. Check that the message is being sent correctly
4. Restart the development server

### Issue: Chatbot Not Responding

**Debug Steps:**
1. Open browser console (F12)
2. Check for error messages
3. Open Network tab
4. Send a message
5. Look for `/api/chat` request
6. Check if request was sent and what the response was
7. Check server logs for errors

### Issue: Response in English Instead of Mongolian

**Debug Steps:**
1. Try asking in Mongolian first
2. Check the system prompt in `/src/pages/api/chat.ts`
3. Verify the prompt includes "Always respond in Mongolian language"
4. Try a different question
5. Check OpenAI API status

## Performance Testing

### Test Response Time
1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message
4. Check the time taken for `/api/chat` request
5. Typical response time: 1-3 seconds

### Test Multiple Messages
1. Send 5-10 messages in quick succession
2. Verify all responses are received
3. Check for any rate limiting errors
4. Monitor API usage in OpenAI dashboard

### Test on Different Devices
1. Test on desktop browser
2. Test on mobile browser
3. Test on tablet
4. Verify responsive design works
5. Check that chat window is accessible

## Monitoring

### Monitor API Usage

**In OpenAI Dashboard:**
1. Go to https://platform.openai.com/account/billing/overview
2. Check current usage
3. Set up billing alerts
4. Monitor costs

**In Application:**
1. Add logging to `/src/pages/api/chat.ts`
2. Log each API call with timestamp
3. Log response time
4. Log any errors

### Example Logging

Add this to `/src/pages/api/chat.ts`:

```typescript
console.log(`[${new Date().toISOString()}] Chat request from user`);
console.log(`Message: ${userMessage}`);
console.log(`Response time: ${Date.now() - startTime}ms`);
```

## Production Testing

### Before Deploying to Production

1. **Test with real API key**
   - Use production API key
   - Test all features
   - Monitor costs

2. **Test error handling**
   - Test with invalid API key
   - Test with rate limiting
   - Test with network errors

3. **Test performance**
   - Test with multiple concurrent users
   - Monitor response times
   - Check API usage

4. **Test security**
   - Verify API key is not exposed
   - Check that frontend cannot access API key
   - Verify input validation works

5. **Test on staging environment**
   - Deploy to staging first
   - Run all tests
   - Monitor for errors
   - Then deploy to production

## Useful Commands

### Check if API key is set
```bash
# On Mac/Linux
echo $OPENAI_API_KEY

# On Windows (PowerShell)
$env:OPENAI_API_KEY
```

### View environment variables
```bash
# Check if .env.local is being read
cat .env.local
```

### Test API endpoint
```bash
# Test the /api/chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Сайн байна уу"}'
```

## Support Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Status Page**: https://status.openai.com/
- **Community Forum**: https://community.openai.com/
- **Astro Documentation**: https://docs.astro.build/

## Checklist for Deployment

- [ ] API key is set in environment variables
- [ ] Chatbot responds to test messages
- [ ] Responses are in Mongolian
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] API usage is being monitored
- [ ] Billing alerts are set up
- [ ] Rate limiting is working
- [ ] Security is verified
- [ ] Performance is acceptable

---

**Last Updated**: November 29, 2025
**Status**: ✅ Testing Guide Complete
