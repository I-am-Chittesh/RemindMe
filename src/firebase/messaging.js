import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";
import { saveFCMToken } from "./firestore";

const messaging = getMessaging(app);

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token && userId) {
      await saveFCMToken(userId, token);
      console.log("FCM token saved:", token);
    }

    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

// foreground — manually show the notification when app is open
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const { title, body } = payload.notification;

    // manually trigger the notification while app is open
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
      });
    }

    if (callback) callback(payload);
  });
};

export { messaging };