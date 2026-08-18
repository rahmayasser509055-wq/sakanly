import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  const handleBookingClick = (e) => {
    e.preventDefault();
    
    // بنتاكد من الـ token لو مش موجود او فاضي
    const token = localStorage.getItem('token');

    if (!token || token === 'undefined' || token === 'null') {
      alert('يجب تسجيل الدخول أولاً كطالب لتتمكن من إتمام الحجز');
      navigate('/login');
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="relative bg-gray-900 text-white min-h-[500px] flex items-center justify-center overflow-hidden" dir="rtl">
      {/* صورة الخلفية مع طبقة إعتام */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80')`
        }}
      ></div>

      {/* المحتوى النصي */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-wide leading-tight">
          مرحباً بك في <span className="text-blue-500">سكنلي</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-200 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          نوفر لك أفضل حلول السكن الجامعي بسهولة وأكثر أماناً، لتبدأ رحلتك الجامعية وأنت مطمئن في مكان مريح وموثوق.
        </p>

        {/* زر الإجراء الرئيسي */}
        <button 
          onClick={handleBookingClick}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          احجز الآن
        </button>
      </div>
    </div>
  );
}

export default Hero;