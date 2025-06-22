import { Bell, Bug, TestTube } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { debugNotificationSetup } from "../utils/notifications";
import { debugServiceWorkerStatus } from "../utils/serviceWorker";

interface HeaderProps {
	children: ReactNode;
	onTestNotification?: () => void;
	onComprehensiveTest?: () => void;
	onAddTestNotification?: () => void;
}

const Header: React.FC<HeaderProps> = ({
	children,
	onTestNotification,
	onComprehensiveTest,
	onAddTestNotification,
}) => {
	const handleDebug = async () => {
		console.log("=== Manual Debug Triggered ===");
		await debugServiceWorkerStatus();
		await debugNotificationSetup();
		console.log("=== Manual Debug Complete ===");
	};

	return (
		<div className="fixed top-4 md:top-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm md:max-w-lg">
			<div className="flex items-center w-full bg-black/80 backdrop-blur-md rounded-xl md:rounded-2xl px-4 py-3 md:px-3 md:py-4 text-white border border-gray-600 hover:bg-black/90 transition-colors">
				<img
					src="/assets/img/logo.jpeg"
					alt="logo"
					className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl"
				/>
				<h1 className="text-xl md:text-3xl font-bold text-white items-center mt-1 flex ml-2 md:ml-3">
					Mahsa Alert
					<span className="text-xs md:text-sm ml-1 md:ml-2">(beta)</span>
				</h1>

				{children}

				<div className="flex ml-2 space-x-1">
					{onTestNotification && (
						<button
							type="button"
							onClick={onTestNotification}
							className="p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/80 rounded-lg"
							title="Test Notification"
						>
							<Bell size={20} />
						</button>
					)}

					{onComprehensiveTest && (
						<button
							type="button"
							onClick={onComprehensiveTest}
							className="p-2 text-white hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black/80 rounded-lg"
							title="Comprehensive Test"
						>
							<TestTube size={20} />
						</button>
					)}

					{onAddTestNotification && (
						<button
							type="button"
							onClick={onAddTestNotification}
							className="p-2 text-white hover:text-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black/80 rounded-lg"
							title="Add Test Notification"
						>
							<TestTube size={20} />
						</button>
					)}

					<button
						type="button"
						onClick={handleDebug}
						className="p-2 text-white hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black/80 rounded-lg"
						title="Debug Notifications"
					>
						<Bug size={20} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
