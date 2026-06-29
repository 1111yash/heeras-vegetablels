import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4AoPUMHBZ3bMxpuA3lEOvRTxskStEdUo", // 👈 आपकी असली API Key सेट हो गई है
  authDomain: "heeras-vegetable.firebaseapp.com",
  databaseURL: "https://heeras-vegetable-default-rtdb.firebaseio.com/", 
  projectId: "heeras-vegetable",
  storageBucket: "heeras-vegetable.appspot.com",
  messagingSenderId: "21242317416", 
  appId: "1:21242317416:web:47909c10f7f9e3459a49dd"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);