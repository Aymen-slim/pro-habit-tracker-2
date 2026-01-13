// Firebase configuration for Google Analytics
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrnydZ3SjYlj_FR8WRnWLI16WMzTaiGQE",
  authDomain: "habit-tracker-3-b881e.firebaseapp.com",
  projectId: "habit-tracker-3-b881e",
  storageBucket: "habit-tracker-3-b881e.firebasestorage.app",
  messagingSenderId: "501088981878",
  appId: "1:501088981878:web:3f090c17f6401479f86057",
  measurementId: "G-CTQ1CQBVDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if supported - avoids errors in SSR/dev environments)
let analytics: ReturnType<typeof getAnalytics> | null = null;

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  }
});

export { app, analytics };
