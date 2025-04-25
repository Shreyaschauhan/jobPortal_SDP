# Google OAuth 403 Error - Troubleshooting Guide

## The Error
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

This means your frontend URL (origin) is NOT in the "Authorized JavaScript origins" list in Google Cloud Console.

## Step-by-Step Fix

### 1. Check Your Exact Frontend URL

Open your browser's Developer Tools (F12) and check:
- What URL are you accessing? (e.g., `http://localhost:5173`, `http://127.0.0.1:5173`)
- The URL must match EXACTLY in Google Cloud Console (including http/https, port number, and no trailing slash)

### 2. Verify Google Cloud Console Configuration

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID**
5. Click on it to edit

### 3. Add ALL Possible Origins

**Authorized JavaScript origins** - Add ALL of these:
```
http://localhost:5173
http://127.0.0.1:5173
http://localhost:3000
http://localhost:5174
```
(Add any other ports you might use)

**Important Notes:**
- ✅ DO include: `http://localhost:5173` (exact match, no trailing slash)
- ❌ DON'T include: `http://localhost:5173/` (trailing slash is different!)
- ⚠️  `localhost` and `127.0.0.1` are DIFFERENT - add both if you use either

### 4. Verify Client ID

Check that your frontend `.env` file has:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

And make sure this matches EXACTLY the Client ID shown in Google Cloud Console.

### 5. Save and Wait

1. Click **SAVE** in Google Cloud Console
2. Wait 2-5 minutes for changes to propagate
3. Clear browser cache completely (Ctrl+Shift+Delete or Cmd+Shift+Delete)
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
5. Try again

### 6. Verify It's Working

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Check for any errors related to Google OAuth
4. Check the **Network** tab - look for requests to `accounts.google.com`

## Common Mistakes

❌ **Wrong**: Adding `https://localhost:5173` (localhost doesn't use https)
✅ **Correct**: `http://localhost:5173`

❌ **Wrong**: Adding `http://localhost:5173/` (with trailing slash)
✅ **Correct**: `http://localhost:5173` (without trailing slash)

❌ **Wrong**: Adding `http://localhost` without port
✅ **Correct**: `http://localhost:5173` (with exact port)

❌ **Wrong**: Client ID mismatch between frontend .env and Google Cloud Console
✅ **Correct**: They must match exactly

## Still Not Working?

1. **Check browser console** - Look for the exact origin Google is complaining about
2. **Verify Client ID** - Make sure `VITE_GOOGLE_CLIENT_ID` is set correctly
3. **Check if using a different port** - Vite might use a different port if 5173 is busy
4. **Try incognito/private window** - Rules out cache issues
5. **Verify the Client ID is for "Web application" type** in Google Cloud Console

## Quick Test

Run this in your browser console on your frontend page:
```javascript
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('Origin:', window.location.origin);
```

Then verify:
- The Client ID matches Google Cloud Console
- The Origin is in your "Authorized JavaScript origins" list

