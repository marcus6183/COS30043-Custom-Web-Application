// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo1ddR2xCWOetgHo6zSG_JXyd13_1a29I",
  authDomain: "carrotkeebs-db.firebaseapp.com",
  projectId: "carrotkeebs-db",
  storageBucket: "carrotkeebs-db.appspot.com",
  messagingSenderId: "258107595041",
  appId: "1:258107595041:web:8c73c617867af7dfc04660"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make db variable accessible across entire app
export {
  db
}