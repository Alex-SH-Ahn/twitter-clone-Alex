import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMcjd-NZ8hWiSdPVOaJCuhNus28Bkcbek",
  authDomain: "twitter-clone-alex-72752.firebaseapp.com",
  projectId: "twitter-clone-alex-72752",
  storageBucket: "twitter-clone-alex-72752.appspot.com",
  messagingSenderId: "1002455872811",
  appId: "1:1002455872811:web:dd334b3608153860fb816e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
