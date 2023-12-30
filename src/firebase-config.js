// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB5iowNE0LfgddCFcihCLk5O-7uiwWQfHg",
  authDomain: "e-class-room-278f6.firebaseapp.com",
  projectId: "e-class-room-278f6",
  storageBucket: "e-class-room-278f6.appspot.com",
  messagingSenderId: "343724906562",
  appId: "1:343724906562:web:f6f6012ee0657f6a2835db",
  measurementId: "G-0XD2434QVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();
const messaging = getMessaging(app);



export {app, auth, db, storage, messaging};