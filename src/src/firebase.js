import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyB4AoPUMHBZ3bMxpuA3lEOvRTxskStEdUo",
  authDomain: "heeras-vegetable.firebaseapp.com",
  databaseURL: "https://heeras-vegetable-default-rtdb.firebaseio.com/",
  projectId: "heeras-vegetable",
  storageBucket: "heeras-vegetable.appspot.com",
  messagingSenderId: "21242317416",
  appId: "1:21242317416:web:47909c10f7f9e3459a49dd",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase Cloud Messaging
export const messaging = isSupported().then((supported) =>
  supported ? getMessaging(app) : null
);