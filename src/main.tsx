import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { registerFirebaseMessagingSW } from "./utils/serviceWorker";

// Register Firebase messaging service worker
if (import.meta.env.PROD) {
	registerFirebaseMessagingSW().catch(console.error);
}

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
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
