importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Config has to be hardcoded here — service workers can't access .env
// We'll replace these with real values at build time
firebase.initializeApp({
  apiKey: "AIzaSyAYHqsBbEanJs2aeL7_TKJ-xpcm3t2yJPA",
  authDomain: "b6f24.firebaseapp.com",
  projectId: "remindme-b6f24",
  storageBucket: "remindme-b6f24.firebasestorage.app",
  messagingSenderId: "494621208753",
  appId: "1:494621208753:web:ef108380787b59267d7290",
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: payload.data,
  });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});