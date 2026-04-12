import { authHandlers } from "./auth";
import { memberHandlers } from "./members";

export const handlers = [...authHandlers, ...memberHandlers];
