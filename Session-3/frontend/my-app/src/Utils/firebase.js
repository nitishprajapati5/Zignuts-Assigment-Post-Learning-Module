// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_amsb3Zf3UhN5oPBfoq75X-6JiFtS734",
  authDomain: "task-manager-3ee1b.firebaseapp.com",
  projectId: "task-manager-3ee1b",
  storageBucket: "task-manager-3ee1b.firebasestorage.app",
  messagingSenderId: "919358569382",
  appId: "1:919358569382:web:3f8ca60061e6170a0fad67",
  measurementId: "G-R375T8794J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)

