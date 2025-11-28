import React from 'react';
import { ShieldCheck, Truck, Clock, Heart } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586015555751-63c9733623f0?auto=format&fit=crop&q=80&w=2070" 
            alt="Pharmacy Warehouse" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-blue-600/80 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-2xl px-8 py-12 md:py-20 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Your Health, <br/> Delivered in Minutes.
          </h1>
          <p className="text-lg md:text-xl text-primary-50 mb-8 font-light">
            Order medicines from our verified warehouse. 
            Pharmacist-checked, tamper-proof, and delivered to your doorstep at lightning speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-transform transform hover:-translate-y-1"
            >
              Order Medicine Now
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Upload Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">100% Genuine</h3>
          <p className="text-gray-600">Sourced directly from manufacturers to our central warehouse. No middlemen, no fakes.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Superfast Delivery</h3>
          <p className="text-gray-600">Optimized logistics and local hubs ensure your medicines reach you within 2 hours.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacist Verified</h3>
          <p className="text-gray-600">Every prescription order is reviewed by a licensed pharmacist before packing.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-8">Trusted by thousands of families</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-extrabold text-primary-400 mb-2">50k+</div>
            <div className="text-gray-400">Orders Delivered</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary-400 mb-2">10k+</div>
            <div className="text-gray-400">Happy Users</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary-400 mb-2">1200+</div>
            <div className="text-gray-400">Medicines</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary-400 mb-2">4.8</div>
            <div className="text-gray-400">App Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};