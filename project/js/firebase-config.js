
// js/firebase-config.js
// Modular Firebase v9+ imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1hi40suOkUIrmtKpCJnEnAtMsqOvUOEY",
  authDomain: "class-6a3ae.firebaseapp.com",
  databaseURL: "https://class-6a3ae-default-rtdb.firebaseio.com",
  projectId: "class-6a3ae",
  storageBucket: "class-6a3ae.firebasestorage.app",
  messagingSenderId: "993948361196",
  appId: "1:993948361196:web:10573bcc739276eb2ea0c9",
  measurementId: "G-V2YRBG9HSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.auth = auth; // Expose for use in other scripts
