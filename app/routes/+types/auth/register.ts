import type { RouteTypes } from "@react-router/types";
import type Register from "../../../routes/auth/register";

export type Route = RouteTypes<
  typeof Register,
  {
    // Add any route params here
  }
>;
