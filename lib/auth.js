/**
 * Simple dashboard auth helpers using a cookie flag.
 * Not full auth — just enough to protect the leads dashboard.
 */
export const AUTH_COOKIE_NAME = "dashboard-authenticated";

/**
 * Returns true when the request carries a valid dashboard auth cookie.
 */
export function isDashboardAuthenticated(request) {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value === "true";
}
