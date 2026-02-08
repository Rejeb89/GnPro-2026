import React, { useState, useEffect } from 'react';
import { Bell, Search, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        <div className="relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="bg-gray-50 border-none rounded-full pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse border-l rtl:border-r pl-4 rtl:pr-4">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm font-medium">
              {format(currentTime, 'eeee, d MMMM', { locale: ar })}
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Clock size={16} className="text-primary" />
            <span className="text-sm font-bold tracking-wider">
              {format(currentTime, 'HH:mm:ss')}
            </span>
          </div>
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
