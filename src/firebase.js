import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDLVJ5bwl-4GezWHsQSLKKwxMyZVCdqmw0",
  authDomain: "bookshop-4cb62.firebaseapp.com",
  projectId: "bookshop-4cb62",
  storageBucket: "bookshop-4cb62.appspot.com",
  messagingSenderId: "795133676824",
  appId: "1:795133676824:web:a6a0ddc876aec76422626d",
  measurementId: "G-RWLVSQ54NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage, app };
