import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/auth/login", "routes/auth/login.tsx"),
  route("/auth/register", "routes/auth/register.tsx"),
  route("/auth/forgot-password", "routes/auth/forgot-password.tsx"),
] satisfies RouteConfig;
