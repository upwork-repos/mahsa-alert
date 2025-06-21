import { getToken, messaging } from "../firebase";
import { registerFirebaseMessagingSW } from "./serviceWorker";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

// Global notification function that can be called from anywhere
let globalShowNotification:
	| ((notification: {
			title: string;
			message: string;
			type?: "warning" | "info" | "error";
			onConfirm?: () => void;
			confirmText?: string;
			cancelText?: string;
	  }) => void)
	| null = null;

export const setGlobalNotificationHandler = (
	handler: typeof globalShowNotification,
) => {
	globalShowNotification = handler;
};

export const showGlobalNotification = (notification: {
	title: string;
	message: string;
	type?: "warning" | "info" | "error";
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
}) => {
	if (globalShowNotification) {
		globalShowNotification(notification);
	} else {
		// Fallback to browser alert if global handler is not set
		alert(`${notification.title}\n\n${notification.message}`);
	}
};

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

// Note: This function now requires the notification context to be available
// It should be called from within a component that has access to useNotification
export const showLocalNotification = (
	title: string,
	options?: NotificationOptions,
) => {
	if (Notification.permission === "granted") {
		// Instead of alert, we'll return the notification object
		// The calling component should use the global notification system
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
