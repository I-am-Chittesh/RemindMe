const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

// Runs every minute
exports.checkReminders = onSchedule("every 1 minutes", async (event) => {
  const now = new Date();

  console.log("Checking reminders at", now.toISOString());

  const usersSnapshot = await db.collection("users").get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) continue;

    const tasksRef = db.collection("users").doc(userId).collection("tasks");
    const tasksSnapshot = await tasksRef
      .where("notified", "==", false)
      .where("completed", "==", false)
      .get();

    for (const taskDoc of tasksSnapshot.docs) {
      const task = taskDoc.data();

      if (!task.reminderTime) continue;

      const reminderDate = task.reminderTime.toDate();

      if (reminderDate <= now) {
        try {
          await messaging.send({
            token: fcmToken,
            notification: {
              title: "RemindMe 🔔",
              body: task.title,
            },
            data: {
              taskId: taskDoc.id,
            },
            webpush: {
              fcmOptions: {
                link: "/",
              },
            },
          });

          console.log(`Notification sent for task "${task.title}" to user ${userId}`);

          await taskDoc.ref.update({ notified: true });
        } catch (error) {
          console.error(`Failed to send notification for task ${taskDoc.id}:`, error);

          if (
            error.code === "messaging/registration-token-not-registered" ||
            error.code === "messaging/invalid-registration-token"
          ) {
            await db.collection("users").doc(userId).update({ fcmToken: null });
          }
        }
      }
    }
  }

  console.log("Reminder check complete");
});