import type { SpotCoordinates } from '../types/spot';

/**
 * Calculates distance in kilometers between two points using the Haversine formula
 */
export function calculateDistanceKm(
  coord1: SpotCoordinates,
  coord2: SpotCoordinates
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLng = deg2rad(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) *
      Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formats coordinates to standard GPS format (DMS or DD)
 */
export function formatCoordinates(coord: SpotCoordinates): string {
  return `${coord.lat.toFixed(5)}° N, ${coord.lng.toFixed(5)}° E`;
}

/**
 * Generates navigation URLs for external apps
 */
export function getNavigationUrls(coords: SpotCoordinates, spotName: string) {
  const { lat, lng } = coords;
  return {
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(spotName)}`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    appleMaps: `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(spotName)}`,
    osmand: `https://osmand.net/go?lat=${lat}&lon=${lng}&z=15`
  };
}
