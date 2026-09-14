import { jwtDecode } from "jwt-decode";

/**
 * Reads the eventId out of a scanned QR token WITHOUT verifying its
 * signature — verification happens server-side in checkInWithQr().
 * This is only used to know which /events/:id/checkin URL to call.
 */
export function extractEventIdFromToken(token) {
  try {
    const payload = jwtDecode(token);
    return payload.eventId || payload.id || payload.event || null;
  } catch {
    return null;
  }
}