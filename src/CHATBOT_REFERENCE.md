# NegOne AI Chatbot - Quick Reference

## 🎯 One-Page Summary

### Setup (3 Steps)
```
1. Get API key: https://platform.openai.com/api-keys
2. Create .env.local with: OPENAI_API_KEY=sk-...
3. Restart dev server and test!
```

### Architecture
```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Chatbot Component (Chatbot.tsx)             │   │
│  │  - Beautiful UI                              │   │
│  │  - Message input/display                     │   │
│  │  - Calls /api/chat endpoint                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓ POST /api/chat
┌─────────────────────────────────────────────────────┐
│                  Backend Server                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  API Route (pages/api/chat.ts)               │   │
│  │  - Validates message                         │   │
│  │  - Has API key (SECURE!)                     │   │
│  │  - Calls OpenAI                              │   │
│  │  - Returns response                          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓ API Call
┌─────────────────────────────────────────────────────┐
│              OpenAI API (External)                   │
│  - GPT-3.5-turbo model                              │
│  - Processes message                                │
│  - Returns response                                 │
└─────────────────────────────────────────────────────┘
```

---

## 📁 File Reference

### Core Files
| File | Purpose | Status |
|------|---------|--------|
| `/src/components/Chatbot.tsx` | Chat UI | ✅ Updated |
| `/src/pages/api/chat.ts` | Backend API | ✅ NEW |
| `.env.local` | API key | ✅ Create this |

### Documentation
| File | Purpose |
|------|---------|
| `/src/CHATBOT_QUICK_START.md` | 3-step setup |
| `/src/CHATBOT_SETUP.md` | Detailed guide |
| `/src/CHATBOT_TESTING.md` | Testing guide |
| `/src/CHATBOT_INTEGRATION_SUMMARY.md` | Overview |
| `/src/CHATBOT_REFERENCE.md` | This file |

---

## 🔑 Environment Variables

### Development
```env
# File: .env.local (in project root)
OPENAI_API_KEY=sk-your-api-key-here
```

### Production
```
Wix Dashboard > Settings > Environment Variables
OPENAI_API_KEY=sk-your-api-key-here
```

---

## 🚀 Quick Commands

### Get API Key
```
1. Visit: https://platform.openai.com/api-keys
2. Click: "Create new secret key"
3. Copy: The key (only shown once!)
```

### Create .env.local
```bash
# Mac/Linux
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local

# Windows (PowerShell)
"OPENAI_API_KEY=sk-your-key-here" | Out-File -FilePath .env.local
```

### Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Сайн байна уу"}'
```

---

## 🧪 Test Messages

### Mongolian Test Messages
```
Greeting:
"Сайн байна уу"

Fitness:
"Фитнесийн хувьд сайн зөвлөгөө өгөөрэй"

Nutrition:
"Эрүүл хооллолтын талаар ямар мэдээлэл байна вэ?"

Mental Health:
"Сэтгэлзүйн эрүүл мэндийн талаар ярьж болох уу?"
```

---

## 🔍 Debugging Checklist

```
□ .env.local exists in project root
□ OPENAI_API_KEY is set correctly
□ Dev server restarted
□ Chatbot button visible (bottom-right)
□ Can type messages
□ Messages are sent to /api/chat
□ Getting responses back
□ No errors in browser console (F12)
□ No errors in server logs
```

---

## 📊 API Response Format

### Success Response
```json
{
  "message": "Сайн байна уу! Би NegOne AI туслах юм..."
}
```

### Error Response
```json
{
  "error": "API key not configured",
  "message": "Уучлаарай, API түлхүүр олдсонгүй..."
}
```

---

## 🔐 Security Checklist

```
✅ API key stored on backend only
✅ API key NOT in frontend code
✅ API key NOT in browser requests
✅ API key NOT in git repository
✅ Input validation on backend
✅ Error handling on backend
✅ HTTPS in production
```

---

## 💰 Cost Reference

### Pricing
```
GPT-3.5-turbo:
- Input: ~$0.0005 per 1K tokens
- Output: ~$0.0015 per 1K tokens

Average message:
- Input: ~50-100 tokens
- Output: ~50-100 tokens
- Cost: ~$0.001-0.002 per message
```

### Budget Estimate
```
100 messages/day:
- Daily: ~$0.10-0.20
- Monthly: ~$3-6

1000 messages/day:
- Daily: ~$1-2
- Monthly: ~$30-60
```

---

## 🐛 Common Errors & Fixes

### Error: "API key not found"
```
Fix:
1. Create .env.local in project root
2. Add: OPENAI_API_KEY=sk-...
3. Restart dev server
```

### Error: "401 Unauthorized"
```
Fix:
1. Check API key in OpenAI dashboard
2. Verify key hasn't been revoked
3. Try generating a new key
4. Update .env.local
```

### Error: "Failed to fetch /api/chat"
```
Fix:
1. Check server is running
2. Check browser console for errors
3. Check server logs
4. Restart dev server
```

### Error: "Rate limit exceeded"
```
Fix:
1. Wait 1-2 minutes
2. Check OpenAI dashboard for limits
3. Upgrade plan if needed
```

---

## 📞 Support Resources

### Official Resources
- OpenAI Docs: https://platform.openai.com/docs
- API Reference: https://platform.openai.com/docs/api-reference
- Status Page: https://status.openai.com/
- Community: https://community.openai.com/

### Project Documentation
- Quick Start: `/src/CHATBOT_QUICK_START.md`
- Full Setup: `/src/CHATBOT_SETUP.md`
- Testing: `/src/CHATBOT_TESTING.md`
- Summary: `/src/CHATBOT_INTEGRATION_SUMMARY.md`

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] API key obtained
- [ ] .env.local created
- [ ] Chatbot tested locally
- [ ] No console errors
- [ ] Responses in Mongolian

### Deployment
- [ ] Add OPENAI_API_KEY to Wix environment variables
- [ ] Deploy to production
- [ ] Test on production
- [ ] Monitor API usage

### Post-Deployment
- [ ] Monitor daily usage
- [ ] Check for errors
- [ ] Verify responses
- [ ] Monitor costs
- [ ] Set up alerts

---

## 🎯 Key Points

1. **API Key is Secure**
   - Stored on backend only
   - Never exposed to frontend
   - Safe for production

2. **Easy to Setup**
   - Just 3 steps
   - Takes ~5 minutes
   - No complex configuration

3. **Production Ready**
   - Error handling
   - Rate limiting
   - Input validation
   - Logging support

4. **Well Documented**
   - Quick start guide
   - Full setup guide
   - Testing guide
   - This reference

---

## 🎉 You're All Set!

The NegOne AI Chatbot is ready to use. Just:

1. Get your API key
2. Add it to .env.local
3. Restart dev server
4. Click the chat button
5. Start chatting!

---

**Status**: ✅ Ready to Use  
**Last Updated**: November 29, 2025  
**Version**: 2.0 (Secure Backend)
