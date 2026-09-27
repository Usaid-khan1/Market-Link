/**
 * Routing Service using OSRM (Open Source Routing Machine)
 * Computes driving routes, distance, and estimated travel duration between coordinates.
 */

export function formatDistance(meters) {
  if (typeof meters !== 'number' || isNaN(meters)) return 'N/A';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(1);
  const miles = (meters / 1609.34).toFixed(1);
  return `${km} km (${miles} mi)`;
}

export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return 'N/A';
  const mins = Math.round(seconds / 60);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours} hr ${remMins} min` : `${hours} hr`;
}

/**
 * Fetch a driving route from customer location to farmer stall.
 *
 * @param {number} customerLng Customer longitude
 * @param {number} customerLat Customer latitude
 * @param {number} farmerLng Farmer stall longitude
 * @param {number} farmerLat Farmer stall latitude
 * @returns {Promise<{ success: boolean, geometry?: any, distanceMeters?: number, durationSeconds?: number, distanceFormatted?: string, durationFormatted?: string, error?: string }>}
 */
export async function getRoute(customerLng, customerLat, farmerLng, farmerLat) {
  // Validate coordinates
  const cLng = Number(customerLng);
  const cLat = Number(customerLat);
  const fLng = Number(farmerLng);
  const fLat = Number(farmerLat);

  if (
    isNaN(cLng) || isNaN(cLat) || isNaN(fLng) || isNaN(fLat) ||
    Math.abs(cLat) > 90 || Math.abs(fLat) > 90 ||
    Math.abs(cLng) > 180 || Math.abs(fLng) > 180
  ) {
    return {
      success: false,
      error: 'Invalid coordinates provided for route calculation.',
    };
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${cLng},${cLat};${fLng},${fLat}?overview=full&geometries=geojson`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM server responded with HTTP status ${res.status}`);
    }

    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return {
        success: false,
        error: data.message || 'No driving route found between these locations.',
      };
    }

    const primaryRoute = data.routes[0];

    return {
      success: true,
      geometry: primaryRoute.geometry,
      distanceMeters: primaryRoute.distance,
      durationSeconds: primaryRoute.duration,
      distanceFormatted: formatDistance(primaryRoute.distance),
      durationFormatted: formatDuration(primaryRoute.duration),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Routing service error:', err);
    return {
      success: false,
      error: 'Unable to calculate the pickup route. Please try again.',
    };
  }
}

export default {
  getRoute,
  formatDistance,
  formatDuration,
};
