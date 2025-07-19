import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as Sentry from "@sentry/react";
import { NotificationProvider } from "./components/NotificationContext";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { registerFirebaseMessagingSW } from "./utils/serviceWorker";
import { AuthProvider, useAuth } from "./components/admin/auth";

// Register Firebase messaging service worker
if (import.meta.env.PROD) {
	registerFirebaseMessagingSW().catch(console.error);
}

Sentry.init({
	dsn: "https://0da1a1c56040e5f4e3bbe8874ce3e5fe@o4508405102018560.ingest.us.sentry.io/4509539536338944",
	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true,
});

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<StrictMode>
			<NotificationProvider>
				<AuthProvider>
					<InnerApp />
				</AuthProvider>
			</NotificationProvider>
		</StrictMode>
	);
}

function InnerApp() {
	const auth = useAuth()
	return <RouterProvider router={router} context={{ auth }} />
  }