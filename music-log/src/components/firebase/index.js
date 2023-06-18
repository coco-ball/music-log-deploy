import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqg3MweI0LFD4Oomq-oCV8dPf5cNN2JS0",
  authDomain: "musiclog-8ac3e.firebaseapp.com",
  projectId: "musiclog-8ac3e",
  storageBucket: "musiclog-8ac3e.appspot.com",
  messagingSenderId: "532635667537",
  appId: "1:532635667537:web:3b868b67b22bfb93253c70",
  measurementId: "G-VD0VCTVLZG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db }; //auth 맞나