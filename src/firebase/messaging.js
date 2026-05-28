import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";
import { saveFCMToken } from "./firestore";

const messaging = getMessaging(app);

export const requestNotificationPermission = async (userId) => {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("FCM token obtained:", token.substring(0, 20) + "...");
      
      if (userId) {
        await saveFCMToken(userId, token);
        console.log("FCM token saved to Firestore");
      }
    } else {
      console.warn("Failed to get FCM token");
    }

    return token;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const notification = payload.notification || {};
    const title = notification.title || "RemindMe";
    const body = notification.body || "";

    // Manually show notification while app is in foreground
    if (Notification.permission === "granted" && body) {
      try {
        new Notification(title, {
          body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          vibrate: [200, 100, 200],
        });
        console.log("Foreground notification displayed");
      } catch (error) {
        console.error("Error displaying foreground notification:", error);
      }
    }

    if (callback) {
      callback(payload);
    }
  });
};

export { messaging };