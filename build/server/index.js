import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
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
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
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
				content: "black-translucent"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
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
		"module": "/assets/entry.client-nH9RvQYF.js",
		"imports": [
			"/assets/utils-Duj3-NSY.js",
			"/assets/jsx-runtime-DLqYqO7l.js",
			"/assets/errorBoundaries-msimjkRu.js"
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
			"module": "/assets/root-C4256-mL.js",
			"imports": [
				"/assets/utils-Duj3-NSY.js",
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/errorBoundaries-msimjkRu.js",
				"/assets/lib-BzQYkn29.js"
			],
			"css": ["/assets/root-C5_VuHRa.css"],
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
			"module": "/assets/home-main-Bm1tJCu9.js",
			"imports": [
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/lib-BzQYkn29.js",
				"/assets/utils-Duj3-NSY.js",
				"/assets/errorBoundaries-msimjkRu.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": "/assets/home-client-loader-CYdogAg_.js",
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
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app-DXCAWdyC.js",
			"imports": [
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/lib-BzQYkn29.js",
				"/assets/utils-Bt7S2j2P.js",
				"/assets/utils-Duj3-NSY.js",
				"/assets/errorBoundaries-msimjkRu.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
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
			"module": "/assets/index-BgvVmIEj.js",
			"imports": [
				"/assets/utils-Duj3-NSY.js",
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/utils-Bt7S2j2P.js",
				"/assets/dist-C_2QWXd_.js",
				"/assets/badge-BXLmPYtj.js"
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
			"module": "/assets/index-BzjWD7sZ.js",
			"imports": [
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/utils-Bt7S2j2P.js",
				"/assets/plus-DhkzdGcy.js",
				"/assets/dist-C_2QWXd_.js",
				"/assets/badge-BXLmPYtj.js",
				"/assets/button-L0yUfdIx.js",
				"/assets/utils-Duj3-NSY.js"
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
			"module": "/assets/index-EgT6lwL5.js",
			"imports": [
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/utils-Bt7S2j2P.js",
				"/assets/plus-DhkzdGcy.js",
				"/assets/dist-C_2QWXd_.js",
				"/assets/badge-BXLmPYtj.js",
				"/assets/button-L0yUfdIx.js",
				"/assets/utils-Duj3-NSY.js"
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
			"module": "/assets/index-C6r0yaSi.js",
			"imports": [
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/plus-DhkzdGcy.js",
				"/assets/dist-C_2QWXd_.js",
				"/assets/badge-BXLmPYtj.js",
				"/assets/button-L0yUfdIx.js",
				"/assets/utils-Duj3-NSY.js",
				"/assets/utils-Bt7S2j2P.js"
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
			"module": "/assets/login-BxZ6XIcz.js",
			"imports": [
				"/assets/utils-Duj3-NSY.js",
				"/assets/jsx-runtime-DLqYqO7l.js",
				"/assets/utils-Bt7S2j2P.js",
				"/assets/dist-C_2QWXd_.js",
				"/assets/button-L0yUfdIx.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-871c7bb3.js",
	"version": "871c7bb3",
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
