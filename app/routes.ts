import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/sheet.tsx"), route("/login", "routes/login.tsx"), route("/signup", "routes/signup.tsx"), route("/sheetList", "routes/sheetList.tsx")] satisfies RouteConfig;
