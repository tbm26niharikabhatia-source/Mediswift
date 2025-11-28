import React, { useState } from 'react';
import { Medicine, MedicineCategory, CartItem } from '../types';
import { Search, Plus, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface MarketplaceProps {
  medicines: Medicine[];
  onAddToCart: (medicine: Medicine) => void;
  cart: CartItem[];
  onUpdateCart: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  medicines, 
  onAddToCart, 
  cart,
  onUpdateCart,
  onCheckout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCartModal, setShowCartModal] = useState(false);

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const requiresPrescription = cart.some(item => item.requiresPrescription);

  return (
    <div className="pb-20">
      {/* Search Header */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for medicines, brands, or symptoms..."
            className="w-full px-5 py-4 pl-12 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
        </div>
        
        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          <button 
             onClick={() => setSelectedCategory('All')}
             className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            All Items
          </button>
          {Object.values(MedicineCategory).map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <div key={medicine.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
             <div className="relative mb-4 aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img src={medicine.imageUrl} alt={medicine.name} className="w-full h-full object-cover" />
                {medicine.requiresPrescription && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> Rx Required
                  </div>
                )}
             </div>
             <div className="flex-grow">
               <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{medicine.name}</h3>
               <p className="text-sm text-gray-500 mb-2">{medicine.brand} • {medicine.category}</p>
               <div className="flex items-end justify-between mt-2">
                  <div>
                    {medicine.originalPrice && (
                       <span className="text-xs text-gray-400 line-through mr-2">${medicine.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-xl font-bold text-primary-600">${medicine.price.toFixed(2)}</span>
                  </div>
                  {medicine.stock < 10 && (
                    <span className="text-xs text-red-500 font-medium">Only {medicine.stock} left</span>
                  )}
               </div>
             </div>
             <button 
               onClick={() => onAddToCart(medicine)}
               disabled={medicine.stock === 0}
               className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center transition-colors ${
                 medicine.stock === 0 
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                   : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
               }`}
             >
               {medicine.stock === 0 ? 'Out of Stock' : <><Plus className="w-4 h-4 mr-2" /> Add to Cart</>}
             </button>
          </div>
        ))}
      </div>

      {/* Floating Cart Summary if not empty */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-20 md:hidden">
           <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">{cart.length} Items</p>
                <p className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setShowCartModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg"
              >
                View Cart
              </button>
           </div>
        </div>
      )}

      {/* Cart Modal / Page Section (Simplified as a section for Desktop, Modal for Mobile) */}
      {(showCartModal || cart.length > 0) && (
        <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity flex justify-end ${showCartModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:static md:opacity-100 md:pointer-events-auto md:bg-transparent md:block hidden'}`}>
           <div className={`bg-white w-full md:w-96 h-full md:h-auto md:fixed md:top-24 md:right-8 md:rounded-2xl md:shadow-2xl md:border md:border-gray-100 flex flex-col transition-transform duration-300 transform ${showCartModal ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center">
                   <ShoppingBagIcon count={cart.length} /> 
                   <span className="ml-2">Your Cart</span>
                 </h2>
                 <button onClick={() => setShowCartModal(false)} className="md:hidden p-2 text-gray-500">Close</button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                 {cart.length === 0 ? (
                   <div className="text-center py-10 text-gray-500">Your cart is empty.</div>
                 ) : (
                   cart.map(item => (
                     <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} / unit</p>
                          {item.requiresPrescription && (
                            <span className="text-xs text-yellow-600 flex items-center mt-1"><FileText className="w-3 h-3 mr-1" /> Rx Required</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                           <button onClick={() => onUpdateCart(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-</button>
                           <span className="font-medium w-4 text-center">{item.quantity}</span>
                           <button onClick={() => onUpdateCart(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-b-2xl">
                   {requiresPrescription && (
                     <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        One or more items require a prescription. You will be asked to upload it on checkout.
                     </div>
                   )}
                   <div className="flex justify-between mb-4 text-lg font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                   </div>
                   <button 
                     onClick={onCheckout}
                     className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg transition-colors flex justify-center items-center"
                   >
                     Proceed to Checkout
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const ShoppingBagIcon = ({ count }: { count: number }) => (
  <div className="relative">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{count}</span>}
  </div>
);