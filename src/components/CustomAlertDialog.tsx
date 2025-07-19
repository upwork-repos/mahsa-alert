import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomAlertDialogProps {
	title: string;
	message: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	type?: "warning" | "info" | "error" | "success";
	autoDismiss?: boolean;
	duration?: number;
	position?:
		| "top-right"
		| "top-left"
		| "top-center"
		| "bottom-right"
		| "bottom-left"
		| "bottom-center";
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
	autoDismiss = true,
	duration = 5000,
	position = "top-right",
}: CustomAlertDialogProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [progressWidth, setProgressWidth] = useState(100);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
			setProgressWidth(100);

			// Auto-dismiss functionality
			if (autoDismiss && !onConfirm) {
				// Start progress animation
				const startTime = Date.now();
				const animateProgress = () => {
					const elapsed = Date.now() - startTime;
					const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
					setProgressWidth(remaining);

					if (remaining > 0) {
						requestAnimationFrame(animateProgress);
					}
				};

				const animationId = requestAnimationFrame(animateProgress);

				const timer = setTimeout(() => {
					handleClose();
				}, duration);

				return () => {
					clearTimeout(timer);
					cancelAnimationFrame(animationId);
				};
			}
		} else {
			setIsVisible(false);
		}
	}, [isOpen, autoDismiss, duration, onConfirm]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 300);
	};

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		}
		handleClose();
	};

	const getIcon = () => {
		switch (type) {
			case "error":
				return <AlertCircle className="w-5 h-5" />;
			case "info":
				return <Info className="w-5 h-5" />;
			case "success":
				return <CheckCircle className="w-5 h-5" />;
			default:
				return <AlertTriangle className="w-5 h-5" />;
		}
	};

	const getIconColor = () => {
		switch (type) {
			case "error":
				return "text-red-500";
			case "info":
				return "text-blue-500";
			case "success":
				return "text-green-500";
			default:
				return "text-yellow-500";
		}
	};

	const getBorderColor = () => {
		switch (type) {
			case "error":
				return "border-l-red-500";
			case "info":
				return "border-l-blue-500";
			case "success":
				return "border-l-green-500";
			default:
				return "border-l-yellow-500";
		}
	};

	const getPositionClasses = () => {
		switch (position) {
			case "top-left":
				return "top-4 left-4";
			case "top-center":
				return "top-4 left-1/2 transform -translate-x-1/2";
			case "bottom-right":
				return "bottom-4 right-4";
			case "bottom-left":
				return "bottom-4 left-4";
			case "bottom-center":
				return "bottom-4 left-1/2 transform -translate-x-1/2";
			default:
				return "top-4 right-4";
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className={`fixed z-[9999] ${getPositionClasses()} max-w-sm w-full mx-4`}
		>
			<div
				className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${getBorderColor()} transform transition-all duration-300 ease-out ${
					isVisible
						? "translate-y-0 opacity-100 scale-100"
						: "translate-y-[-100%] opacity-0 scale-95"
				}`}
			>
				{/* Header */}
				<div className="flex items-start justify-between p-4">
					<div className="flex items-start space-x-3 flex-1">
						<div className={`flex-shrink-0 ${getIconColor()}`}>{getIcon()}</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-5">
								{title}
							</h3>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-5">
								{message}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={handleClose}
						className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					>
						<X size={16} />
					</button>
				</div>

				{/* Action buttons - only show if onConfirm is provided */}
				{onConfirm && (
					<div className="flex items-center justify-end space-x-2 px-4 pb-4">
						<button
							type="button"
							onClick={handleClose}
							className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
						>
							{cancelText}
						</button>
						<button
							type="button"
							onClick={handleConfirm}
							className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
								type === "error"
									? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
									: type === "info"
										? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
										: type === "success"
											? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
											: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
							}`}
						>
							{confirmText}
						</button>
					</div>
				)}

				{/* Progress bar for auto-dismiss */}
				{autoDismiss && !onConfirm && (
					<div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
						<div
							className={`h-full transition-all duration-100 ease-linear ${
								type === "error"
									? "bg-red-500"
									: type === "info"
										? "bg-blue-500"
										: type === "success"
											? "bg-green-500"
											: "bg-yellow-500"
							}`}
							style={{ width: `${progressWidth}%` }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
