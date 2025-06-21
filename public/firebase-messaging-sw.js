importScripts(
	"https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	authDomain: "mahsa-alert.firebaseapp.com",
	projectId: "mahsa-alert",
	storageBucket: "mahsa-alert.appspot.com",
	messagingSenderId: "123456789012",
	appId: "1:123456789012:web:abcdefghijklmnop",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
	console.log("Received background message:", payload);

	const notificationTitle = payload.notification?.title || "New Alert";
	const notificationOptions = {
		body: payload.notification?.body || "You have a new notification",
		icon: "/assets/img/icon-192x192.png",
		badge: "/assets/img/icon-192x192.png",
		tag: "mahsa-alert-notification",
		requireInteraction: true,
		actions: [
			{
				action: "view",
				title: "View Details",
				icon: "/assets/img/icon-192x192.png",
			},
			{
				action: "dismiss",
				title: "Dismiss",
				icon: "/assets/img/icon-192x192.png",
			},
		],
		data: payload.data || {},
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions,
	);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
	console.log("Notification clicked:", event);

	event.notification.close();

	if (event.action === "view") {
		// Open the app and focus on it
		event.waitUntil(
			clients
				.matchAll({ type: "window", includeUncontrolled: true })
				.then((clientList) => {
					// Check if there's already a window/tab open with the target URL
					for (const client of clientList) {
						if (
							client.url.includes(self.location.origin) &&
							"focus" in client
						) {
							return client.focus();
						}
					}
					// If no window/tab is open, open a new one
					if (clients.openWindow) {
						return clients.openWindow("/");
					}
				}),
		);
	} else if (event.action === "dismiss") {
		// Just close the notification
		event.notification.close();
	} else {
		// Default action - open the app
		event.waitUntil(
			clients
				.matchAll({ type: "window", includeUncontrolled: true })
				.then((clientList) => {
					for (const client of clientList) {
						if (
							client.url.includes(self.location.origin) &&
							"focus" in client
						) {
							return client.focus();
						}
					}
					if (clients.openWindow) {
						return clients.openWindow("/");
					}
				}),
		);
	}
});

// Handle push events (fallback for older browsers)
self.addEventListener("push", (event) => {
	console.log("Push event received:", event);

	if (event.data) {
		const data = event.data.json();
		const notificationTitle = data.notification?.title || "New Alert";
		const notificationOptions = {
			body: data.notification?.body || "You have a new notification",
			icon: "/assets/img/icon-192x192.png",
			badge: "/assets/img/icon-192x192.png",
			tag: "mahsa-alert-notification",
			requireInteraction: true,
			data: data.data || {},
		};

		event.waitUntil(
			self.registration.showNotification(
				notificationTitle,
				notificationOptions,
			),
		);
	}
});
