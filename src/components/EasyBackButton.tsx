import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { PageType } from '../types';

interface EasyBackButtonProps {
  label?: string;
  targetPage?: PageType;
  className?: string;
  showBreadcrumb?: boolean;
  currentPageName?: string;
}

export const EasyBackButton: React.FC<EasyBackButtonProps> = ({
  label,
  targetPage,
  className = '',
  showBreadcrumb = false,
  currentPageName = '',
}) => {
  const { goBack, navigateTo, previousPageName } = useApp();

  const handleClick = () => {
    if (targetPage) {
      navigateTo(targetPage);
    } else {
      goBack();
    }
  };

  const displayText = label || `Back to ${previousPageName}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleClick}
        type="button"
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white light:bg-white light:border-slate-200 light:text-slate-700 light:hover:text-slate-900 light:hover:bg-slate-50 transition-all shadow-xs hover:border-purple-500/40"
        title={`Click to go ${displayText}`}
      >
        <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
        <span>{displayText}</span>
      </button>

      {showBreadcrumb && currentPageName && (
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>{previousPageName}</span>
          <ChevronLeft className="w-3 h-3 rotate-180 text-slate-600" />
          <span className="text-slate-300 light:text-slate-700 font-semibold truncate max-w-[200px]">
            {currentPageName}
          </span>
        </div>
      )}
    </div>
  );
};
