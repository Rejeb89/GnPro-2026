import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Search, Plus, MapPin, Maximize2, Tag } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const RealEstate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/realestate`);
      setData(res.data.data);
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
          <h1 className="text-2xl font-bold text-gray-900">قسم الوضعيات العقارية</h1>
          <p className="text-sm text-gray-500">إدارة العقارات، الوحدات، والوضعيات القانونية</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-light shadow-lg shadow-primary/20 transition-all">
          <Plus size={20} />
          إضافة عقار جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse"></div>)
        ) : data.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Building2 size={24} />
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                {item.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800">{item.unitName}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold">المساحة</p>
                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                  <Maximize2 size={14} className="text-gray-400" />
                  <span>{item.area ? `${item.area} م²` : 'غير محدد'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold">الوضعية القانونية</p>
                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                  <Tag size={14} className="text-gray-400" />
                  <span>{item.legalStatus || 'غير محدد'}</span>
                </div>
              </div>
            </div>

            {item.notes && (
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstate;
