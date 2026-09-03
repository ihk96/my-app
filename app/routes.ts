import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("app", "routes/app/app.tsx", [
        index("routes/app/index.tsx"),
        route("balance", "routes/app/balance/index.tsx"),
        route("inventory", "routes/app/inventory/index.tsx"),
        route("pets", "routes/app/pets/index.tsx")
    ]),
    route("login","routes/login.tsx"),

] satisfies RouteConfig;
