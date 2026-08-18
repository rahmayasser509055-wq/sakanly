import React from 'react';

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">عن منصة سكنلي</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <p className="text-gray-700 text-lg leading-relaxed">
          منصة <strong className="text-blue-600">سكنلي</strong> هي المنصة الأولى والأسهل للطلاب المغتربين للبحث عن سكن جامعي آمن ومريح بالقرب من جامعاتهم في مختلف المحافظات.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          نهدف إلى توفير تجربة موثوقة تجمع بين أصحاب العقارات والطلاب للوصول إلى سكن مريح وبأسعار مناسبة وبأسهل الطرق.
        </p>
      </div>
    </div>
  );
}

export default About;