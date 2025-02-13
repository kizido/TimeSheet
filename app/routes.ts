import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/login.tsx"), route("/signup", "routes/signup.tsx"), route("/sheet", "routes/sheet.tsx"), route("/sheetList", "routes/sheetList.tsx")] satisfies RouteConfig;
