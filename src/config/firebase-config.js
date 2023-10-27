// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

//1 for logging in
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCJfpG0Vb0JOpaI_jLMrz3zurVcqk6lIEE",
  authDomain: "e-class-room-7219c.firebaseapp.com",
  projectId: "e-class-room-7219c",
  storageBucket: "e-class-room-7219c.appspot.com",
  messagingSenderId: "277200520190",
  appId: "1:277200520190:web:ca8d462359966e581d36af",
  measurementId: "G-8C21NPQMWY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

//2
const auth = getAuth()
export {app, getAuth};