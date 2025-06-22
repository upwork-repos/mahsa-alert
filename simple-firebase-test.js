// Simple Firebase Test for Modular SDK
// Run this AFTER the app has loaded and Firebase is initialized

console.log("=== Simple Firebase Test ===");

// Wait a moment for Firebase to initialize
setTimeout(() => {
	console.log("1. Checking Firebase objects...");

	if (window.firebaseApp) {
		console.log("✓ Firebase app found");
		console.log("Project ID:", window.firebaseApp.options.projectId);
	} else {
		console.log("✗ Firebase app not found");
	}

	if (window.firebaseMessaging) {
		console.log("✓ Firebase messaging found");
	} else {
		console.log("✗ Firebase messaging not found");
	}

	if (window.firebaseGetToken) {
		console.log("✓ Firebase getToken function found");

		// Test token generation
		const vapidKey =
			"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";

		window
			.firebaseGetToken(window.firebaseMessaging, { vapidKey })
			.then((token) => {
				if (token) {
					console.log("✓ Token generated successfully");
					console.log("Token length:", token.length);
					console.log(`Token preview: ${token.substring(0, 20)}...`);
					window.testToken = token;
				} else {
					console.log("✗ No token received");
				}
			})
			.catch((error) => {
				console.error("✗ Token generation failed:", error);
			});
	} else {
		console.log("✗ Firebase getToken function not found");
	}

	console.log("2. Checking service worker...");
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		const firebaseSW = registrations.find((reg) =>
			reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
		);

		if (firebaseSW) {
			console.log("✓ Firebase service worker found");
		} else {
			console.log("✗ Firebase service worker not found");
		}
	});

	console.log("3. Notification permission:", Notification.permission);
}, 1000);

// Helper function to test token generation
window.testTokenGeneration = () => {
	if (window.firebaseGetToken && window.firebaseMessaging) {
		const vapidKey =
			"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";
		window
			.firebaseGetToken(window.firebaseMessaging, { vapidKey })
			.then((token) => {
				console.log("Token:", token);
				window.testToken = token;
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	} else {
		console.log("Firebase functions not available");
		console.log("firebaseGetToken:", !!window.firebaseGetToken);
		console.log("firebaseMessaging:", !!window.firebaseMessaging);
	}
};
