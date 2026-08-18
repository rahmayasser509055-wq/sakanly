import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // جلب بيانات المستخدم المسجل من الـ localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('تم تسجيل الخروج بنجاح 👋');
    navigate('/login');
    window.location.reload(); // إعادة تنشيط الحالة
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm py-3 px-6 flex items-center justify-between" dir="rtl">
      
      {/* 1. اللوجو واسم المنصة */}
      <Link to="/" className="text-2xl font-black text-blue-600 flex items-center gap-2">
        🏠 سكنلي
      </Link>

      {/* 2. الروابط الرئيسية */}
      <div className="hidden md:flex items-center gap-6 font-semibold text-gray-600">
        <Link to="/" className="hover:text-blue-600 transition">الرئيسية</Link>
        <Link to="/properties" className="hover:text-blue-600 transition">العقارات المتاحة</Link>
        <Link to="/about" className="hover:text-blue-600 transition">عن المنصة</Link>
      </div>

      {/* 3. الجزء الأيسر: زرار أضف سكنك + بيانات المستخدم */}
      <div className="flex items-center gap-3">

        {/* زرار أضف سكنك: يظهر فقط إذا كان المستخدم مالك/وسيط */}
        {user && user.userType === 'مالك/وسيط' && (
          <Link
            to="/add-apartment"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
          >
            ➕ أضف سكنك
          </Link>
        )}

        {/* حالة المستخدم: إذا كان مسجل دخول */}
        {user ? (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-sm">
            <span className="text-lg">👤</span>
            <div className="flex flex-col text-right">
              <span className="font-bold text-gray-800 leading-tight">{user.fullName || 'مستخدم'}</span>
              <span className="text-xs font-semibold text-blue-600">
                ({user.userType})
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="mr-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 font-bold px-2 py-1 rounded-lg transition"
            >
              خروج
            </button>
          </div>
        ) : (
          /* لو مش مسجل دخول يظهر زرار تسجيل الدخول وحساب جديد */
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-700 hover:text-blue-600 px-3 py-2"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              إنشاء حساب
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;