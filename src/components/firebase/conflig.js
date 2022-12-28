import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyCQJwlTeyJn3fSXTTBj9u8XmyVm_aqnmqk",
//     authDomain: "library-online-eebb9.firebaseapp.com",
//     projectId: "library-online-eebb9",
//     storageBucket: "library-online-eebb9.appspot.com",
//     messagingSenderId: "702387283753",
//     appId: "1:702387283753:web:f2d9e832315379fddef938",
//     measurementId: "G-7J7R6B4YCY",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDZSYjeNloI7TSJRanZdwj67sEzYMLRvSA",
  authDomain: "library-online-b8ea4.firebaseapp.com",
  projectId: "library-online-b8ea4",
  storageBucket: "library-online-b8ea4.appspot.com",
  messagingSenderId: "595643552782",
  appId: "1:595643552782:web:acc297c28acdd62bce585f",
  measurementId: "G-9F5CHKYPFJ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, app, storage };
export default firebase;
