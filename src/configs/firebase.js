// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIRBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIRBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);
// Get a reference to the database service
const firebaseDb = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
export {auth,firebaseDb,firebaseStorage} ;
