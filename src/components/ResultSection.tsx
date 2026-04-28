import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { calculateLevel } from '../quizData';

interface ResultSectionProps {
  t: any;
  quizScore: number;
  totalQuestions: number;
  onApplyResult: () => void;
  onRestart: () => void;
  onShowReview: () => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({
  t,
  quizScore,
  totalQuestions,
  onApplyResult,
  onRestart,
  onShowReview
}) => {
  const suggestedLevel = calculateLevel(quizScore, totalQuestions);

  return (
    <div className="text-center space-y-8 py-8">
      <div className="w-20 h-20 bg-[#5A5A40] rounded-full flex items-center justify-center text-white mx-auto shadow-xl">
        <CheckCircle2 size={40} />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold mb-2">{t.quizTitle} {t.continue}</h2>
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#5A5A40] text-white rounded-full shadow-md">
          <span className="text-sm font-sans uppercase tracking-widest opacity-80">{t.score}</span>
          <span className="font-bold text-2xl">{quizScore} / {totalQuestions}</span>
        </div>
      </div>
      <div className="p-8 bg-white rounded-[40px] border-2 border-[#5A5A40]/10 shadow-xl inline-block min-w-[240px]">
        <p className="text-sm font-sans uppercase tracking-widest opacity-60 mb-2">{t.suggestedLevel}</p>
        <p className="text-6xl font-bold text-[#5A5A40] tracking-tighter">{suggestedLevel}</p>
      </div>

      <div className="max-w-md mx-auto p-6 bg-[#5A5A40]/5 rounded-3xl border border-dashed border-[#5A5A40]/20">
        <p className="text-[#5A5A40] italic text-sm leading-relaxed">
          {quizScore === totalQuestions 
            ? "Perfect! You've mastered this set. Why not challenge yourself with more questions to truly test your limits?" 
            : `Good start! You got ${totalQuestions - quizScore} questions wrong on the first try. Try again to practice more and improve your score!`}
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <button 
          onClick={onApplyResult}
          className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold shadow-lg hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
        >
          {t.updateProfileWithLevel}
          <ChevronRight size={20} />
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onShowReview}
            className="py-3 rounded-full border-2 border-[#5A5A40]/20 text-[#5A5A40] font-sans font-bold text-sm hover:bg-[#5A5A40]/5 transition-all"
          >
            Review
          </button>
          <button 
            onClick={onRestart}
            className="py-3 rounded-full border-2 border-[#5A5A40]/20 text-[#5A5A40] font-sans font-bold text-sm hover:bg-[#5A5A40]/5 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
