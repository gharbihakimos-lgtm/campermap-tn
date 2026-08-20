import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tent, 
  Droplet, 
  Zap, 
  HeartPulse, 
  Truck, 
  Trees 
} from 'lucide-react';


interface ChecklistItem {
  id: string;
  category: 'shelter' | 'food_water' | 'energy_tools' | 'health_safety' | 'offroad_desert' | 'eco';
  title: string;
  desc?: string;
  checked: boolean;
  requiredFor?: ('all' | 'hiking' | '4x4')[];
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // Abri & Sommeil
  { id: '1', category: 'shelter', title: 'Tente double-toit résistante au vent', desc: 'Arceaux alu et haubans solides', checked: false },
  { id: '2', category: 'shelter', title: 'Sac de couchage adapté à la saison', desc: 'Température confort 0°C à 10°C selon région', checked: false },
  { id: '3', category: 'shelter', title: 'Matelas autogonflant ou mousse isolante', desc: 'Isolation thermique contre le sol froid', checked: false },
  { id: '4', category: 'shelter', title: 'Bâche de sol (Footprint)', desc: 'Protège contre l\'humidité et les épines', checked: false },
  { id: '5', category: 'shelter', title: 'Piquets spéciaux sable/roche', desc: 'Indispensables pour le Sahara ou les criques', checked: false },

  // Eau & Alimentation
  { id: '6', category: 'food_water', title: 'Réserve d’eau : 4 à 5 Litres / personne / jour', desc: 'Règle vitale en Tunisie surtout l\'été et désert', checked: false },
  { id: '7', category: 'food_water', title: 'Gourde filtrante ou pastilles Micropur', desc: 'Pour purifier l\'eau des sources et oueds', checked: false },
  { id: '8', category: 'food_water', title: 'Réchaud à gaz homologué + recharge', desc: 'Interdiction absolue de feux au sol en été', checked: false },
  { id: '9', category: 'food_water', title: 'Briquet tempête & allumettes étanches', desc: 'Dans un sac hermétique ziploc', checked: false },
  { id: '10', category: 'food_water', title: 'Nourriture riche & snacks (Dattes, fruits secs)', desc: 'Dattes de Tozeur, noix, barres énergétiques', checked: false },

  // Énergie & Outils
  { id: '11', category: 'energy_tools', title: 'Lampe frontale + piles de rechange', desc: 'Indispensable pour monter le camp de nuit', checked: false },
  { id: '12', category: 'energy_tools', title: 'Batterie externe Powerbank (10 000+ mAh)', desc: 'Pour garder votre smartphone chargé pour le GPS', checked: false },
  { id: '13', category: 'energy_tools', title: 'Couteau suisse multifonction / Pince', desc: 'Opérations de dépannage et cuisine', checked: false },
  { id: '14', category: 'energy_tools', title: 'Cordelette parachute (Paracord 10m)', desc: 'Pour haubanage et étendoir', checked: false },

  // Santé & Sécurité
  { id: '15', category: 'health_safety', title: 'Trousse de premiers secours complète', desc: 'Compresses, antiseptique, bandes, pansements', checked: false },
  { id: '16', category: 'health_safety', title: 'Pince à tiques & sérum physiologique', desc: 'Pour les zones forestières de Kroumirie', checked: false },
  { id: '17', category: 'health_safety', title: 'Crème solaire indice 50+ & lunettes UV', desc: 'Protection réverbération mer et désert', checked: false },
  { id: '18', category: 'health_safety', title: 'Couverture de survie & sifflet de détresse', desc: 'Équipement obligatoire de fond de sac', checked: false },

  // Tout-terrain & 4x4 Sahara
  { id: '19', category: 'offroad_desert', title: 'Plaques de désensablage (Sand Tracks)', desc: 'Pour franchissement des dunes du Sud', checked: false },
  { id: '20', category: 'offroad_desert', title: 'Compresseur d’air 12V + Manomètre', desc: 'Dégonfler à 1.0 bar dans le sable et regonfler sur goudron', checked: false },
  { id: '21', category: 'offroad_desert', title: 'Sangle de traction kinétique + manilles', desc: 'Pour treuillage et sauvetage entre véhicules', checked: false },
  { id: '22', category: 'offroad_desert', title: 'Pelle pliable tout-terrain', desc: 'Dégager les roues et aménager le camp', checked: false },

  // Leave No Trace
  { id: '23', category: 'eco', title: 'Sacs poubelle renforcés (Zéro déchet)', desc: 'On repart avec TOUS ses déchets sans exception', checked: false },
  { id: '24', category: 'eco', title: 'Petite truelle pour trou de chat', desc: 'Besoins naturels enterrés à 20cm et à 50m des points d\'eau', checked: false },
  { id: '25', category: 'eco', title: 'Savon noir ou biodégradable sans parfum', desc: 'Pour vaisselle et toilette respectueuse', checked: false }
];

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('campermap_checklist_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Checklist parse error', e);
      }
    }
    return DEFAULT_CHECKLIST;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('campermap_checklist_items', JSON.stringify(items));
  }, [items]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleReset = () => {
    if (confirm('Réinitialiser toutes les cases de votre checklist ?')) {
      setItems(DEFAULT_CHECKLIST);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom_${Date.now()}`,
      category: 'shelter',
      title: newItemTitle.trim(),
      checked: true
    };
    setItems(prev => [newItem, ...prev]);
    setNewItemTitle('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  const categories = [
    { id: 'all', label: 'Tous', icon: Sparkles },
    { id: 'shelter', label: 'Abri & Sommeil', icon: Tent },
    { id: 'food_water', label: 'Eau & Miam', icon: Droplet },
    { id: 'energy_tools', label: 'Énergie & Outils', icon: Zap },
    { id: 'health_safety', label: 'Pharmacie SOS', icon: HeartPulse },

    { id: 'offroad_desert', label: '4x4 & Sahara', icon: Truck },
    { id: 'eco', label: 'Leave No Trace', icon: Trees }
  ];

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-700 rounded-3xl p-6 z-50 text-stone-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-lg">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Checklist Matériel de Bivouac 🎒
              </h2>
              <p className="text-xs text-stone-400">Ne rien oublier avant de partir à l'aventure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Gauge */}
        <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 mb-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-300">Préparation de votre équipement :</span>
            <span className="font-black text-amber-400">{checkedCount} / {items.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Ajouter un équipement personnel (ex: Drone, Hamac, Canne à pêche...)"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[16px] sm:text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </form>

        {/* Items List */}
        <div className="space-y-1.5 overflow-y-auto flex-1 max-h-72 pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                item.checked 
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-stone-200' 
                  : 'bg-stone-950/70 border-stone-800/80 text-stone-300 hover:border-stone-700'
              }`}
            >
              <button type="button" className="shrink-0 mt-0.5 text-emerald-400">
                {item.checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-stone-500" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold ${item.checked ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                  {item.title}
                </div>
                {item.desc && (
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {item.desc}
                  </p>
                )}
              </div>
              {item.id.startsWith('custom_') && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1 rounded-lg text-stone-500 hover:text-red-400 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser la liste</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-600/30"
          >
            Prêt à camper ! 🏕️
          </button>
        </div>

      </div>
    </div>
  );
};
