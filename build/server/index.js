import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Toast } from "@base-ui/react/toast";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region app/components/ui/button.tsx
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-8",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant = "default", size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region app/components/ui/toast.tsx
var toast = Toast.createToastManager();
function ToastProvider({ ...props }) {
	return /* @__PURE__ */ jsx(Toast.Provider, { ...props });
}
function ToastPortal({ ...props }) {
	return /* @__PURE__ */ jsx(Toast.Portal, {
		"data-slot": "toast-portal",
		...props
	});
}
function ToastViewport({ className, ...props }) {
	return /* @__PURE__ */ jsx(Toast.Viewport, {
		"data-slot": "toast-viewport",
		className: cn("pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full", className),
		...props
	});
}
function Toast$1({ className, ...props }) {
	return /* @__PURE__ */ jsx(Toast.Root, {
		"data-slot": "toast",
		className: cn("group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]", "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]", "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']", "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]", "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]", "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]", "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]", "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]", "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]", className),
		...props
	});
}
function ToastContent({ className, ...props }) {
	return /* @__PURE__ */ jsx(Toast.Content, {
		"data-slot": "toast-content",
		className: cn("flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100", className),
		...props
	});
}
function ToastTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(Toast.Title, {
		"data-slot": "toast-title",
		className: cn("text-sm font-medium", className),
		...props
	});
}
function ToastDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(Toast.Description, {
		"data-slot": "toast-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function ToastAction({ className, render = /* @__PURE__ */ jsx(Button$1, {
	variant: "outline",
	size: "sm"
}), ...props }) {
	return /* @__PURE__ */ jsx(Toast.Action, {
		"data-slot": "toast-action",
		render,
		className: cn("shrink-0", className),
		...props
	});
}
function ToastClose({ className, children, render = /* @__PURE__ */ jsx(Button$1, {
	variant: "ghost",
	size: "icon-sm"
}), ...props }) {
	return /* @__PURE__ */ jsx(Toast.Close, {
		"data-slot": "toast-close",
		"aria-label": "Close toast",
		render,
		className: cn("relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground", className),
		...props,
		children: children ?? /* @__PURE__ */ jsx(XIcon, { "aria-hidden": "true" })
	});
}
function ToastIcon({ type }) {
	let icon = null;
	if (type === "success") icon = /* @__PURE__ */ jsx(CircleCheckIcon, { "aria-hidden": "true" });
	if (type === "info") icon = /* @__PURE__ */ jsx(InfoIcon, { "aria-hidden": "true" });
	if (type === "warning") icon = /* @__PURE__ */ jsx(TriangleAlertIcon, { "aria-hidden": "true" });
	if (type === "error") icon = /* @__PURE__ */ jsx(OctagonXIcon, {
		className: "text-destructive",
		"aria-hidden": "true"
	});
	if (type === "loading") icon = /* @__PURE__ */ jsx(Loader2Icon, {
		className: "animate-spin",
		"aria-hidden": "true"
	});
	if (!icon) return null;
	return /* @__PURE__ */ jsx("span", {
		"data-slot": "toast-icon",
		className: "shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
		children: icon
	});
}
function ToastList() {
	const { toasts } = Toast.useToastManager();
	return toasts.map((toastItem) => /* @__PURE__ */ jsx(Toast$1, {
		toast: toastItem,
		children: /* @__PURE__ */ jsxs(ToastContent, { children: [
			/* @__PURE__ */ jsx(ToastIcon, { type: toastItem.type }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col gap-1",
				children: [/* @__PURE__ */ jsx(ToastTitle, {}), /* @__PURE__ */ jsx(ToastDescription, {})]
			}),
			/* @__PURE__ */ jsx(ToastAction, {}),
			/* @__PURE__ */ jsx(ToastClose, {})
		] })
	}, toastItem.id));
}
function Toaster({ children, toastManager = toast, ...props }) {
	return /* @__PURE__ */ jsxs(ToastProvider, {
		toastManager,
		...props,
		children: [children, /* @__PURE__ */ jsx(ToastPortal, { children: /* @__PURE__ */ jsx(ToastViewport, { children: /* @__PURE__ */ jsx(ToastList, {}) }) })]
	});
}
Toast.createToastManager;
Toast.useToastManager;
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [{
	rel: "manifest",
	href: "/manifest.webmanifest"
}, {
	rel: "icon",
	href: "/favicon.svg",
	type: "image/svg+xml"
}];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("title", { children: "Miyaku" }),
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#111111"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "apple-mobile-web-app-capable",
				content: "yes"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(Toaster, {}),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-D99JhfDh.js",
		"imports": [
			"/assets/utils-D8DF_fE-.js",
			"/assets/react-dom-MyUVqu9L.js",
			"/assets/jsx-runtime-B33W4qnm.js",
			"/assets/errorBoundaries-CggeDJD4.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-DKxopI_S.js",
			"imports": [
				"/assets/utils-D8DF_fE-.js",
				"/assets/react-dom-MyUVqu9L.js",
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/errorBoundaries-CggeDJD4.js",
				"/assets/lib-iu4PiuYQ.js",
				"/assets/toast-C_pEtpih.js",
				"/assets/dist-CBGDQNAk.js",
				"/assets/useTimeout-0yV_E83X.js",
				"/assets/button-feiIwOts.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/loader-circle-DOJZVfP1.js",
				"/assets/triangle-alert-Ciz7OvoX.js"
			],
			"css": ["/assets/root-DbHTsgS5.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-main-xuuE1JIK.js",
			"imports": [
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/lib-iu4PiuYQ.js",
				"/assets/users-DAAOtI4q.js",
				"/assets/utils-D8DF_fE-.js",
				"/assets/errorBoundaries-CggeDJD4.js",
				"/assets/api-client-H6AkTUcl.js",
				"/assets/schemas-gP0zsXjp.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": "/assets/home-client-loader-BqfRioRh.js",
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/app": {
			"id": "routes/app/app",
			"parentId": "root",
			"path": "app",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app-main-DCc2SAl9.js",
			"imports": [
				"/assets/utils-D8DF_fE-.js",
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/lib-iu4PiuYQ.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/app-state-DUkqpa7S.js",
				"/assets/spinner-CN-Pa-dX.js",
				"/assets/app-client-loader-BAkyG3Hx.js",
				"/assets/errorBoundaries-CggeDJD4.js",
				"/assets/schemas-gP0zsXjp.js",
				"/assets/loader-circle-DOJZVfP1.js",
				"/assets/users-DAAOtI4q.js",
				"/assets/api-client-H6AkTUcl.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": "/assets/app-client-loader-BAkyG3Hx.js",
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/index": {
			"id": "routes/app/index",
			"parentId": "routes/app/app",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-DATfVUCc.js",
			"imports": [
				"/assets/utils-D8DF_fE-.js",
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/dist-CBGDQNAk.js",
				"/assets/useTimeout-0yV_E83X.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/app-state-DUkqpa7S.js",
				"/assets/card-CmNfnnek.js",
				"/assets/badge-CUIrBvRE.js",
				"/assets/schemas-gP0zsXjp.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/balance/index": {
			"id": "routes/app/balance/index",
			"parentId": "routes/app/app",
			"path": "balance",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-3yv_qD83.js",
			"imports": [
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/button-feiIwOts.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/plus-SLsiu0ye.js",
				"/assets/card-CmNfnnek.js",
				"/assets/badge-CUIrBvRE.js",
				"/assets/utils-D8DF_fE-.js",
				"/assets/dist-CBGDQNAk.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/inventory/index": {
			"id": "routes/app/inventory/index",
			"parentId": "routes/app/app",
			"path": "inventory",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-BFoDGNgW.js",
			"imports": [
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/button-feiIwOts.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/plus-SLsiu0ye.js",
				"/assets/triangle-alert-Ciz7OvoX.js",
				"/assets/card-CmNfnnek.js",
				"/assets/badge-CUIrBvRE.js",
				"/assets/utils-D8DF_fE-.js",
				"/assets/dist-CBGDQNAk.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/pets/index": {
			"id": "routes/app/pets/index",
			"parentId": "routes/app/app",
			"path": "pets",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-BU_NiBcv.js",
			"imports": [
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/button-feiIwOts.js",
				"/assets/plus-SLsiu0ye.js",
				"/assets/card-CmNfnnek.js",
				"/assets/badge-CUIrBvRE.js",
				"/assets/utils-D8DF_fE-.js",
				"/assets/dist-CBGDQNAk.js",
				"/assets/createLucideIcon-C67c0dPr.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/login": {
			"id": "routes/login",
			"parentId": "root",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/login-BOJcvpXn.js",
			"imports": [
				"/assets/utils-D8DF_fE-.js",
				"/assets/jsx-runtime-B33W4qnm.js",
				"/assets/dist-CBGDQNAk.js",
				"/assets/button-feiIwOts.js",
				"/assets/toast-C_pEtpih.js",
				"/assets/createLucideIcon-C67c0dPr.js",
				"/assets/api-client-H6AkTUcl.js",
				"/assets/spinner-CN-Pa-dX.js",
				"/assets/card-CmNfnnek.js",
				"/assets/react-dom-MyUVqu9L.js",
				"/assets/useTimeout-0yV_E83X.js",
				"/assets/loader-circle-DOJZVfP1.js",
				"/assets/triangle-alert-Ciz7OvoX.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-b732d5cb.js",
	"version": "b732d5cb",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var route1 = { default: () => null };
var route2 = { default: () => null };
var route3 = { default: () => null };
var route4 = { default: () => null };
var route5 = { default: () => null };
var route6 = { default: () => null };
var route7 = { default: () => null };
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = false;
var isSpaMode = true;
var prerender = [];
var routeDiscovery = { "mode": "initial" };
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: route1
	},
	"routes/app/app": {
		id: "routes/app/app",
		parentId: "root",
		path: "app",
		index: void 0,
		caseSensitive: void 0,
		module: route2
	},
	"routes/app/index": {
		id: "routes/app/index",
		parentId: "routes/app/app",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: route3
	},
	"routes/app/balance/index": {
		id: "routes/app/balance/index",
		parentId: "routes/app/app",
		path: "balance",
		index: void 0,
		caseSensitive: void 0,
		module: route4
	},
	"routes/app/inventory/index": {
		id: "routes/app/inventory/index",
		parentId: "routes/app/app",
		path: "inventory",
		index: void 0,
		caseSensitive: void 0,
		module: route5
	},
	"routes/app/pets/index": {
		id: "routes/app/pets/index",
		parentId: "routes/app/app",
		path: "pets",
		index: void 0,
		caseSensitive: void 0,
		module: route6
	},
	"routes/login": {
		id: "routes/login",
		parentId: "root",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: route7
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
