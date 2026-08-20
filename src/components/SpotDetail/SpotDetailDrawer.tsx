import React, { useState, useEffect } from 'react';
import type { 
  CampingSpot, 
  AccessType, 
  Amenity, 
  SpotReview 
} from '../../types/spot';
import { 
  X, 
  Heart, 
  Share2, 
  Download, 
  Navigation, 
  Footprints, 
  Car, 
  Truck, 
  Droplets, 
  Trees, 
  Waves, 
  Wifi, 
  Mountain, 
  Sun, 
  Flame, 
  ShieldCheck, 
  Calendar, 
  User, 
  Star, 
  Send, 
  AlertTriangle,
  Compass,
  TrendingUp,
  Wind,
  CloudRain,
  Loader2,
  Sunrise,
  Sunset,
  Sparkles
} from 'lucide-react';

import { downloadSpotGPX } from '../../utils/gpxGenerator';
import { formatCoordinates, getNavigationUrls } from '../../utils/geoUtils';
import { fetchSpotWeather, type WeatherData } from '../../services/weatherService';
import { calculateSolarTimes } from '../../utils/solarCalculator';


interface SpotDetailDrawerProps {
  spot: CampingSpot | null;
  onClose: () => void;
  onPlanRoute: (spot: CampingSpot) => void;
  isFavorite: boolean;
  onToggleFavorite: (spotId: string) => void;
  onAddReview?: (spotId: string, review: SpotReview) => void;
}

export const SpotDetailDrawer: React.FC<SpotDetailDrawerProps> = ({
  spot,
  onClose,
  onPlanRoute,
  isFavorite,
  onToggleFavorite,
  onAddReview
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewVehicle, setNewReviewVehicle] = useState<AccessType>('car');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    if (!spot) {
      setWeather(null);
      return;
    }
    let isMounted = true;
    setIsLoadingWeather(true);
    fetchSpotWeather(spot.coordinates).then((data) => {
      if (isMounted) {
        setWeather(data);
        setIsLoadingWeather(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [spot]);


  if (!spot) return null;

  const navUrls = getNavigationUrls(spot.coordinates, spot.name);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const review: SpotReview = {
      id: `review-${Date.now()}`,
      author: newReviewAuthor.trim(),
      comment: newReviewComment.trim(),
      rating: newReviewRating,
      vehicleUsed: newReviewVehicle,
      date: new Date().toISOString().split('T')[0]
    };

    if (onAddReview) {
      onAddReview(spot.id, review);
    }

    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const getAmenityInfo = (amenity: Amenity) => {
    switch (amenity) {
      case 'potable_water':
        return { label: "Source d'eau potable", icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800' };
      case 'dense_forest':
        return { label: 'Forêt ombragée', icon: Trees, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };
      case 'river_lake':
        return { label: 'Rivière / Cascade', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-800' };
      case 'wild_beach':
        return { label: 'Plage sauvage / Mer', icon: Waves, color: 'text-sky-400', bg: 'bg-sky-950/60 border-sky-800' };
      case 'panoramic_view':
        return { label: 'Vue panoramique', icon: Mountain, color: 'text-purple-400', bg: 'bg-purple-950/60 border-purple-800' };
      case 'desert_dunes':
        return { label: 'Dunes de sable', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800' };
      case 'network_4g':
        return { label: 'Réseau 4G disponible', icon: Wifi, color: 'text-indigo-400', bg: 'bg-indigo-950/60 border-indigo-800' };
      case 'firewood':
        return { label: 'Bois mort disponible', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-950/60 border-orange-800' };
      case 'ranger_station':
        return { label: 'Poste Garde forestier', icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-950/60 border-green-800' };
      case 'shaded_area':
        return { label: 'Zone abritée', icon: Trees, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };
      default:
        return { label: amenity, icon: Compass, color: 'text-stone-300', bg: 'bg-stone-900 border-stone-700' };
    }
  };

  const getDifficultyBadge = () => {
    switch (spot.difficulty) {
      case 'easy':
        return { label: 'Niveau Facile', desc: 'Accessible à tous véhicules et débutants', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' };
      case 'moderate':
        return { label: 'Niveau Modéré', desc: 'Piste en terre ou marche soutenue', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' };
      case 'hard':
        return { label: 'Niveau Difficile', desc: 'Piste cassante, franchissement ou rando avec dénivelé', color: 'bg-orange-500/20 text-orange-300 border-orange-500/50' };
      case 'expert':
        return { label: 'Niveau Expert', desc: 'Sable mou / dunes ou terrain d’aventure isolé', color: 'bg-red-500/20 text-red-300 border-red-500/50' };
    }
  };

  const difficultyInfo = getDifficultyBadge();

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-stone-900 border-l border-stone-800 h-full overflow-y-auto z-50 flex flex-col shadow-2xl pointer-events-auto text-stone-100">
        
        {/* Top Floating Actions Header */}
        <div className="sticky top-0 z-20 bg-stone-900/90 backdrop-blur-md px-4 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
              📍 {spot.region}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {formatCoordinates(spot.coordinates)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(spot.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                  : 'bg-stone-800 text-stone-400 hover:text-white border-stone-700'
              }`}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all relative"
              title="Copier le lien"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Lien copié !
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="relative w-full h-72 bg-stone-950 shrink-0">
          <img 
            src={spot.photos[activePhotoIndex] || spot.photos[0]} 
            alt={spot.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/30 pointer-events-none" />

          {/* Photo Pagination Thumbs */}
          {spot.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10 bg-stone-950/70 backdrop-blur-xs p-1 rounded-xl border border-stone-700">
              {spot.photos.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                    activePhotoIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-xl border border-stone-700 flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-sm text-stone-100">{spot.rating}</span>
            <span className="text-xs text-stone-400">({spot.reviewsCount} avis)</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1">
          
          {/* Titles & Arabic name */}
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-black text-stone-100 tracking-tight">
                {spot.name}
              </h1>
              {spot.sourceRef && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  📍 {spot.sourceRef}
                </span>
              )}
            </div>
            {spot.arabicName && (
              <p className="text-lg font-bold text-amber-400/90 font-sans tracking-wide">
                {spot.arabicName}
              </p>
            )}
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Proposé par <span className="text-stone-300 font-semibold">{spot.author || 'CamperMap Community'}</span>
            </p>
          </div>


          {/* Primary Action Buttons Bar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onPlanRoute(spot)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-600/30 transition-all transform active:scale-98"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" />
              Calculer Itinéraire
            </button>

            <button
              onClick={() => downloadSpotGPX(spot)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-emerald-800/60 font-bold text-sm transition-all shadow-md"
              title="Exporter fichier GPX pour montres et GPS Garmin"
            >
              <Download className="w-4 h-4" />
              Trace GPX (.gpx)
            </button>
          </div>

          {/* External GPS Open Buttons */}
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-500" />
              <span>Ouvrir l'application GPS sur votre téléphone</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <a
                href={navUrls.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 text-center rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-all border border-stone-700 truncate"
              >
                Google Maps
              </a>
              <a
                href={navUrls.waze}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 text-center rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-all border border-stone-700 truncate"
              >
                Waze
              </a>
              <a
                href={navUrls.osmand}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 text-center rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-all border border-stone-700 truncate"
              >
                OsmAnd
              </a>
              <a
                href={navUrls.appleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 text-center rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-all border border-stone-700 truncate"
              >
                Apple Maps
              </a>
            </div>

            {/* Quick Share & Copy GPS Bar */}
            <div className="flex items-center gap-2 pt-2.5 mt-2 border-t border-stone-800/80">
              <button
                type="button"
                onClick={() => {
                  const text = `${spot.name} 🏕️ - Spot de bivouac en Tunisie :\nGPS : ${spot.coordinates.lat.toFixed(5)}, ${spot.coordinates.lng.toFixed(5)}\nhttps://maps.google.com/?q=${spot.coordinates.lat},${spot.coordinates.lng}`;
                  navigator.clipboard.writeText(text);
                  alert('✅ Coordonnées GPS et lien du spot copiés dans le presse-papier !');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 text-[11px] font-semibold border border-stone-750 flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Copier Coordonnées GPS</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🏕️ Regarde ce spot de camping en Tunisie : ${spot.name} (${spot.region})\nGPS: https://maps.google.com/?q=${spot.coordinates.lat},${spot.coordinates.lng}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold border border-emerald-800 flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>


          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              À propos de ce spot
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed bg-stone-950/40 p-3.5 rounded-xl border border-stone-800/80">
              {spot.description}
            </p>
          </div>

          {/* Live Weather & 3-Day Forecast Widget */}
          <div className="bg-gradient-to-br from-stone-950 to-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                Météo en direct & Prévisions Bivouac
              </h3>
              {isLoadingWeather ? (
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Chargement...</span>
                </div>
              ) : weather ? (
                <span className="text-[10px] text-stone-400">
                  Mis à jour : {weather.lastUpdated}
                </span>
              ) : null}
            </div>

            {weather && (
              <>
                {/* Current Weather Card */}
                <div className="grid grid-cols-3 gap-2 bg-stone-900/80 p-3 rounded-xl border border-stone-700/60 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{weather.current.conditionEmoji}</span>
                    <div>
                      <div className="text-xl font-black text-stone-100">{weather.current.temp}°C</div>
                      <div className="text-[10px] text-stone-400 leading-tight">{weather.current.conditionText}</div>
                    </div>
                  </div>

                  <div className="text-center border-x border-stone-800 px-2">
                    <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                      <Wind className="w-3 h-3 text-sky-400" />
                      <span>Vent</span>
                    </div>
                    <div className="text-sm font-bold text-sky-300">{weather.current.windSpeed} km/h</div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                      <CloudRain className="w-3 h-3 text-cyan-400" />
                      <span>Humidité</span>
                    </div>
                    <div className="text-sm font-bold text-cyan-300">{weather.current.humidity || 50}%</div>
                  </div>
                </div>

                {/* Wind Warning Banner (if any) */}
                {weather.current.windWarning && (
                  <div className="bg-amber-950/60 border border-amber-800/80 p-2.5 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{weather.current.windWarning}</span>
                  </div>
                )}

                {/* 3-Day Forecast Strip */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {weather.daily.map((day, idx) => (
                    <div key={idx} className="bg-stone-950/70 p-2 rounded-xl border border-stone-800/80 text-center">
                      <div className="text-[10px] font-semibold text-stone-400 truncate">{day.dayName}</div>
                      <div className="text-lg my-0.5">{day.conditionEmoji}</div>
                      <div className="text-xs font-bold text-stone-200">{day.maxTemp}° / <span className="text-stone-400 font-normal">{day.minTemp}°</span></div>
                      <div className="text-[9px] text-cyan-400 font-mono mt-0.5 flex items-center justify-center gap-0.5">
                        <CloudRain className="w-2.5 h-2.5" />
                        <span>{day.rainProb}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Solar Times & Golden Hour Card */}
          {spot && (() => {
            const solar = calculateSolarTimes(spot.coordinates.lat, spot.coordinates.lng);
            return (
              <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sunrise className="w-4 h-4 text-amber-400" />
                    <span>Éphéméride & Heures Solaires</span>
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    Durée du jour : <strong className="text-stone-200">{solar.dayLength}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-center">
                    <div className="text-[10px] text-amber-400/90 font-medium flex items-center justify-center gap-1">
                      <Sunrise className="w-3.5 h-3.5" />
                      <span>Lever</span>
                    </div>
                    <div className="text-sm font-black text-stone-100 mt-0.5">{solar.sunrise}</div>
                    <div className="text-[9px] text-stone-500">Aube {solar.dawn}</div>
                  </div>

                  <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-center">
                    <div className="text-[10px] text-orange-400/90 font-medium flex items-center justify-center gap-1">
                      <Sunset className="w-3.5 h-3.5" />
                      <span>Coucher</span>
                    </div>
                    <div className="text-sm font-black text-stone-100 mt-0.5">{solar.sunset}</div>
                    <div className="text-[9px] text-stone-500">Montage tente</div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/40 p-2.5 rounded-xl border border-amber-900/40 text-center">
                    <div className="text-[10px] text-amber-300 font-bold flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Golden Hour</span>
                    </div>
                    <div className="text-sm font-black text-amber-300 mt-0.5">{solar.goldenHour}</div>
                    <div className="text-[9px] text-amber-400/70">Meilleures photos</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Road Nature & Accessibility Card */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3.5">

            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" />
                Nature du chemin & Accès
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${difficultyInfo.color}`}>
                {difficultyInfo.label}
              </span>
            </div>

            {/* Allowed Vehicles Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'foot', label: 'À pied / Rando', icon: Footprints },
                { id: 'car', label: 'Voiture classique', icon: Car },
                { id: 'suv', label: 'SUV', icon: Truck },
                { id: '4x4', label: '4x4 Franchissement', icon: Truck },
                { id: 'moto', label: 'Moto Trail', icon: Mountain }
              ].map(({ id, label, icon: Icon }) => {
                const isSupported = spot.accessTypes.includes(id as AccessType);
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      isSupported
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-stone-900/40 text-stone-400 border-stone-800/60 line-through opacity-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Track Description Text */}
            <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1">
              <p className="font-semibold text-amber-400">Détails de l'itinéraire :</p>
              <p>{spot.trackDescription}</p>
            </div>

            {/* Hiking Specifics (if any) */}
            {(spot.hikingDistanceKm || spot.elevationGainMeters) && (
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 uppercase">Distance marche</div>
                  <div className="text-sm font-black text-stone-100">{spot.hikingDistanceKm} km</div>
                </div>
                <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 uppercase">Durée estimée</div>
                  <div className="text-sm font-black text-stone-100">{spot.hikingDurationMin} min</div>
                </div>
                <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 uppercase">Dénivelé D+</div>
                  <div className="text-sm font-black text-emerald-400">+{spot.elevationGainMeters} m</div>
                </div>
              </div>
            )}
          </div>

          {/* Elevation Profile (Graphique SVG) */}
          {spot.elevationProfile && spot.elevationProfile.length > 1 && (
            <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Profil Altimétrique & Dénivelé
                </h3>
                <span className="text-xs text-stone-400">
                  Altitude max: {Math.max(...spot.elevationProfile.map(p => p.altitudeMeters))} m
                </span>
              </div>

              {/* Simple Responsive SVG Chart */}
              <div className="h-28 w-full">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#292524" strokeDasharray="3,3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#292524" strokeDasharray="3,3" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="#44403c" />

                  {/* Polygon Fill */}
                  {(() => {
                    const minAlt = Math.min(...spot.elevationProfile!.map(p => p.altitudeMeters));
                    const maxAlt = Math.max(...spot.elevationProfile!.map(p => p.altitudeMeters));
                    const altRange = Math.max(maxAlt - minAlt, 10);
                    const totalDist = spot.elevationProfile![spot.elevationProfile!.length - 1].distanceKm || 1;

                    const points = spot.elevationProfile!.map(p => {
                      const x = (p.distanceKm / totalDist) * 300;
                      const y = 90 - ((p.altitudeMeters - minAlt) / altRange) * 75;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polygon
                          points={`0,90 ${points} 300,90`}
                          fill="url(#elevationGrad)"
                        />
                        <polyline
                          points={points}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>Départ (0 km)</span>
                <span>Arrivée ({spot.elevationProfile[spot.elevationProfile.length - 1].distanceKm} km)</span>
              </div>
            </div>
          )}

          {/* Activities on Site */}
          {spot.activities && spot.activities.length > 0 && (

            <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>🎯 Activités recommandées sur place</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {spot.activities.map((act) => {
                  const activityLabels: Record<string, { label: string; icon: string; desc: string }> = {
                    hiking: { label: 'Randonnée & Trek', icon: '🥾', desc: 'Sentiers pédestres balisés' },
                    swimming: { label: 'Baignade & Criques', icon: '🏊', desc: 'Eaux claires & snorkeling' },
                    climbing: { label: 'Escalade & Spéléo', icon: '🧗', desc: 'Parois calcaires & grottes' },
                    cycling: { label: 'VTT & Piste', icon: '🚴', desc: 'Circuits vélo tout-terrain' },
                    stargazing: { label: 'Ciel Étoilé', icon: '🌌', desc: 'Zéro pollution lumineuse' },
                    kayak_fishing: { label: 'Kayak & Pêche', icon: '🛶', desc: 'Plan d’eau calme / mer' },
                    wildlife_watching: { label: 'Observation Faune', icon: '🦌', desc: 'Cerfs, rapaces, flamants' },
                    sandboarding: { label: 'Glisse sur Dunes', icon: '🏂', desc: 'Dunes de sable fin' },
                    offroad_trail: { label: 'Raid 4x4 & Pistes', icon: '🚜', desc: 'Passages tout-terrain' },
                    photography: { label: 'Photographie', icon: '📸', desc: 'Lumières & panoramas' }
                  };
                  const actInfo = activityLabels[act] || { label: act, icon: '✨', desc: 'Activité outdoor' };
                  return (
                    <div
                      key={act}
                      className="bg-stone-900/90 border border-stone-800/80 rounded-xl p-2.5 flex items-start gap-2.5"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{actInfo.icon}</span>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-stone-100 line-clamp-1">{actInfo.label}</div>
                        <div className="text-[10px] text-stone-400 leading-tight line-clamp-1">{actInfo.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities & Nearby Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Commodités & Points d'intérêt à proximité
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {spot.amenities.map(amenity => {
                const info = getAmenityInfo(amenity);
                const Icon = info.icon;
                return (
                  <div 
                    key={amenity}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${info.bg}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${info.color}`} />
                    <span className="text-stone-200">{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network & Best Season */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400 mb-1 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                <span>Réseau Mobile</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                spot.networkCoverage === 'good' ? 'bg-emerald-950 text-emerald-300' :
                spot.networkCoverage === 'weak' ? 'bg-yellow-950 text-yellow-300' :
                'bg-red-950 text-red-300'
              }`}>
                {spot.networkCoverage === 'good' ? 'Bonne couverture (4G)' :
                 spot.networkCoverage === 'weak' ? 'Signal faible / intermittent' :
                 'Zone blanche (Aucun réseau)'}
              </span>
            </div>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Meilleure Période</span>
              </div>
              <p className="text-xs font-bold text-stone-200 line-clamp-1">
                {spot.bestSeason}
              </p>
            </div>
          </div>

          {/* Safety & Local Regulations in Tunisia */}
          <div className="bg-amber-950/40 rounded-2xl p-4 border border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Conseils de Sécurité & Réglementation en Tunisie</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {spot.safetyAdvice}
            </p>
            <div className="pt-2 text-[11px] text-amber-300/70 border-t border-amber-800/40 flex items-center justify-between">
              <span>🌿 Règle d'or : Emportez TOUS vos déchets (Sans Trace)</span>
            </div>
          </div>

          {/* Community Reviews & Feedback */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Avis & Retours d'expérience ({spot.reviews?.length || 0})
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                {showReviewForm ? 'Fermer formulaire' : '+ Laisser un avis'}
              </button>
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="text-xs font-bold text-stone-200">Partagez l'état du chemin ou vos conseils :</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Votre prénom / Pseudo"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    required
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 placeholder-stone-400"
                  />
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400">Véhicule utilisé :</span>
                  <select
                    value={newReviewVehicle}
                    onChange={(e) => setNewReviewVehicle(e.target.value as AccessType)}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-100"
                  >
                    <option value="car">Voiture classique</option>
                    <option value="suv">SUV</option>
                    <option value="4x4">4x4 Tout-terrain</option>
                    <option value="foot">À pied / Sac à dos</option>
                    <option value="moto">Moto Trail</option>
                  </select>
                </div>

                <textarea
                  placeholder="État de la piste, eau disponible, vent, sécurité..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={2}
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 placeholder-stone-400"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publier mon retour
                </button>
              </form>
            )}

            {/* Reviews List */}
            {spot.reviews && spot.reviews.length > 0 ? (
              <div className="space-y-2.5">
                {spot.reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-stone-200">{rev.author}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        {'★'.repeat(rev.rating)}
                        <span className="text-stone-400 text-[10px] ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-stone-300 leading-relaxed">{rev.comment}</p>
                    {rev.vehicleUsed && (
                      <div className="mt-1.5 text-[10px] text-stone-400">
                        Véhicule : {rev.vehicleUsed}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic bg-stone-950/30 p-3 rounded-xl text-center">
                Soyez le premier à partager votre retour sur ce spot !
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
