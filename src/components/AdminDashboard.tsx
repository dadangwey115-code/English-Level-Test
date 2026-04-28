import React from 'react';
import { motion } from 'motion/react';
import { Users, BarChart3, Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  lang: string;
  translations: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, lang, translations: t }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-[#f5f5f0] p-4 md:p-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-[#5A5A40]/20 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#5A5A40]/10 rounded-full transition-colors text-[#5A5A40]"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-[#5A5A40]" />
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[#5A5A40]">Total Users</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[#5A5A40]">Completion Rate</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[#5A5A40]">Avg. Session</p>
              <p className="text-2xl font-bold">24 min</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#5A5A40]/10">
          <h2 className="text-xl font-bold mb-6">Learning Trends</h2>
          <div className="h-64 bg-[#f5f5f0] rounded-[24px] border-2 border-dashed border-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]/40 italic">
            Visual analytics will appear here...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
