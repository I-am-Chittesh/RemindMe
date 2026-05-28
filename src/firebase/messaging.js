import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";
import { saveFCMToken } from "./firestore";

const messaging = getMessaging(app);

// Request permission + get FCM token
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
    }

    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

// Handle foreground messages (app is open)
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export { messaging };