import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import PropertyDetails from './pages/PropertyDetails';
import AuthPage from './pages/AuthPage'; // استدعاء صفحة المصادقة الموحدة

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl">
      {/* الهيدر */}
      <Navbar />

      {/* محتوى الصفحات */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          {/* مسارات إضافة السكن */}
          <Route path="/add-apartment" element={<AddProperty />} />
          <Route path="/add-property" element={<AddProperty />} />

          {/* مسارات الحسابات الموحدة الذكية */}
          <Route path="/login" element={<AuthPage initialMode={false} />} />
          <Route path="/register" element={<AuthPage initialMode={true} />} />
        </Routes>
      </div>

      {/* الفوتير */}
      <Footer />
    </div>
  );
}

export default App;