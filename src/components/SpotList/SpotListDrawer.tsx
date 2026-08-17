import React, { useState } from 'react';
import type { CampingSpot, SpotCoordinates } from '../../types/spot';
import { calculateDistanceKm } from '../../utils/geoUtils';
import { 
  MapPin, 
  Heart,
  Compass
} from 'lucide-react';


interface SpotListDrawerProps {
  spots: CampingSpot[];
  selectedSpot: CampingSpot | null;
  onSelectSpot: (spot: CampingSpot) => void;
  favorites: string[];
  onToggleFavorite: (spotId: string) => void;
  userLocation: SpotCoordinates | null;
  mode: 'list' | 'favorites';
}

export const SpotListDrawer: React.FC<SpotListDrawerProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  favorites,
  onToggleFavorite,
  userLocation,
  mode
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'distance'>('rating');

  const displayedSpots = mode === 'favorites'
    ? spots.filter(s => favorites.includes(s.id))
    : spots;

  const sortedSpots = [...displayedSpots].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'distance' && userLocation) {
      const distA = calculateDistanceKm(userLocation, a.coordinates);
      const distB = calculateDistanceKm(userLocation, b.coordinates);
      return distA - distB;
    }
    return 0;
  });

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return { text: 'Facile', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'moderate': return { text: 'Modéré', color: 'bg-yellow-950 text-yellow-300 border-yellow-800' };
      case 'hard': return { text: 'Difficile', color: 'bg-orange-950 text-orange-300 border-orange-800' };
      case 'expert': return { text: 'Expert', color: 'bg-red-950 text-red-300 border-red-800' };
      default: return { text: diff, color: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <div className="w-full h-full bg-stone-900 border-r border-stone-800 flex flex-col overflow-hidden">
      
      {/* List Header & Sorting */}
      <div className="p-4 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>{mode === 'favorites' ? 'Mes Spots Favoris' : 'Spots de Bivouac'}</span>
            </h2>
            <p className="text-xs text-stone-400">
              {displayedSpots.length} spot{displayedSpots.length > 1 ? 's' : ''} répertorié{displayedSpots.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-2 py-1 rounded-lg transition-all ${
                sortBy === 'rating' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              Note
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2 py-1 rounded-lg transition-all ${
                sortBy === 'name' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              Nom
            </button>
            {userLocation && (
              <button
                onClick={() => setSortBy('distance')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  sortBy === 'distance' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                Proximité
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spots Scrollable Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedSpots.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-semibold text-stone-400 mb-1">
              {mode === 'favorites' ? 'Aucun spot favori pour le moment' : 'Aucun spot ne correspond à vos filtres'}
            </p>
            <p className="text-xs text-stone-400">
              {mode === 'favorites' 
                ? 'Cliquez sur le coeur ❤️ dans une fiche pour sauvegarder vos spots préférés.'
                : 'Essayez de réinitialiser ou d’élargir vos critères de recherche.'}
            </p>
          </div>
        ) : (
          sortedSpots.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            const isFav = favorites.includes(spot.id);
            const diff = getDifficultyLabel(spot.difficulty);
            const distance = userLocation ? calculateDistanceKm(userLocation, spot.coordinates) : null;

            return (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? 'bg-stone-800 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                    : 'bg-stone-950/70 border-stone-800/90 hover:border-stone-700 hover:bg-stone-950 shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row h-full">
                  
                  {/* Thumbnail Image */}
                  <div className="relative sm:w-36 h-32 sm:h-auto shrink-0 overflow-hidden bg-stone-900">
                    <img
                      src={spot.photos[0]}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      ⭐ {spot.rating}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-bold text-sm text-stone-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {spot.name}
                          </h3>
                          {spot.arabicName && (
                            <p className="text-xs text-amber-500/80 font-medium">{spot.arabicName}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(spot.id);
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-400 shrink-0 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Region & Distance */}
                      <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {spot.region}
                        </span>
                        {distance && (
                          <span className="text-emerald-400 font-mono text-[11px]">
                            • à {distance} km
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2 mb-2.5">
                        {spot.description}
                      </p>
                    </div>

                    {/* Tags footer */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diff.color}`}>
                          {diff.text}
                        </span>
                        <span className="text-[10px] text-stone-400 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                          {spot.trackType === 'asphalt' ? 'Asphalte' :
                           spot.trackType === 'rocky_track' ? 'Piste caillou' :
                           spot.trackType === 'deep_sand' ? 'Sable/Dunes' :
                           spot.trackType === 'hiking_trail' ? 'Sentier' : 'Piste terre'}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Voir</span>
                        <span>→</span>
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
