# 🔑 GROQ_API_KEY Setup Guide

## Problem
The chatbot is showing the error: **"Уучлаарай, API түлхүүр олдсонгүй. Админтай холбогдоорой."** (API key not found)

This means the `GROQ_API_KEY` environment variable is not being loaded properly.

---

## Solution

### Step 1: Get Your Groq API Key

1. Go to https://console.groq.com/
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create New API Key"**
5. Copy the key (it starts with `gsk-`)

### Step 2: Create `.env.local` File

**For Local Development:**

1. In your project root (same level as `package.json`), create a file named `.env.local`
2. Add this line:
   ```
   GROQ_API_KEY=gsk-your-actual-api-key-here
   ```
3. Replace `gsk-your-actual-api-key-here` with your actual Groq API key

**Example:**
```
GROQ_API_KEY=gsk-proj_abc123def456ghi789jkl012mno345pqr
```

### Step 3: Verify the File

- **File location:** `/project-root/.env.local`
- **File should NOT be committed** (already in `.gitignore`)
- **File should be readable** by the development server

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the Chatbot

1. Open your app in the browser
2. Click the floating chat button (💬) in the bottom-right corner
3. Type a test message: "Сайн байна уу"
4. You should get a response from the chatbot

---

## For Production (Wix Deployment)

1. Go to **Wix Dashboard**
2. Navigate to **Settings > Environment Variables**
3. Add a new environment variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk-your-actual-api-key-here`
4. Save and deploy

---

## Troubleshooting

### Issue: Still getting "API key not found" error

**Check 1: File exists**
```bash
# On Mac/Linux:
ls -la .env.local

# On Windows (PowerShell):
Get-Item .env.local
```

**Check 2: File content is correct**
```bash
# On Mac/Linux:
cat .env.local

# On Windows (PowerShell):
Get-Content .env.local
```

Should output:
```
GROQ_API_KEY=gsk-...
```

**Check 3: Dev server restarted**
- Stop the dev server (Ctrl+C)
- Wait 2 seconds
- Restart with `npm run dev`

**Check 4: API key is valid**
- Go to https://console.groq.com/
- Check if your API key is still active
- If revoked, create a new one and update `.env.local`

### Issue: Getting "API key is invalid" error

This means the API key exists but is incorrect or revoked:
1. Go to https://console.groq.com/
2. Check your API key
3. If it's revoked, create a new one
4. Update `.env.local` with the new key
5. Restart the dev server

### Issue: Getting rate limit error

This means you've sent too many requests:
1. Wait 1-2 minutes
2. Try again

---

## How It Works

```
User types message
    ↓
Frontend sends to /api/chat
    ↓
Backend reads GROQ_API_KEY from environment
    ↓
Backend calls Groq API with the key
    ↓
Groq returns response
    ↓
Frontend displays response
```

---

## Environment Variable Loading

The code now includes debug logging to help diagnose issues:

```typescript
console.log('Checking for GROQ_API_KEY...');
console.log('API Key exists:', !!apiKey);
console.log('API Key length:', apiKey?.length || 0);
console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('GROQ') || key.includes('API')));
```

**To view these logs:**
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Send a message in the chatbot
4. Look for the debug messages

---

## Files Modified

- ✅ `/src/env.d.ts` - Added `NodeJS.ProcessEnv` type for `GROQ_API_KEY`
- ✅ `/src/pages/api/chat.ts` - Added debug logging and improved error messages
- ✅ `/src/components/Chatbot.tsx` - No changes needed (already calls `/api/chat`)

---

## Quick Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added `GROQ_API_KEY=gsk-...` to `.env.local`
- [ ] Restarted dev server
- [ ] Tested chatbot with a message
- [ ] Got a response (not an error)

---

## Still Having Issues?

1. **Check the browser console** (F12 > Console tab)
2. **Check the server logs** in your terminal
3. **Verify the API key** at https://console.groq.com/
4. **Restart everything:**
   - Stop dev server (Ctrl+C)
   - Delete `.env.local`
   - Create new `.env.local` with correct key
   - Restart dev server

---

## Security Notes

- ✅ The API key is **only** stored in `.env.local` (local development)
- ✅ The API key is **never** exposed to the frontend
- ✅ The API key is **never** visible in browser requests
- ✅ The API key is **never** committed to git (in `.gitignore`)
- ✅ For production, use Wix's environment variables (not in code)

---

## Need Help?

- **Groq Documentation:** https://console.groq.com/docs
- **Groq API Reference:** https://console.groq.com/docs/api-reference
- **Groq Status:** https://status.groq.com/

