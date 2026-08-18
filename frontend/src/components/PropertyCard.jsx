import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaComments } from 'react-icons/fa';

function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col text-right" dir="rtl">
      
      {/* صورة السكن والسعر */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow">
          {property.price} ج.م / شهرياً
        </div>
      </div>

      {/* تفاصيل السكن */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition">
            {property.title}
          </h3>
          
          {/* الموقع */}
          <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
            <FaMapMarkerAlt className="text-blue-500" />
            <span>{property.location}</span>
          </div>

          {/* المميزات الأساسية */}
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-3 my-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <FaBed className="text-gray-400" />
              <span>{property.beds} غرف</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="text-gray-400" />
              <span>{property.baths} حمام</span>
            </div>
            {property.wifi && (
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <FaWifi />
                <span>نت مجاني</span>
              </div>
            )}
          </div>
        </div>

        {/* الأزرار (عرض التفاصيل + مراسلة سريعة) */}
        <div className="space-y-2">
          <Link 
            to={`/property/${property.id}`} 
            className="w-full bg-gray-50 text-blue-600 hover:bg-blue-500 hover:text-white font-bold py-2.5 rounded-xl transition duration-200 text-center text-sm border border-blue-50 block"
          >
            عرض التفاصيل
          </Link>

          {/* زر مراسلة المالك الجديد */}
          <Link 
            to={`/chat/${property.id}`} 
            className="w-full bg-green-50 text-green-700 hover:bg-green-600 hover:text-white font-bold py-2.5 rounded-xl transition duration-200 text-center text-sm border border-green-100 flex items-center justify-center gap-1.5"
          >
            <FaComments />
            <span>مراسلة المالك</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default PropertyCard;