import type { RouteTypes } from "@react-router/types";
import type Profile from "../../routes/profile";

export type Route = RouteTypes<
  typeof Profile,
  {
    // Add any route params here
  }
>;
