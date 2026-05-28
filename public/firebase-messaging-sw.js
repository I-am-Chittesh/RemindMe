importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAYHqsBbEanJs2aeL7_TKJ-xpcm3t2yJPA",
  authDomain: "b6f24.firebaseapp.com",
  projectId: "remindme-b6f24",
  storageBucket: "remindme-b6f24.firebasestorage.app",
  messagingSenderId: "494621208753",
  appId: "1:494621208753:web:ef108380787b59267d7290",
});


const messaging = firebase.messaging();

// background FCM notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
  });
});

// this handles the postMessage from useTasks.js setTimeout
self.addEventListener("message", (event) => {
  console.log("SW received message:", event.data);
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      data: event.data.data,
    });
  }
});

// notification tap opens the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});