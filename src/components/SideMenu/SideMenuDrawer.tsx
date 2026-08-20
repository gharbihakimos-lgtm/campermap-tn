import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  User, 
  Settings, 
  FileText, 
  ShieldAlert, 
  Compass, 
  Route, 
  PlusCircle, 
  LogOut, 
  BookOpen, 
  Award, 
  Trees, 
  ChevronRight,
  UserCheck,
  HelpCircle
} from 'lucide-react';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenLegal: (tab?: 'cgu' | 'charter' | 'privacy' | 'disclaimer') => void;
  onOpenSafety: () => void;
  onOpenRoutePlanner: () => void;
  onOpenAddSpot: () => void;
  onOpenWelcomeTour: () => void;
  onOpenSOS: () => void;
  onOpenChecklist: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenLegal,
  onOpenSafety,
  onOpenRoutePlanner,
  onOpenAddSpot,
  onOpenWelcomeTour,
  onOpenSOS,
  onOpenChecklist
}) => {

  const { user, stats, setIsProfileOpen, setIsAuthModalOpen, logout } = useAuth();


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-stone-900 border-r border-stone-800 h-full overflow-y-auto z-50 flex flex-col shadow-2xl text-stone-100 p-5">
        
        {/* Top Brand & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg text-white font-bold">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-stone-100">CamperMap</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-stone-950">TN</span>
              </div>
              <p className="text-[10px] text-stone-400">Bivouac & Pistes en Tunisie</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card / Auth Banner */}
        {user ? (
          <div 
            onClick={() => {
              onClose();
              setIsProfileOpen(true);
            }}
            className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 hover:border-amber-500/60 transition-all cursor-pointer mb-5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-amber-500 shrink-0">
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-black text-sm text-stone-100 truncate group-hover:text-amber-400 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">{user.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      ⛺ {stats.totalNights} nuits
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      🥾 {stats.totalKm} km
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-stone-950 to-stone-900 p-4 rounded-2xl border border-stone-800 mb-5">
            <div className="font-bold text-xs text-stone-200 mb-1">Espace Campeur</div>
            <p className="text-[11px] text-stone-400 mb-3">
              Connectez-vous pour enregistrer vos pas, kilomètres et nuits passées en bivouac.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Se connecter / S'inscrire</span>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-4 flex-1 text-xs">
          
          {/* Section 1 : Mon Compte & Aventures */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 px-2">
              Mon Activité Outdoor
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  if (user) {
                    setIsProfileOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Gérer mon Profil & Bio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (user) {
                    setIsProfileOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Carnet de Bivouac & Sorties</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (user) {
                    setIsProfileOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">Trophées & Badges d'Aventure</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Section 2 : Outils Carte */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 px-2">
              Navigation & Exploration
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenRoutePlanner();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Route className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Calculer un Itinéraire & Piste</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAddSpot();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Proposer un Nouveau Spot</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChecklist();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Checklist Sac & Matériel 🎒</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSOS();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 hover:text-white hover:bg-red-900/50 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="font-bold">SOS Urgence & GPS 🆘</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-red-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSafety();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold">Guide Sécurité & Numéros Utiles</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>


          {/* Section 3 : Paramètres & Documents Légaux */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 px-2">
              Application & Légal
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenWelcomeTour();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-amber-300 hover:text-amber-200 transition-all text-left bg-amber-950/20 border border-amber-900/40"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Guide de Bienvenue & Tutoriel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Paramètres de l'Application</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>


              <button
                onClick={() => {
                  onClose();
                  onOpenLegal('charter');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Trees className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Charte du Bivouac en Tunisie</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLegal('cgu');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span className="font-semibold">Conditions Générales (CGU)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLegal('privacy');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span className="font-semibold">Politique de Confidentialité</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom footer & Logout */}
        <div className="pt-4 border-t border-stone-800 mt-auto">
          {user && (
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-red-800 text-red-400 font-semibold flex items-center justify-center gap-2 transition-all mb-3 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          )}

          <div className="text-[10px] text-stone-400 text-center font-mono">
            CamperMap TN • Carte Interactive Bivouac 2026
          </div>
        </div>

      </div>
    </div>
  );
};
