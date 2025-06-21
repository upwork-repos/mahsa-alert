import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationToastProps {
	title: string;
	body?: string;
	onClose: () => void;
	onClick?: () => void;
}

export function NotificationToast({
	title,
	body,
	onClose,
	onClick,
}: NotificationToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(onClose, 300); // Wait for animation to complete
		}, 5000); // Auto-hide after 5 seconds

		return () => clearTimeout(timer);
	}, [onClose]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 300);
	};

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
		handleClose();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<div
			className={`fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transform transition-all duration-300 ${
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
			}`}
		>
			{onClick ? (
				<button
					type="button"
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
				>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
								{title}
							</h4>
							{body && (
								<p className="text-sm text-gray-600 dark:text-gray-300">
									{body}
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleClose();
							}}
							className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
						>
							<X size={16} />
						</button>
					</div>
				</button>
			) : (
				<div className="p-4">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
								{title}
							</h4>
							{body && (
								<p className="text-sm text-gray-600 dark:text-gray-300">
									{body}
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={handleClose}
							className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
						>
							<X size={16} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
