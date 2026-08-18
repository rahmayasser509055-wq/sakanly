import React from 'react';
import { FaBuilding, FaHome, FaCheckCircle } from 'react-icons/fa';

function Stats() {
  const statsData = [
    { id: 1, title: 'إجمالي الشقق', count: '16+', icon: <FaBuilding className="text-3xl text-blue-600" /> },
    { id: 2, title: 'سرير متاح', count: '104+', icon: <FaHome className="text-3xl text-blue-600" /> },
    { id: 3, title: 'حجز تم عبر الموقع', count: '50+', icon: <FaCheckCircle className="text-3xl text-blue-600" /> },
  ];

  return (
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
  );
}

export default Stats;