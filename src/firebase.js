// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpX55SEwgsPFm0oYlURTzvFaJhs5h-OEU",
    authDomain: "aaragraphy-61b54.firebaseapp.com",
    projectId: "aaragraphy-61b54",
    storageBucket: "aaragraphy-61b54.firebasestorage.app",
    messagingSenderId: "709141645686",
    appId: "1:709141645686:web:4d4a45cd6e561d26229257",
    measurementId: "G-8JHQ67FZ0D",
    databaseURL: "https://aaragraphy-61b54-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };