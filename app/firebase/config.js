// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_apiKey,
  authDomain: process.env.NEXT_authDomain,
  projectId: process.env.NEXT_projectId,
  storageBucket: process.env.NEXT_storageBucket,
  messagingSenderId: process.env.NEXT_messagingSenderId,
  appId: process.env.NEXT_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize auth
const auth = getAuth(app);

export { app, auth };