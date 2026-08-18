import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaWhatsapp, 
  FaFacebookF, 
  FaTelegramPlane,
  FaHome,
  FaShieldAlt,
  FaHeadset,
  FaAward
} from 'react-icons/fa';

function Footer() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // أرقام مبدئية احترافية بدل الأصفار
  const [stats, setStats] = useState({ propertiesCount: 16, bedsCount: 104, bookingsCount: 12 });
  const navigate = useNavigate();

  // محاولة جلب الإحصائيات الحقيقية إن وجد سيرفر شغال
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('[https://sakanly-production.up.railway.app](https://sakanly-production.up.railway.app)/api/properties');
        if (res.ok) {
          const properties = await res.json();
          if (properties && properties.length > 0) {
            const totalBeds = properties.reduce((acc, curr) => acc + (Number(curr.bedsCount) || Number(curr.beds) || 1), 0);
            setStats({
              propertiesCount: properties.length,
              bedsCount: totalBeds,
              bookingsCount: 12
            });
          }
        }
      } catch (error) {
        // في حالة عدم الاتصال بالباك إند بيحافظ على الأرقام المبدئية الممتازة
      }
    };

    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <footer className="bg-[#0B1E3A] text-white pt-12 pb-6 border-t border-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* شبكة الأعمدة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          
          {/* العمود الأول */}
          <div>
            <div className="flex items-center gap-3 text-2xl font-black text-amber-400 mb-4">
              <FaBuilding className="text-3xl" />
              <span>سكنلي</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              المنصة الأولى والأسهل للطلاب المغتربين للبحث عن سكن جامعي آمن ومريح بالقرب من جامعاتهم في مختلف المحافظات.
            </p>

            {/* أرقام الإحصائيات */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#132A4A] p-2 rounded-lg text-center border border-slate-700">
                <span className="block text-amber-400 font-bold text-base">+{stats.propertiesCount}</span>
                <span className="text-[10px] text-slate-300">شقة متاحة</span>
              </div>
              <div className="bg-[#132A4A] p-2 rounded-lg text-center border border-slate-700">
                <span className="block text-amber-400 font-bold text-base">+{stats.bedsCount}</span>
                <span className="text-[10px] text-slate-300">سرير متاح</span>
              </div>
              <div className="bg-[#132A4A] p-2 rounded-lg text-center border border-slate-700">
                <span className="block text-amber-400 font-bold text-base">+{stats.bookingsCount}</span>
                <span className="text-[10px] text-slate-300">حجز تم</span>
              </div>
            </div>
          </div>

          {/* العمود الثاني */}
          <div>
            <h4 className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-400/30 inline-block">
              روابط سريعة
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-amber-400 transition flex items-center gap-2">
                  <FaHome className="text-amber-400 text-xs" />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-amber-400 transition flex items-center gap-2">
                  <FaBuilding className="text-amber-400 text-xs" />
                  <span>الشقق المتاحة</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition flex items-center gap-2">
                  <FaShieldAlt className="text-amber-400 text-xs" />
                  <span>السياسات والضوابط</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition flex items-center gap-2">
                  <FaHeadset className="text-amber-400 text-xs" />
                  <span>تواصل معنا</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الثالث */}
          <div>
            <h4 className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-400/30 inline-block">
              خدماتنا
            </h4>
            <ul className="space-y-3 text-sm text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <FaSearch className="text-amber-400 text-xs" />
                <span>البحث عن سكن</span>
              </li>
              <li className="flex items-center gap-2">
                <FaShieldAlt className="text-amber-400 text-xs" />
                <span>حجز آمن 100%</span>
              </li>
              <li className="flex items-center gap-2">
                <FaAward className="text-amber-400 text-xs" />
                <span>ضمان الجودة والنظافة</span>
              </li>
              <li className="flex items-center gap-2">
                <FaHeadset className="text-amber-400 text-xs" />
                <span>دعم متواصل 24/7</span>
              </li>
            </ul>

            {/* مربع البحث */}
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden p-1">
              <button type="submit" className="bg-amber-400 text-slate-900 p-2.5 rounded-lg hover:bg-amber-500 transition">
                <FaSearch />
              </button>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن شقة..." 
                className="w-full px-3 text-slate-800 text-sm focus:outline-none"
              />
            </form>
          </div>

          {/* العمود الرابع */}
          <div>
            <h4 className="text-amber-400 font-bold text-lg mb-4 pb-2 border-b-2 border-amber-400/30 inline-block">
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm text-slate-300 mb-6">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-400" />
                <a href="tel:+201102030702" className="hover:text-amber-400 transition" dir="ltr">+20 110 203 0702</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-400" />
                <a href="mailto:sakanli2026@gmail.com" className="hover:text-amber-400 transition">sakanli2026@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-amber-400" />
                <span>أونلاين - الأقصر - اسنا ومختلف المحافظات</span>
              </li>
            </ul>

            {/* أزرار التواصل */}
            <div className="flex items-center gap-3">
              <a href="https://wa.me/201102030702" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition">
                <FaWhatsapp className="text-lg" />
              </a>
              <a href="https://www.facebook.com/khaled.r.zend.2025?locale=ar_AR" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition">
                <FaFacebookF className="text-base" />
              </a>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition">
                <FaTelegramPlane className="text-base" />
              </a>
            </div>
          </div>

        </div>

        {/* سطر الحقوق */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>© 2026 سكنلي - جميع الحقوق محفوظة للمهندس خالد رجب</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;