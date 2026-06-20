const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

// Calculate next reminder time based on recurrence
const getNextReminderTime = (currentDate, recurrence) => {
  const next = new Date(currentDate);
  switch (recurrence) {
    case "daily":
      next.setDate(next.getDate() + 1);
      return next;
    case "weekly":
      next.setDate(next.getDate() + 7);
      return next;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      return next;
    default:
      return null;
  }
};

exports.checkReminders = onSchedule(
  {
    schedule: "every 1 minutes",
    timeZone: "Asia/Kolkata",
  },
  async (event) => {
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
            // send push notification
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

            const recurrence = task.recurrence || "none";
            const nextDate = getNextReminderTime(reminderDate, recurrence);

            if (recurrence !== "none" && nextDate) {
              // recurring — reset for next occurrence
              await taskDoc.ref.update({
                notified: false,
                reminderTime: Timestamp.fromDate(nextDate),
              });
              console.log(`Next occurrence for "${task.title}" set to ${nextDate}`);
            } else {
              // one-time — just mark as notified
              await taskDoc.ref.update({ notified: true });
            }
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
  }
);