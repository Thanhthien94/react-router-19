import type { RouteTypes } from "@react-router/types";
import type Login from "../../../routes/auth/login";

export type Route = RouteTypes<
  typeof Login,
  {
    // Add any route params here
  }
>;
