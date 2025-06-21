import { getToken, messaging } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

export const requestNotificationPermission = async () => {
	try {
		const permission = await Notification.requestPermission();

		if (permission !== "granted") {
			console.warn("Notification permission not granted");
			return null;
		}

		const token = await getToken(messaging, { vapidKey: VAPID_KEY });
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
