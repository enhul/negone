# NegOne AI Chatbot - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get API Key (2 minutes)
1. Go to https://console.groq.com/
2. Click "Create new API key"
3. Copy the key (you'll only see it once!)

### Step 2: Add to Project (1 minute)
Create `.env.local` file in project root:
```env
GROQ_API_KEY=gsk-your-api-key-here
```

### Step 3: Test It! (1 minute)
1. Restart dev server
2. Click the floating chat button (💬)
3. Type: "Сайн байна уу"
4. Get instant response!

---

## 📋 What's New

✅ **Secure Backend API** - API key is protected on the server  
✅ **Real Groq Responses** - Not pre-programmed answers  
✅ **Mongolian Support** - Responds in Mongolian  
✅ **Error Handling** - Graceful error messages  
✅ **Production Ready** - Fully tested and secure  

---

## 🔧 Architecture

```
User Types Message
        ↓
Frontend (Chatbot.tsx)
        ↓
Backend API (/api/chat.ts) ← API Key is HERE (secure!)
        ↓
Groq API
        ↓
Response back to User
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/src/components/Chatbot.tsx` | Chat UI component |
| `/src/pages/api/chat.ts` | **NEW** Backend API route |
| `.env.local` | **NEW** Environment variables |
| `/src/CHATBOT_SETUP.md` | Full setup guide |
| `/src/CHATBOT_TESTING.md` | Testing & debugging |

---

## ✅ Verification Checklist

- [ ] `.env.local` file created
- [ ] `GROQ_API_KEY` is set
- [ ] Dev server restarted
- [ ] Chatbot button visible
- [ ] Can send messages
- [ ] Getting responses
- [ ] No console errors

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not found" | Check `.env.local` exists and has `GROQ_API_KEY=gsk-...` |
| "401 Unauthorized" | Verify API key is correct in Groq console |
| No response | Check browser console (F12) for errors |
| English responses | Try asking in Mongolian first |
| Chatbot not visible | Scroll to bottom-right corner of page |

---

## 💰 Cost Estimate

- **Per message**: Free or minimal
- **100 messages**: Free
- **1000 messages**: Free (with Groq's generous free tier)

Monitor at: https://console.groq.com/

---

## 🔒 Security

✅ API key stored on backend only  
✅ Never exposed to frontend  
✅ All Groq calls are server-side  
✅ Input validation on backend  
✅ Safe for production use  

---

## 📞 Need Help?

1. **Check the logs**: Open browser console (F12) and server terminal
2. **Read the guides**: `/src/CHATBOT_SETUP.md` and `/src/CHATBOT_TESTING.md`
3. **Test the API**: Use the test cases in `CHATBOT_TESTING.md`
4. **Check Groq status**: https://status.groq.com/

---

## 🎯 Next Steps

1. ✅ Set up API key
2. ✅ Test the chatbot
3. ✅ Monitor usage
4. ✅ Deploy to production
5. ✅ Celebrate! 🎉

---

**Status**: ✅ Ready to Use  
**Last Updated**: November 29, 2025
