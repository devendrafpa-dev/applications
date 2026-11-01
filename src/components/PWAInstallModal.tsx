import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { UpstoxLogo } from './UpstoxLogo';
import { 
  Download, 
  X, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden bg-[#121620] border-purple-500/30 text-slate-100 light:bg-white light:border-purple-200 light:text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Banner with Upstox Purple Gradient */}
        <div className="relative p-6 bg-gradient-to-br from-[#7b2cbf] via-[#5c2494] to-[#240046] text-white flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Large Upstox App Icon with mobile frame simulation */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8a2be2] via-[#5c2494] to-[#3c1361] p-2.5 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
              <img 
                src="/apple-touch-icon.png" 
                alt="Upstox Pro App Icon" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  // Fallback to inline SVG if needed
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h3 className="text-xl font-bold font-sans">Install Upstox Pro</h3>
          <p className="text-xs text-purple-200 mt-1 max-w-xs">
            Add Upstox directly to your mobile home screen with the official Upstox app icon
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Perks list */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Full-screen trading</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sub-second quotes</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Direct Demat access</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Zero store download</span>
            </div>
          </div>

          {/* Installation Instructions based on browser/platform */}
          {isInstallable ? (
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 via-[#7b2cbf] to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install Upstox App Now</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Instantly installs to your Android/Desktop home screen & app drawer
              </p>
            </div>
          ) : isIOS ? (
            <div className="p-4 rounded-2xl bg-slate-900/80 light:bg-slate-100 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Smartphone className="w-4 h-4" />
                <span>How to Install on iPhone / iPad:</span>
              </div>
              <ol className="text-xs text-slate-300 light:text-slate-700 space-y-2 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  Tap the <strong className="text-purple-300 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 inline" /> Share</strong> button at the bottom of Safari.
                </li>
                <li className="leading-relaxed">
                  Scroll down and tap <strong className="text-purple-300 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                </li>
                <li className="leading-relaxed">
                  Tap <strong>Add</strong> in the top-right corner. The Upstox purple logo will now appear on your iPhone screen!
                </li>
              </ol>
            </div>
          ) : isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-400">Upstox Pro is Installed!</p>
              <p className="text-xs text-slate-400">You are running the official standalone app.</p>
            </div>
          ) : (
            /* General browser guide */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 space-y-2 text-xs text-slate-300 light:text-slate-700">
                <p className="font-semibold text-purple-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Install on Mobile Browser:</span>
                </p>
                <p className="leading-relaxed">
                  Open your browser menu (tap <strong>⋮</strong> on Android Chrome or <strong>Share</strong> on iOS Safari) and select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add Upstox Pro to Home Screen</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 light:border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Official Upstox PWA • SEBI Registered Broker
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
