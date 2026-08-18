import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaPhoneAlt, FaArrowRight, FaCheckCircle, FaComments } from 'react-icons/fa';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    fetch(`[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)/api/apartments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let imageUrl = defaultImage;
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          imageUrl = data.images[0].startsWith('http') ? data.images[0] : `[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)${data.images[0]}`;
        } else if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
          imageUrl = data.image.startsWith('http') ? data.image : `[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)${data.image}`;
        }

        setProperty({
          ...data,
          displayImage: imageUrl,
          imagesList: data.images && data.images.length > 0 ? data.images.map(img => img.startsWith('http') ? img : `[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)${img}`) : [imageUrl]
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ في جلب تفاصيل العقار:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-600">جاري تحميل تفاصيل السكن...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">عذراً، لم يتم العثور على هذا السكن!</h2>
        <Link to="/properties" className="text-blue-600 underline font-bold">العودة لقائمة العقارات</Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      
      {/* زر العودة */}
      <Link to="/properties" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-6 transition">
        <FaArrowRight />
        <span>العودة لكل العقارات</span>
      </Link>

      {/* عنوان العقار والموقع */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-3">{property.title || 'شقة مفروشة'}</h1>
        <div className="flex items-center text-gray-600 gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <span>{property.location || 'الموقع غير محدد'}</span>
        </div>
      </div>

      {/* معرض الصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-2xl overflow-hidden shadow-lg">
        {property.imagesList && property.imagesList.length > 0 ? (
          property.imagesList.map((img, index) => (
            <img key={index} src={img} alt={`صورة ${index + 1}`} className="w-full h-72 object-cover" onError={(e) => { e.target.src = defaultImage; }} />
          ))
        ) : (
          <img src={property.displayImage} alt="صورة السكن" className="w-full h-72 object-cover md:col-span-2" />
        )}
      </div>

      {/* التفاصيل والسعر */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* مميزات سريعة */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-around text-center">
            <div>
              <span className="text-gray-400 text-sm block">الغرف</span>
              <span className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
                <FaBed className="text-blue-500" /> {property.bedrooms || property.rooms || 1}
              </span>
            </div>
            <div className="border-r border-gray-100 pr-6">
              <span className="text-gray-400 text-sm block">الحمامات</span>
              <span className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
                <FaBath className="text-blue-500" /> {property.bathrooms || 1}
              </span>
            </div>
            <div className="border-r border-gray-100 pr-6">
              <span className="text-gray-400 text-sm block">الإنترنت</span>
              <span className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
                <FaWifi /> متوفر
              </span>
            </div>
          </div>

          {/* الوصف */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">وصف السكن</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description || 'لا يوجد وصف تفصيلي.'}</p>
          </div>

        </div>

        {/* كارت السعر والتواصل */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md sticky top-6">
            <div className="text-gray-500 text-sm mb-1">الإيجار الشهرى</div>
            <div className="text-3xl font-black text-blue-600 mb-6">
              {property.price || 0} <span className="text-sm font-normal text-gray-500">ج.م / شهرياً</span>
            </div>

            {/* زر واتساب */}
            <a 
              href={`https://wa.me/201102030702?text=${encodeURIComponent('السلام عليكم، استفسار عن السكن: ' + property.title)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white hover:bg-green-700 font-bold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md mb-3"
            >
              <FaPhoneAlt />
              <span>تواصل عبر واتساب</span>
            </a>

            {/* زر مراسلة المالك (شات المنصة) */}
            <Link 
              to={`/chat/${property._id || property.id}`} 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <FaComments />
              <span>مراسلة المالك 💬</span>
            </Link>
          </div>
        </div>

      </div>

    </main>
  );
}

export default PropertyDetails;