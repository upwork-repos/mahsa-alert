import { doc, setDoc } from "firebase/firestore";
import { onMessage } from "firebase/messaging";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase";
import EvacSlider from "./components/EvacSlider";
import Header from "./components/Header";
import LayerFilter from "./components/LayerFilter";
import Layout from "./components/Layout";
import LocateButton from "./components/LocateButton";
import LocationTooltip from "./components/LocationTooltip";
import MapComponent from "./components/MapComponent";
import { NotificationManager } from "./components/NotificationManager";
import { NotificationPermission } from "./components/NotificationPermission";
import { OfflineIndicator } from "./components/OfflineIndicator";
import ProximityAlert from "./components/ProximityAlert";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import ThemeToggle from "./components/ThemeToggle";
import { messaging } from "./firebase";
import { BordersProvider } from "./map-entities/borders/borders.context";
import { LayersProvider } from "./map-entities/layers/layers.context";
import { UserLocationProvider } from "./map-entities/user-location/user-location.context";
import type { LocationProperties } from "./types";
import { ThemeProvider } from "./ui/theme-provider";
import { requestNotificationPermission } from "./utils/notifications";

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

	useEffect(() => {
		requestNotificationPermission().then(async (token) => {
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
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id),
		);
	}, []);

	const handleNotificationPermissionGranted = useCallback(async () => {
		try {
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
			}
		} catch (error) {
			console.error(
				"Error setting up notifications after permission granted:",
				error,
			);
		}
	}, []);

	const testNotification = useCallback(() => {
		// check if notification is supported
		if (!("Notification" in window)) {
			console.log("Notification API not supported");
			return;
		}
		// check if permission is granted
		if (Notification.permission === "granted") {
			new Notification("New Strike Detected", {
				body: "This is a test notification to demonstrate the push notification system.",
				icon: "/favicon.ico",
			});
		} else {
			Notification.requestPermission().then((permission) => {
				console.log("permission", permission);
				if (permission === "granted") {
					new Notification("New Strike Detected", {
						body: "This is a test notification to demonstrate the push notification system.",
						icon: "/favicon.ico",
					});
				}
			});
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
				<Header onTestNotification={testNotification}>
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
						</BordersProvider>
					</LayersProvider>
				</UserLocationProvider>
			</Layout>
		</ThemeProvider>
	);
}

export default App;
