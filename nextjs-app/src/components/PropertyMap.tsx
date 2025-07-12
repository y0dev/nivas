"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin, Home, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  address: string;
  price: number;
  type: 'house' | 'apartment' | 'condo';
  lat: number;
  lng: number;
  status: 'for-sale' | 'for-rent' | 'sold';
}

const sampleProperties: Property[] = [
  {
    id: '1',
    address: '123 Main St, Downtown',
    price: 450000,
    type: 'house',
    lat: 34.0522,
    lng: -118.2437,
    status: 'for-sale'
  },
  {
    id: '2',
    address: '456 Oak Ave, Midtown',
    price: 320000,
    type: 'condo',
    lat: 34.0622,
    lng: -118.2537,
    status: 'for-sale'
  },
  {
    id: '3',
    address: '789 Pine St, Uptown',
    price: 280000,
    type: 'apartment',
    lat: 34.0422,
    lng: -118.2337,
    status: 'for-rent'
  },
  {
    id: '4',
    address: '321 Elm St, Downtown',
    price: 520000,
    type: 'house',
    lat: 34.0522,
    lng: -118.2537,
    status: 'for-sale'
  },
  {
    id: '5',
    address: '654 Maple Dr, Midtown',
    price: 380000,
    type: 'condo',
    lat: 34.0622,
    lng: -118.2437,
    status: 'for-sale'
  },
  {
    id: '6',
    address: '987 Cedar Ln, Uptown',
    price: 290000,
    type: 'apartment',
    lat: 34.0422,
    lng: -118.2437,
    status: 'for-rent'
  }
];

export default function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const centerLat = 34.0522;
  const centerLng = -118.2437;

  const getPropertyIcon = (type: string, status: string) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold";
    
    if (status === 'sold') {
      return `${baseClasses} bg-gray-500`;
    } else if (status === 'for-rent') {
      return `${baseClasses} bg-green-500`;
    } else {
      return `${baseClasses} bg-blue-500`;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Map Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Property Map</h3>
            <p className="text-sm text-gray-600">Discover investment opportunities in your area</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                For Sale
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                For Rent
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                Sold
              </div>
            </div>
            <div className="border-l border-gray-300 h-4"></div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-1">H</div>
                House
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-1">C</div>
                Condo
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-1">A</div>
                Apartment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100" 
           style={{
             backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/><circle cx="50" cy="50" r="2" fill="%23dbeafe"/><text x="50" y="55" text-anchor="middle" font-size="3" fill="%236b7280">LA</text></svg>')`,
             backgroundSize: '100px 100px',
             backgroundRepeat: 'repeat'
           }}>
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                You are here
              </div>
            </div>

            {/* Property Pins */}
            {sampleProperties.map((property, index) => {
              // Calculate position relative to center
              const latDiff = property.lat - centerLat;
              const lngDiff = property.lng - centerLng;
              const x = 50 + (lngDiff * 1000); // Scale for visualization
              const y = 50 - (latDiff * 1000); // Invert Y axis
              
              return (
                <div
                  key={property.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{
                    left: `${Math.max(10, Math.min(90, x))}%`,
                    top: `${Math.max(10, Math.min(90, y))}%`,
                  }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative">
                    <div className={getPropertyIcon(property.type, property.status)}>
                      {property.type === 'house' ? 'H' : property.type === 'condo' ? 'C' : 'A'}
                    </div>
                    {selectedProperty?.id === property.id && (
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-10">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Home className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{property.address}</h4>
                            <div className="flex items-center mt-1">
                              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm font-semibold text-green-600">
                                {formatPrice(property.price)}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                property.status === 'for-sale' ? 'bg-blue-100 text-blue-800' :
                                property.status === 'for-rent' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {property.status === 'for-sale' ? 'For Sale' :
                                 property.status === 'for-rent' ? 'For Rent' : 'Sold'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

                         {/* Map Labels */}
             <div className="absolute top-4 left-4 text-xs text-gray-500 font-medium">
               Downtown LA
             </div>
             <div className="absolute top-8 right-8 text-xs text-gray-500 font-medium">
               Hollywood
             </div>
             <div className="absolute bottom-8 left-8 text-xs text-gray-500 font-medium">
               South LA
             </div>
             <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-medium">
               Westside
             </div>
             
             {/* Street Lines */}
             <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200 opacity-30"></div>
             <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 opacity-30"></div>
             <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200 opacity-30"></div>
             <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-200 opacity-30"></div>
             <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 opacity-30"></div>
             <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-200 opacity-30"></div>
             
             {/* Search Radius Circle */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
               <div className="w-64 h-64 border-2 border-blue-300 border-dashed rounded-full opacity-50"></div>
             </div>
          </>
        )}
      </div>

      {/* Map Controls */}
      <div className="bg-white px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
              Zoom In
            </button>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
              Zoom Out
            </button>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
              Reset View
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {sampleProperties.length} properties found
          </div>
        </div>
      </div>

      {/* Click outside to close property details */}
      {selectedProperty && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
} 