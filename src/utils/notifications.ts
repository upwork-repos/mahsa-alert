import { getToken, messaging } from "../firebase";
import { registerFirebaseMessagingSW } from "./serviceWorker";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

export const requestNotificationPermission = async () => {
	try {
		// First, register the Firebase messaging service worker
		const swRegistration = await registerFirebaseMessagingSW();
		if (!swRegistration) {
			console.error("Failed to register Firebase messaging service worker");
			return null;
		}

		const permission = await Notification.requestPermission();

		if (permission !== "granted") {
			console.warn("Notification permission not granted");
			return null;
		}

		const token = await getToken(messaging, { vapidKey: VAPID_KEY });
		console.log("Firebase messaging token obtained:", token);
		return token;
	} catch (error) {
		console.error("Error requesting notification permission:", error);
		return null;
	}
};

export const showLocalNotification = (
	title: string,
	options?: NotificationOptions,
) => {
	if (Notification.permission === "granted") {
		alert(options?.body);
		return new Notification(title, {
			icon: "/assets/img/icon-192x192.png",
			badge: "/assets/img/icon-192x192.png",
			...options,
		});
	}
	return null;
};

export const isNotificationSupported = () => {
	return "Notification" in window && "serviceWorker" in navigator;
};

export const isNotificationPermissionGranted = () => {
	return Notification.permission === "granted";
};
