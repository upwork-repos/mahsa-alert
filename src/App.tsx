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
import { NotificationPermission } from "./components/NotificationPermission";
import { OfflineIndicator } from "./components/OfflineIndicator";
import ProximityAlert from "./components/ProximityAlert";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import ThemeToggle from "./components/ThemeToggle";
import { messaging, onMessage } from "./firebase";
import { BordersProvider } from "./map-entities/borders/borders.context";
import { LayersProvider } from "./map-entities/layers/layers.context";
import { UserLocationProvider } from "./map-entities/user-location/user-location.context";
import type { LocationProperties } from "./types";
import { ThemeProvider } from "./ui/theme-provider";
import { requestNotificationPermission } from "./utils/notifications";
import { registerFirebaseMessagingSW } from "./utils/serviceWorker";

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
					// TODO: Handle notification click - could navigate to specific area or show details
					console.log("Notification clicked:", payload);
				},
			};
			// check if the notification is already in the list
			if (notifications.some((n) => n.id === notification.id)) {
				return;
			}
			showNotification({
				title: notification.title,
				message: notification.body ?? "",
			});

			setNotifications((prev) => [...prev, notification]);
		});
	}, []);

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) => {
			const newNotifications = prev.filter(
				(notification) => notification.id !== id,
			);
			return newNotifications;
		});
	}, []);

	const handleNotificationPermissionGranted = useCallback(async () => {
		try {
			console.log("=== Starting notification setup ===");

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
				<Header>
					<ThemeToggle className="ml-auto" />
				</Header>

				<UserLocationProvider>
					<LayersProvider>
						<BordersProvider>
							<div className="h-full w-full">
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
							<PWAInstallPrompt />

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
