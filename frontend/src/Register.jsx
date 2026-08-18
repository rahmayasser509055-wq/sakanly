import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: 'طالب',
    fullName: '',
    phone: '',
    email: '',
    nationalId: '',
    birthDate: '',
    religion: '',
    governorate: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeData: false,
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // التحقق التلقائي من الرقم القومي فور اكتماله 14 رقم
  useEffect(() => {
    const checkNationalId = async () => {
      if (formData.nationalId && formData.nationalId.length === 14) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/check-national-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nationalId: formData.nationalId }),
          });
          const data = await response.json();
          if (data.exists) {
            setError(data.message);
          } else {
            setError('');
          }
        } catch (err) {
          console.error('خطأ في التحقق من الرقم القومي', err);
        }
      } else if (formData.nationalId.length < 14) {
        setError('');
      }
    };

    checkNationalId();
  }, [formData.nationalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (!formData.agreeData || !formData.agreeTerms) {
      setError('يرجى الموافقة على جميع الشروط والملاحظات');
      return;
    }

    setLoading(true);

    try {
      // تجهيز البيانات وتحويل البريد الإلكتروني إلى حروف صغيرة تماماً لمنع مشاكل الـ Case-Sensitivity
      const submissionData = {
        ...formData,
        email: formData.email.toLowerCase().trim()
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('تم إنشاء الحساب بنجاح! 🎉');
        navigate('/login');
      } else {
        setError(data.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      setError('تعذر الاتصال بالسيرفر، تأكد من تشغيل الباك إند');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-gray-100 relative overflow-hidden">
        
        {/* الدائرة الزخرفية بالعلوي */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-100 rounded-full blur-xl pointer-events-none"></div>

        <h2 className="text-2xl font-black text-center text-blue-600 mb-6">
          إنشاء حساب جديد
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* نوع الحساب */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-2">👥 نوع الحساب *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'طالب' })}
                className={`py-3 rounded-xl font-bold border text-xs flex flex-col items-center justify-center gap-1 transition ${
                  formData.userType === 'طالب'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>🎓</span>
                <span>طالب</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'مالك/وسيط' })}
                className={`py-3 rounded-xl font-bold border text-xs flex flex-col items-center justify-center gap-1 transition ${
                  formData.userType === 'مالك/وسيط'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>🏠</span>
                <span>مالك/وسيط</span>
              </button>
            </div>
          </div>

          {/* الاسم ورقم الهاتف */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">الاسم الكامل *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">رقم الهاتف *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
            <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl mt-1.5 flex items-start gap-2">
              <span className="text-amber-600 text-xs font-bold">⚠️</span>
              <p className="text-[10px] text-amber-800 leading-relaxed font-semibold">
                تأكد من صحة البريد الإلكتروني، سيتم استخدامه لتفعيل الحساب واسترجاع كلمة السر عند الحاجة.
              </p>
            </div>
          </div>

          {/* الرقم القومي */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-1">الرقم القومي *</label>
            <input
              type="text"
              name="nationalId"
              required
              maxLength="14"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* تاريخ الميلاد والديانة */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">تاريخ الميلاد *</label>
              <input
                type="date"
                name="birthDate"
                required
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">الديانة *</label>
              <select
                name="religion"
                required
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">اختر الديانة</option>
                <option value="مسلم">مسلم</option>
                <option value="مسيحي">مسيحي</option>
              </select>
            </div>
          </div>

          {/* المحافظة */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-1">المحافظة التي ترغب في الإيجار فيها *</label>
            <select
              name="governorate"
              required
              value={formData.governorate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">اختر المحافظة</option>
              <option value="الأقصر">الأقصر</option>
              <option value="قنا">قنا</option>
              <option value="أسوان">أسوان</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="أسيوط">أسيوط</option>
              <option value="سوهاج">سوهاج</option>
            </select>
          </div>

          {/* عنوان الإقامة التفصيلي */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-1">عنوان الإقامة التفصيلي *</label>
            <input
              type="text"
              name="address"
              required
              placeholder="العنوان كما في بطاقة الرقم القومي أو محل الإقامة"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* كلمات المرور */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">كلمة المرور *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1">تأكيد كلمة المرور *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* الشروط والملاحظات */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-[11px] space-y-2">
            <p className="font-bold text-blue-600">الشروط والأحكام:</p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeData"
                checked={formData.agreeData}
                onChange={handleChange}
                className="mt-0.5 rounded text-blue-600"
              />
              <span className="text-gray-600">أقر أن البيانات المدرجة صحيحة وأني أتحمل المسؤولية الكاملة.</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 rounded text-blue-600"
              />
              <span className="text-gray-600">أوافق على جميع الشروط والأحكام وسياسة الخصوصية والاستخدام.</span>
            </label>
          </div>

          {/* زر إنشاء الحساب */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <span>👤+</span>
            <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;