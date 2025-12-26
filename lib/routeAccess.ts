import { ROLES } from "@/utils/constants";

export const ROUTE_ACCESS: Record<string, number[]> = {
  "/rfqs/create-rfq": [ROLES.CUSTOMER],
  "/rfqs/my-rfqs": [ROLES.CUSTOMER],
  "/admin": [ROLES.ADMIN],
  "/vendor": [ROLES.VENDOR],
  "/profile": [
    ROLES.ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.CUSTOMER,
    ROLES.VENDOR,
  ],
};
