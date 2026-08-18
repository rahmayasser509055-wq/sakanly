import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();

  // 🛡️ شرط الحماية (Protected Route): المالك/الوسيط فقط
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.userType !== 'مالك/وسيط') {
      alert('⚠️ عفواً، إضافة السكن مخصصة للمُلاك والوسطاء فقط!');
      navigate('/'); // طرده للصفحة الرئيسية
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    propertyType: 'شقة كاملة', // نوع السكن
    bedrooms: '1',
    bedsCount: '1', // عدد السرر الإجمالي أو لكل غرفة
    bathrooms: '1',
    amenities: '', // المرافق والخدمات
    description: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('propertyType', formData.propertyType);
    data.append('bedrooms', formData.bedrooms);
    data.append('bedsCount', formData.bedsCount);
    data.append('bathrooms', formData.bathrooms);
    data.append('amenities', formData.amenities);
    data.append('description', formData.description);

    imageFiles.forEach((file) => {
      data.append('imageFiles', file);
    });

    try {
      const response = await fetch('[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)/api/apartments', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('تم إضافة السكن بجميع تفاصيله وصوره بنجاح! 🎉');
        navigate('/properties');
      } else {
        const errData = await response.json();
        console.error('تفاصيل الخطأ:', errData);
        alert(`حدث خطأ أثناء إضافة السكن: ${errData.details || errData.error || ''}`);
      }
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      alert('تعذر الاتصال بالسيرفر. تأكد من تشغيل الباك إند.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100" dir="rtl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">➕ إضافة سكن جديد وتفاصيل الحجز</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">عنوان الإعلان</label>
          <input
            type="text"
            name="title"
            required
            placeholder="مثال: شقة مفروشة بالقرب من الجامعة"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">السعر الشهري (ج.م)</label>
            <input
              type="number"
              name="price"
              required
              placeholder="مثال: 3000"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">المنطقة / المدينة</label>
            <input
              type="text"
              name="location"
              required
              placeholder="مثال: الأقصر - طيبة"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* نوع السكن */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">نوع السكن</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="شقة كاملة">شقة بالكامل</option>
            <option value="غرفة مستقلة">غرفة مستقلة</option>
            <option value="سرير في غرفة مشتركة">سرير في غرفة مشتركة</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">عدد الغرف</label>
            <input
              type="number"
              name="bedrooms"
              min="1"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">عدد السرر المتاحة</label>
            <input
              type="number"
              name="bedsCount"
              min="1"
              value={formData.bedsCount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">عدد الحمامات</label>
            <input
              type="number"
              name="bathrooms"
              min="1"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* المرافق والخدمات */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">المرافق والخدمات المتاحة</label>
          <input
            type="text"
            name="amenities"
            placeholder="مثال: واي فاي مجاني، تكييف، أثاث كامل، غسالة"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">وصف السكن والتفاصيل</label>
          <textarea
            name="description"
            rows="3"
            placeholder="اكتب تفاصيل الشقة ورقم التواصل..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          ></textarea>
        </div>

        {/* رفع صور متعددة */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">صور السكن (يمكنك اختيار أكثر من صورة)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previews.map((src, index) => (
                <img key={index} src={src} alt={`معاينة ${index}`} className="h-24 w-full object-cover rounded-xl border" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4 text-center cursor-pointer"
        >
          {loading ? 'جاري الإضافة والرفع...' : 'حفظ ونشر السكن 🚀'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;