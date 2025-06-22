// Firebase Configuration Test Script
// Run this in the browser console to test Firebase setup

console.log("=== Firebase Configuration Test ===");

// Test 1: Check if Firebase is loaded
console.log("1. Firebase SDK Check:");
if (typeof firebase !== "undefined") {
	console.log("  ✓ Firebase SDK loaded");
	console.log("  Version:", firebase.SDK_VERSION);
} else {
	console.log("  ✗ Firebase SDK not loaded");
	console.log("  Make sure Firebase is properly imported");
}

// Test 2: Check Firebase App Configuration
console.log("2. Firebase App Configuration:");
try {
	const app = firebase.app();
	const options = app.options;
	console.log("  Project ID:", options.projectId);
	console.log("  Messaging Sender ID:", options.messagingSenderId);
	console.log("  App ID:", options.appId);
	console.log("  Auth Domain:", options.authDomain);

	// Check if configuration matches expected values
	const expectedConfig = {
		projectId: "alert-1af29",
		messagingSenderId: "729990985266",
		appId: "1:729990985266:web:0a1d98102caefd4c406e2b",
		authDomain: "alert-1af29.firebaseapp.com",
	};

	let configMatch = true;
	Object.keys(expectedConfig).forEach((key) => {
		if (options[key] !== expectedConfig[key]) {
			console.log(
				`  ⚠ ${key} mismatch: expected ${expectedConfig[key]}, got ${options[key]}`,
			);
			configMatch = false;
		}
	});

	if (configMatch) {
		console.log("  ✓ Configuration matches expected values");
	} else {
		console.log("  ✗ Configuration has mismatches");
	}
} catch (error) {
	console.error("  ✗ Error checking Firebase app:", error);
}

// Test 3: Check Firebase Messaging
console.log("3. Firebase Messaging Check:");
try {
	const messaging = firebase.messaging();
	console.log("  ✓ Firebase Messaging initialized");

	// Test VAPID key
	const vapidKey =
		"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk";

	messaging
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
} catch (error) {
	console.error("  ✗ Error initializing Firebase Messaging:", error);
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
if (Notification.permission === "granted") {
	try {
		const notification = new Notification("Firebase Test", {
			body: "This is a test notification from Firebase test script",
			icon: "/favicon.ico",
			tag: "firebase-test",
		});
		console.log("  ✓ Local notification created successfully");

		// Auto-close after 3 seconds
		setTimeout(() => {
			notification.close();
			console.log("  ✓ Test notification closed");
		}, 3000);
	} catch (error) {
		console.error("  ✗ Local notification failed:", error);
	}
} else {
	console.log("  ⚠ Cannot test local notifications - permission not granted");
}

console.log("=== Test Complete ===");
console.log("");
console.log("Next Steps:");
console.log("1. If all tests pass, the issue is likely no messages being sent");
console.log("2. Copy the Firebase token from above");
console.log("3. Go to Firebase Console > Cloud Messaging");
console.log("4. Send a test message to the token");
console.log("5. Check for any errors in the console");

// Helper function to send test message (for development only)
window.sendTestMessage = () => {
	if (window.testFirebaseToken) {
		console.log("To send a test message:");
		console.log(
			"1. Go to: https://console.firebase.google.com/project/alert-1af29/messaging",
		);
		console.log("2. Click 'Send your first message'");
		console.log("3. Fill in notification details");
		console.log("4. Select 'Single device'");
		console.log("5. Paste this token:", window.testFirebaseToken);
		console.log("6. Send the message");
	} else {
		console.log("No Firebase token available. Run the test again.");
	}
};
