import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fuel as FuelIcon, Search, Plus, Calendar, Droplet, Hash } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Fuel = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/fuel`);
      setRecords(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قسم المحروقات</h1>
          <p className="text-sm text-gray-500">متابعة استهلاك الوقود ووصولات المحروقات للوحدات</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
          <Plus size={20} />
          إضافة وصولات جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-sm">سجل الاستهلاك الأخير</h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-gray-50/50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">الوحدة الأمنية</th>
                    <th className="px-6 py-4">الكمية (لتر)</th>
                    <th className="px-6 py-4">نوع الوقود</th>
                    <th className="px-6 py-4">أرقام الوصولات</th>
                    <th className="px-6 py-4">التاريخ</th>
                    <th className="px-6 py-4">بواسطة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{r.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Droplet size={14} className="text-blue-500" />
                          <span className="font-bold text-gray-900">{r.amount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.fuelType}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Hash size={12} />
                          <span>{r.couponNumbers || '---'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{new Date(r.date).toLocaleDateString('ar-TN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {r.creator?.name || '---'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fuel;
