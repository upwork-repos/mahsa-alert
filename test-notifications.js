// Test script for notification system
// Run this in the browser console to test notifications

console.log("=== Notification System Test Script ===");

// Test 1: Check browser support
console.log("1. Browser Support:");
console.log("  Service Worker:", "serviceWorker" in navigator);
console.log("  Notification API:", "Notification" in window);
console.log("  PushManager:", "PushManager" in window);

// Test 2: Check permissions
console.log("2. Permissions:");
console.log("  Current permission:", Notification.permission);

// Test 3: Test local notification
console.log("3. Local Notification Test:");
if (Notification.permission === "granted" && "serviceWorker" in navigator) {
	try {
		navigator.serviceWorker.ready.then((registration) => {
			registration.showNotification("Test Notification", {
				body: "This is a test notification from the console",
				icon: "/favicon.ico",
				badge: "/favicon.ico",
				tag: "console-test",
			});
			console.log("  ✓ Local notification created successfully");

			// Auto-close after 5 seconds
			setTimeout(() => {
				registration.getNotifications().then((notifications) => {
					notifications.forEach((n) => {
						if (n.tag === "console-test") {
							n.close();
						}
					});
				});
				console.log("  ✓ Notification auto-closed");
			}, 5000);
		});
	} catch (error) {
		console.error("  ✗ Local notification failed:", error);
	}
} else {
	console.log(
		"  ⚠ Permission not granted or service worker not available, cannot test local notifications",
	);
}

// Test 4: Check service workers
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
		} else {
			console.log("  ✗ Firebase service worker not found");
		}
	});
} else {
	console.log("  ✗ Service Worker not supported");
}

// Test 5: Test Firebase messaging (if available)
console.log("5. Firebase Messaging Test:");
if (typeof firebase !== "undefined" && firebase.messaging) {
	try {
		const messaging = firebase.messaging();
		messaging
			.getToken({
				vapidKey:
					"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk",
			})
			.then((token) => {
				if (token) {
					console.log("  ✓ Firebase token obtained");
					console.log("  Token length:", token.length);
					console.log(`  Token preview: ${token.substring(0, 20)}...`);
				} else {
					console.log("  ✗ No Firebase token received");
				}
			})
			.catch((error) => {
				console.error("  ✗ Firebase token error:", error);
			});
	} catch (error) {
		console.error("  ✗ Firebase messaging error:", error);
	}
} else {
	console.log("  ⚠ Firebase messaging not available in console context");
}

console.log("=== Test Complete ===");
console.log("");
console.log("Next steps:");
console.log("1. If local notifications work, the basic setup is correct");
console.log("2. If Firebase token is obtained, push notifications should work");
console.log(
	"3. To test push notifications, send a message from Firebase Console",
);
console.log(
	"4. Check the browser's developer tools > Application > Service Workers",
);
console.log(
	"5. Check the browser's developer tools > Application > Notifications",
);
