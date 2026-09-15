const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://rccs-backend-production.up.railway.app";

// Builds an absolute URL from a relative backend path like "/uploads/x.png"
export function getFileUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${FILE_BASE_URL}${path}`;
}