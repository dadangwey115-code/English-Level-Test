import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
  </div>
);

export default Loader;
