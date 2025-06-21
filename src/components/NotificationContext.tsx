import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { setGlobalNotificationHandler } from "../utils/notifications";

interface NotificationDialog {
	id: string;
	title: string;
	message: string;
	type?: "warning" | "info" | "error";
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
}

interface NotificationContextType {
	showNotification: (notification: Omit<NotificationDialog, "id">) => void;
	closeNotification: (id: string) => void;
	notifications: NotificationDialog[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider",
		);
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({
	children,
}: NotificationProviderProps) => {
	const [notifications, setNotifications] = useState<NotificationDialog[]>([]);

	const showNotification = useCallback(
		(notification: Omit<NotificationDialog, "id">) => {
			const id = Date.now().toString();
			setNotifications((prev) => [...prev, { ...notification, id }]);
		},
		[],
	);

	const closeNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id),
		);
	}, []);

	// Set up global notification handler
	useEffect(() => {
		setGlobalNotificationHandler(showNotification);
	}, [showNotification]);

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
				closeNotification,
				notifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};
