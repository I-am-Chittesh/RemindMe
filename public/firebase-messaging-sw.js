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

// store scheduled notifications in SW cache
const NOTIF_STORE = "scheduled-notifications";

// get all scheduled notifications from cache
const getScheduled = async () => {
  const cache = await caches.open(NOTIF_STORE);
  const keys = await cache.keys();
  const notifications = [];
  for (const key of keys) {
    const res = await cache.match(key);
    const data = await res.json();
    notifications.push({ key: key.url, ...data });
  }
  return notifications;
};

// save a notification to cache
const saveNotification = async (id, data) => {
  const cache = await caches.open(NOTIF_STORE);
  const res = new Response(JSON.stringify(data));
  await cache.put(`https://remindme-notif/${id}`, res);
};

// delete a fired notification from cache
const deleteNotification = async (key) => {
  const cache = await caches.open(NOTIF_STORE);
  await cache.delete(key);
};

// check every minute if any notification should fire
const checkAndFire = async () => {
  const now = Date.now();
  const scheduled = await getScheduled();

  for (const notif of scheduled) {
    if (notif.fireAt <= now) {
      await self.registration.showNotification(notif.title, {
        body: notif.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
        tag: notif.id,
        data: { taskId: notif.id },
      });
      await deleteNotification(notif.id);
    }
  }
};

// run check every 60 seconds
setInterval(checkAndFire, 60 * 1000);

// listen for schedule/cancel messages from the app
self.addEventListener("message", async (event) => {
  const { type, id, title, body, fireAt } = event.data;

  if (type === "SCHEDULE_NOTIFICATION") {
    console.log("SW: scheduling notification for", title, "at", new Date(fireAt));
    await saveNotification(id, { id, title, body, fireAt });
    // also check immediately in case it's very soon
    await checkAndFire();
  }

  if (type === "CANCEL_NOTIFICATION") {
    await deleteNotification(id);
  }

  if (type === "SHOW_NOTIFICATION") {
    await self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
    });
  }
});

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

// notification tap → open app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// activate SW immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});