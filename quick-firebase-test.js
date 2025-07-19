// Quick Firebase Test
// Run this in the browser console

console.log("=== Quick Firebase Test ===");

// Check what's available
console.log("Available Firebase objects:");
console.log("- firebaseApp:", !!window.firebaseApp);
console.log("- firebaseMessaging:", !!window.firebaseMessaging);
console.log("- firebaseGetToken:", !!window.firebaseGetToken);
console.log("- firebaseOnMessage:", !!window.firebaseOnMessage);

// Test token generation if available
if (window.firebaseGetToken && window.firebaseMessaging) {
	console.log("\nTesting token generation...");

	const vapidKey =
		"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";

	window
		.firebaseGetToken(window.firebaseMessaging, { vapidKey })
		.then((token) => {
			if (token) {
				console.log("✓ SUCCESS: Token generated!");
				console.log("Token length:", token.length);
				console.log(`Token preview: ${token.substring(0, 20)}...`);
				window.testToken = token;

				console.log("\n🎉 Firebase is working! Next steps:");
				console.log("1. Copy this token");
				console.log(
					"2. Go to: https://console.firebase.google.com/project/alert-1af29/messaging",
				);
				console.log("3. Send a test message to this token");
			} else {
				console.log("✗ No token received");
			}
		})
		.catch((error) => {
			console.error("✗ Token generation failed:", error);
			console.log("\n🔧 Troubleshooting:");
			console.log("1. Check Firebase Console project settings");
			console.log("2. Verify VAPID key is correct");
			console.log("3. Ensure Cloud Messaging is enabled");
		});
} else {
	console.log("\n❌ Firebase objects not available");
	console.log("Try refreshing the page and running this test again");
}

// Check service worker
navigator.serviceWorker.getRegistrations().then((registrations) => {
	const firebaseSW = registrations.find((reg) =>
		reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
	);

	if (firebaseSW) {
		console.log("✓ Firebase service worker registered");
	} else {
		console.log("✗ Firebase service worker not found");
	}
});

console.log("Notification permission:", Notification.permission);
