// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQDf1evRwI2mQ6RWN-ZrIXXTKxcmj6-_k",
  authDomain: "trello-auth-f3665.firebaseapp.com",
  databaseURL: "https://trello-auth-f3665-default-rtdb.firebaseio.com",
  projectId: "trello-auth-f3665",
  storageBucket: "trello-auth-f3665.appspot.com",
  messagingSenderId: "405311453302",
  appId: "1:405311453302:web:78f3fd08603bfcfe258757"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);