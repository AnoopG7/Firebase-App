// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1hi40suOkUIrmtKpCJnEnAtMsqOvUOEY",
  authDomain: "class-6a3ae.firebaseapp.com",
  databaseURL: "https://class-6a3ae-default-rtdb.firebaseio.com",
  projectId: "class-6a3ae",
  storageBucket: "class-6a3ae.appspot.com", // FIXED
  messagingSenderId: "993948361196",
  appId: "1:993948361196:web:10573bcc739276eb2ea0c9",
  measurementId: "G-V2YRBG9HSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Expose to other modules
export const auth = getAuth(app);
export const db   = getFirestore(app);
export { serverTimestamp };
