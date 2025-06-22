import { getToken, messaging } from "../firebase";
import { registerFirebaseMessagingSW } from "./serviceWorker";

const VAPID_KEY =
	"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";

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
		console.log("Starting notification permission request...");

		// Check if service worker is supported
		if (!("serviceWorker" in navigator)) {
			console.error("Service Worker not supported in this browser");
			return null;
		}

		// First, register the Firebase messaging service worker
		console.log("Registering Firebase messaging service worker...");
		const swRegistration = await registerFirebaseMessagingSW();
		if (!swRegistration) {
			console.error("Failed to register Firebase messaging service worker");
			return null;
		}
		console.log("Service worker registered successfully:", swRegistration);

		// Check if messaging is supported
		if (!("Notification" in window)) {
			console.error("Notification API not supported in this browser");
			return null;
		}

		// Request notification permission
		console.log("Requesting notification permission...");
		const permission = await Notification.requestPermission();
		console.log("Notification permission result:", permission);

		if (permission !== "granted") {
			console.warn("Notification permission not granted:", permission);
			return null;
		}

		// Get Firebase messaging token
		console.log("Getting Firebase messaging token...");
		const token = await getToken(messaging, { vapidKey: VAPID_KEY });
		console.log("Firebase messaging token obtained:", token);

		if (!token) {
			console.error("Failed to get Firebase messaging token");
			return null;
		}

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

// Debug function to check notification setup
export const debugNotificationSetup = async () => {
	console.log("=== Notification Setup Debug ===");
	console.log("Service Worker supported:", "serviceWorker" in navigator);
	console.log("Notification API supported:", "Notification" in window);
	console.log("Current notification permission:", Notification.permission);

	if ("serviceWorker" in navigator) {
		const registrations = await navigator.serviceWorker.getRegistrations();
		console.log("Service worker registrations:", registrations);
	}

	try {
		const token = await getToken(messaging, { vapidKey: VAPID_KEY });
		console.log("Firebase token:", token);
	} catch (error) {
		console.error("Error getting Firebase token:", error);
	}

	console.log("=== End Debug ===");
};
