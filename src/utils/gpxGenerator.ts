import type { CampingSpot } from '../types/spot';

/**
 * Generates and downloads a GPX file for GPS devices (Garmin, OsmAnd, GaiaGPS, etc.)
 */
export function downloadSpotGPX(spot: CampingSpot) {
  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="CamperMapTN - https://campermap.tn" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(spot.name)}</name>
    <desc>${escapeXml(spot.description)}</desc>
    <time>${new Date().toISOString()}</time>
    <link href="https://campermap.tn/spot/${spot.id}">
      <text>CamperMap Tunisie</text>
    </link>
  </metadata>
  
  <wpt lat="${spot.coordinates.lat}" lon="${spot.coordinates.lng}">
    <name>${escapeXml(spot.name)}</name>
    <desc>Bivouac: ${escapeXml(spot.trackDescription)} | Difficulté: ${spot.difficulty} | Accès: ${spot.accessTypes.join(', ')}</desc>
    <sym>Campground</sym>
    <type>Camping</type>
  </wpt>

  ${spot.elevationProfile && spot.elevationProfile.length > 0 ? `
  <trk>
    <name>Tracé d'accès - ${escapeXml(spot.name)}</name>
    <trkseg>
      ${spot.elevationProfile.map((pt, index) => {
        const latOffset = (index / spot.elevationProfile!.length) * 0.008;
        const lngOffset = (index / spot.elevationProfile!.length) * 0.008;
        return `
      <trkpt lat="${(spot.coordinates.lat - 0.008 + latOffset).toFixed(6)}" lon="${(spot.coordinates.lng - 0.008 + lngOffset).toFixed(6)}">
        <ele>${pt.altitudeMeters}</ele>
        <time>${new Date(Date.now() + index * 600000).toISOString()}</time>
      </trkpt>`;
      }).join('')}
    </trkseg>
  </trk>
  ` : ''}
</gpx>`;

  const blob = new Blob([gpxContent], { type: 'application/gpx+xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${spot.id}-campermap-tn.gpx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
