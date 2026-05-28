import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { onForegroundMessage } from "./firebase/messaging"

// Register Firebase messaging service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js", { scope: "/" })
    .then((registration) => {
      console.log("Firebase messaging SW registered:", registration)
    })
    .catch((error) => {
      console.error("Firebase messaging SW registration failed:", error)
    })
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