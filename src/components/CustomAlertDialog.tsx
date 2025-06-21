import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomAlertDialogProps {
	title: string;
	message: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	type?: "warning" | "info" | "error";
}

export function CustomAlertDialog({
	title,
	message,
	isOpen,
	onClose,
	onConfirm,
	confirmText = "OK",
	cancelText = "Cancel",
	type = "warning",
}: CustomAlertDialogProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [isOpen]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 200);
	};

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		}
		handleClose();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Escape") {
			handleClose();
		} else if (event.key === "Enter") {
			handleConfirm();
		}
	};

	if (!isOpen) return null;

	const getIconColor = () => {
		switch (type) {
			case "error":
				return "text-red-500";
			case "info":
				return "text-blue-500";
			default:
				return "text-yellow-500";
		}
	};

	const getButtonColor = () => {
		switch (type) {
			case "error":
				return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
			case "info":
				return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
			default:
				return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
		}
	};

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center">
			{/* Backdrop */}
			<button
				type="button"
				onClick={handleClose}
				className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
					isVisible ? "opacity-100" : "opacity-0"
				}`}
			/>

			{/* Dialog */}
			<div
				className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-200 ${
					isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center space-x-3">
						<AlertTriangle className={`w-6 h-6 ${getIconColor()}`} />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{title}
						</h3>
					</div>
					<button
						type="button"
						onClick={handleClose}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleClose();
							}
						}}
						className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						{message}
					</p>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
					{onConfirm && (
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
						>
							{cancelText}
						</button>
					)}
					<button
						type="button"
						onClick={handleConfirm}
						onKeyDown={handleKeyDown}
						className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${getButtonColor()}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
