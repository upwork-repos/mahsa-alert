import { NotificationToast } from "./NotificationToast";

interface Notification {
	id: string;
	title: string;
	body?: string;
	onClick?: () => void;
}

interface NotificationManagerProps {
	notifications: Notification[];
	onRemoveNotification: (id: string) => void;
}

export function NotificationManager({
	notifications,
	onRemoveNotification,
}: NotificationManagerProps) {
	return (
		<div className="fixed top-4 right-4 z-[9999] space-y-2">
			{notifications.map((notification, index) => (
				<div
					key={notification.id}
					style={{
						transform: `translateY(${index * 80}px)`,
					}}
				>
					<NotificationToast
						title={notification.title}
						body={notification.body}
						onClose={() => onRemoveNotification(notification.id)}
						onClick={notification.onClick}
					/>
				</div>
			))}
		</div>
	);
}
