import React, { useState } from 'react';
import type { CampingSpot, SpotCoordinates } from '../../types/spot';

import { calculateDistanceKm, getNavigationUrls } from '../../utils/geoUtils';
import { downloadSpotGPX } from '../../utils/gpxGenerator';
import { 
  X, 
  Route, 
  MapPin, 
  Compass, 
  Footprints, 
  Car, 
  Truck, 
  Download, 
  Navigation, 
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  userLocation: SpotCoordinates | null;
  onApplyRoute: (points: SpotCoordinates[]) => void;
}

const TUNISIAN_CITIES: { name: string; coords: SpotCoordinates }[] = [
  { name: 'Tunis (Capitale)', coords: { lat: 36.8065, lng: 10.1815 } },
  { name: 'Bizerte', coords: { lat: 37.2744, lng: 9.8739 } },
  { name: 'Sousse', coords: { lat: 35.8256, lng: 10.6084 } },
  { name: 'Sfax', coords: { lat: 34.7406, lng: 10.7603 } },
  { name: 'Nabeul / Hammamet', coords: { lat: 36.4561, lng: 10.7376 } },
  { name: 'Tabarka', coords: { lat: 36.9544, lng: 8.7581 } },
  { name: 'Zaghouan', coords: { lat: 36.4029, lng: 10.1429 } },
  { name: 'Gabès', coords: { lat: 33.8815, lng: 10.0982 } },
  { name: 'Tozeur', coords: { lat: 33.9197, lng: 8.1335 } },
  { name: 'Tataouine', coords: { lat: 32.9297, lng: 10.4518 } }
];

export const RoutePlannerModal: React.FC<RoutePlannerModalProps> = ({
  isOpen,
  onClose,
  spots,
  selectedSpot,
  userLocation,
  onApplyRoute
}) => {
  const [startType, setStartType] = useState<'gps' | 'city'>(userLocation ? 'gps' : 'city');
  const [selectedCityName, setSelectedCityName] = useState<string>('Tunis (Capitale)');
  const [targetSpotId, setTargetSpotId] = useState<string>(selectedSpot?.id || spots[0]?.id || '');
  const [transportMode, setTransportMode] = useState<'car' | '4x4' | 'foot'>('car');

  if (!isOpen) return null;

  const targetSpot = spots.find(s => s.id === targetSpotId) || spots[0];

  let startCoords: SpotCoordinates = TUNISIAN_CITIES[0].coords;
  let startLabel = 'Tunis';

  if (startType === 'gps' && userLocation) {
    startCoords = userLocation;
    startLabel = 'Votre position GPS actuelle';
  } else {
    const foundCity = TUNISIAN_CITIES.find(c => c.name === selectedCityName);
    if (foundCity) {
      startCoords = foundCity.coords;
      startLabel = foundCity.name;
    }
  }

  // Calculate distance
  const straightDistance = calculateDistanceKm(startCoords, targetSpot.coordinates);
  
  // Adjusted road distance (usually ~1.25x straight line in Tunisia)
  const estimatedRoadDistance = Math.round(straightDistance * 1.28);

  // Estimated Duration
  let speedKmH = 75; // car average
  if (transportMode === '4x4') speedKmH = 60; // including tracks
  if (transportMode === 'foot') speedKmH = 4.5; // hiking speed

  const totalHours = estimatedRoadDistance / speedKmH;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  const handleGenerateRoute = () => {
    // Generate route interpolation points
    const pointsCount = 12;
    const points: SpotCoordinates[] = [];
    
    for (let i = 0; i <= pointsCount; i++) {
      const ratio = i / pointsCount;
      // Slight road curvature simulation
      const curve = Math.sin(ratio * Math.PI) * 0.05;
      points.push({
        lat: startCoords.lat + (targetSpot.coordinates.lat - startCoords.lat) * ratio + curve,
        lng: startCoords.lng + (targetSpot.coordinates.lng - startCoords.lng) * ratio + curve
      });
    }

    onApplyRoute(points);
    onClose();
  };

  const navUrls = getNavigationUrls(targetSpot.coordinates, targetSpot.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl max-h-[90vh] overflow-y-auto z-50 flex flex-col shadow-2xl text-stone-100 p-5 md:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">
                Calculateur d'Itinéraire & Rando
              </h2>
              <p className="text-xs text-stone-400">
                Estimez le trajet, la durée et la nature du chemin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          
          {/* Departure Point */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2.5">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Point de Départ</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStartType('city')}
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                  startType === 'city'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                Choisir une ville
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userLocation) {
                    setStartType('gps');
                  } else {
                    alert("Position GPS non détectée. Veuillez autoriser la géolocalisation.");
                  }
                }}
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                  startType === 'gps'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                Ma position GPS
              </button>
            </div>

            {startType === 'city' ? (
              <select
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              >
                {TUNISIAN_CITIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                ✓ Départ depuis votre géolocalisation actuelle
              </div>
            )}
          </div>

          {/* Destination Spot */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Spot de Bivouac de Destination</span>
            </div>

            <select
              value={targetSpotId}
              onChange={(e) => setTargetSpotId(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            >
              {spots.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.region}) — {s.difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              Mode de transport envisagé
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'car', label: 'Voiture', icon: Car, desc: 'Route & Piste facile' },
                { id: '4x4', label: '4x4 / Piste', icon: Truck, desc: 'Tout-terrain & Dunes' },
                { id: 'foot', label: 'Randonnée', icon: Footprints, desc: 'Sentier pédestre' }
              ].map(({ id, label, icon: Icon, desc }) => {
                const active = transportMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTransportMode(id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-bold">{label}</div>
                    <div className="text-[9px] opacity-75">{desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estimation Summary Box */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span>{startLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-stone-200">{targetSpot.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400 uppercase">Distance estimée</div>
                <div className="text-lg font-black text-amber-400">~{estimatedRoadDistance} km</div>
              </div>
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400 uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Durée estimée</span>
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`}
                </div>
              </div>
            </div>

            {/* Track Advice */}
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 text-xs text-stone-300">
              <span className="font-bold text-amber-400">Nature du chemin final : </span>
              <span>{targetSpot.trackDescription}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleGenerateRoute}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Afficher le tracé sur la carte interactive
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={navUrls.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Lancer Google Maps
              </a>
              <button
                onClick={() => downloadSpotGPX(targetSpot)}
                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-emerald-800/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger GPX
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
