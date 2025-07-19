// Firebase Configuration Test Script for Modular SDK (v9+)
// Run this in the browser console to test Firebase setup

console.log("=== Firebase Configuration Test (Modular SDK) ===");

// Test 1: Check if Firebase modules are available
console.log("1. Firebase SDK Check:");
if (typeof window !== "undefined" && window.firebase) {
	console.log("  ✓ Firebase SDK loaded (global)");
	console.log("  Version:", window.firebase.SDK_VERSION);
} else {
	console.log(
		"  ⚠ Firebase SDK not available globally (expected for modular SDK)",
	);
	console.log("  This is normal for Firebase v9+ modular SDK");
}

// Test 2: Check if Firebase app is initialized
console.log("2. Firebase App Check:");
try {
	// Try to access the Firebase app through the window object
	// The app should be available if it's been initialized
	if (window.firebaseApp) {
		console.log("  ✓ Firebase app found in window object");
		const options = window.firebaseApp.options;
		console.log("  Project ID:", options.projectId);
		console.log("  Messaging Sender ID:", options.messagingSenderId);
		console.log("  App ID:", options.appId);
		console.log("  Auth Domain:", options.authDomain);
	} else {
		console.log("  ⚠ Firebase app not found in window object");
		console.log("  This might be normal if the app hasn't been accessed yet");
	}
} catch (error) {
	console.error("  ✗ Error checking Firebase app:", error);
}

// Test 3: Check if messaging is available
console.log("3. Firebase Messaging Check:");
try {
	if (window.firebaseMessaging) {
		console.log("  ✓ Firebase Messaging found in window object");

		// Test VAPID key
		const vapidKey =
			"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";

		// Use the getToken function from the messaging object
		window.firebaseMessaging
			.getToken({ vapidKey })
			.then((token) => {
				if (token) {
					console.log("  ✓ VAPID key is valid");
					console.log("  Token length:", token.length);
					console.log(`  Token preview: ${token.substring(0, 20)}...`);

					// Save token for testing
					window.testFirebaseToken = token;
					console.log("  Token saved as window.testFirebaseToken");
				} else {
					console.log("  ✗ No token received");
				}
			})
			.catch((error) => {
				console.error("  ✗ VAPID key error:", error);
				console.log("  This usually means:");
				console.log("  - VAPID key is invalid");
				console.log("  - Firebase project not configured for web");
				console.log("  - Cloud Messaging not enabled");
			});
	} else {
		console.log("  ⚠ Firebase Messaging not found in window object");
		console.log("  Try accessing the app first to initialize Firebase");
	}
} catch (error) {
	console.error("  ✗ Error checking Firebase Messaging:", error);
}

// Test 4: Check Service Worker
console.log("4. Service Worker Check:");
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		console.log("  Total registrations:", registrations.length);

		const firebaseSW = registrations.find((reg) =>
			reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
		);

		if (firebaseSW) {
			console.log("  ✓ Firebase service worker found");
			console.log("  State:", firebaseSW.active?.state);
			console.log("  Script:", firebaseSW.active?.scriptURL);

			// Check if service worker is controlling the page
			if (navigator.serviceWorker.controller) {
				console.log("  ✓ Service worker is controlling the page");
			} else {
				console.log("  ⚠ Service worker is not controlling the page");
			}
		} else {
			console.log("  ✗ Firebase service worker not found");
			console.log("  Available service workers:");
			registrations.forEach((reg, index) => {
				console.log(`    ${index + 1}. ${reg.active?.scriptURL}`);
			});
		}
	});
} else {
	console.log("  ✗ Service Worker not supported");
}

// Test 5: Check Notification Permission
console.log("5. Notification Permission Check:");
console.log("  Permission:", Notification.permission);
console.log("  API Supported:", "Notification" in window);

if (Notification.permission === "granted") {
	console.log("  ✓ Notifications are allowed");
} else if (Notification.permission === "denied") {
	console.log("  ✗ Notifications are blocked");
	console.log("  User needs to enable notifications in browser settings");
} else {
	console.log("  ⚠ Permission not yet requested");
}

// Test 6: Test Local Notification
console.log("6. Local Notification Test:");
if (Notification.permission === "granted" && "serviceWorker" in navigator) {
	try {
		navigator.serviceWorker.ready.then((registration) => {
			registration.showNotification("Firebase Test", {
				body: "This is a test notification from Firebase test script",
				icon: "/favicon.ico",
				badge: "/favicon.ico",
				tag: "firebase-test",
			});
			console.log("  ✓ Local notification created successfully");

			// Auto-close after 3 seconds
			setTimeout(() => {
				registration.getNotifications().then((notifications) => {
					notifications.forEach((n) => {
						if (n.tag === "firebase-test") {
							n.close();
						}
					});
				});
				console.log("  ✓ Test notification closed");
			}, 3000);
		});
	} catch (error) {
		console.error("  ✗ Local notification failed:", error);
	}
} else {
	console.log(
		"  ⚠ Cannot test local notifications - permission not granted or service worker not available",
	);
}

console.log("=== Test Complete ===");
console.log("");
console.log("Next Steps:");
console.log(
	"1. If Firebase objects are not found, try interacting with the app first",
);
console.log("2. Check if the app has loaded Firebase properly");
console.log("3. Look for any console errors during app initialization");
console.log("4. If token is generated, copy it and test in Firebase Console");

// Helper function to manually test Firebase
window.testFirebaseManually = () => {
	console.log("Manual Firebase Test:");
	console.log("1. Try clicking the notification test button in the app");
	console.log("2. Check if Firebase gets initialized");
	console.log("3. Look for any errors in the console");
	console.log("4. If successful, the Firebase objects should be available");
};
