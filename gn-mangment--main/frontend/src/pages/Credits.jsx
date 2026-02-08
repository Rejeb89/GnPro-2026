import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Plus, Calculator, TrendingUp, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get(`${API_URL}/credits`);
        setCredits(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCredits();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الاعتمادات المالية</h1>
          <p className="text-sm text-gray-500 mt-1">تتبع الميزانية، المصاريف، والقيم المتبقية</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-light shadow-lg shadow-primary/20 transition-all">
          <Plus size={20} />
          إضافة اعتماد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {credits.map((credit) => (
          <div key={credit.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">
                <Calculator size={24} />
              </div>
              <span className="text-sm font-bold bg-gray-50 px-3 py-1 rounded-full text-gray-500 border border-gray-100">
                {credit.year}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-1">{credit.description}</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">القيمة الجملية</span>
                <span className="font-bold text-gray-900">{credit.totalAmount.toLocaleString()} د.ت</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">الاستهلاك</span>
                  <span className="font-medium text-orange-600">
                    {Math.round((credit.spentAmount / credit.totalAmount) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(credit.spentAmount / credit.totalAmount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">المبلغ المتبقي</p>
                  <p className="text-xl font-black text-primary">{credit.remainingAmount.toLocaleString()} د.ت</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
