import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  Car,
  Building2,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getDashboardStats, getStockSummary } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, subValue, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    {subValue && <p className="text-xs text-gray-400 mt-2">{subValue}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, stockSummary] = await Promise.all([
          getDashboardStats(),
          getStockSummary()
        ]);
        setStats(statsData);
        setStockData(stockSummary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">...</div>;

  const COLORS = ['#1a365d', '#c05621', '#2f855a', '#6b46c1'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">نظرة عامة</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">إحصائيات وقراءات مباشرة من جميع الأقسام</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="مخزون التجهيزات"
          value={stats?.counts.receptions || 0}
          icon={Package}
          color="bg-blue-600"
          subValue={`${stats?.counts.equipmentTypes || 0} نوع مختلف`}
        />
        <StatCard
          title="التنبيهات"
          value={stats?.counts.lowStockItems || 0}
          icon={AlertTriangle}
          color="bg-red-600"
          subValue="تجهيزات تحت حد المخزون"
        />
        <StatCard
          title="الوسائل الإدارية"
          value={stats?.counts.vehicles || 0}
          icon={Car}
          color="bg-orange-600"
          subValue="سيارات ودراجات نارية"
        />
        <StatCard
          title="الاعتمادات المتاحة"
          value={`${stats?.counts.totalAvailableCredit.toLocaleString() || 0} د.ت`}
          icon={DollarSign}
          color="bg-green-600"
          subValue="الميزانية المتبقية"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">مستويات المخزون</h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              <span className="text-xs text-gray-500">المخزون الحالي</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="stock" fill="#1a365d" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Lists */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-primary" />
            آخر النشاطات
          </h3>
          <div className="space-y-6">
            {stats?.recentDeliveries.slice(0, 5).map((del, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary border border-gray-100">
                  <Package size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{del.equipmentName}</p>
                  <p className="text-xs text-gray-400 truncate">سلمت لـ: {del.beneficiary}</p>
                </div>
                <span className="text-xs font-medium text-gray-500">{new Date(del.createdAt).toLocaleDateString('ar-TN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
