import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Marketplace } from './components/Marketplace';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { getHealthAssistantResponse } from './services/geminiService';
import { Medicine, MedicineCategory, CartItem, User, UserRole, Order, OrderStatus } from './types';
import { Loader2, Send } from 'lucide-react';

// --- MOCK DATA INITIALIZATION ---
const MOCK_MEDICINES: Medicine[] = [
  { 
    id: '1', 
    name: 'Crocin Advance', 
    brand: 'GSK', 
    price: 1.50, 
    stock: 120, 
    requiresPrescription: false, 
    category: MedicineCategory.OTC, 
    description: 'Paracetamol 650mg for fever', 
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '2', 
    name: 'Atorvastatin 10mg', 
    brand: 'Sun Pharma', 
    price: 5.20, 
    stock: 45, 
    requiresPrescription: true, 
    category: MedicineCategory.PRESCRIPTION, 
    description: 'Cholesterol lowering', 
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '3', 
    name: 'Vitamin D3', 
    brand: 'HealthKart', 
    price: 12.00, 
    originalPrice: 15.00, 
    stock: 8, 
    requiresPrescription: false, 
    category: MedicineCategory.SUPPLEMENTS, 
    description: 'Bone health', 
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '4', 
    name: 'Insulin Pen', 
    brand: 'Novo Nordisk', 
    price: 25.00, 
    stock: 5, 
    requiresPrescription: true, 
    category: MedicineCategory.DIABETES, 
    description: 'Insulin delivery device', 
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '5', 
    name: 'Baby Wipes', 
    brand: 'Pampers', 
    price: 3.50, 
    stock: 200, 
    requiresPrescription: false, 
    category: MedicineCategory.BABY_CARE, 
    description: 'Gentle wipes', 
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400' 
  },
];

const App: React.FC = () => {
  // --- STATE ---
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);

  // --- ACTIONS ---

  const handleAddToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const handleUpdateCart = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }

    const requiresRx = cart.some(i => i.requiresPrescription);
    // In a real app, we would trigger file upload here if requiresRx is true
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user.id,
      items: [...cart],
      totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      status: requiresRx ? OrderStatus.PENDING_VERIFICATION : OrderStatus.APPROVED,
      prescriptionUrl: requiresRx ? 'mock_prescription.pdf' : undefined,
      timestamp: new Date()
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    
    if (requiresRx) {
       alert("Order Placed! Please wait for Pharmacist Verification.");
    } else {
       alert("Order Placed Successfully!");
    }
    
    // If user is pharmacist/admin, redirect to dashboard to see the order immediately (for demo flow)
    if (user.role !== UserRole.PATIENT) {
        setCurrentPage('dashboard');
    } else {
        setCurrentPage('home');
    }
  };

  // CRUD Actions for Inventory
  const handleAddMedicine = (m: Medicine) => setMedicines([...medicines, m]);
  const handleUpdateMedicine = (m: Medicine) => setMedicines(medicines.map(med => med.id === m.id ? m : med));
  const handleDeleteMedicine = (id: string) => setMedicines(medicines.filter(med => med.id !== id));

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // AI Logic
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const query = aiQuery;
    setAiQuery('');
    setAiChatHistory(prev => [...prev, { role: 'user', text: query }]);
    setIsAiLoading(true);

    const response = await getHealthAssistantResponse(query);
    
    setAiChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  // --- ROUTING RENDERER ---
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onStart={() => setCurrentPage('marketplace')} />;
      case 'auth':
        return <Auth onLogin={(u) => { setUser(u); setCurrentPage('home'); }} />;
      case 'marketplace':
      case 'cart': // Simplified routing: cart is part of marketplace flow or modal, but mapping specific route for sticky nav
        return (
          <Marketplace 
            medicines={medicines} 
            onAddToCart={handleAddToCart}
            cart={cart}
            onUpdateCart={handleUpdateCart}
            onCheckout={handleCheckout}
          />
        );
      case 'dashboard':
        return user?.role !== UserRole.PATIENT ? (
          <Dashboard 
            medicines={medicines}
            orders={orders}
            onAddMedicine={handleAddMedicine}
            onUpdateMedicine={handleUpdateMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        ) : (
          <div className="text-center py-20">Access Denied. Pharmacist only area.</div>
        );
      default:
        return <LandingPage onStart={() => setCurrentPage('marketplace')} />;
    }
  };

  return (
    <>
      <Layout 
        user={user} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onLogout={() => { setUser(null); setCurrentPage('home'); }}
        onToggleAI={() => setIsAIModalOpen(true)}
      >
        {renderContent()}
      </Layout>

      {/* AI Assistant Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
              <h2 className="font-bold flex items-center"><span className="mr-2">✨</span> MediSwift AI Assistant</h2>
              <button onClick={() => setIsAIModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><span className="text-xl">×</span></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
               {aiChatHistory.length === 0 && (
                 <div className="text-center text-gray-500 mt-10">
                   <p className="mb-2">Hello! I can help you with:</p>
                   <ul className="text-sm space-y-1">
                     <li>• Medicine usage & interactions</li>
                     <li>• Symptom checking</li>
                     <li>• Understanding prescriptions</li>
                   </ul>
                 </div>
               )}
               {aiChatHistory.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               {isAiLoading && (
                 <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                     <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                     <span className="text-xs text-gray-500">Thinking...</span>
                   </div>
                 </div>
               )}
            </div>

            <form onSubmit={handleAskAI} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask about a medicine..."
                className="flex-grow p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button 
                type="submit" 
                disabled={isAiLoading || !aiQuery.trim()}
                className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;