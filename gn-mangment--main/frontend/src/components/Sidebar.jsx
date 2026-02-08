import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Building2,
  Car,
  Fuel,
  Settings,
  LogOut,
  ChevronLeft,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 rtl:space-x-reverse
      ${isActive ? 'bg-secondary text-white shadow-lg' : 'text-gray-300 hover:bg-primary-light hover:text-white'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/equipment', icon: Package, label: 'مكتب التجهيز' },
    { to: '/credits', icon: DollarSign, label: 'الاعتمادات المالية' },
    { to: '/real-estate', icon: Building2, label: 'الوضعيات العقارية' },
    { to: '/vehicles', icon: Car, label: 'الوسائل والصيانة' },
    { to: '/fuel', icon: Fuel, label: 'قسم المحروقات' },
    { to: '/settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen sticky top-0 shadow-2xl transition-all duration-300 overflow-y-auto overflow-x-hidden">
      <div className="p-6 border-b border-primary-light flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl">
          GN
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">الحرس الوطني</h1>
          <p className="text-xs text-gray-400 mt-1">منطقة المتلوي</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-primary-light">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary-light rtl:space-x-reverse mb-4">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors rtl:space-x-reverse"
        >
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
