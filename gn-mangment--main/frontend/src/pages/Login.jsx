import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التثبت من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccess = async () => {
    setError('');
    setLoading(true);
    try {
      await login('rejebmohamed@gn.com', 'rejebmohamed1989');
      navigate('/');
    } catch (err) {
      setError('فشل الدخول السريع. يرجى التأكد من تهيئة قاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <h2 className="text-2xl font-bold">منظومة إدارة التجهيز</h2>
          <p className="mt-2 opacity-80">إقليم الحرس الوطني بالمتلوي</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full pr-10 pl-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pr-10 pl-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-md transition duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'تسجيل الدخول'}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs">أو</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickAccess}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-md transition duration-200 flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            دخول سريع (بدون بيانات)
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
