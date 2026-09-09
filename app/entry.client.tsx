import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

async function enableApiMocking() {
	try {
		if (process.env.NODE_ENV !== "development") {
			return;
		}
		console.log('Development mode')
		console.log("Enabling client API mocking...");
		const { worker } = await import("~/mocks/browser");
		return worker.start();
	} catch (error) {
		return
	}
}

enableApiMocking().then(()=>{
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<HydratedRouter  />
			</StrictMode>,
		);
	}
)});