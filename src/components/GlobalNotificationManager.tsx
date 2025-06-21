import { CustomAlertDialog } from "./CustomAlertDialog";
import { useNotification } from "./NotificationContext";

export const GlobalNotificationManager = () => {
	const { notifications, closeNotification } = useNotification();

	return (
		<>
			{notifications.map((notification) => (
				<CustomAlertDialog
					key={notification.id}
					title={notification.title}
					message={notification.message}
					isOpen={true}
					onClose={() => closeNotification(notification.id)}
					onConfirm={notification.onConfirm}
					confirmText={notification.confirmText}
					cancelText={notification.cancelText}
					type={notification.type}
				/>
			))}
		</>
	);
};
