// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export {app, auth, db, storage};