// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2AidEJkOcqODVGM_mmDpmh4JmYOMcmjc",
  authDomain: "messenger-39f3c.firebaseapp.com",
  projectId: "messenger-39f3c",
  storageBucket: "messenger-39f3c.appspot.com",
  messagingSenderId: "709502296761",
  appId: "1:709502296761:web:835951a154dbb58598f168",
  measurementId: "G-W32VJRLGDZ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

export default firebaseApp ;
