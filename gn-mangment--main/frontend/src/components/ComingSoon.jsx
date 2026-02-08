import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border-2 border-dashed border-gray-200">
    <Construction size={64} className="text-gray-300 mb-4" />
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-2">هذا القسم قيد التطوير حالياً وسيتم توفيره قريباً.</p>
  </div>
);

export default ComingSoon;
