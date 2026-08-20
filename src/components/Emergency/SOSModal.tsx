import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Share2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Radio
} from 'lucide-react';

import type { SpotCoordinates } from '../../types/spot';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: SpotCoordinates | null;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  userLocation: initialLocation
}) => {
  const [coords, setCoords] = useState<SpotCoordinates | null>(initialLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      locate();
    }
  }, [isOpen]);

  const locate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('SOS geolocation error:', err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isOpen) return null;

  const latText = coords ? coords.lat.toFixed(6) : '36.806500';
  const lngText = coords ? coords.lng.toFixed(6) : '10.181500';
  const mapsUrl = `https://maps.google.com/?q=${latText},${lngText}`;
  const sosMessage = `🆘 URGENCE BIVOUAC TUNISIE !\nJ'ai besoin de secours immédiats.\nMa position GPS exacte :\nLatitude : ${latText}\nLongitude : ${lngText}\nLien Carte : ${mapsUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const emergencyNumbers = [
    {
      name: "Protection Civile",
      number: "198",
      role: "Urgences Médicales, Incendies, Secours",
      color: "bg-red-600 hover:bg-red-500",
      desc: "À appeler en priorité pour malaise, blessure ou feu de forêt"
    },
    {
      name: "Garde Nationale",
      number: "193",
      role: "Montagnes, Forêts, Pistes & Sahara",
      color: "bg-emerald-700 hover:bg-emerald-600",
      desc: "Compétent pour les zones rurales, sentiers de trek et désert"
    },
    {
      name: "Police Secours",
      number: "197",
      role: "Sécurité Publique & Littoral Urbain",
      color: "bg-blue-700 hover:bg-blue-600",
      desc: "Urgences en zones côtières urbanisées et agglomérations"
    },
    {
      name: "Garde Maritime",
      number: "194",
      role: "Détresse en Mer & Criques Isolées",
      color: "bg-cyan-700 hover:bg-cyan-600",
      desc: "Pour les campeurs en crique isolée ou détresse nautique"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with red emergency pulse */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-red-600/80 rounded-3xl p-6 z-50 text-stone-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight uppercase">
                  SOS Urgence Bivouac
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/40">
                  Tunisie
                </span>
              </div>
              <p className="text-xs text-stone-400">Position GPS & Numéros de Secours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Box */}
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 mb-4 text-center">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Vos Coordonnées GPS Actuelles :
            </span>
            <button 
              onClick={locate} 
              disabled={isLocating}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <Radio className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Actualisation...' : 'Actualiser'}</span>
            </button>
          </div>

          <div className="font-mono text-sm sm:text-xl md:text-2xl font-black text-amber-400 py-1 tracking-wider break-all selection:bg-amber-500 selection:text-stone-950">
            {latText}, {lngText}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-850">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 text-xs font-bold border border-stone-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
              <span>{copied ? 'Copié !' : 'Copier Message SOS'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(sosMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer par WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 1-Click Call Buttons */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1">
            Appel direct des services de secours (Gratuit 24h/7j) :
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className={`p-3 rounded-2xl ${item.color} text-white flex items-center justify-between transition-all shadow-md active:scale-98`}
              >
                <div>
                  <div className="font-black text-sm flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <p className="text-[10px] text-white/80 mt-0.5 line-clamp-1">
                    {item.role}
                  </p>
                </div>
                <span className="font-mono text-xl font-black bg-black/25 px-2.5 py-1 rounded-xl shrink-0">
                  {item.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Vital Outdoor Survival Tips */}
        <div className="bg-amber-950/30 p-3 rounded-2xl border border-amber-800/50 text-[11px] text-amber-200/90 space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Consignes de sécurité en attente des secours :</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-stone-300 pl-1 text-[11px]">
            <li>Donnez immédiatement vos <strong>coordonnées GPS</strong> à l'opérateur.</li>
            <li>Restez à proximité de votre abri / véhicule (ne partez pas seul en marchant).</li>
            <li>En cas de morsure de vipère/scorpion : <strong>ne pas inciser</strong>, rester calme et immobile.</li>
            <li>Allumez une lampe frontale en mode clignotant stroboscopique la nuit.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
