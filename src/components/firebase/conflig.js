import firebase from "firebase/compat/app"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD2J6bcsACLQTgcvZMBh4CVXXsLSNNLA9Q",
  authDomain: "library-online-48512.firebaseapp.com",
  projectId: "library-online-48512",
  storageBucket: "library-online-48512.appspot.com",
  messagingSenderId: "940946887226",
  appId: "1:940946887226:web:dd00f80c891a2b1c9b1b03",
  measurementId: "G-ZRT9EG9TJT"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db, app};
export default firebase;
