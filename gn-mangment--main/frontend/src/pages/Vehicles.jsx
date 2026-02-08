import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Search, Plus, Wrench, Shield, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/vehicles`);
      setVehicles(res.data.data);
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
          <h1 className="text-2xl font-bold text-gray-900">مكتب الوسائل والصيانة</h1>
          <p className="text-sm text-gray-500">إدارة وسائل النقل الإدارية، الصيانة، والحالة الفنية</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
            <Plus size={20} />
            إضافة وسيلة
          </button>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
            <Wrench size={20} />
            سجل صيانة جديد
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
          ) : (
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">رقم اللوحة</th>
                  <th className="px-6 py-4">النوع</th>
                  <th className="px-6 py-4">الماركة / الطراز</th>
                  <th className="px-6 py-4">الوحدة التابعة لها</th>
                  <th className="px-6 py-4 text-center">الحالة</th>
                  <th className="px-6 py-4 text-center">آخر صيانة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                          <Car size={18} />
                        </div>
                        <span className="font-mono font-bold text-gray-900 tracking-wider bg-gray-50 px-3 py-1 rounded border border-gray-200">
                          {v.plateNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{v.vehicleType}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{v.brand}</p>
                      <p className="text-[10px] text-gray-400">{v.model}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={14} className="text-primary opacity-50" />
                        <span>{v.assignedUnit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'وظيفية' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {v.maintenance && v.maintenance.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-700">
                            {new Date(v.maintenance[v.maintenance.length - 1].maintenanceDate).toLocaleDateString('ar-TN')}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate max-w-[120px]">
                            {v.maintenance[v.maintenance.length - 1].description}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300">لا يوجد سجل</span>
                      )}
                    </td>
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

export default Vehicles;
