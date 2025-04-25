import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import store from './store/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Debug: Log client ID and origin for troubleshooting
if (!GOOGLE_CLIENT_ID) {
  console.error("❌ VITE_GOOGLE_CLIENT_ID is not set in environment variables!");
} else {
  console.log("✅ Google Client ID loaded:", GOOGLE_CLIENT_ID);
  console.log("📍 Current origin:", window.location.origin);
  console.log("💡 Make sure this origin is in Google Cloud Console 'Authorized JavaScript origins'");
}

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
  <Provider store={store}>
  <StrictMode>
    <App/>
    <Toaster />
  </StrictMode>
  </Provider>
  </GoogleOAuthProvider>,
)
