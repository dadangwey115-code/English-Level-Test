import React from 'react';
import { Bot, User, Settings, Languages, Target, Library, Book, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  t: any;
  profile: UserProfile;
  lang: string;
  toggleLang: () => void;
  setIsEditing: (val: boolean) => void;
  setInitialEditStep: (val: number | undefined) => void;
  onShowResources: () => void;
  onResetChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  t, 
  profile, 
  lang, 
  toggleLang, 
  setIsEditing, 
  setInitialEditStep, 
  onShowResources, 
  onResetChat 
}) => {
  return (
    <header className="flex-none flex items-center justify-between mb-4 md:mb-6 border-b border-[#5A5A40]/20 pb-4">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button 
          onClick={() => setIsEditing(true)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5A5A40] flex items-center justify-center text-white shadow-lg flex-none hover:scale-105 active:scale-95 transition-transform group relative"
          title={t.profileSettings}
          aria-label={t.profileSettings}
        >
          <User size={20} className="md:size-6" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#5A5A40]/20">
            <Settings size={10} className="text-[#5A5A40]" />
          </div>
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a 
              href="https://gemini.google.com/gem/1Rj6lnR1zxTVTo5lD3faANn3F6zinnvqL?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 md:w-8 md:h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white shadow-sm flex-none hover:scale-110 transition-transform"
              title="Open Gemini Gem"
              aria-label="Open Gemini Gem"
            >
              <Bot size={16} className="md:size-5" />
            </a>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate leading-tight">{t.appName}</h1>
          </div>
          <p className="text-[9px] md:text-sm text-[#5A5A40] font-sans uppercase tracking-widest font-semibold opacity-70 truncate">
            {lang === 'en' ? (
              <>{t.personalizedFor} {profile.name}</>
            ) : (
              <>{profile.name}{t.personalizedFor}</>
            )} • {profile.level}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 md:gap-2 flex-none">
        <button 
          onClick={toggleLang}
          className="h-7 md:h-9 px-1.5 md:px-3 bg-[#5A5A40]/10 hover:bg-[#5A5A40]/20 rounded-full transition-colors text-[#5A5A40] font-sans font-bold text-[9px] md:text-xs flex items-center gap-1"
          title="Change Language"
          aria-label="Change Language"
        >
          <Languages size={10} className="md:size-[14px]" />
          {lang === 'en' ? 'MY' : 'EN'}
        </button>
        <button 
          onClick={() => {
            setInitialEditStep(2);
            setIsEditing(true);
          }}
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white rounded-full transition-colors text-[#5A5A40]"
          title={t.retakeLevelTest}
          aria-label={t.retakeLevelTest}
        >
          <Target size={16} className="md:size-5" />
        </button>
        <button 
          onClick={onShowResources}
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white rounded-full transition-colors text-[#5A5A40]"
          title={t.usefulResources}
           aria-label={t.usefulResources}
        >
          <Library size={16} className="md:size-5" />
        </button>
        <a 
          href="https://drive.google.com/drive/folders/1wlaU3O82loDnk9biiifUQxCtAJlhwZBQ?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white rounded-full transition-colors text-[#5A5A40]"
          title={t.learningEbooks}
          aria-label={t.learningEbooks}
        >
          <Book size={16} className="md:size-5" />
        </a>
        <button 
          onClick={onResetChat}
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white rounded-full transition-colors text-[#5A5A40]"
          title={t.resetChat}
          aria-label={t.resetChat}
        >
          <RefreshCw size={16} className="md:size-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
