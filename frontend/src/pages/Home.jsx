import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import { FaBuilding, FaHome, FaCheckCircle } from 'react-icons/fa';

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80";

  useEffect(() => {
    // جلب العقارات الحقيقية من قاعدة البيانات
    fetch('http://localhost:5000/api/apartments')
      .then((res) => res.json())
      .then((data) => {
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
            id: item._id,
            title: item.title,
            price: item.price,
            location: item.location,
            beds: item.beds || item.rooms || 1,
            baths: item.baths || 1,
            wifi: true,
            image: imageUrl
          };
        });
        
        setProperties(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('خطأ في جلب بيانات الصفحة الرئيسية:', err);
        setLoading(false);
      });
  }, []);

  // حساب الإحصائيات الحقيقية من البيانات
  const totalApartments = properties.length;
  const totalBeds = properties.reduce((acc, curr) => acc + Number(curr.beds || 0), 0);

  const statsData = [
    { id: 1, title: 'إجمالي الشقق المتاحة', count: totalApartments, icon: <FaBuilding className="text-3xl text-blue-600" /> },
    { id: 2, title: 'إجمالي الأسِرّة', count: totalBeds, icon: <FaHome className="text-3xl text-blue-600" /> },
    { id: 3, title: 'خدمة متواصلة', count: '24/7', icon: <FaCheckCircle className="text-3xl text-blue-600" /> },
  ];

  return (
    <>
      <Hero />

      {/* قسم الإحصائيات الديناميكي */}
      <section className="py-10 bg-white my-10 rounded-3xl border border-gray-100 shadow-sm max-w-6xl mx-auto px-4" dir="rtl">
        <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">
          إحصائيات سكنلي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition">
              <div className="mb-3 p-4 bg-blue-50 rounded-2xl">
                {item.icon}
              </div>
              <span className="text-3xl font-extrabold text-gray-900 mb-1">{item.count}</span>
              <span className="text-gray-600 text-sm font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* قسم أحدث العقارات */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          أحدث العقارات المضافة حديثاً
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">جاري تحميل أحدث العقارات...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">لا توجد عقارات مضافة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Home;