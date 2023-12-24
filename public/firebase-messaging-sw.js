// Inside firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyB5iowNE0LfgddCFcihCLk5O-7uiwWQfHg",
  authDomain: "e-class-room-278f6.firebaseapp.com",
  projectId: "e-class-room-278f6",
  storageBucket: "e-class-room-278f6.appspot.com",
  messagingSenderId: "343724906562",
  appId: "1:343724906562:web:f6f6012ee0657f6a2835db",
  measurementId: "G-0XD2434QVB",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOption = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOption);
});
