import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isNotificationSupported } from "../utils/notifications";

interface NotificationPermissionProps {
	onPermissionGranted?: () => void;
}

export function NotificationPermission({
	onPermissionGranted,
}: NotificationPermissionProps) {
	const [showPrompt, setShowPrompt] = useState(false);
	const [isSupported, setIsSupported] = useState(false);

	useEffect(() => {
		const supported = isNotificationSupported();
		setIsSupported(supported);

		if (supported) {
			const permission = Notification.permission;
			if (permission === "default") {
				// Show prompt after a delay
				const timer = setTimeout(() => {
					setShowPrompt(true);
				}, 3000);

				return () => clearTimeout(timer);
			}
			if (permission === "granted" && onPermissionGranted) {
				onPermissionGranted();
			}
		}
	}, [onPermissionGranted]);

	const handleEnableNotifications = async () => {
		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				setShowPrompt(false);
				if (onPermissionGranted) {
					onPermissionGranted();
				}
			}
		} catch (error) {
			console.error("Error requesting notification permission:", error);
		}
	};

	const handleDismiss = () => {
		setShowPrompt(false);
	};

	if (!isSupported || !showPrompt) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
			<div className="flex items-start space-x-3">
				<div className="flex-shrink-0">
					<Bell className="h-6 w-6 text-blue-500" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
						Enable Push Notifications
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
						Stay informed about important alerts and updates in your area.
					</p>
					<div className="flex space-x-2">
						<button
							type="button"
							onClick={handleEnableNotifications}
							className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Enable
						</button>
						<button
							type="button"
							onClick={handleDismiss}
							className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						>
							Later
						</button>
					</div>
				</div>
				<button
					type="button"
					onClick={handleDismiss}
					className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	);
}
