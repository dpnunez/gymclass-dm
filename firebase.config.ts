// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8lpGYPBUcsmBwwU45qTDWdna1VuNBOpk",
  authDomain: "gym-class-dm-35.firebaseapp.com",
  projectId: "gym-class-dm-35",
  storageBucket: "gym-class-dm-35.firebasestorage.app",
  messagingSenderId: "479020907084",
  appId: "1:479020907084:web:1e32bde34a2e0f973f52e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app as firebaseApp };
