import { doc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase";
import EvacSlider from "./components/EvacSlider";
import { GlobalNotificationManager } from "./components/GlobalNotificationManager";
import Header from "./components/Header";
import LayerFilter from "./components/LayerFilter";
import Layout from "./components/Layout";
import LocateButton from "./components/LocateButton";
import LocationTooltip from "./components/LocationTooltip";
import MapComponent from "./components/MapComponent";
import { useNotification } from "./components/NotificationContext";
import { NotificationManager } from "./components/NotificationManager";
import { NotificationPermission } from "./components/NotificationPermission";
import { OfflineIndicator } from "./components/OfflineIndicator";
import ProximityAlert from "./components/ProximityAlert";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import ThemeToggle from "./components/ThemeToggle";
import { getToken, messaging, onMessage } from "./firebase";
import { BordersProvider } from "./map-entities/borders/borders.context";
import { LayersProvider } from "./map-entities/layers/layers.context";
import { UserLocationProvider } from "./map-entities/user-location/user-location.context";
import type { LocationProperties } from "./types";
import { ThemeProvider } from "./ui/theme-provider";
import {
	debugNotificationSetup,
	requestNotificationPermission,
} from "./utils/notifications";
import {
	debugServiceWorkerStatus,
	registerFirebaseMessagingSW,
} from "./utils/serviceWorker";

interface TooltipState {
	location: LocationProperties;
	x: number;
	y: number;
}

interface Notification {
	id: string;
	title: string;
	body?: string;
	onClick?: () => void;
}

type ZoomToBounds = [[number, number], [number, number]];

function App() {
	const [tooltipState, setTooltipState] = useState<TooltipState | null>(null);
	const [zoomToBounds, setZoomToBounds] = useState<ZoomToBounds | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { showNotification } = useNotification();

	useEffect(() => {
		// Register Firebase messaging service worker first
		registerFirebaseMessagingSW().then(async (swRegistration) => {
			if (!swRegistration) {
				console.error("Failed to register Firebase messaging service worker");
				return;
			}

			// Then request notification permission and get token
			const token = await requestNotificationPermission();
			if (!token) return;

			console.log("Notification token:", token);
			await setDoc(doc(db, "tokens", token), {
				token,
				createdAt: new Date(),
				browser: {
					userAgent: navigator.userAgent,
					platform: navigator.platform,
					language: navigator.language,
					vendor: navigator.vendor,
				},
			});
		});

		onMessage(messaging, (payload) => {
			console.log("Message received in foreground:", payload);

			const notification: Notification = {
				id: Date.now().toString(),
				title: payload.notification?.title || "New Alert",
				body: payload.notification?.body,
				onClick: () => {
					// Handle notification click - could navigate to specific area or show details
					console.log("Notification clicked:", payload);
				},
			};

			setNotifications((prev) => [...prev, notification]);
		});
	}, []);

	const removeNotification = useCallback((id: string) => {
		console.log("Removing notification:", id);
		setNotifications((prev) => {
			const newNotifications = prev.filter(
				(notification) => notification.id !== id,
			);
			console.log("Notifications after removal:", newNotifications.length);
			return newNotifications;
		});
	}, []);

	// Add logging when notifications state changes
	useEffect(() => {
		console.log(
			"Notifications state updated:",
			notifications.length,
			notifications,
		);
	}, [notifications]);

	// Simple test function to add a notification directly
	const addTestNotification = useCallback(() => {
		console.log("Adding test notification directly");
		const testNotification: Notification = {
			id: `test-${Date.now()}`,
			title: "Direct Test Notification",
			body: "This notification was added directly to test the NotificationManager",
			onClick: () => {
				console.log("Direct test notification clicked!");
			},
		};
		setNotifications((prev) => [...prev, testNotification]);
	}, []);

	const handleNotificationPermissionGranted = useCallback(async () => {
		try {
			console.log("=== Starting notification setup ===");

			// Debug current state
			await debugServiceWorkerStatus();
			await debugNotificationSetup();

			// Register Firebase messaging service worker first
			const swRegistration = await registerFirebaseMessagingSW();
			if (!swRegistration) {
				console.error("Failed to register Firebase messaging service worker");
				return;
			}

			const token = await requestNotificationPermission();
			if (token) {
				console.log("Notification permission granted, token:", token);
				await setDoc(doc(db, "tokens", token), {
					token,
					createdAt: new Date(),
					browser: {
						userAgent: navigator.userAgent,
						platform: navigator.platform,
						language: navigator.language,
						vendor: navigator.vendor,
					},
				});
				console.log("Token saved to Firestore successfully");
			} else {
				console.error("Failed to get notification token");
			}
		} catch (error) {
			console.error(
				"Error setting up notifications after permission granted:",
				error,
			);
		}
	}, []);

	const testNotification = useCallback(() => {
		console.log("=== Testing notification ===");

		// Add a test notification to the local state for NotificationManager
		const testNotificationItem: Notification = {
			id: Date.now().toString(),
			title: "Test Notification",
			body: "This is a test notification from the NotificationManager",
			onClick: () => {
				console.log("Test notification clicked!");
			},
		};
		setNotifications((prev) => [...prev, testNotificationItem]);

		// check if notification is supported
		if (!("Notification" in window)) {
			console.log("Notification API not supported");
			return;
		}

		// check if permission is granted
		console.log("Notification.permission", Notification.permission);
		if (Notification.permission === "granted") {
			console.log("Permission granted");

			// Test Firebase messaging token
			getToken(messaging, {
				vapidKey:
					"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk",
			})
				.then((token) => {
					console.log("Current Firebase token:", token);

					// Test if we can send a test message to ourselves
					if (token) {
						console.log("Token is valid, notification system should work");
						console.log(
							"To test push notifications, you need to send a message from Firebase Console",
						);
						console.log(
							"or use the Firebase Admin SDK to send a test message to this token",
						);
					}
				})
				.catch((error) => {
					console.error("Error getting Firebase token:", error);
				});

			// Show custom alert dialog
			showNotification({
				title: "New Strike Detected",
				message:
					"This is a test notification to demonstrate the push notification system. A new strike has been detected in your area.",
				type: "warning",
			});

			// Also show the native browser notification
			new Notification("New Strike Detected", {
				body: "This is a test notification to demonstrate the push notification system.",
				icon: "/favicon.ico",
			});
		} else {
			console.log("Permission not granted");
			Notification.requestPermission().then((permission) => {
				console.log("re permission", permission);
				if (permission === "granted") {
					// Show custom alert dialog
					showNotification({
						title: "New Strike Detected",
						message:
							"This is a test notification to demonstrate the push notification system. A new strike has been detected in your area.",
						type: "warning",
					});

					// Also show the native browser notification
					new Notification("New Strike Detected", {
						body: "This is a test notification to demonstrate the push notification system.",
						icon: "/favicon.ico",
					});
				}
			});
		}
	}, [showNotification]);

	// Comprehensive test function
	const comprehensiveTest = useCallback(async () => {
		console.log("=== COMPREHENSIVE NOTIFICATION TEST ===");

		// 1. Check browser support
		console.log("1. Browser Support Check:");
		console.log("  - Service Worker supported:", "serviceWorker" in navigator);
		console.log("  - Notification API supported:", "Notification" in window);
		console.log("  - PushManager supported:", "PushManager" in window);

		// 2. Check current permissions
		console.log("2. Permission Check:");
		console.log("  - Current permission:", Notification.permission);

		// 3. Check service worker registration
		console.log("3. Service Worker Check:");
		if ("serviceWorker" in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations();
			console.log("  - Total registrations:", registrations.length);

			const firebaseSW = registrations.find((reg) =>
				reg.active?.scriptURL.includes("firebase-messaging-sw.js"),
			);
			console.log("  - Firebase SW found:", !!firebaseSW);
			if (firebaseSW) {
				console.log("  - Firebase SW state:", firebaseSW.active?.state);
				console.log("  - Firebase SW script:", firebaseSW.active?.scriptURL);
			}
		}

		// 4. Test Firebase token
		console.log("4. Firebase Token Check:");
		try {
			const token = await getToken(messaging, {
				vapidKey:
					"BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk",
			});
			console.log("  - Token obtained:", !!token);
			if (token) {
				console.log("  - Token length:", token.length);
				console.log(`  - Token preview: ${token.substring(0, 20)}...`);
			}
		} catch (error) {
			console.error("  - Token error:", error);
		}

		// 5. Test local notification
		console.log("5. Local Notification Test:");
		if (Notification.permission === "granted") {
			try {
				const notification = new Notification("Test Notification", {
					body: "This is a test of local notifications",
					icon: "/favicon.ico",
				});
				console.log("  - Local notification created successfully");

				// Auto-close after 3 seconds
				setTimeout(() => {
					notification.close();
				}, 3000);
			} catch (error) {
				console.error("  - Local notification error:", error);
			}
		}

		console.log("=== END COMPREHENSIVE TEST ===");
		console.log("");
		console.log("If all tests pass, the issue might be:");
		console.log("1. No messages are being sent from Firebase Console");
		console.log("2. Firebase project configuration issue");
		console.log("3. Network connectivity issues");
		console.log("4. Browser blocking push notifications");
	}, []);

	const handleLocationHover = useCallback(
		(location: LocationProperties | null, mouseEvent?: MouseEvent) => {
			if (location && mouseEvent) {
				setTooltipState({
					location,
					x: mouseEvent.clientX,
					y: mouseEvent.clientY,
				});
			} else {
				setTimeout(() => {
					const tooltipElement = document.querySelector(
						'[data-tooltip="true"]',
					);
					if (!tooltipElement || !tooltipElement.matches(":hover")) {
						setTooltipState(null);
					}
				}, 50);
			}
		},
		[],
	);

	const handleMouseMove = useCallback(
		(mouseEvent: MouseEvent) => {
			if (tooltipState) {
				setTooltipState((prev) =>
					prev
						? {
								...prev,
								x: mouseEvent.clientX,
								y: mouseEvent.clientY,
							}
						: null,
				);
			}
		},
		[tooltipState],
	);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Layout>
				<Header
					onTestNotification={testNotification}
					onComprehensiveTest={comprehensiveTest}
					onAddTestNotification={addTestNotification}
				>
					<ThemeToggle className="ml-auto" />
				</Header>

				<UserLocationProvider>
					<LayersProvider>
						<BordersProvider>
							<div className="h-full w-full">
								{/* <IranBorderMap
									onLocationHover={handleLocationHover}
									onMouseMove={handleMouseMove}
									zoomToBounds={zoomToBounds}
								/> */}
								<MapComponent
									onLocationHover={handleLocationHover}
									onMouseMove={handleMouseMove}
									zoomToBounds={zoomToBounds}
								/>
							</div>

							<LayerFilter className="fixed top-26 right-5 z-50 " />
							<LocateButton className="fixed top-42 right-5 z-20" />
							<ProximityAlert className="fixed inset-4 z-50" />
							<EvacSlider
								onZoomToArea={setZoomToBounds}
								className="fixed bottom-12 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40"
							/>
							<LocationTooltip
								tooltipState={tooltipState}
								onClose={() => setTooltipState(null)}
							/>

							{/* PWA Components */}
							<OfflineIndicator />
							<PWAUpdatePrompt />
							<PWAInstallPrompt />

							{/* Push Notifications */}
							<NotificationManager
								notifications={notifications}
								onRemoveNotification={removeNotification}
							/>

							{/* Notification Permission Prompt */}
							<NotificationPermission
								onPermissionGranted={handleNotificationPermissionGranted}
							/>

							{/* Global Notification Manager */}
							<GlobalNotificationManager />
						</BordersProvider>
					</LayersProvider>
				</UserLocationProvider>
			</Layout>
		</ThemeProvider>
	);
}

export default App;
