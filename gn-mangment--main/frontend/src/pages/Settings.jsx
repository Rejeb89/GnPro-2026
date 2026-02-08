import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Save, Building, Info, ShieldCheck, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  const [regionName, setRegionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);
      setRegionName(res.data.data.regionName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await axios.put(`${API_URL}/settings`, { regionName });
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل حفظ الإعدادات' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="text-primary" />
          إعدادات النظام
        </h1>
        <p className="text-gray-500 mt-1">تخصيص معلومات الإدارة والمنطقة الأمنية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Building size={18} className="text-gray-400" />
              المعلومات العامة
            </h3>

            {message && (
              <div className={`p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنطقة / الإدارة</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                placeholder="مثال: منطقة الحرس الوطني بالمتلوي"
              />
              <p className="text-xs text-gray-400 mt-2">سيظهر هذا الاسم في جميع التقارير ولوحة التحكم</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-light disabled:opacity-50 transition-all font-bold"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                حفظ التغييرات
              </button>
            </div>
          </form>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
            <Info className="text-blue-500 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 text-sm">نصيحة أمنية</h4>
              <p className="text-blue-800 text-xs mt-1 leading-relaxed">
                يرجى التأكد من دقة المعلومات المدخلة حيث أنها ستعتمد كمرجع رسمي في جميع المراسلات والوثائق المستخرجة من المنظومة.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-gray-400" />
              حالة النظام
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">إصدار المنظومة</span>
                <span className="font-mono font-bold text-primary tracking-wider">v1.0.4-stable</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">قاعدة البيانات</span>
                <span className="flex items-center gap-1.5 text-green-600 font-bold uppercase text-[10px]">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  متصلة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
