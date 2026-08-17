import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { CampingSpot } from '../../types/spot';
import { X, Calendar, Footprints, Moon, MapPin, Compass, CheckCircle2 } from 'lucide-react';


interface AddLogEntryModalProps {
  spots: CampingSpot[];
}

export const AddLogEntryModal: React.FC<AddLogEntryModalProps> = ({ spots }) => {
  const { isAddLogModalOpen, setIsAddLogModalOpen, addLogEntry } = useAuth();
  
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0]?.id || 'custom');
  const [customSpotName, setCustomSpotName] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [nightsCount, setNightsCount] = useState(1);
  const [kmHiked, setKmHiked] = useState(5);
  const [stepsCount, setStepsCount] = useState(7000);
  const [weatherCondition, setWeatherCondition] = useState('☀️ Ciel étoilé & Beau temps');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isAddLogModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const chosenSpot = spots.find(s => s.id === selectedSpotId);
    const spotName = chosenSpot ? chosenSpot.name : customSpotName.trim() || 'Bivouac Sauvage';
    const spotRegion = chosenSpot ? chosenSpot.region : 'Tunisie';

    try {
      await addLogEntry({
        spotId: selectedSpotId,
        spotName,
        spotRegion,
        checkInDate,
        nightsCount,
        kmHiked,
        stepsCount,
        weatherCondition,
        notes,
        rating
      });
      setNotes('');
    } catch (err) {
      console.error('Error logging adventure', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAddLogModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl p-6 z-50 text-stone-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">
                Enregistrer un Bivouac / Rando
              </h2>
              <p className="text-xs text-stone-400">
                Ajoutez vos nuits passées, vos pas et kilomètres à votre profil
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddLogModalOpen(false)}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Spot Choice */}
          <div>
            <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Lieu / Spot de Camping</span>
            </label>
            <select
              value={selectedSpotId}
              onChange={(e) => setSelectedSpotId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
            >
              {spots.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
              ))}
              <option value="custom">Autre lieu secret...</option>
            </select>
          </div>

          {selectedSpotId === 'custom' && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Nom du lieu secret</label>
              <input
                type="text"
                required
                placeholder="Ex: Crique isolée Ghar El Melh"
                value={customSpotName}
                onChange={(e) => setCustomSpotName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
              />
            </div>
          )}

          {/* Date & Nights */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Date de la sortie</span>
              </label>
              <input
                type="date"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Nombre de nuits</span>
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={nightsCount}
                onChange={(e) => setNightsCount(parseInt(e.target.value) || 1)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
              />
            </div>
          </div>

          {/* Steps & Kilometers */}
          <div className="grid grid-cols-2 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800">
            <div>
              <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nombre de pas marchés</span>
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={stepsCount}
                onChange={(e) => setStepsCount(parseInt(e.target.value) || 0)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100"
              />
              <span className="text-[10px] text-stone-400">Ex: 10 000 pas ~ 7 km</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Kilomètres parcourus</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={kmHiked}
                onChange={(e) => setKmHiked(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100"
              />
              <span className="text-[10px] text-stone-400">Pédestre ou piste 4x4</span>
            </div>
          </div>

          {/* Weather condition & Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Météo constatée</label>
              <select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              >
                <option value="☀️ Ciel dégagé & Étoilé">☀️ Ciel dégagé & Étoilé</option>
                <option value="🌤️ Beau temps doux">🌤️ Beau temps doux</option>
                <option value="💨 Vent frais">💨 Vent frais</option>
                <option value="🌧️ Pluie / Averses">🌧️ Pluie / Averses</option>
                <option value="🌫️ Brume matinale">🌫️ Brume matinale</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Note de l'expérience</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (Inoubliable)</option>
                <option value={4}>⭐⭐⭐⭐ (Très bien)</option>
                <option value={3}>⭐⭐⭐ (Correct)</option>
                <option value={2}>⭐⭐ (Difficile)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-stone-300 mb-1">Notes & Souvenirs d'aventure</label>
            <textarea
              rows={2}
              placeholder="Feu de bois, rencontre avec bergers, état du terrain, coucher de soleil..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enregistrer dans mon carnet de bivouac</span>
          </button>
        </form>

      </div>
    </div>
  );
};
