import type { RouteTypes } from "@react-router/types";
import type ForgotPassword from "../../../routes/auth/forgot-password";

export type Route = RouteTypes<
  typeof ForgotPassword,
  {
    // Add any route params here
  }
>;
