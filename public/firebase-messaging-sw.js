importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

// Background push — fires when app is closed or minimized
messaging.onBackgroundMessage((payload) => {
  console.log("Background push received:", payload);

  const title = payload.notification?.title || "RemindMe 🔔";
  const body = payload.notification?.body || "You have a reminder";

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: payload.data || {},
  });
});

// Tap on notification → open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindow = clientsArr.find((c) => c.url.includes(self.location.origin));
      if (hadWindow) return hadWindow.focus();
      return clients.openWindow("/");
    })
  );
});

// activate immediately, don't wait for old SW to be killed
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});