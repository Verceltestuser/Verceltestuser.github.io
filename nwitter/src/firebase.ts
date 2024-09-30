// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3NwrQ8muDM_g70jMA6ZW7wh9cTMGbGe4",
  authDomain: "nwtter-now.firebaseapp.com",
  projectId: "nwtter-now",
  storageBucket: "nwtter-now.appspot.com",
  messagingSenderId: "750143711945",
  appId: "1:750143711945:web:54c2bfd008a0edc39e7b18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);




export const storage = getStorage(app)

export const db = getFirestore(app)