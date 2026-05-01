import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Loader2, AlertCircle, X } from 'lucide-react';
import { QuizQuestion } from '../quizData';

interface QuizSectionProps {
  t: any;
  lang: string;
  quizStep: number;
  activeQuestions: QuizQuestion[];
  timeLeft: number;
  wrongAnswersForCurrentQuestion: number[];
  quizFeedback: { isWrong: boolean, explanation: string | null, loading: boolean };
  isTranslating: boolean;
  selectedWordMeaning: string | null;
  tooltipPos: { x: number, y: number } | null;
  onAnswer: (idx: number) => void;
  onTextSelection: (e: React.MouseEvent | React.TouchEvent) => void;
  onExit: () => void;
  onCloseTooltip: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  t,
  lang,
  quizStep,
  activeQuestions,
  timeLeft,
  wrongAnswersForCurrentQuestion,
  quizFeedback,
  isTranslating,
  selectedWordMeaning,
  tooltipPos,
  onAnswer,
  onTextSelection,
  onExit,
  onCloseTooltip
}) => {
  const currentQuestion = activeQuestions[quizStep];

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className={`text-xl md:text-2xl font-bold truncate ${lang === 'my' ? 'mm-text' : ''}`}>{t.quizTitle}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-widest text-[#5A5A40] opacity-60 ${lang === 'my' ? 'mm-text' : ''}`}>
                {t[currentQuestion.skill.toLowerCase() as keyof typeof t]}
              </span>
            </div>
          </div>
          <div className="flex-none text-right flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-colors ${
              timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-100 text-amber-700'
            }`}>
              <Timer size={14} />
              {timeLeft}s
            </div>
            <span className="text-[10px] md:text-sm font-sans font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full whitespace-nowrap">
              {t.question} {quizStep + 1} / {activeQuestions.length}
            </span>
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-[#5A5A40]/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((quizStep + 1) / activeQuestions.length) * 100}%` }}
            className="h-full bg-[#5A5A40] rounded-full"
          />
        </div>
      </div>

      <div className="p-4 md:p-8 bg-[#5A5A40]/5 rounded-3xl border border-[#5A5A40]/10 relative">
        <p 
          className="text-lg md:text-xl font-medium mb-6 md:mb-8 select-text cursor-help"
          onMouseUp={onTextSelection}
          onKeyUp={onTextSelection}
          onTouchEnd={onTextSelection}
        >
          {currentQuestion.question}
        </p>
        
        <AnimatePresence>
          {tooltipPos && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              style={{ 
                position: 'fixed',
                left: tooltipPos.x,
                top: tooltipPos.y - 10,
                transform: 'translate(-50%, -100%)',
                zIndex: 100
              }}
              className="bg-[#5A5A40] text-white p-3 rounded-xl shadow-2xl max-w-[250px] text-sm pointer-events-auto"
            >
              <div className="flex flex-col gap-1">
                {isTranslating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Translating...</span>
                  </div>
                ) : (
                  <>
                    <p className="font-sans leading-relaxed">{selectedWordMeaning}</p>
                    <button 
                      onClick={onCloseTooltip}
                      className="text-xs uppercase tracking-widest opacity-80 hover:opacity-100 text-right mt-2 py-2 px-4 bg-white/10 rounded-lg touch-manipulation font-bold"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#5A5A40]" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={wrongAnswersForCurrentQuestion.includes(idx) || quizFeedback.loading}
              onClick={() => onAnswer(idx)}
              className={`w-full text-left p-4 md:p-5 min-h-[56px] rounded-2xl border-2 transition-all font-sans touch-manipulation ${
                wrongAnswersForCurrentQuestion.includes(idx)
                  ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60'
                  : 'border-[#5A5A40]/10 hover:border-[#5A5A40] hover:bg-white active:bg-[#5A5A40]/5'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {quizFeedback.isWrong && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start"
            >
              <AlertCircle className="text-red-500 flex-none mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-bold text-sm mb-1">Not quite right!</p>
                {quizFeedback.loading ? (
                  <div className="flex items-center gap-2 text-red-600 text-sm italic">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </div>
                ) : (
                  <p className="text-red-700 text-sm leading-relaxed">{quizFeedback.explanation}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 mt-12 pb-8 border-t border-[#5A5A40]/5 pt-8">
        <button 
          onClick={onExit}
          className={`text-red-500 hover:text-red-600 transition-colors font-sans text-base font-bold flex items-center gap-2 px-8 py-3.5 rounded-full hover:bg-red-50 border-2 border-red-100 hover:border-red-200 shadow-sm touch-manipulation active:scale-95 ${lang === 'my' ? 'mm-text' : ''}`}
        >
          <X size={18} />
          {t.exitTest}
        </button>
      </div>
    </div>
  );
};

export default QuizSection;
