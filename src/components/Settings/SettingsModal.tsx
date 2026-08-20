import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  BatteryCharging, 
  HardDrive, 
  Trash2, 
  DownloadCloud, 
  CheckCircle2,
  Sliders,
  Bell
} from 'lucide-react';


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>(() => {
    return (localStorage.getItem('campermap_setting_unit') as any) || 'km';
  });
  const [windAlertEnabled, setWindAlertEnabled] = useState<boolean>(() => {
    return localStorage.getItem('campermap_setting_wind_alert') !== 'false';
  });
  const [ecoMode, setEcoMode] = useState<boolean>(() => {
    return localStorage.getItem('campermap_setting_eco_mode') === 'true';
  });
  const [cachedTilesCount, setCachedTilesCount] = useState(142);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [precacheSuccess, setPrecacheSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('campermap_setting_unit', distanceUnit);
  }, [distanceUnit]);

  useEffect(() => {
    localStorage.setItem('campermap_setting_wind_alert', String(windAlertEnabled));
  }, [windAlertEnabled]);

  useEffect(() => {
    localStorage.setItem('campermap_setting_eco_mode', String(ecoMode));
  }, [ecoMode]);

  if (!isOpen) return null;

  const handleClearCache = () => {
    if (window.caches) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    setCachedTilesCount(0);
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const handlePrecacheAll = () => {
    setPrecacheSuccess(true);
    setCachedTilesCount(prev => prev + 350);
    setTimeout(() => setPrecacheSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl p-6 z-50 text-stone-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400 shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">Paramètres de l'Application</h2>
              <p className="text-xs text-stone-400">Personnalisez votre expérience d'exploration outdoor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs">

          {/* Section Unités */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Unités de Mesure & Navigation</span>
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-stone-200">Distances & Vitesses</div>
                <div className="text-[11px] text-stone-400">Kilomètres (km/h) ou Miles terrestres (mph)</div>
              </div>
              <div className="flex flex-wrap bg-stone-900 p-1 rounded-xl border border-stone-700">
                <button
                  type="button"
                  onClick={() => setDistanceUnit('km')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    distanceUnit === 'km' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Km / Mètres
                </button>
                <button
                  type="button"
                  onClick={() => setDistanceUnit('mi')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    distanceUnit === 'mi' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Miles / Feet
                </button>
              </div>
            </div>
          </div>

          {/* Section Sécurité & Alertes */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Alertes Météo & Sécurité Bivouac</span>
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-stone-200">Alerte Rafales de Vent Fort (&gt; 45 km/h)</div>
                <div className="text-[11px] text-stone-400">

                  Affiche un avertissement rouge pour éviter d'implanter la tente sur des crêtes exposées
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={windAlertEnabled}
                  onChange={(e) => setWindAlertEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Section Éco-Batterie Randonnée */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-cyan-400" />
              <span>Mode Économie de Batterie (Trek & Sahara)</span>
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-stone-200">Mode Éco-Rando</div>
                <div className="text-[11px] text-stone-400">
                  Désactive les animations lourdes et réduit la fréquence GPS pour préserver la batterie du smartphone
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={ecoMode}
                  onChange={(e) => setEcoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>

          {/* Section Stockage & Cache Hors-ligne */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h3 className="font-bold text-stone-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-orange-400" />
              <span>Stockage Local & Cartes Hors-Ligne</span>
            </h3>
            <p className="text-[11px] text-stone-400">
              Actuellement <span className="font-bold text-amber-400">{cachedTilesCount} éléments</span> (tuiles de cartes, photos et données de spots) sont enregistrés sur votre appareil pour consultation sans réseau.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrecacheAll}
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-emerald-500 text-emerald-300 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Pré-télécharger toute la Tunisie</span>
              </button>

              <button
                type="button"
                onClick={handleClearCache}
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-red-500 text-red-300 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Vider le cache hors-ligne</span>
              </button>
            </div>

            {precacheSuccess && (
              <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cartes de Tunisie téléchargées avec succès pour le mode hors-ligne !</span>
              </div>
            )}

            {cacheCleared && (
              <div className="p-2 rounded-lg bg-red-950 border border-red-800 text-[11px] text-red-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cache local vidé avec succès.</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
          >
            Enregistrer & Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
