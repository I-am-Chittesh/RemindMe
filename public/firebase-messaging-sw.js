importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAYHqsBbEanJs2aeL7_TKJ-xpcm3t2yJPA",
  authDomain: "remindme-b6f24.firebaseapp.com",
  projectId: "remindme-b6f24",
  storageBucket: "remindme-b6f24.firebasestorage.app",
  messagingSenderId: "494621208753",
  appId: "1:494621208753:web:ef108380787b59267d7290",
});

const messaging = firebase.messaging();

console.log("[Firebase SW] Service Worker initialized");

// background FCM notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[Firebase SW] Background message:", payload);
  
  const notification = payload.notification || {};
  const title = notification.title || "RemindMe";
  const body = notification.body || "";
  
  if (body) {
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
    });
  }
});

// handle postMessage from main app
self.addEventListener("message", (event) => {
  console.log("[Firebase SW] Message event:", event.data);
  
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, data } = event.data;
    
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      data: data || {},
    });
  }
});

// notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[Firebase SW] Notification clicked");
  
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        if (windowClients[i].url === "/") {
          return windowClients[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});