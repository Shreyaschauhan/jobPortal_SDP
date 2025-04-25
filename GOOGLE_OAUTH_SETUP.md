# Google OAuth Setup Guide

## Overview
This guide will help you fix the "403 - The given origin is not allowed for the given client ID" error when using Google Sign-In.

## Step 1: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create a new one)

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Search for "Identity Toolkit API" and enable it

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information:
     - User Type: External (or Internal if using Google Workspace)
     - App name, User support email, Developer contact information
   - Add scopes if needed (email, profile are usually required)
   - Save and continue

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Fill in the details:

   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://jobportal-sdp.onrender.com
   https://your-frontend-domain.com
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:5173
   https://jobportal-sdp.onrender.com
   https://your-frontend-domain.com
   ```

5. **Save the Client ID**
   - Copy the Client ID (it looks like: `xxxxx-xxxxx.apps.googleusercontent.com`)
   - You'll need this for your environment variables

## Step 2: Update Environment Variables

### Frontend (.env or deployment environment variables)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_REACT_APP_API_URL=http://localhost:8081/api
```

### Backend (.env or deployment environment variables)
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here (if using passport)
CORS_ORIGIN=https://jobportal-sdp.onrender.com
```

## Step 3: Important Notes

1. **Origin Mismatch Error**: The 403 error occurs when your frontend URL is not listed in "Authorized JavaScript origins" in Google Cloud Console.

2. **Multiple Environments**: If you're using different URLs for development and production, add ALL of them to the authorized origins list.

3. **HTTPS Required**: Google OAuth requires HTTPS for production domains. Localhost is allowed to use HTTP.

4. **Client ID Must Match**: Make sure the `GOOGLE_CLIENT_ID` in both frontend and backend environment variables matches exactly.

## Step 4: Testing

1. Clear your browser cache and cookies
2. Test the Google Sign-In button
3. Check browser console for any remaining errors
4. Verify that the token is being sent correctly to your backend

## Common Issues

### Issue: "The given origin is not allowed"
**Solution**: Add your exact frontend URL (with http/https and port if applicable) to "Authorized JavaScript origins" in Google Cloud Console.

### Issue: "Invalid client ID"
**Solution**: Verify that your `VITE_GOOGLE_CLIENT_ID` environment variable matches the Client ID from Google Cloud Console.

### Issue: "Cross-Origin-Opener-Policy" errors
**Solution**: This is usually resolved by adding the correct origins to Google Cloud Console. The CORS configuration in the backend has been updated to handle this.

### Issue: 500 error on backend
**Solution**: 
- Check that `GOOGLE_CLIENT_ID` is set correctly in backend environment variables
- Verify the token is being received correctly
- Check backend logs for detailed error messages

## Verification Checklist

- [ ] Google+ API is enabled in Google Cloud Console
- [ ] OAuth consent screen is configured
- [ ] OAuth 2.0 Client ID is created
- [ ] Frontend URL is added to "Authorized JavaScript origins"
- [ ] Frontend URL is added to "Authorized redirect URIs"
- [ ] `VITE_GOOGLE_CLIENT_ID` is set in frontend environment
- [ ] `GOOGLE_CLIENT_ID` is set in backend environment
- [ ] Client IDs match in both environments
- [ ] CORS is configured correctly in backend
- [ ] Environment variables are deployed/restarted

## Need Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Check backend logs for authentication errors
3. Verify all environment variables are set correctly
4. Ensure Google Cloud Console configuration is saved and changes have propagated (may take a few minutes)

