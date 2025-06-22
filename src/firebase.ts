// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
	getMessaging,
	getToken,
	type Messaging,
	onMessage,
} from "firebase/messaging";

// Using the same config as the service worker to ensure consistency
const firebaseConfig = {
	apiKey: "AIzaSyB0q6Y0WtN7rIR5Zoau-7qghjRKL6k3Sfg",
	authDomain: "alert-1af29.firebaseapp.com",
	projectId: "alert-1af29",
	storageBucket: "alert-1af29.firebasestorage.app",
	messagingSenderId: "729990985266",
	appId: "1:729990985266:web:0a1d98102caefd4c406e2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);
const db = getFirestore(app);

// Expose Firebase objects globally for debugging (development only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	(window as any).firebaseApp = app;
	(window as any).firebaseMessaging = messaging;
	(window as any).firebaseDB = db;
	(window as any).firebaseGetToken = getToken;
	(window as any).firebaseOnMessage = onMessage;
	console.log("Firebase objects exposed globally for debugging");
	console.log("Available functions: firebaseGetToken, firebaseOnMessage");
}

export { messaging, onMessage, getToken, db };
