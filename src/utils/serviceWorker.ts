export const registerFirebaseMessagingSW = async () => {
	if (!("serviceWorker" in navigator)) {
		console.warn("Service Worker not supported");
		return null;
	}

	try {
		const registration = await navigator.serviceWorker.register(
			"/firebase-messaging-sw.js",
			{
				scope: "/",
			},
		);

		console.log("Firebase messaging service worker registered:", registration);
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
