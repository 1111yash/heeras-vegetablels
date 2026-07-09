importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB4AoPUMHBZ3bMxpuA3lEOvRTxskStEdUo",
  authDomain: "heeras-vegetable.firebaseapp.com",
  projectId: "heeras-vegetable",
  storageBucket: "heeras-vegetable.appspot.com",
  messagingSenderId: "21242317416",
  appId: "1:21242317416:web:47909c10f7f9e3459a49dd",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});yrs