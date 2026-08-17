import React from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Flame, 
  Trash2, 
  Droplets, 
  SunMedium, 
  FileCheck
} from 'lucide-react';


interface SafetyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-2xl max-h-[90vh] overflow-y-auto z-50 flex flex-col shadow-2xl text-stone-100 p-5 md:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-stone-100">
                Guide de Sécurité & Bivouac en Tunisie
              </h2>
              <p className="text-xs text-stone-400">
                Numéros d'urgence, réglementation locale et éthique Sans Trace
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

        <div className="space-y-6 text-xs md:text-sm">
          
          {/* Emergency Numbers Banner */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              Numéros d'Urgence en Tunisie (Appel gratuit)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href="tel:198"
                className="bg-red-950/70 border border-red-800/80 p-3 rounded-xl text-center hover:bg-red-900/80 transition-all group"
              >
                <div className="text-red-400 text-xs font-semibold">Protection Civile</div>
                <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">198</div>
                <div className="text-[10px] text-red-300">Secours & Incendie</div>
              </a>

              <a
                href="tel:193"
                className="bg-emerald-950/70 border border-emerald-800/80 p-3 rounded-xl text-center hover:bg-emerald-900/80 transition-all group"
              >
                <div className="text-emerald-400 text-xs font-semibold">Garde Nationale</div>
                <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">193</div>
                <div className="text-[10px] text-emerald-300">Zones rurales & Pistes</div>
              </a>

              <a
                href="tel:197"
                className="bg-blue-950/70 border border-blue-800/80 p-3 rounded-xl text-center hover:bg-blue-900/80 transition-all group"
              >
                <div className="text-blue-400 text-xs font-semibold">Police Secours</div>
                <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">197</div>
                <div className="text-[10px] text-blue-300">Villes & Agglomérations</div>
              </a>

              <a
                href="tel:194"
                className="bg-sky-950/70 border border-sky-800/80 p-3 rounded-xl text-center hover:bg-sky-900/80 transition-all group"
              >
                <div className="text-sky-400 text-xs font-semibold">Garde Maritime</div>
                <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">194</div>
                <div className="text-[10px] text-sky-300">Secours en mer / Côtes</div>
              </a>
            </div>
          </div>

          {/* Golden Rules */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Les 5 Règles d'Or du Bivouac Sauvage en Tunisie
            </h3>

            {/* Rule 1 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs md:text-sm">
                  1. Éthique "Sans Trace" (Leave No Trace)
                </h4>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                  Emportez 100% de vos déchets avec vous dans des sacs poubelles étanches. Ne laissez aucun papier toilette, lingette ou déchet organique sur les spots sauvages.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs md:text-sm">
                  2. Zéro Feu de Camp au Sol en Forêt (Mai à Octobre)
                </h4>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                  Le risque d'incendie de forêt en Kroumirie et Mogods est extrêmement élevé en été. Utilisez exclusivement un réchaud à gaz sécurisé et éteignez soigneusement toute braise.
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs md:text-sm">
                  3. Signalement de Courtoisie (Garde Nationale & Gardes Forestiers)
                </h4>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                  En Tunisie, passer saluer le poste de la Garde Nationale ou les gardes forestiers les plus proches est une excellente habitude. Ils vous indiqueront l'état des pistes et veilleront sur votre tranquillité.
                </p>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <SunMedium className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs md:text-sm">
                  4. Préparation Expédition Désert & Grand Erg (Sud)
                </h4>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                  Ne partez jamais seul dans le sable profond (minimum 2 véhicules 4x4 avec treuil, plaques, compresseur et sangles). Prévoyez 5 litres d'eau potable par jour et par personne + navigation GPS autonome (traces offline).
                </p>
              </div>
            </div>

            {/* Rule 5 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-xs md:text-sm">
                  5. Sources d'eau & Purification
                </h4>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                  Bien que les sources indiquées sur CamperMap soient réputées potables, emportez toujours un filtre à eau (type Sawyer/Katadyn) ou des pastilles de purification (Micropur) par précaution.
                </p>
              </div>
            </div>

          </div>

          {/* Close Action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold rounded-xl border border-stone-700 transition-all"
            >
              J'ai compris, fermer le guide
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
