// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcbpqXfFOYbEsHt1vpGM-75SNe1N44KjE",
  authDomain: "mailbox-client-ae901.firebaseapp.com",
  projectId: "mailbox-client-ae901",
  storageBucket: "mailbox-client-ae901.firebasestorage.app",
  messagingSenderId: "339358547188",
  appId: "1:339358547188:web:fbc788e71ea42d272bb2a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
