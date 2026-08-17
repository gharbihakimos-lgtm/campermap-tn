import React, { useState, useEffect } from 'react';
import { 
  X, 
  Compass, 
  MapPin, 
  CloudSun, 
  WifiOff, 
  ChevronRight, 
  ShieldCheck
} from 'lucide-react';


interface WelcomeTourModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({ 
  isOpen: forcedIsOpen, 
  onClose: forcedOnClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forcedIsOpen !== undefined) {
      setIsOpen(forcedIsOpen);
    } else {
      const hasSeenTour = localStorage.getItem('campermap_has_seen_tour');
      if (!hasSeenTour) {
        setIsOpen(true);
      }
    }
  }, [forcedIsOpen]);

  const handleClose = () => {
    localStorage.setItem('campermap_has_seen_tour', 'true');
    setIsOpen(false);
    if (forcedOnClose) forcedOnClose();
  };

  const steps = [
    {
      title: "Bienvenue sur CamperMap TN 🇹🇳",
      subtitle: "La première carte interactive du bivouac et camping sauvage en Tunisie",
      icon: Compass,
      color: "from-emerald-500 to-amber-500",
      content: (
        <div className="space-y-3 text-xs text-stone-300">
          <p>
            Que vous soyez randonneur à pied 🥾, aventurier en 4x4 🚜, motard trail 🏍️ ou voyageur en van / camping-car 🚐, découvrez les plus beaux trésors naturels de Tunisie avec toutes les indications techniques fiables.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
              <span className="text-lg">🌲</span>
              <span className="font-semibold text-stone-200">Forêts du Nord</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
              <span className="text-lg">🏖️</span>
              <span className="font-semibold text-stone-200">Criques Vierge</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
              <span className="text-lg">🏔️</span>
              <span className="font-semibold text-stone-200">Dorsale & Sommets</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2">
              <span className="text-lg">🏜️</span>
              <span className="font-semibold text-stone-200">Sahara & Grand Erg</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Filtres Précis & Activités sur Place 🎯",
      subtitle: "Trouvez le spot idéal selon votre véhicule et vos envies",
      icon: MapPin,
      color: "from-amber-500 to-orange-500",
      content: (
        <div className="space-y-3 text-xs text-stone-300">
          <ul className="space-y-2">
            <li className="flex items-start gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <span className="text-emerald-400 font-bold">1.</span>
              <span><strong>Filtrez par accès :</strong> à pied, voiture classique, SUV ou 4x4 franchissement.</span>
            </li>
            <li className="flex items-start gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <span className="text-cyan-400 font-bold">2.</span>
              <span><strong>Ressources vitales :</strong> repérez les sources d'eau potable, l'ombre et la couverture réseau 4G.</span>
            </li>
            <li className="flex items-start gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <span className="text-amber-400 font-bold">3.</span>
              <span><strong>Activités :</strong> baignade, escalade, VTT, ciel étoilé, kayak, observation des cerfs de Barbarie.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Météo Live & Mode 100% Hors-Ligne 📱",
      subtitle: "Préparez votre sortie en toute sécurité, même sans réseau",
      icon: WifiOff,
      color: "from-blue-500 to-indigo-500",
      content: (
        <div className="space-y-3 text-xs text-stone-300">
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-start gap-2.5">
            <CloudSun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 mb-0.5">Météo en direct & Alerte Vent Fort</div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Chaque fiche de spot affiche la température, le vent et les alertes de rafales pour éviter d'implanter sa tente sur une crête dangereuse.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 mb-0.5">PWA & Navigation sans 4G</div>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Les cartes et données sont mises en cache automatique sur votre téléphone. Vous pouvez télécharger la trace GPX ou ouvrir le point GPS directement dans Google Maps, Waze ou OsmAnd.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-6 z-50 text-stone-100 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top bar with Step dots & Close */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === step ? 'w-7 bg-amber-500' : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Icon & Titles */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentStep.color} flex items-center justify-center text-stone-950 font-bold shadow-lg shrink-0`}>
            <Icon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-stone-100 leading-tight">
              {currentStep.title}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-2 flex-1">
          {currentStep.content}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-4 border-t border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-semibold text-stone-400 hover:text-stone-200"
          >
            Passer le guide
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="py-2 px-3 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-all"
              >
                Précédent
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Commencer l'exploration 🏕️</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
