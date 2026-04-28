/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Send, 
  User, 
  ChevronRight, 
  Loader2,
  Languages,
  Target,
  Clock,
  Mic,
  RefreshCw,
  X,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  AlertCircle,
  Bot,
  Trash2,
  Download,
  Timer,
  Printer,
  Share2,
  Link,
  Copy,
  ExternalLink,
  Library,
  Book,
  ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UserProfile, Message, EnglishLevel, Goal, Skill, Dialect } from './types';
import { getChatResponse, getWordMeaning, getWrongAnswerExplanation } from './services/geminiService';
import { Language, translations } from './translations';
import { quizQuestions, calculateLevel, QuizQuestion } from './quizData';

// New Components
import Header from './components/Header';
import Loader from './components/Loader';

// Lazy Components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const QuizSection = lazy(() => import('./components/QuizSection'));
const ResultSection = lazy(() => import('./components/ResultSection'));

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialEditStep, setInitialEditStep] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResetOptions, setShowResetOptions] = useState(false);
  const [showPurpose, setShowPurpose] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  const getTransferCode = () => {
    if (!profile) return "";
    return `Name: ${profile.name}
Level: ${profile.level}
Goals: ${profile.goals.join(", ")}
Skills: ${profile.prioritySkills.join(", ")}
Dialect: ${profile.preferredDialect}
Daily: ${profile.dailyCommitment} min
Status: Learning from Web App`;
  };

  const copyTransferCode = () => {
    navigator.clipboard.writeText(getTransferCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'my' : 'en');

  useEffect(() => {
    fetchProfile();
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m: any) => ({
          id: m.id.toString(),
          role: m.role,
          text: m.text,
          timestamp: new Date(m.timestamp).getTime()
        })));
      }
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleAssessmentSubmit = async (newProfile: UserProfile) => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      if (res.ok) {
        setProfile(newProfile);
        setIsEditing(false);
        // Initial greeting only if it's the first time
        if (messages.length === 0) {
          const greeting = `Mingalar par, ${newProfile.name}! I'm your ESL coach. I've reviewed your goals (${newProfile.goals.join(', ')}) and your current level (${newProfile.level}). Shall we start with a small exercise or would you like to discuss something specific?`;
          await saveMessage('model', greeting);
          setMessages([{ id: Date.now().toString(), role: 'model', text: greeting, timestamp: Date.now() }]);
        }
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (role: 'user' | 'model', text: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, text })
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !profile) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await saveMessage('user', input);

    try {
      const responseText = await getChatResponse(profile, messages, input);
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
      await saveMessage('model', responseText);
    } catch (err: any) {
      console.error("Failed to get response", err);
      if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
        setQuotaExceeded(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChatOnly = async () => {
    setShowResetOptions(false);
    try {
      // 1. Clear local messages immediately for feedback
      setMessages([]);
      
      // 2. Clear server history
      await fetch('/api/chat', { method: 'DELETE' });
      
      // 3. If profile exists, recreate the initial greeting
      if (profile) {
        const greeting = `Mingalar par, ${profile.name}! I'm your ESL coach. I've reviewed your goals (${profile.goals.join(', ')}) and your current level (${profile.level}). Shall we start with a small exercise or would you like to discuss something specific?`;
        
        // Save to server
        await saveMessage('model', greeting);
        
        // Update local state with the new greeting
        const newMsg: Message = { 
          id: Date.now().toString(), 
          role: 'model', 
          text: greeting, 
          timestamp: Date.now() 
        };
        setMessages([newMsg]);
      }
    } catch (err) {
      console.error("Failed to reset chat:", err);
      alert("Failed to reset chat. Please try again.");
    }
  };

  const resetChat = () => setShowResetOptions(true);

  const handleFullReset = async () => {
    setShowResetOptions(false);
    try {
      setMessages([]);
      await fetch('/api/chat', { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to clear chat on reset:", err);
    }
    setProfile(null);
    setIsEditing(false);
  };

  useEffect(() => {
    (window as any).showGlobalPurpose = () => setShowPurpose(true);
    (window as any).showGlobalAbout = () => setShowAbout(true);
    return () => { 
      delete (window as any).showGlobalPurpose;
      delete (window as any).showGlobalAbout;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif selection:bg-[#5A5A40]/20">
      <main>
        <AnimatePresence mode="wait">
          {!profile || isEditing ? (
          <AssessmentForm 
            key="assessment" 
            onSubmit={handleAssessmentSubmit} 
            initialData={profile || undefined}
            onCancel={profile ? () => {
              setIsEditing(false);
              setInitialEditStep(undefined);
            } : undefined}
            onReset={handleFullReset}
            lang={lang}
            toggleLang={toggleLang}
            setQuotaExceeded={setQuotaExceeded}
            initialStep={initialEditStep}
            onShowResources={() => setShowResources(true)}
            onShowAdmin={() => setShowAdmin(true)}
          />
        ) : (
          <div key="chat" className="max-w-5xl mx-auto h-[100dvh] flex flex-col p-4 md:p-8 overflow-hidden">
            <Header 
              t={t}
              profile={profile}
              lang={lang}
              toggleLang={toggleLang}
              setIsEditing={setIsEditing}
              setInitialEditStep={setInitialEditStep}
              onShowResources={() => setShowResources(true)}
              onResetChat={resetChat}
            />

            {/* Chat Area */}

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 md:pr-4 scrollbar-thin scrollbar-thumb-[#5A5A40]/20"
            >
              {messages.length === 0 && (
                <div className="text-center py-20 opacity-40 italic font-sans text-sm">
                  {t.startJourney}
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#5A5A40] text-white rounded-tr-none' 
                      : 'bg-white text-[#1a1a1a] rounded-tl-none border border-[#5A5A40]/10'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {msg.text}
                    </div>
                    <div className={`text-[9px] md:text-[10px] mt-2 opacity-50 font-sans uppercase tracking-tighter ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tl-none border border-[#5A5A40]/10 flex gap-1">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#5A5A40] rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#5A5A40] rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#5A5A40] rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-none pb-2 md:pb-0 relative">
              {/* Quota Exceeded Overlay */}
              <AnimatePresence>
                {quotaExceeded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-0 z-50 p-6 bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-[#5A5A40]/10 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">{t.quotaExceededTitle}</h3>
                    <p className="text-[#5A5A40] opacity-80 text-sm max-w-md mx-auto">
                      {t.quotaExceededDesc}
                    </p>
                    
                    <div className="bg-[#5A5A40]/5 p-4 rounded-2xl border border-dashed border-[#5A5A40]/20 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t.transferCodeLabel}</p>
                      <pre className="text-xs font-mono bg-white p-3 rounded-lg border border-[#5A5A40]/10 overflow-x-auto text-left whitespace-pre-wrap">
                        {getTransferCode()}
                      </pre>
                      <button 
                        onClick={copyTransferCode}
                        className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw size={12} className={copied ? "text-green-600" : ""} />
                        {copied ? t.codeCopied : t.copyCode}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <a 
                        href="https://gemini.google.com/gem/1Rj6lnR1zxTVTo5lD3faANn3F6zinnvqL?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold shadow-lg hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
                      >
                        <Bot size={20} />
                        {t.unlimitedGem}
                      </a>
                      <button 
                        onClick={() => setQuotaExceeded(false)}
                        className="text-sm font-sans font-bold text-[#5A5A40] opacity-60 hover:opacity-100"
                      >
                        {t.back}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                onSubmit={handleSendMessage}
                className="relative bg-white rounded-full shadow-xl border border-[#5A5A40]/10 p-1.5 md:p-2 flex items-center"
              >
                <button 
                  type="button"
                  className="p-2 md:p-3 text-[#5A5A40] hover:bg-[#f5f5f0] rounded-full transition-colors"
                  aria-label="Voice input"
                >
                  <Mic size={18} className="md:size-5" />
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.typeMessage}
                  aria-label={t.typeMessage}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-2 md:px-4 font-sans text-base md:text-lg outline-none min-w-0"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-[#5A5A40] text-white p-2 md:p-3 rounded-full hover:bg-[#4a4a34] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-none"
                  aria-label="Send message"
                >
                  <Send size={18} className="md:size-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
      </main>

      <AnimatePresence>
        {showResetOptions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">{t.resetOptionsTitle}</h3>
                <button onClick={() => setShowResetOptions(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleResetChatOnly}
                  className="w-full p-6 rounded-3xl border-2 border-[#5A5A40]/10 hover:border-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                      <RefreshCw size={20} />
                    </div>
                    <span className="font-bold text-lg text-gray-900">{t.resetChatOnly}</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-14">{t.resetChatOnlyDesc}</p>
                </button>

                <button 
                  onClick={handleFullReset}
                  className="w-full p-6 rounded-3xl border-2 border-red-100 hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <Trash2 size={20} />
                    </div>
                    <span className="font-bold text-lg text-red-600">{t.resetProfile}</span>
                  </div>
                  <p className="text-sm text-red-500/60 ml-14">{t.resetWarningDesc}</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPurpose && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-10 max-w-2xl w-full shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto border border-[#5A5A40]/10"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white pb-4 z-10 border-b border-[#5A5A40]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shadow-lg">
                    <Bot size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.globalMindset}</h3>
                </div>
                <button onClick={() => setShowPurpose(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-6 md:p-8 bg-[#5A5A40] text-white rounded-[32px] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                  <p className="text-lg md:text-xl font-bold leading-relaxed relative z-10 italic">
                    "{t.purposeQuote}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { title: t.onWritingTitle, quote: t.onWritingQuote, color: 'bg-blue-50 border-blue-100 text-blue-900' },
                    { title: t.onReadingTitle, quote: t.onReadingQuote, color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
                    { title: t.onListeningTitle, quote: t.onListeningQuote, color: 'bg-amber-50 border-amber-100 text-amber-900' },
                    { title: t.onSpeakingTitle, quote: t.onSpeakingQuote, color: 'bg-rose-50 border-rose-100 text-rose-900' }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={`p-6 rounded-3xl border-2 ${item.color} space-y-3 shadow-sm hover:shadow-md transition-all`}
                    >
                      <h4 className="font-bold text-lg uppercase tracking-tight">{item.title}</h4>
                      <p className="text-sm leading-relaxed opacity-90 italic">"{item.quote}"</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setShowPurpose(false)}
                    className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold shadow-lg hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    {t.gotIt}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-10 max-w-2xl w-full shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto border border-[#5A5A40]/10"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white pb-4 z-10 border-b border-[#5A5A40]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.aboutWebsite}</h3>
                </div>
                <button onClick={() => setShowAbout(false)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-6 md:p-8 bg-[#5A5A40] text-white rounded-[32px] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                  <p className="text-lg md:text-xl font-bold leading-relaxed relative z-10">
                    {t.websitePurpose}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(t.purposePoints as string[]).map((point, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="p-4 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/10 text-sm font-bold text-[#5A5A40] flex items-center gap-3"
                    >
                      <CheckCircle2 size={18} className="text-green-600 flex-none" />
                      {point}
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setShowAbout(false)}
                    className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold shadow-lg hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    {t.gotIt}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResources && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white pb-4 z-10 border-b border-[#5A5A40]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shadow-lg">
                    <Library size={20} />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 truncate tracking-tight">{t.freeCoursesTitle}</h3>
                    <p className="text-[10px] md:text-xs text-[#5A5A40] opacity-60 uppercase font-sans font-bold tracking-widest">{t.usefulResources}</p>
                  </div>
                </div>
                <button onClick={() => setShowResources(false)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
                <div className="p-5 md:p-6 bg-[#5A5A40]/5 rounded-[24px] border-l-4 border-[#5A5A40] space-y-2 text-left">
                  <p className="text-sm md:text-base leading-relaxed opacity-90">{t.resourcesDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 1, title: 'BBC Learning English', level: 'A1 - C2', desc: t.bbcDesc, link: 'https://www.bbc.co.uk/learningenglish', cert: false, type: t.noCertificate },
                    { id: 2, title: 'British Council', level: 'A1 - C1', desc: t.britishCouncilDesc, link: 'https://learnenglish.britishcouncil.org', cert: false, type: t.noCertificate },
                    { id: 3, title: 'Alison', level: 'A1 - C2', desc: t.alisonDesc, link: 'https://alison.com', cert: true, type: t.freeCertificate, badge: 'IELTS' },
                    { id: 4, title: 'Coursera (Audit)', level: 'A1 - C2', desc: t.courseraDesc, link: 'https://www.coursera.org', cert: false, type: t.auditMode, badge: 'Uni' },
                    { id: 8, title: 'VOA Learning English', level: 'A1 - B2', desc: t.voaDesc, link: 'https://learningenglish.voanews.com', cert: false, type: t.noCertificate, badge: 'Video' },
                    { id: 9, title: 'Cambridge English', level: 'A1 - C2', desc: t.cambridgeDesc, link: 'https://www.cambridgeenglish.org/learning-english/free-resources/', cert: false, type: t.noCertificate, badge: 'Exam' },
                    { id: 5, title: 'FutureLearn', level: 'A1 - C1', desc: t.futureLearnDesc, link: 'https://www.futurelearn.com', cert: false, type: t.auditMode, badge: 'UK' },
                    { id: 6, title: 'USA Learns', level: 'A1 - B2', desc: t.usaLearnsDesc, link: 'https://www.usalearns.org', cert: false, type: t.noCertificate, badge: 'US' },
                    { id: 7, title: 'Saylor Academy', level: 'A2 - C1', desc: t.saylorDesc, link: 'https://learn.saylor.org', cert: true, type: t.freeCertificate, badge: 'Acad' }
                  ].map((res) => (
                    <motion.div 
                      key={res.id}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-[24px] bg-white border border-[#5A5A40]/10 hover:border-[#5A5A40] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group text-left"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-sans font-bold bg-[#5A5A40]/10 text-[#5A5A40] px-2 py-0.5 rounded-full uppercase tracking-widest">{res.level}</span>
                          {res.badge && <span className="text-[10px] font-sans font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest">{res.badge}</span>}
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#5A5A40] transition-colors">{res.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed italic opacity-80 line-clamp-2">"{res.desc}"</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className={`w-2 h-2 rounded-full ${res.cert ? 'bg-green-500' : 'bg-amber-400'}`} />
                          <span className="text-[10px] font-sans font-bold opacity-60 uppercase tracking-tighter">{res.type}</span>
                        </div>
                      </div>
                      <a 
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full py-2.5 rounded-xl bg-transparent border-2 border-[#5A5A40]/20 text-[#5A5A40] text-center font-sans font-bold text-xs hover:bg-[#5A5A40] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        {t.visitWebsite} <ExternalLink size={12} />
                      </a>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 pb-2">
                  <button 
                    onClick={() => setShowResources(false)}
                    className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold shadow-lg hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    {t.gotIt}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && (
          <Suspense fallback={<div className="fixed inset-0 z-[100] bg-white flex items-center justify-center"><Loader /></div>}>
            <AdminDashboard 
              onClose={() => setShowAdmin(false)} 
              lang={lang} 
              translations={t} 
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Global Floating AI Assistant Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-[100] no-print"
      >
        <a 
          href="https://gemini.google.com/gem/1Rj6lnR1zxTVTo5lD3faANn3F6zinnvqL?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative group cursor-pointer"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#5A5A40]/20 blur-2xl rounded-full scale-150 animate-pulse" />
            
            {/* Button Container */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#5A5A40] rounded-full shadow-[0_10px_30px_rgba(90,90,64,0.3)] flex items-center justify-center border-4 border-white relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
              <Bot size={28} className="text-white drop-shadow-md" />
              
              {/* Small Sparkle */}
              <div className="absolute top-2 right-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-60" />
              </div>
            </div>

            {/* Tooltip/Label */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#5A5A40] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-[#5A5A40]/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Learning Assistant
            </div>
          </motion.div>
        </a>
      </motion.div>
    </div>
  );
}

function AssessmentForm({ onSubmit, initialData, onCancel, onReset, lang, toggleLang, setQuotaExceeded, initialStep, onShowResources, onShowAdmin }: { 
  onSubmit: (profile: UserProfile) => void, 
  initialData?: UserProfile,
  onCancel?: () => void,
  onReset?: () => void,
  lang: Language,
  toggleLang: () => void,
  setQuotaExceeded: (val: boolean) => void,
  onShowResources: () => void,
  onShowAdmin: () => void,
  key?: string,
  initialStep?: number
}) {
  const t = translations[lang];
  const [step, setStep] = useState(initialStep ?? (initialData ? 0 : 1));
  const [showQuiz, setShowQuiz] = useState(false);
  const [showManualLevel, setShowManualLevel] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [totalQuestionsToTake, setTotalQuestionsToTake] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [selectedWordMeaning, setSelectedWordMeaning] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number, y: number } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isWrong: boolean, explanation: string | null, loading: boolean }>({ isWrong: false, explanation: null, loading: false });
  const [wrongAnswersForCurrentQuestion, setWrongAnswersForCurrentQuestion] = useState<number[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [sharedCertificate, setSharedCertificate] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const QUESTION_TIME_LIMIT = 30; // 30 seconds per question

  // Check for shared certificate on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const certId = params.get('cert');
    if (certId) {
      fetch(`/api/certificates/${certId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setSharedCertificate(data);
          }
        })
        .catch(err => console.error("Error fetching certificate:", err));
    }
  }, []);

  const issueCertificate = async (score: number, total: number) => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const level = calculateLevel(score, total);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const certData = {
      id,
      name: formData.name,
      score,
      total,
      level,
      date
    };

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certData)
      });
      if (res.ok) {
        setCertificateId(id);
      }
    } catch (err) {
      console.error("Error issuing certificate:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareLink = `${window.location.origin}${window.location.pathname}?cert=${certificateId}`;

  const generateCertificateHTML = () => {
    const level = calculateLevel(quizScore, activeQuestions.length);
    const suggestion = t[`suggestion${level}` as keyof typeof t];
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>English Achievement Certificate - ${formData.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 20px; background: #f3f4f6; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .cert-container { width: 1123px; height: 794px; background: white; padding: 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; border: 20px solid rgba(90, 90, 64, 0.1); position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .accent-circle { position: absolute; width: 256px; height: 256px; background: rgba(90, 90, 64, 0.05); border-radius: 50%; z-index: 0; }
        .top-right { top: -128px; right: -128px; }
        .bottom-left { bottom: -128px; left: -128px; }
        .content { position: relative; z-index: 10; text-align: center; }
        .header-icon { width: 96px; height: 96px; background: #5A5A40; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; margin: 0 auto 32px; font-size: 48px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        h1 { font-size: 60px; font-weight: 700; color: #5A5A40; margin: 0 0 24px; text-transform: uppercase; letter-spacing: -1px; }
        .divider { width: 128px; height: 4px; background: #5A5A40; margin: 0 auto; }
        .subtitle { font-size: 24px; font-style: italic; color: rgba(0, 0, 0, 0.6); margin: 40px 0 20px; }
        .name { font-size: 72px; font-weight: 700; color: #111827; border-bottom: 2px solid #e5e7eb; display: inline-block; padding: 0 48px 8px; margin-bottom: 32px; }
        .body-text { font-size: 20px; color: #374151; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; position: relative; z-index: 10; }
        .level-box { text-align: left; }
        .level-label { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: rgba(0, 0, 0, 0.4); margin-bottom: 8px; }
        .level-value-container { display: flex; align-items: center; gap: 16px; }
        .level-value { font-size: 60px; font-weight: 700; color: #5A5A40; }
        .level-divider { height: 48px; width: 1px; background: #e5e7eb; }
        .level-suggestion { font-size: 14px; font-style: italic; color: rgba(0, 0, 0, 0.6); max-width: 300px; }
        .signature { text-align: right; }
        .sig-name { font-size: 24px; font-weight: 700; color: #5A5A40; margin-bottom: 4px; }
        .sig-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: rgba(0, 0, 0, 0.4); }
        .date { font-size: 14px; color: rgba(0, 0, 0, 0.4); margin-top: 16px; }
        .corner { position: absolute; width: 80px; height: 80px; border: 4px solid rgba(90, 90, 64, 0.2); z-index: 5; }
        .top-left-corner { top: 40px; left: 40px; border-right: 0; border-bottom: 0; }
        .bottom-right-corner { bottom: 40px; right: 40px; border-left: 0; border-top: 0; }
    </style>
</head>
<body>
    <div class="cert-container">
        <div class="accent-circle top-right"></div>
        <div class="accent-circle bottom-left"></div>
        <div class="corner top-left-corner"></div>
        <div class="corner bottom-right-corner"></div>

        <div class="content">
            <div class="header-icon serif">✨</div>
            <h1 class="serif">${t.certificateTitle}</h1>
            <div class="divider"></div>
            
            <p class="subtitle serif">${t.certificateSubtitle}</p>
            <div class="name serif">${formData.name}</div>
            <p class="body-text">${t.certificateBody} <strong>${quizScore} / ${activeQuestions.length}</strong>.</p>
        </div>

        <div class="footer">
            <div class="level-box">
                <p class="level-label">${t.certificateLevel}</p>
                <div class="level-value-container">
                    <span class="level-value serif">${level}</span>
                    <div class="level-divider"></div>
                    <p class="level-suggestion serif">${suggestion}</p>
                </div>
            </div>

            <div class="signature">
                <p class="sig-name">Mingalar ESL Coach</p>
                <p class="sig-title">AI Language Partner</p>
                <p class="date">${date}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const downloadCertificateHTML = () => {
    const html = generateCertificateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `English_Certificate_${formData.name?.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.certificateTitle,
          text: `${formData.name} ${t.certificateBody} ${quizScore}/${activeQuestions.length}`,
          url: shareLink,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
          copyToClipboard(shareLink);
        }
      }
    } else {
      copyToClipboard(shareLink);
    }
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQuiz && quizStarted && !quizFinished && !showReview && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizFinished) {
      // Auto-advance or mark as wrong when time is up
      handleQuizAnswer(-1); // -1 indicates time's up
    }
    return () => clearInterval(timer);
  }, [showQuiz, quizStarted, quizFinished, showReview, timeLeft]);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${formData.name}_English_Certificate.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const printCertificate = () => {
    window.print();
  };

  const handleTextSelection = async (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 1 && selectedText.length < 30 && !selectedText.includes(' ')) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        setTooltipPos({
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY
        });
        setIsTranslating(true);
        setSelectedWordMeaning(null);

        try {
          const meaning = await getWordMeaning(selectedText, formData as UserProfile);
          setSelectedWordMeaning(meaning);
        } catch (err: any) {
          console.error("Translation error:", err);
          if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
            setQuotaExceeded(true);
          }
          setSelectedWordMeaning("Error translating word.");
        } finally {
          setIsTranslating(false);
        }
      }
    } else {
      setSelectedWordMeaning(null);
      setTooltipPos(null);
    }
  };

  const [formData, setFormData] = useState<Partial<UserProfile>>(initialData || {
    goals: [],
    prioritySkills: [],
    dailyCommitment: 30,
    preferredDialect: 'American',
    nativeLanguage: 'Burmese'
  });

  const levels: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const goals: Goal[] = ['Professional', 'Academic', 'Travel', 'Social'];
  const skills: Skill[] = ['Speaking', 'Listening', 'Reading', 'Writing'];
  const dialects: Dialect[] = ['American', 'British'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleGoal = (goal: Goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals?.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...(prev.goals || []), goal]
    }));
  };

  const toggleSkill = (skill: Skill) => {
    setFormData(prev => ({
      ...prev,
      prioritySkills: prev.prioritySkills?.includes(skill) 
        ? prev.prioritySkills.filter(s => s !== skill) 
        : [...(prev.prioritySkills || []), skill]
    }));
  };

  const handleQuizAnswer = async (index: number) => {
    if (quizFeedback.loading) return;

    // Time's up case
    if (index === -1) {
      setQuizFeedback({ isWrong: true, explanation: t.timeUp, loading: false });
      // Wait a bit then move to next question
      setTimeout(() => {
        if (quizStep < activeQuestions.length - 1) {
          setQuizStep(s => s + 1);
          setTimeLeft(QUESTION_TIME_LIMIT);
          setQuizFeedback({ isWrong: false, explanation: null, loading: false });
          setWrongAnswersForCurrentQuestion([]);
        } else {
          setQuizFinished(true);
          issueCertificate(quizScore, activeQuestions.length);
        }
      }, 2000);
      return;
    }

    // Store the first attempt for review purposes
    if (wrongAnswersForCurrentQuestion.length === 0) {
      setUserAnswers(prev => [...prev, index]);
    }

    if (index === activeQuestions[quizStep].correctIndex) {
      // Correct!
      if (wrongAnswersForCurrentQuestion.length === 0) {
        setQuizScore(s => s + 1);
      }
      
      setQuizFeedback({ isWrong: false, explanation: null, loading: false });
      setWrongAnswersForCurrentQuestion([]);

      if (quizStep < activeQuestions.length - 1) {
        setQuizStep(s => s + 1);
        setTimeLeft(QUESTION_TIME_LIMIT); // Reset timer
      } else {
        setQuizFinished(true);
        issueCertificate(quizScore + 1, activeQuestions.length);
      }
    } else {
      // Wrong!
      if (wrongAnswersForCurrentQuestion.includes(index)) return;

      setQuizFeedback(prev => ({ ...prev, loading: true, isWrong: true }));
      setWrongAnswersForCurrentQuestion(prev => [...prev, index]);

      try {
        const explanation = await getWrongAnswerExplanation(
          activeQuestions[quizStep].question,
          activeQuestions[quizStep].options[index],
          activeQuestions[quizStep].options,
          formData as UserProfile
        );
        setQuizFeedback({ isWrong: true, explanation, loading: false });
      } catch (err: any) {
        console.error("Failed to get explanation:", err);
        if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
          setQuotaExceeded(true);
        }
        setQuizFeedback({ isWrong: true, explanation: "That's not quite right. Try another option!", loading: false });
      }
    }
  };

  const applyQuizResult = () => {
    const suggestedLevel = calculateLevel(quizScore, activeQuestions.length);
    setFormData({ ...formData, level: suggestedLevel });
    setShowQuiz(false);
    nextStep();
  };

  const startQuiz = () => {
    // Shuffle and pick questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, totalQuestionsToTake));
    setQuizStarted(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  const restartQuiz = () => {
    setQuizStep(0);
    setQuizScore(0);
    setQuizFinished(false);
    setShowReview(false);
    setUserAnswers([]);
    setQuizStarted(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex items-start md:items-center justify-center p-4 md:p-6">
      {sharedCertificate ? (
        <div className="fixed inset-0 z-[200] bg-gray-100 flex flex-col items-center justify-center p-4 overflow-auto">
          <div className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#5A5A40]">Mingalar ESL Coach</h1>
          </div>
          
          <div className="shadow-2xl transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-center bg-white">
            <div 
              className="w-[1123px] h-[794px] bg-white p-20 flex flex-col items-center justify-between border-[20px] border-[#5A5A40]/10 relative overflow-hidden"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -ml-32 -mb-32" />
              
              <div className="text-center space-y-6 relative z-10">
                <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                  <Bot size={48} />
                </div>
                <h1 className="text-6xl font-bold text-[#5A5A40] tracking-tight uppercase">{t.certificateTitle}</h1>
                <div className="w-32 h-1 bg-[#5A5A40] mx-auto" />
              </div>

              <div className="text-center space-y-8 relative z-10">
                <p className="text-2xl italic opacity-60">{t.certificateSubtitle}</p>
                <h2 className="text-7xl font-bold text-gray-900 border-b-2 border-gray-200 inline-block px-12 pb-2">
                  {sharedCertificate.name}
                </h2>
                <p className="text-xl max-w-2xl mx-auto leading-relaxed">
                  {t.certificateBody} <span className="font-bold">{sharedCertificate.score} / {sharedCertificate.total}</span>.
                </p>
              </div>

              <div className="flex justify-between w-full items-end relative z-10">
                <div className="text-left space-y-2">
                  <p className="text-sm uppercase tracking-widest opacity-40 font-sans font-bold">{t.certificateLevel}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-bold text-[#5A5A40]">{sharedCertificate.level}</span>
                    <div className="h-12 w-[1px] bg-gray-200" />
                    <div className="text-sm italic opacity-60 max-w-[300px]">
                      {t[`suggestion${sharedCertificate.level}` as keyof typeof t]}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-[#5A5A40]">Mingalar ESL Coach</p>
                    <p className="text-sm opacity-40 font-sans uppercase tracking-widest font-bold">AI Language Partner</p>
                  </div>
                  <p className="text-sm opacity-40 font-sans">{sharedCertificate.date}</p>
                </div>
              </div>

              <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-[#5A5A40]/20" />
              <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-[#5A5A40]/20" />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <p className="text-gray-500 font-sans text-center max-w-md">
              This certificate was issued by Mingalar ESL Coach, an AI-powered language learning platform for Myanmar students.
            </p>
            <button 
              onClick={() => window.location.href = window.location.origin + window.location.pathname}
              className="bg-[#5A5A40] text-white px-8 py-4 rounded-full font-sans font-bold shadow-xl hover:bg-[#4a4a34] transition-all flex items-center gap-2"
            >
              Start Your Own Journey <ExternalLink size={20} />
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full rounded-[40px] shadow-2xl p-6 md:p-16 relative overflow-hidden my-4 md:my-8"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 rounded-bl-full -mr-8 -mt-8" />
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 md:top-6 right-4 md:right-6 p-2 text-[#5A5A40] opacity-40 hover:opacity-100 transition-opacity z-20"
            title={t.cancelReturn}
          >
            <X size={24} />
          </button>
        )}
        
        {/* Language Toggle in Assessment */}
        <button 
          onClick={toggleLang}
          className="absolute top-4 md:top-6 left-4 md:left-6 px-3 py-1 bg-[#5A5A40]/10 hover:bg-[#5A5A40]/20 rounded-full transition-colors text-[#5A5A40] font-sans font-bold text-xs flex items-center gap-2 z-20"
        >
          <Languages size={14} />
          {lang === 'en' ? 'MY' : 'EN'}
        </button>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12 md:mb-8 mt-8 md:mt-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-[#5A5A40]' : 'bg-[#5A5A40]/10'
                }`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && initialData && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#5A5A40]/10 rounded-full flex items-center justify-center text-[#5A5A40] mx-auto border-4 border-white shadow-xl">
                    <User size={40} className="md:size-12" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.profileOverview}</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div className="p-5 md:p-6 bg-[#5A5A40]/5 rounded-3xl border border-[#5A5A40]/10 space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">{t.personalInfo}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl md:text-2xl font-bold">{formData.name}</p>
                      <p className="text-xs md:text-sm opacity-70">{formData.preferredDialect} • {formData.nativeLanguage}</p>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 bg-[#5A5A40]/5 rounded-3xl border border-[#5A5A40]/10 space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">{t.levelAndSkills}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#5A5A40] text-white px-2 py-0.5 md:px-3 md:py-1 rounded-lg font-bold text-sm md:text-base">{formData.level}</span>
                        <span className="font-medium text-sm md:text-base">{t[`level${formData.level}Desc` as keyof typeof t]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.prioritySkills?.map(s => (
                          <span key={s} className="text-[10px] md:text-xs bg-[#5A5A40]/10 px-2 py-1 rounded-full font-bold">{t[s.toLowerCase() as keyof typeof t]}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 bg-[#5A5A40]/5 rounded-3xl border border-[#5A5A40]/10 space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">{t.learningGoals}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.goals?.map(g => (
                        <span key={g} className="bg-[#5A5A40]/10 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">{t[g.toLowerCase() as keyof typeof t]}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:gap-4 pt-4">
                  <button 
                    onClick={nextStep}
                    className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a34] transition-all shadow-lg"
                  >
                    <Settings size={20} />
                    {t.editProfile}
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full border-2 border-[#5A5A40] text-[#5A5A40] py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#5A5A40]/5 transition-all"
                  >
                    <HelpCircle size={20} />
                    {t.retakeLevelTest}
                  </button>
                  {onCancel && (
                    <button onClick={onCancel} className="text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm font-bold py-2">
                      {t.back}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {showQuiz ? (
              <Suspense fallback={<Loader />}>
                {!quizFinished ? (
                  <QuizSection 
                    t={t}
                    quizStep={quizStep}
                    activeQuestions={activeQuestions}
                    timeLeft={timeLeft}
                    wrongAnswersForCurrentQuestion={wrongAnswersForCurrentQuestion}
                    quizFeedback={quizFeedback}
                    isTranslating={isTranslating}
                    selectedWordMeaning={selectedWordMeaning}
                    tooltipPos={tooltipPos}
                    onAnswer={handleQuizAnswer}
                    onTextSelection={handleTextSelection}
                    onExit={() => setShowExitConfirm(true)}
                    onCloseTooltip={() => { setTooltipPos(null); setSelectedWordMeaning(null); }}
                  />
                ) : (
                  <ResultSection 
                    t={t}
                    quizScore={quizScore}
                    totalQuestions={activeQuestions.length}
                    onApplyResult={applyQuizResult}
                    onRestart={() => { restartQuiz(); setShowQuiz(false); }}
                    onShowReview={() => setShowReview(true)}
                  />
                )}
              </Suspense>
            ) : (
              <>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-4xl font-bold tracking-tight mb-4">{t.mingalarPar}</h2>
                <p className="text-lg text-[#5A5A40] mb-8">{t.namePrompt}</p>
                <input 
                  type="text"
                  placeholder={t.yourName}
                  aria-label={t.yourName}
                  className="w-full text-2xl border-b-2 border-[#5A5A40]/20 focus:border-[#5A5A40] outline-none py-4 transition-colors bg-transparent"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                  <div className="flex flex-wrap gap-4 order-2 sm:order-1">
                    <button 
                      onClick={onShowAdmin}
                      className="flex items-center gap-2 bg-[#5A5A40]/10 text-[#5A5A40] px-4 py-2 rounded-full transition-all hover:bg-[#5A5A40]/20 font-sans font-bold text-xs"
                    >
                      <ShieldCheck size={14} />
                      Admin
                    </button>
                    <button 
                      onClick={() => (window as any).showGlobalPurpose?.()} 
                      className="flex items-center gap-2 bg-[#5A5A40] text-white px-4 py-2 rounded-full transition-all hover:bg-[#4a4a34] shadow-md font-sans font-bold text-xs"
                    >
                      <Bot size={14} />
                      {t.globalMindset}
                    </button>
                    <button 
                      onClick={() => (window as any).showGlobalAbout?.()} 
                      className="flex items-center gap-2 text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm font-bold"
                    >
                      <Sparkles size={18} />
                      {t.aboutWebsite}
                    </button>
                    <button 
                      onClick={onShowResources} 
                      className="flex items-center gap-2 text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm font-bold"
                    >
                      <Library size={18} />
                      {t.usefulResources}
                    </button>
                    <a 
                      href="https://drive.google.com/drive/folders/1wlaU3O82loDnk9biiifUQxCtAJlhwZBQ?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm font-bold"
                    >
                      <Book size={18} />
                      {t.learningEbooks}
                    </a>
                    <a 
                      href="https://komoe.mindset-it.online/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm font-bold"
                      title="Created by Ko Moe"
                    >
                      <Link size={18} />
                      Ko Moe
                    </a>
                    {onCancel && <button onClick={onCancel} className="text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm">{t.cancel}</button>}
                  </div>
                  <button 
                    disabled={!formData.name}
                    onClick={nextStep}
                    className="w-full sm:w-auto bg-[#5A5A40] text-white px-10 py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a34] transition-all disabled:opacity-50 order-1 sm:order-2"
                  >
                    {t.continue} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 md:space-y-6 flex flex-col h-full"
              >
                {!showManualLevel ? (
                  <div className="text-center py-4 md:py-8 space-y-4 md:space-y-6 flex-1 flex flex-col justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#5A5A40]/10 rounded-full flex items-center justify-center text-[#5A5A40] mx-auto">
                      <HelpCircle size={32} className="md:w-10 md:h-10" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.quizTitle}</h2>
                      <p className="text-[#5A5A40] opacity-70 max-w-sm mx-auto text-sm md:text-base">
                        {t.selectQuestionCount}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4 items-center pt-2">
                      <div className="flex flex-col gap-2 w-full max-w-[280px]">
                        {[10, 20, 30, 50, 100].map((count) => (
                          <button
                            key={count}
                            onClick={() => { 
                              setTotalQuestionsToTake(count); 
                              setShowQuiz(true); 
                              restartQuiz(); 
                              // Immediately start quiz after selecting count
                              const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
                              setActiveQuestions(shuffled.slice(0, count));
                              setQuizStarted(true);
                              setTimeLeft(QUESTION_TIME_LIMIT);
                            }}
                            className="bg-white border-2 border-[#5A5A40]/10 text-[#5A5A40] px-8 py-3 md:py-4 rounded-2xl font-sans font-bold hover:border-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all w-full text-center"
                          >
                            {count} {t.questions}
                          </button>
                        ))}
                      </div>
                      <div className="max-w-sm mx-auto p-4 bg-amber-50 border border-amber-100 rounded-2xl text-left flex gap-3 mt-4">
                        <Timer size={20} className="text-amber-600 flex-none mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {t.timerSuggestion}
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowManualLevel(true)}
                        className="text-[#5A5A40] font-sans font-bold text-sm opacity-60 hover:opacity-100 transition-opacity py-2 mt-4"
                      >
                        {t.skip}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide pb-20 md:pb-0">
                    <div className="flex items-center justify-between mb-2 md:mb-4 sticky top-0 bg-white/90 backdrop-blur-sm pt-2 pb-2 z-10">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.manualLevelSelection}</h2>
                      <button 
                        onClick={() => setShowManualLevel(false)}
                        className="text-[10px] md:text-xs font-sans font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-[#5A5A40]/20 transition-all whitespace-nowrap ml-2"
                      >
                        {t.takeQuiz}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => { setFormData({ ...formData, level: lvl }); nextStep(); }}
                          className={`p-4 md:p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-3 md:gap-4 ${
                            formData.level === lvl 
                              ? 'border-[#5A5A40] bg-[#5A5A40]/5 text-[#5A5A40]' 
                              : 'border-[#5A5A40]/10 hover:border-[#5A5A40]/30'
                          }`}
                        >
                          <div className="bg-[#5A5A40]/10 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-none font-bold text-lg md:text-xl">
                            {lvl}
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold uppercase tracking-widest text-[10px] md:text-xs opacity-60">
                              {lvl === 'A1' ? t.beginner : 
                               lvl === 'A2' ? t.elementary : 
                               lvl === 'B1' ? t.intermediate : 
                               lvl === 'B2' ? t.upperIntermediate : 
                               lvl === 'C1' ? t.advanced : t.proficient}
                            </div>
                            <div className="text-xs md:text-sm opacity-80 leading-relaxed">
                              {t[`level${lvl}Desc` as keyof typeof t]}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.level && !showManualLevel && (
                  <div className="pt-4 md:pt-6 border-t border-[#5A5A40]/10 text-center mt-auto">
                    <p className="text-xs md:text-sm font-sans uppercase tracking-widest opacity-60 mb-2 md:mb-4">Current Selection</p>
                    <div className="inline-flex items-center gap-3 md:gap-4 bg-[#5A5A40]/5 px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-[#5A5A40]/20">
                      <span className="text-xl md:text-2xl font-bold text-[#5A5A40]">{formData.level}</span>
                      <button 
                        onClick={nextStep}
                        className="text-[#5A5A40] font-sans font-bold text-sm hover:underline"
                      >
                        {t.continue} →
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 md:pt-8 mt-auto">
                  <div className="flex gap-4 order-2 sm:order-1 w-full sm:w-auto justify-center">
                    <button onClick={prevStep} className="text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm py-2">{t.back}</button>
                    {onCancel && <button onClick={onCancel} className="text-[#5A5A40] opacity-90 hover:opacity-100 transition-opacity font-sans text-sm py-2">{t.cancel}</button>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight mb-4">{t.primaryGoals}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                        formData.goals?.includes(goal) 
                          ? 'border-[#5A5A40] bg-[#5A5A40]/5 text-[#5A5A40] font-bold' 
                          : 'border-[#5A5A40]/10 hover:border-[#5A5A40]/30'
                      }`}
                    >
                      {goal === 'Professional' && <Target size={24} />}
                      {goal === 'Academic' && <BookOpen size={24} />}
                      {goal === 'Travel' && <Languages size={24} />}
                      {goal === 'Social' && <MessageSquare size={24} />}
                      <span>{goal === 'Professional' ? t.professional : goal === 'Academic' ? t.academic : goal === 'Travel' ? t.travel : t.social}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                  <div className="flex gap-4 order-2 sm:order-1">
                    <button onClick={prevStep} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.back}</button>
                    {onCancel && <button onClick={onCancel} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.cancel}</button>}
                  </div>
                  <button 
                    disabled={formData.goals?.length === 0}
                    onClick={nextStep}
                    className="w-full sm:w-auto bg-[#5A5A40] text-white px-10 py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a34] transition-all disabled:opacity-50 order-1 sm:order-2"
                  >
                    {t.continue} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight mb-4">{t.focusSkills}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                        formData.prioritySkills?.includes(skill) 
                          ? 'border-[#5A5A40] bg-[#5A5A40]/5 text-[#5A5A40] font-bold' 
                          : 'border-[#5A5A40]/10 hover:border-[#5A5A40]/30'
                      }`}
                    >
                      {skill === 'Speaking' && <Mic size={24} />}
                      {skill === 'Listening' && <Languages size={24} />}
                      {skill === 'Reading' && <BookOpen size={24} />}
                      {skill === 'Writing' && <MessageSquare size={24} />}
                      <span>{skill === 'Speaking' ? t.speaking : skill === 'Listening' ? t.listening : skill === 'Reading' ? t.reading : t.writing}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                  <div className="flex gap-4 order-2 sm:order-1">
                    <button onClick={prevStep} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.back}</button>
                    {onCancel && <button onClick={onCancel} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.cancel}</button>}
                  </div>
                  <button 
                    disabled={formData.prioritySkills?.length === 0}
                    onClick={nextStep}
                    className="w-full sm:w-auto bg-[#5A5A40] text-white px-10 py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a34] transition-all disabled:opacity-50 order-1 sm:order-2"
                  >
                    {t.continue} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold tracking-tight mb-4">{t.finalDetails}</h2>
                
                <div className="space-y-4">
                  <label className="block text-sm font-sans uppercase tracking-widest opacity-60 font-bold">{t.dailyCommitment}</label>
                  <div className="flex items-center gap-4">
                    <Clock className="text-[#5A5A40]" />
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="5"
                      value={formData.dailyCommitment}
                      onChange={(e) => setFormData({ ...formData, dailyCommitment: parseInt(e.target.value) })}
                      className="flex-1 accent-[#5A5A40]"
                      aria-label="Daily commitment level"
                    />
                    <span className="font-bold w-20 text-right">{formData.dailyCommitment} min</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-sans uppercase tracking-widest opacity-60 font-bold">{t.preferredDialect}</label>
                  <div className="flex gap-4">
                    {dialects.map(d => (
                      <button
                        key={d}
                        onClick={() => setFormData({ ...formData, preferredDialect: d })}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all ${
                          formData.preferredDialect === d 
                            ? 'border-[#5A5A40] bg-[#5A5A40]/5 text-[#5A5A40] font-bold' 
                            : 'border-[#5A5A40]/10 hover:border-[#5A5A40]/30'
                        }`}
                      >
                        {d === 'American' ? t.american : t.british}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-sans uppercase tracking-widest opacity-60 font-bold">{t.customApiKeyLabel}</label>
                  <div className="flex items-center gap-4">
                    <Settings className="text-[#5A5A40]" />
                    <input 
                      type="password"
                      placeholder={t.customApiKeyPlaceholder}
                      value={formData.customApiKey || ''}
                      onChange={(e) => setFormData({ ...formData, customApiKey: e.target.value })}
                      className="flex-1 bg-transparent border-b-2 border-[#5A5A40]/20 focus:border-[#5A5A40] outline-none py-2 font-sans"
                      aria-label={t.customApiKeyLabel}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-sans uppercase tracking-widest opacity-60 font-bold">{t.openRouterApiKeyLabel}</label>
                  <div className="flex items-center gap-4">
                    <Settings className="text-[#5A5A40]" />
                    <input 
                      type="password"
                      placeholder={t.openRouterApiKeyPlaceholder}
                      value={formData.openRouterApiKey || ''}
                      onChange={(e) => setFormData({ ...formData, openRouterApiKey: e.target.value })}
                      className="flex-1 bg-transparent border-b-2 border-[#5A5A40]/20 focus:border-[#5A5A40] outline-none py-2 font-sans"
                      aria-label={t.openRouterApiKeyLabel}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                  <div className="flex gap-4 order-2 sm:order-1">
                    <button onClick={prevStep} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.back}</button>
                    {onCancel && <button onClick={onCancel} className="text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans text-sm">{t.cancel}</button>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                    {onCancel && (
                      <button 
                        onClick={onCancel}
                        className="w-full sm:w-auto px-10 py-4 rounded-full font-sans font-bold text-[#5A5A40] border border-[#5A5A40]/20 hover:bg-[#5A5A40]/5 transition-all"
                      >
                        {t.cancel}
                      </button>
                    )}
                    <button 
                      onClick={() => onSubmit(formData as UserProfile)}
                      className="w-full sm:w-auto bg-[#5A5A40] text-white px-10 py-4 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-[#4a4a34] transition-all shadow-lg"
                    >
                      {initialData ? t.saveChanges : t.startLearning} <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {initialData && onReset && (
                  <div className="pt-8 mt-8 border-t border-red-500/10">
                    <h3 className="text-sm font-sans uppercase tracking-widest text-red-500/60 font-bold mb-4">{t.dangerZone}</h3>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-red-500/20 text-red-600 font-sans font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      {t.resetProfile}
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {showResetConfirm && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
                      >
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                          <AlertCircle size={32} />
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-gray-900">{t.resetWarningTitle}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {t.resetWarningDesc}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                          <button 
                            onClick={onReset}
                            className="w-full bg-red-600 text-white py-4 rounded-full font-sans font-bold hover:bg-red-700 transition-colors"
                          >
                            {t.confirmResetProfile}
                          </button>
                          <button 
                            onClick={() => setShowResetConfirm(false)}
                            className="w-full bg-gray-100 text-gray-700 py-4 rounded-full font-sans font-bold hover:bg-gray-200 transition-colors"
                          >
                            {t.keepProfile}
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
        </div>

        <div className="fixed left-[-9999px] top-[-9999px]">
          <div 
            ref={certificateRef}
            className="w-[1123px] h-[794px] bg-white p-20 flex flex-col items-center justify-between border-[20px] border-[#5A5A40]/10 relative overflow-hidden"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -ml-32 -mb-32" />
            
            <div className="text-center space-y-6 relative z-10">
              <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                <Bot size={48} />
              </div>
              <h1 className="text-6xl font-bold text-[#5A5A40] tracking-tight uppercase">{t.certificateTitle}</h1>
              <div className="w-32 h-1 bg-[#5A5A40] mx-auto" />
            </div>

            <div className="text-center space-y-8 relative z-10">
              <p className="text-2xl italic opacity-60">{t.certificateSubtitle}</p>
              <h2 className="text-7xl font-bold text-gray-900 border-b-2 border-gray-200 inline-block px-12 pb-2">
                {formData.name}
              </h2>
              <p className="text-xl max-w-2xl mx-auto leading-relaxed">
                {t.certificateBody} <span className="font-bold">{quizScore} / {activeQuestions.length}</span>.
              </p>
            </div>

            <div className="flex justify-between w-full items-end relative z-10">
              <div className="text-left space-y-2">
                <p className="text-sm uppercase tracking-widest opacity-40 font-sans font-bold">{t.certificateLevel}</p>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-bold text-[#5A5A40]">{calculateLevel(quizScore, activeQuestions.length)}</span>
                  <div className="h-12 w-[1px] bg-gray-200" />
                  <div className="text-sm italic opacity-60 max-w-[300px]">
                    {t[`suggestion${calculateLevel(quizScore, activeQuestions.length)}` as keyof typeof t]}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-[#5A5A40]">Mingalar ESL Coach</p>
                  <p className="text-sm opacity-40 font-sans uppercase tracking-widest font-bold">AI Language Partner</p>
                </div>
                <p className="text-sm opacity-40 font-sans">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-[#5A5A40]/20" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-[#5A5A40]/20" />
          </div>
        </div>

        {/* Certificate Modal for Viewing and Printing */}
        <AnimatePresence>
          {showCertificateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md no-print"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-white sticky top-0 z-10 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <h3 className="text-xl font-bold">{t.certificateTitle}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {certificateId && (
                      <button 
                        onClick={shareCertificate}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans font-bold transition-all border-2 ${
                          isCopied ? 'bg-green-50 border-green-200 text-green-600' : 'border-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/5'
                        }`}
                      >
                        {isCopied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                        {isCopied ? t.copied : t.share}
                      </button>
                    )}
                    <button 
                      onClick={printCertificate}
                      className="flex items-center gap-2 bg-[#5A5A40] text-white px-5 py-2 rounded-full font-sans font-bold hover:bg-[#4a4a34] transition-all shadow-md"
                    >
                      <Printer size={18} />
                      {t.print}
                    </button>
                    <button 
                      onClick={downloadCertificate}
                      disabled={isGeneratingPDF}
                      className="flex items-center gap-2 border-2 border-[#5A5A40]/20 text-[#5A5A40] px-5 py-2 rounded-full font-sans font-bold hover:bg-[#5A5A40]/5 transition-all"
                    >
                      {isGeneratingPDF ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      PDF
                    </button>
                    <button 
                      onClick={downloadCertificateHTML}
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-sans font-bold transition-all border-2 border-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/5"
                    >
                      <Download size={18} />
                      {t.downloadHTML}
                    </button>
                    <button 
                      onClick={() => setShowCertificateModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 text-amber-800 text-[10px] md:text-xs flex items-center gap-2 no-print">
                  <HelpCircle size={14} />
                  {t.printToPDFNote}
                </div>

                {/* Modal Content - Scrollable Preview */}
                <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-gray-50 flex justify-center">
                  <div className="print-container shadow-2xl transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top">
                    {/* Reusing the same template structure but visible */}
                    <div 
                      className="w-[1123px] h-[794px] bg-white p-20 flex flex-col items-center justify-between border-[20px] border-[#5A5A40]/10 relative overflow-hidden"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-32 -mt-32" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -ml-32 -mb-32" />
                      
                      <div className="text-center space-y-6 relative z-10">
                        <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                          <Bot size={48} />
                        </div>
                        <h1 className="text-6xl font-bold text-[#5A5A40] tracking-tight uppercase">{t.certificateTitle}</h1>
                        <div className="w-32 h-1 bg-[#5A5A40] mx-auto" />
                      </div>

                      <div className="text-center space-y-8 relative z-10">
                        <p className="text-2xl italic opacity-60">{t.certificateSubtitle}</p>
                        <h2 className="text-7xl font-bold text-gray-900 border-b-2 border-gray-200 inline-block px-12 pb-2">
                          {formData.name}
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto leading-relaxed">
                          {t.certificateBody} <span className="font-bold">{quizScore} / {activeQuestions.length}</span>.
                        </p>
                      </div>

                      <div className="flex justify-between w-full items-end relative z-10">
                        <div className="text-left space-y-2">
                          <p className="text-sm uppercase tracking-widest opacity-40 font-sans font-bold">{t.certificateLevel}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-6xl font-bold text-[#5A5A40]">{calculateLevel(quizScore, activeQuestions.length)}</span>
                            <div className="h-12 w-[1px] bg-gray-200" />
                            <div className="text-sm italic opacity-60 max-w-[300px]">
                              {t[`suggestion${calculateLevel(quizScore, activeQuestions.length)}` as keyof typeof t]}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-4">
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-[#5A5A40]">Mingalar ESL Coach</p>
                            <p className="text-sm opacity-40 font-sans uppercase tracking-widest font-bold">AI Language Partner</p>
                          </div>
                          <p className="text-sm opacity-40 font-sans">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-[#5A5A40]/20" />
                      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-[#5A5A40]/20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )}
    </div>
  );
}
