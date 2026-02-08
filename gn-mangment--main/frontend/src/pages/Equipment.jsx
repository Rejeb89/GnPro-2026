import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Plus,
  Search,
  ArrowLeftRight,
  History,
  FileText,
  Filter
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Equipment = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = activeTab === 'inventory' ? '/equipment/status/stock-summary' : '/equipment';
      if (activeTab === 'deliveries') endpoint = '/delivery';

      const res = await axios.get(`${API_URL}${endpoint}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مكتب التجهيز</h1>
          <p className="text-sm text-gray-500">إدارة المخزون، الاستلام، والتسليم</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors">
            <Plus size={18} />
            إضافة تجهيز
          </button>
          <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText size={18} />
            تصدير تقرير
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        {[
          { id: 'inventory', label: 'جرد المخزون', icon: Package },
          { id: 'receptions', label: 'عمليات الاستلام', icon: History },
          { id: 'deliveries', label: 'عمليات التسليم', icon: ArrowLeftRight },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث في البيانات..."
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
          ) : (
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
                {activeTab === 'inventory' ? (
                  <tr>
                    <th className="px-6 py-4">اسم التجهيز</th>
                    <th className="px-6 py-4">الفئة</th>
                    <th className="px-6 py-4 text-center">المستلم</th>
                    <th className="px-6 py-4 text-center">الموزع</th>
                    <th className="px-6 py-4 text-center">المخزون الحالي</th>
                    <th className="px-6 py-4">الحالة</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4">اسم التجهيز</th>
                    <th className="px-6 py-4">{activeTab === 'receptions' ? 'الجهة المرسلة' : 'الجهة المستفيدة'}</th>
                    <th className="px-6 py-4 text-center">الكمية</th>
                    <th className="px-6 py-4 text-center">التاريخ</th>
                    <th className="px-6 py-4">رقم المرجع</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    {activeTab === 'inventory' ? (
                      <>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                        <td className="px-6 py-4 text-center">{item.received}</td>
                        <td className="px-6 py-4 text-center">{item.delivered}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-12 py-1 rounded-full font-bold text-sm ${
                            item.stock < item.minimumThreshold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.stock < item.minimumThreshold ? (
                            <span className="text-xs text-red-500 font-medium">مخزون منخفض!</span>
                          ) : (
                            <span className="text-xs text-green-500 font-medium">متوفر</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.equipmentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{activeTab === 'receptions' ? item.sendingDept : item.beneficiary}</td>
                        <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('ar-TN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.referenceNumber}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipment;
