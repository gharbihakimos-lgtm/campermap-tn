import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { CampingSpot, SpotCoordinates } from '../../types/spot';
import { 
  Crosshair, 
  MapPin, 
  Maximize2
} from 'lucide-react';


interface CampingMapProps {
  spots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  onSelectSpot: (spot: CampingSpot) => void;
  userLocation: SpotCoordinates | null;
  onLocateUser: () => void;
  isLocating: boolean;
  routePolyline?: SpotCoordinates[] | null;
  isPickingLocation?: boolean;
  onLocationPicked?: (coords: SpotCoordinates) => void;
}

type MapLayerType = 'streets' | 'satellite' | 'topo';

export const CampingMap: React.FC<CampingMapProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  userLocation,
  onLocateUser,
  isLocating,
  routePolyline,
  isPickingLocation = false,
  onLocationPicked
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on Tunisia [34.5, 9.6], zoom 7
    const map = L.map(mapContainerRef.current, {
      center: [34.8, 9.8],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: '<a href="https://leafletjs.com" target="_blank">Leaflet</a> | CamperMap TN'
    }).addTo(map);

    // Tile Layers
    const streetsTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    streetsTile.addTo(map);
    tileLayerRef.current = streetsTile;

    // Markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Click handler for picking location
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isPickingLocation && onLocationPicked) {
        onLocationPicked({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTile: L.TileLayer;
    if (activeLayer === 'satellite') {
      newTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri World Imagery'
      });
    } else if (activeLayer === 'topo') {
      newTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'OpenTopoMap'
      });
    } else {
      newTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: 'CartoDB'
      });
    }

    newTile.addTo(map);
    tileLayerRef.current = newTile;
  }, [activeLayer]);

  // Update Spot Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    spots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;

      // Determine marker color and emoji
      let bgColor = 'bg-emerald-600';
      let borderColor = 'border-emerald-300';
      let iconEmoji = '⛺';

      if (spot.category === '4x4_expedition') {
        bgColor = 'bg-amber-600';
        borderColor = 'border-amber-300';
        iconEmoji = '🚙';
      } else if (spot.category === 'coastal_bivouac') {
        bgColor = 'bg-cyan-600';
        borderColor = 'border-cyan-300';
        iconEmoji = '🌊';
      } else if (spot.category === 'hiking_camp') {
        bgColor = 'bg-lime-600';
        borderColor = 'border-lime-300';
        iconEmoji = '🥾';
      }

      const customHtml = `
        <div class="relative group cursor-pointer transform transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="w-9 h-9 rounded-2xl ${bgColor} ${borderColor} border-2 shadow-xl flex items-center justify-center text-stone-900 font-bold text-sm shadow-black/50">
            <span class="text-base leading-none">${iconEmoji}</span>
          </div>
          ${isSelected ? `
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          ` : ''}
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none">
            <div class="bg-stone-900 text-stone-100 text-[11px] font-semibold px-2 py-1.5 px-3 rounded-lg border border-stone-700 whitespace-nowrap shadow-lg">
              ${spot.name}
            </div>
            <div class="w-1.5 h-1.5 bg-stone-900 rotate-45 -mt-0.5 border-r border-b border-stone-700"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-spot-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: customIcon
      });

      // Interactive popup content
      const difficultyLabels: Record<string, { label: string; color: string }> = {
        easy: { label: 'Facile', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
        moderate: { label: 'Modéré', color: 'bg-yellow-950 text-yellow-300 border-yellow-800' },
        hard: { label: 'Difficile', color: 'bg-orange-950 text-orange-300 border-orange-800' },
        expert: { label: 'Expert', color: 'bg-red-950 text-red-300 border-red-800' }
      };

      const diff = difficultyLabels[spot.difficulty] || difficultyLabels.moderate;

      const popupHtml = `
        <div class="w-64 overflow-hidden rounded-xl bg-stone-900 text-stone-100 border border-stone-700">
          <div class="h-28 w-full overflow-hidden relative">
            <img src="${spot.photos[0]}" alt="${spot.name}" class="w-full h-full object-cover" />
            <div class="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-400 border border-amber-500/40">
              ⭐ ${spot.rating}
            </div>
            <div class="absolute bottom-2 left-2 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-stone-300">
              📍 ${spot.region}
            </div>
          </div>
          <div class="p-3">
            <h3 class="font-bold text-sm text-stone-100 line-clamp-1 mb-1">${spot.name}</h3>
            ${spot.arabicName ? `<p class="text-[11px] text-amber-400 font-semibold mb-2">${spot.arabicName}</p>` : ''}
            
            <div class="flex items-center gap-1.5 flex-wrap mb-2.5">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded border ${diff.color}">
                ${diff.label}
              </span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                ${spot.accessTypes.map(a => a === '4x4' ? '4x4' : a === 'foot' ? 'Rando' : 'Voiture').join(' • ')}
              </span>
            </div>

            <p class="text-[11px] text-stone-300 line-clamp-2 mb-3">
              ${spot.description}
            </p>

            <button 
              id="btn-spot-${spot.id}"
              class="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-all text-center shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Voir la fiche & Itinéraire</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260, minWidth: 260 });

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-spot-${spot.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectSpot(spot);
          };
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [spots, selectedSpot]);

  // Center on Selected Spot
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSpot) return;
    mapInstanceRef.current.flyTo(
      [selectedSpot.coordinates.lat, selectedSpot.coordinates.lng],
      13,
      { duration: 1.2 }
    );
  }, [selectedSpot]);

  // Update User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        const userHtml = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-75"></span>
            <div class="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-xl shadow-sky-500/50"></div>
          </div>
        `;
        const userIcon = L.divIcon({
          html: userHtml,
          className: 'user-location-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        }).addTo(map);

        userMarkerRef.current.bindTooltip('Votre position', {
          permanent: false,
          direction: 'top'
        });
      }
    }
  }, [userLocation]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routePolyline && routePolyline.length > 1) {
      const latlngs: L.LatLngExpression[] = routePolyline.map(p => [p.lat, p.lng]);
      const polyline = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }
  }, [routePolyline]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([34.8, 9.8], 7, { duration: 1 });
  };

  return (
    <div className="relative w-full h-full">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Picking Location Banner Mode */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-stone-950 px-4 py-2 rounded-xl shadow-2xl font-bold text-xs md:text-sm flex items-center gap-2 border-2 border-stone-950 animate-bounce">
          <MapPin className="w-4 h-4 stroke-[2.5]" />
          <span>Cliquez n'importe où sur la carte pour positionner votre spot !</span>
        </div>
      )}

      {/* Floating Map Controls on Top Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        
        {/* Layer Switcher Pill */}
        <div className="bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-stone-700 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setActiveLayer('streets')}
            className={`px-2.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'streets'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Carte Outdoor Standard"
          >
            🗺️ Randonnée
          </button>
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'satellite'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Vue Satellite Haute Résolution"
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setActiveLayer('topo')}
            className={`px-2.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'topo'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Carte Topographique avec Dénivelés"
          >
            🏔️ Relief
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-1.5">
          {/* My Location GPS */}
          <button
            onClick={onLocateUser}
            disabled={isLocating}
            className={`p-3 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700 text-stone-100 shadow-xl hover:bg-stone-800 transition-all ${
              isLocating ? 'animate-spin text-sky-400' : 'hover:text-sky-400'
            }`}
            title="Me géolocaliser (GPS)"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Reset View to Whole Tunisia */}
          <button
            onClick={handleResetView}
            className="p-3 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700 text-stone-100 shadow-xl hover:bg-stone-800 hover:text-amber-400 transition-all"
            title="Recentrer sur toute la Tunisie"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Map Legend on Bottom Left */}
      <div className="absolute bottom-6 left-3 z-20 hidden md:flex items-center gap-3 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-800 text-xs shadow-xl text-stone-300">
        <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Légende :</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Bivouac Forêt</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span>Plage Sauvage</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>4x4 & Désert</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
          <span>Randonnée / Montagne</span>
        </div>
      </div>
    </div>
  );
};
