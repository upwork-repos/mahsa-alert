export const registerFirebaseMessagingSW = async () => {
	if (!("serviceWorker" in navigator)) {
		console.warn("Service Worker not supported");
		return null;
	}

	try {
		console.log("Attempting to register Firebase messaging service worker...");

		// Check if service worker is already registered
		const existingRegistrations =
			await navigator.serviceWorker.getRegistrations();
		const existingSW = existingRegistrations.find((reg) =>
			reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
		);

		if (existingSW) {
			console.log(
				"Firebase messaging service worker already registered:",
				existingSW,
			);
			return existingSW;
		}

		const registration = await navigator.serviceWorker.register(
			"/firebase-messaging-sw.js",
			{
				scope: "/",
			},
		);

		console.log(
			"Firebase messaging service worker registered successfully:",
			registration,
		);

		// Wait for the service worker to be ready
		await navigator.serviceWorker.ready;
		console.log("Service worker is ready");

		return registration;
	} catch (error) {
		console.error(
			"Failed to register Firebase messaging service worker:",
			error,
		);
		return null;
	}
};

export const isServiceWorkerSupported = () => {
	return "serviceWorker" in navigator;
};

// Debug function to check service worker status
export const debugServiceWorkerStatus = async () => {
	console.log("=== Service Worker Debug ===");
	console.log("Service Worker supported:", "serviceWorker" in navigator);

	if ("serviceWorker" in navigator) {
		const registrations = await navigator.serviceWorker.getRegistrations();
		console.log("All service worker registrations:", registrations);

		const firebaseSW = registrations.find((reg) =>
			reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
		);
		console.log("Firebase messaging service worker:", firebaseSW);

		if (firebaseSW) {
			console.log("Service worker state:", firebaseSW.active?.state);
			console.log("Service worker script URL:", firebaseSW.active?.scriptURL);
		}
	}

	console.log("=== End Service Worker Debug ===");
};
