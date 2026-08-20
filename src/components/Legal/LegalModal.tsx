import React, { useState } from 'react';
import { X, FileText, ShieldAlert, Lock, Scale, Trees, Flame, Building2 } from 'lucide-react';



type LegalTab = 'mentions' | 'charter' | 'cgu' | 'disclaimer' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 'charter' 
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab as LegalTab);

  if (!isOpen) return null;

  const tabs: { id: LegalTab; label: string; icon: React.ElementType }[] = [
    { id: 'mentions', label: 'Mentions Légales', icon: Building2 },
    { id: 'charter', label: 'Charte Bivouac', icon: Trees },
    { id: 'cgu', label: 'CGU', icon: FileText },
    { id: 'disclaimer', label: 'Responsabilité', icon: ShieldAlert },
    { id: 'privacy', label: 'Confidentialité', icon: Lock },
  ];

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
            className="p-2.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-stone-800 overflow-x-auto no-scrollbar shrink-0 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-stone-300 leading-relaxed pr-1">

          {/* TAB: Mentions Légales (obligatoire LCEN / loi tunisienne) */}
          {activeTab === 'mentions' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-stone-100">Mentions Légales</h3>
              
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">Éditeur de l'application</h4>
                <ul className="space-y-1">
                  <li><strong>Nom :</strong> CamperMap TN</li>
                  <li><strong>Type :</strong> Application web communautaire — cartographie outdoor</li>
                  <li><strong>Responsable de la publication :</strong> Gharbi Hakim</li>
                  <li><strong>Contact :</strong> contact@campermap.tn</li>
                  <li><strong>Pays :</strong> Tunisie 🇹🇳</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">Hébergement</h4>
                <ul className="space-y-1">
                  <li><strong>Hébergeur :</strong> Render Inc.</li>
                  <li><strong>Adresse :</strong> 525 Brannan St, Suite 300, San Francisco, CA 94107, USA</li>
                  <li><strong>Site :</strong> <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">render.com</a></li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">Propriété Intellectuelle</h4>
                <p>
                  L'ensemble du contenu de CamperMap TN (textes, illustrations, code source, données cartographiques, traces GPS) est protégé par le droit d'auteur tunisien (Loi n° 94-36 du 24 février 1994) et les conventions internationales applicables. Toute reproduction ou utilisation commerciale sans autorisation préalable écrite est interdite.
                </p>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">Données Cartographiques</h4>
                <ul className="space-y-1">
                  <li><strong>Fond de carte :</strong> © OpenStreetMap contributors — Licence ODbL</li>
                  <li><strong>Tuiles :</strong> © CartoDB / CARTO — CC BY 3.0</li>
                  <li><strong>Icônes :</strong> Lucide Icons — ISC License</li>
                  <li><strong>Données météo :</strong> Open-Meteo API — CC BY 4.0</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">Cookies & Stockage Local</h4>
                <p>
                  CamperMap TN utilise le stockage local du navigateur (localStorage) pour sauvegarder vos préférences, favoris et checklist. <strong>Aucun cookie de pistage publicitaire</strong> n'est utilisé. Aucun service d'analyse tiers (Google Analytics, Facebook Pixel) n'est installé.
                </p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>localStorage :</strong> Préférences, langue, favoris, checklist, token d'authentification</li>
                  <li>• <strong>Service Worker (PWA) :</strong> Cache des cartes et données pour une utilisation hors-ligne</li>
                  <li>• <strong>Géolocalisation :</strong> Utilisée exclusivement en local (navigateur), jamais transmise à un serveur tiers</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB: Charte Éthique & Réglementation Bivouac Tunisie */}
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

          {/* TAB: CGU */}
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
              <p>
                <strong>Article 5 — Contenu Utilisateur :</strong> En publiant un spot, un avis ou une photo, l'utilisateur accorde à CamperMap TN une licence non-exclusive, gratuite et mondiale d'utilisation de ce contenu dans le cadre du service. L'utilisateur peut retirer son contenu à tout moment.
              </p>
              <p>
                <strong>Article 6 — Modération :</strong> L'éditeur se réserve le droit de supprimer tout contenu inapproprié, inexact ou contraire aux bonnes mœurs sans préavis ni indemnité.
              </p>
              <p>
                <strong>Article 7 — Loi Applicable :</strong> Les présentes CGU sont régies par le droit tunisien. Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des juridictions tunisiennes.
              </p>
            </div>
          )}

          {/* TAB: Disclaimer / Responsabilité */}
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
                <p>
                  • <strong>Données communautaires :</strong> Les informations publiées par les membres de la communauté ne sont pas vérifiées par l'éditeur. L'utilisateur doit toujours croiser les sources et évaluer les conditions sur place avant de s'engager.
                </p>
                <p>
                  • <strong>Connexion réseau :</strong> L'application fonctionne en mode hors-ligne via le cache PWA, mais certaines fonctionnalités (météo, synchronisation) requièrent une connexion internet. L'éditeur ne garantit pas la disponibilité permanente du service.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Confidentialité & Données — Conformité RGPD / INPDP */}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-stone-100">Politique de Confidentialité & Protection des Données Personnelles</h3>
              
              <div className="bg-indigo-950/30 border border-indigo-800/60 p-3.5 rounded-xl">
                <p className="text-[11px] text-indigo-200/90">
                  Conformément à la loi tunisienne n° 2004-63 du 27 juillet 2004 portant sur la protection des données à caractère personnel, au Règlement Général sur la Protection des Données (RGPD - UE 2016/679), et aux recommandations de l'Instance Nationale de Protection des Données Personnelles (INPDP).
                </p>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">1. Responsable du traitement</h4>
                <p>
                  Gharbi Hakim — CamperMap TN<br />
                  Contact : contact@campermap.tn
                </p>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">2. Données collectées</h4>
                <ul className="space-y-1 list-disc pl-4">
                  <li><strong>Compte utilisateur :</strong> Nom, adresse email, mot de passe hashé (bcrypt), avatar</li>
                  <li><strong>Activité :</strong> Spots ajoutés, avis publiés, statistiques (pas, km, nuits)</li>
                  <li><strong>Géolocalisation :</strong> Coordonnées GPS (en temps réel, traitées uniquement localement dans le navigateur, jamais stockées sur serveur)</li>
                  <li><strong>Préférences :</strong> Langue, favoris, paramètres d'affichage (stockés en localStorage)</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">3. Base légale du traitement</h4>
                <ul className="space-y-1 list-disc pl-4">
                  <li><strong>Consentement :</strong> Création volontaire du compte et acceptation des CGU</li>
                  <li><strong>Intérêt légitime :</strong> Amélioration du service et sécurité des utilisateurs</li>
                  <li><strong>Obligation légale :</strong> Conservation des données de connexion (loi tunisienne)</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">4. Durée de conservation</h4>
                <ul className="space-y-1 list-disc pl-4">
                  <li><strong>Compte actif :</strong> Données conservées pendant la durée d'utilisation du service</li>
                  <li><strong>Compte supprimé :</strong> Données effacées sous 30 jours après la demande de suppression</li>
                  <li><strong>Données de connexion :</strong> Conservées 12 mois maximum (obligation légale)</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">5. Vos droits</h4>
                <p className="mb-2">Conformément à la loi, vous disposez des droits suivants :</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de toutes vos données personnelles</li>
                  <li><strong>Droit de rectification :</strong> Corriger des données inexactes ou incomplètes</li>
                  <li><strong>Droit de suppression :</strong> Demander l'effacement complet de votre compte et données</li>
                  <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré (JSON)</li>
                  <li><strong>Droit d'opposition :</strong> S'opposer au traitement de vos données</li>
                </ul>
                <p className="mt-2 text-stone-400">
                  Pour exercer ces droits, contactez : <strong className="text-amber-400">contact@campermap.tn</strong>
                </p>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">6. Transferts de données</h4>
                <p>
                  Les données sont hébergées sur des serveurs Render Inc. (USA). Ce transfert est encadré par les clauses contractuelles types (CCT) conformément aux exigences du RGPD. Aucune donnée n'est vendue, louée ou partagée avec des tiers à des fins publicitaires.
                </p>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">7. Sécurité</h4>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Mots de passe hashés avec bcrypt (jamais stockés en clair)</li>
                  <li>Authentification par token JWT avec expiration</li>
                  <li>Connexions HTTPS chiffrées (TLS 1.3)</li>
                  <li>Aucun cookie de pistage publicitaire</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <h4 className="font-bold text-stone-100 text-xs mb-1">8. Réclamation</h4>
                <p>
                  En cas de litige, vous pouvez adresser une réclamation auprès de l'<strong>Instance Nationale de Protection des Données Personnelles (INPDP)</strong> — <a href="http://www.inpdp.nat.tn" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">www.inpdp.nat.tn</a>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-800 flex justify-between items-center shrink-0">
          <div className="text-[11px] text-stone-400 font-mono">
            CamperMap TN • v1.0.0 • © 2024-2026
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all min-h-[44px]"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
