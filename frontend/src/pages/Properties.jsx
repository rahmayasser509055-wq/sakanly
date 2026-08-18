import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

const Properties = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);

  // حالات الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [genderType, setGenderType] = useState('all'); // شباب / بنات / الكل

  const location = useLocation();
  const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

  // استخراج نص البحث لو القادم من الفوتر (Search Query Param)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // دالة جلب السكنات من الباك إند مع معالجة الصور بشكل صحيح
  const fetchApartments = () => {
    fetch('http://localhost:5000/api/apartments')
      .then((res) => res.json())
      .then((data) => {
        // تنسيق البيانات ومعالجة الصور لضمان ظهور صور المالك الحقيقية
        const formattedData = data.map((item) => {
          let imageUrl = defaultImage;
          
          if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            imageUrl = item.images[0].startsWith('http') 
              ? item.images[0] 
              : `http://localhost:5000${item.images[0]}`;
          } else if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
            imageUrl = item.image.startsWith('http') 
              ? item.image 
              : `http://localhost:5000${item.image}`;
          }

          return {
            ...item,
            displayImage: imageUrl
          };
        });

        setApartments(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ في جلب البيانات:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // دالة حذف السكن
  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا السكن نهائياً؟')) {
      fetch(`http://localhost:5000/api/apartments/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          alert('تم حذف السكن بنجاح 🗑️');
          fetchApartments(); // إعادة تحديث القائمة فوراً
          if (selectedApartment && selectedApartment._id === id) {
            setSelectedApartment(null);
          }
        })
        .catch((err) => console.error('خطأ أثناء الحذف:', err));
    }
  };

  // تصفية السكنات
  const filteredApartments = apartments.filter((item) => {
    const matchesSearch = 
      !searchTerm ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPrice = maxPrice === '' || (item.price && Number(item.price) <= Number(maxPrice));

    const matchesGender = 
      genderType === 'all' || 
      (item.type && item.type === genderType) || 
      (item.category && item.category === genderType);

    return matchesSearch && matchesPrice && matchesGender;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-600">جاري تحميل السكنات المتاحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-black text-gray-800 mb-6 text-center">
        🏠 السكنات المتاحة حالياً
      </h1>

      {/* ----------------- شريط البحث والفلترة ----------------- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        
        {/* مربع البحث */}
        <div className="flex-1 w-full">
          <input 
            type="text" 
            placeholder="🔍 ابحث بالمدينة، المنطقة، أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>

        {/* فلتر السعر */}
        <div className="w-full md:w-44">
          <input 
            type="number" 
            placeholder="💰 الحد الأقصى للسعر"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>

        {/* فلتر النوع (شباب / بنات) */}
        <div className="w-full md:w-40">
          <select 
            value={genderType}
            onChange={(e) => setGenderType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white text-gray-700 font-medium"
          >
            <option value="all">👥 الكل (شباب وبنات)</option>
            <option value="شباب">👨 سكن شباب</option>
            <option value="بنات">👩 سكن بنات</option>
          </select>
        </div>

        {/* زر إعادة الفلترة */}
        {(searchTerm || maxPrice || genderType !== 'all') && (
          <button 
            onClick={() => { setSearchTerm(''); setMaxPrice(''); setGenderType('all'); }}
            className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-2 bg-red-50 rounded-xl whitespace-nowrap transition"
          >
            إلغاء الفلترة
          </button>
        )}
      </div>

      {/* ----------------- عرض الكروت ----------------- */}
      {filteredApartments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-bold mb-2">لا توجد نتائج تطابق بحثك حالياً 🔍</p>
          <p className="text-gray-400 text-sm">جرّب تغيير كلمات البحث أو إلغاء الفلاتر لتصفح جميع السكنات المتاحة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApartments.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                  <img
                    src={item.displayImage}
                    alt={item.title || "صورة السكن"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = defaultImage; }}
                  />
                  {(item.type || item.category) && (
                    <span className="absolute top-3 right-3 bg-slate-900/80 text-amber-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {item.type || item.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {item.title || 'شقة مفروشة للمغتربين'}
                  </h2>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-amber-600 font-black text-xl">
                      {item.price ? `${item.price} ج.م` : 'غير محدد'} <span className="text-xs text-gray-500 font-normal">/ شهرياً</span>
                    </span>
                    {item.location && (
                      <span className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                        📍 {item.location}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description || 'لا يوجد وصف إضافي'}
                  </p>

                  <div className="flex items-center justify-between text-gray-500 text-sm border-t pt-3 mb-4">
                    <span>🛏️ {item.bedrooms || item.rooms || 1} غرف</span>
                    <span>🛁 {item.bathrooms || 1} حمام</span>
                  </div>
                </div>
              </div>

              {/* أزرار التفاصيل، المراسلة، والحذف */}
              <div className="px-5 pb-5 pt-0 space-y-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedApartment(item)}
                    className="flex-1 bg-[#0B1E3A] hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-xl transition-all shadow-md text-center text-sm"
                  >
                    عرض التفاصيل 📞
                  </button>

                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3.5 py-2.5 rounded-xl transition-all text-sm border border-red-200 flex items-center justify-center"
                    title="حذف السكن"
                  >
                    🗑️
                  </button>
                </div>

                {/* زر مراسلة المالك الأخضر */}
                <Link 
                  to={`/chat/${item._id}`} 
                  className="w-full bg-green-50 text-green-700 hover:bg-green-600 hover:text-white font-bold py-2.5 rounded-xl transition duration-200 text-center text-sm border border-green-100 flex items-center justify-center gap-1.5 block"
                >
                  <FaComments />
                  <span>مراسلة المالك</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ----------------- النافذة المنبثقة (Modal) ----------------- */}
      {selectedApartment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedApartment(null)}
              className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md z-10"
            >
              ✕
            </button>

            <img 
              src={selectedApartment.displayImage} 
              alt="السكن" 
              className="w-full h-56 object-cover"
              onError={(e) => { e.target.src = defaultImage; }}
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedApartment.title || 'شقة مفروشة للمغتربين'}
              </h3>

              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-black text-amber-600">
                  {selectedApartment.price ? `${selectedApartment.price} ج.م` : 'غير محدد'} / شهرياً
                </span>
                <span className="bg-amber-100 text-amber-900 text-sm px-3 py-1 rounded-full font-semibold">
                  📍 {selectedApartment.location}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1 text-sm">تفاصيل الوصف والخدمات:</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedApartment.description || 'لا يوجد وصف تفصيلي متاح لهذا السكن.'}
                </p>
              </div>

              <div className="flex justify-around text-slate-700 text-sm mb-6 bg-amber-50 py-3 rounded-xl border border-amber-100">
                <span>🛏️ <b>{selectedApartment.bedrooms || selectedApartment.rooms || 1}</b> غرف</span>
                <span>🛁 <b>{selectedApartment.bathrooms || 1}</b> حمام</span>
              </div>

              <div className="space-y-2">
                <Link 
                  to={`/chat/${selectedApartment._id}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2 block"
                >
                  <FaComments />
                  <span>مراسلة المالك (شات مباشر)</span>
                </Link>

                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(`https://wa.me/201102030702?text=${encodeURIComponent('السلام عليكم، استفسار عن السكن: ' + selectedApartment.title)}`, '_blank')}
                    className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-bold py-3 rounded-xl transition-all text-center text-sm border border-green-200"
                  >
                    💬 واتساب سريع
                  </button>
                  <button 
                    onClick={() => setSelectedApartment(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-5 py-3 rounded-xl transition-all text-sm"
                  >
                    إغلاق
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Properties;