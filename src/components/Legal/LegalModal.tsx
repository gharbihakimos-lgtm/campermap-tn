import React, { useState } from 'react';
import { X, FileText, ShieldAlert, Lock, Scale, Trees, Flame } from 'lucide-react';


interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'cgu' | 'charter' | 'privacy' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 'charter' 
}) => {
  const [activeTab, setActiveTab] = useState<'cgu' | 'charter' | 'privacy' | 'disclaimer'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-700 rounded-2xl p-5 md:p-6 z-50 text-stone-100 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400 shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">Documents Légaux & Réglementation</h2>
              <p className="text-xs text-stone-400">Règles du bivouac, cadre juridique en Tunisie & charte éthique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-stone-800 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('charter')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'charter'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>Charte du Bivouac en Tunisie</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cgu')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'cgu'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Conditions Générales (CGU)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Responsabilité Outdoor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Confidentialité & Données</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-stone-300 leading-relaxed pr-1">

          {/* TAB 1: Charte Éthique & Réglementation Bivouac Tunisie */}
          {activeTab === 'charter' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-xl">
                <h3 className="font-bold text-sm text-emerald-300 mb-1 flex items-center gap-2">
                  <Trees className="w-4 h-4" />
                  Réglementation et Principes du Bivouac Sauvage en Tunisie
                </h3>
                <p className="text-[11px] text-emerald-200/90">
                  Le bivouac (installation d'une tente légère du coucher au lever du soleil) est toléré dans la plupart des espaces naturels tunisiens sous réserve du strict respect de la sécurité publique et de l'environnement.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  <h4 className="font-bold text-stone-100 text-xs mb-1">1. Obligation de Signalement & Sécurité</h4>
                  <p>
                    Par mesure de sécurité pour votre groupe, il est fortement conseillé de vous présenter au poste de la <strong>Garde Nationale (193)</strong> le plus proche du secteur ou aux gardes forestiers de la <strong>DGF (Direction Générale des Forêts)</strong> avant d'installer votre campement.
                  </p>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  <h4 className="font-bold text-stone-100 text-xs mb-1">2. Parcs Nationaux & Réserves Naturelles</h4>
                  <p>
                    Dans les Parcs Nationaux (El Feidja, Djebel Chambi, Bouhedma, Djebel Serj, Ichkeul), le camping sauvage sans guide ou sans autorisation préalable de l'administration des forêts est interdit pour préserver les espèces menacées (Cerf de Barbarie, Gazelle dorcas).
                  </p>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  <h4 className="font-bold text-stone-100 text-xs mb-1">3. Zones Frontalières et Grand Sud Saharien</h4>
                  <p>
                    Pour les expéditions profondes au-delà de Ksar Ghilane et Tembaine dans la zone militaire tampon, une déclaration auprès des autorités militaires de Tataouine ou Remada ainsi qu'un guide local agréé sont requis.
                  </p>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  <h4 className="font-bold text-stone-100 text-xs mb-1 flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    4. Prévention des Feux de Forêt
                  </h4>
                  <p>
                    Feux au sol formellement interdits en période estivale (1er mai au 31 octobre). Privilégiez impérativement les réchauds à gaz fermés. Éteignez toujours totalement les braises avec de l'eau et du sable avant de quitter les lieux.
                  </p>
                </div>

                <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  <h4 className="font-bold text-stone-100 text-xs mb-1">5. Éthique Sans Trace (Leave No Trace)</h4>
                  <p>
                    Emportez l'intégralité de vos déchets (plastiques, boîtes, lingettes) jusqu'au village le plus proche. Ne laissez aucune trace de votre passage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CGU */}
          {activeTab === 'cgu' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-stone-100">Conditions Générales d'Utilisation de CamperMap TN</h3>
              <p>
                <strong>Article 1 — Objet :</strong> La plateforme CamperMap TN fournit un service interactif de cartographie communautaire, d'itinéraires et d'informations météorologiques pour les amateurs de randonnée, camping et 4x4 en Tunisie.
              </p>
              <p>
                <strong>Article 2 — Compte Utilisateur :</strong> L'utilisateur est responsable de la confidentialité de ses identifiants. Il s'engage à ne publier que des informations véridiques lors de l'ajout de nouveaux spots ou de commentaires.
              </p>
              <p>
                <strong>Article 3 — Propriété Intellectuelle :</strong> Les traces GPX, descriptions et photos partagées par la communauté demeurent protégées. Leur reproduction à des fins commerciales sans accord écrit préalable est interdite.
              </p>
              <p>
                <strong>Article 4 — Données Fournies :</strong> Les estimations d'altimétrie, de temps de marche et de praticabilité des pistes sont données à titre indicatif et peuvent évoluer avec les intempéries (crues d'oueds, ensablement).
              </p>
            </div>
          )}

          {/* TAB 3: Disclaimer / Responsabilité */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <div className="bg-amber-950/40 border border-amber-800/80 p-4 rounded-xl">
                <h3 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Avertissement de Responsabilité Outdoor & Tout-Terrain
                </h3>
                <p className="text-[11px] text-amber-200/90">
                  Les activités de plein air, le bivouac sauvage, la randonnée de haute montagne et les raids 4x4 comportent des risques inhérents liés à l'environnement naturel.
                </p>
              </div>

              <div className="space-y-2.5">
                <p>
                  • <strong>Évolution du terrain :</strong> Une piste répertoriée comme facile peut devenir infranchissable après un violent orage d'automne ou une tempête de sable dans le Sahara.
                </p>
                <p>
                  • <strong>Autonomie :</strong> L'utilisateur est seul responsable de sa préparation matérielle (réserve d'eau, carburant, compresseur, pharmacie de secours, protection thermique).
                </p>
                <p>
                  • <strong>Limitation de responsabilité :</strong> L'éditeur de CamperMap TN et les contributeurs communautaires ne peuvent être tenus responsables d'accidents, de pannes mécaniques, d'amendes administratives ou de blessures survenus lors de l'utilisation de l'application.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Confidentialité */}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-stone-100">Politique de Confidentialité & Données Personnelles</h3>
              <p>
                Conformément aux normes de protection de la vie privée et à la législation tunisienne (Instance Nationale de Protection des Données Personnelles - INPDP) :
              </p>
              <ul className="space-y-2 list-disc pl-4">
                <li>
                  <strong>Données collectées :</strong> Adresse email, nom d'utilisateur, statistiques d'activité (nombre de pas, kilomètres, nuits) et avis déposés.
                </li>
                <li>
                  <strong>Géolocalisation :</strong> Vos coordonnées GPS en temps réel ne sont utilisées que localement sur votre navigateur pour vous positionner sur la carte et ne sont jamais revendues ni stockées sur nos serveurs.
                </li>
                <li>
                  <strong>Suppression :</strong> Vous disposez d'un droit total d'accès, de modification et de suppression définitive de votre compte et de vos données sur simple demande.
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 flex justify-between items-center shrink-0">
          <div className="text-[11px] text-stone-400 font-mono">
            CamperMap TN • Version 2.2.0 (2026)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
