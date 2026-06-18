import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { onForegroundMessage } from "./firebase/messaging"

// Register Firebase messaging service worker
// Manually register the Firebase Messaging service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Firebase messaging SW registered:', registration);
    })
    .catch((err) => {
      console.error('Firebase messaging SW registration failed:', err);
    });
}

// Set up foreground message listener
onForegroundMessage((payload) => {
  console.log("Foreground notification handled:", payload)
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)