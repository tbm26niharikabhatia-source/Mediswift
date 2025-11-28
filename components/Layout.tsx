import React, { useState } from 'react';
import { Pill, ShoppingCart, User as UserIcon, Menu, X, LayoutDashboard, Home, Search, Bot } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  cartCount: number;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  onToggleAI: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  cartCount, 
  onNavigate, 
  currentPage,
  onLogout,
  onToggleAI
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'marketplace', label: 'Medicines', icon: Search },
  ];

  if (user?.role === UserRole.PHARMACIST || user?.role === UserRole.ADMIN) {
    navItems.push({ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-primary-500 p-2 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">MediSwift</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    currentPage === item.id ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => onNavigate('cart')}
                    className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('auth')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium transition-all"
                >
                  Login / Signup
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
               {user && (
                 <button 
                  onClick={() => onNavigate('cart')}
                  className="relative p-2 mr-2 text-gray-500"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
               )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center ${
                    currentPage === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    onNavigate('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
                >
                  Login / Signup
                </button>
              )}
               {user && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Floating Action Button for AI */}
      <button 
        onClick={onToggleAI}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-40 flex items-center justify-center"
        aria-label="Ask AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Mobile Bottom Nav (Simulated for real mobile feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-30 pb-safe">
        <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${currentPage === 'home' ? 'text-primary-600' : 'text-gray-400'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => onNavigate('marketplace')} className={`flex flex-col items-center ${currentPage === 'marketplace' ? 'text-primary-600' : 'text-gray-400'}`}>
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
        {user ? (
          <button onClick={() => onNavigate('cart')} className={`flex flex-col items-center ${currentPage === 'cart' ? 'text-primary-600' : 'text-gray-400'}`}>
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs mt-1">Cart</span>
          </button>
        ) : (
          <button onClick={() => onNavigate('auth')} className={`flex flex-col items-center ${currentPage === 'auth' ? 'text-primary-600' : 'text-gray-400'}`}>
            <UserIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Login</span>
          </button>
        )}
      </div>
    </div>
  );
};