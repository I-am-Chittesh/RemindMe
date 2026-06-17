import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import app from "./config";
import { saveFCMToken } from "./firestore";

let messaging = null;

// Request permission + get FCM token, save it to Firestore
export const requestNotificationPermission = async (userId) => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM not supported in this browser");
      return null;
    }

    if (!messaging) messaging = getMessaging(app);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token && userId) {
      await saveFCMToken(userId, token);
      console.log("FCM token saved ✅");
    }

    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

// Foreground messages — when app is open and a push arrives
export const onForegroundMessage = (callback) => {
  if (!messaging) messaging = getMessaging(app);
  return onMessage(messaging, (payload) => {
    console.log("Foreground push received:", payload);
    if (callback) callback(payload);
  });
};