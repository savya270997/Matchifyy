// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQkyjMvtv7br1Hue0XC2ipnf1D6DbTmzE",
  authDomain: "matchifyy.firebaseapp.com",
  databaseURL:
    "https://matchifyy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "matchifyy",
  storageBucket: "matchifyy.appspot.com",
  messagingSenderId: "317292696004",
  appId: "1:317292696004:web:c1ae7fd8f46f2a289cd491",
  measurementId: "G-RT8Q03S9TL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const thedb = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, thedb };
