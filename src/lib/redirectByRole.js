/**
 * Single source of truth for "where does this role land after auth".
 * Used by both login and register so the rule never drifts between them.
 */
export function getRedirectPath(role) {
  if (role === "Admin") return "/dashboard";
  return "/"; // User & TeamLeader both land on the public home page
}