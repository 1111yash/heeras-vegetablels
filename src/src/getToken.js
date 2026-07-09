import { getToken } from "firebase/messaging";
// सही
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notification permission denied");
      return;
    }

    const messagingInstance = await messaging;

    if (!messagingInstance) {
      console.log("Messaging not supported");
      return;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: "BG2idWa29fVrYhHxUciPFM1hL8gCdsMVcV-yOsM1VCC4rKXNjQK60hJIn4LYy0KJRmGSo6CVQRRSso3yWNBs2l4-yOsM1VCC4rKXNjQK60hJIn4LYy0KJRmGSo6CVQRRSso3yWNBs2l4",
    });

    console.log("FCM Token:", token);

    return token;
  } catch (err) {
    console.error(err);
  }
};