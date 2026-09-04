import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CowLogo } from '../../components/ui/CowLogo';
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  ShoppingBag, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isAuthorized, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#003F2D] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium text-sm">অ্যাডমিন প্যানেল লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isAuthenticated && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">অননুমোদিত প্রবেশাধিকার</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            আপনার অ্যাকাউন্ট ({user?.email}) অ্যাডমিন হিসেবে অনুমোদিত নয়। অনুগ্রহ করে অনুমোদিত অ্যাডমিন ইমেইল দিয়ে লগইন করুন।
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-sm transition-colors cursor-pointer"
          >
            লগআউট করে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/admin/home',
      label: 'হোম কনটেন্ট',
      icon: Home,
      badge: null
    },
    {
      to: '/admin/products',
      label: 'প্রোডাক্টস (তথ্য)',
      icon: Package,
      badge: 'তথ্য'
    },
    {
      to: '/admin/sales',
      label: 'বিক্রয় পণ্য',
      icon: ShoppingBag,
      badge: 'মূল্যসহ'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col lg:flex-row text-gray-800 antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0 select-none">
        {/* Farm Brand */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#003F2D] flex items-center justify-center shrink-0">
            <CowLogo size="sm" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-[#003F2D] text-base leading-tight truncate">মজুমদার খামার</h2>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">অ্যাডমিন প্যানেল</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-[#003F2D] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-inherit font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#003F2D] transition-colors"
          >
            <span>পাবলিক ওয়েবসাইট</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-500 truncate">
            লগইন: <span className="font-medium text-gray-700">{user?.email || 'Admin'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="lg:hidden p-1 rounded-lg bg-[#003F2D] flex items-center justify-center shrink-0">
                <CowLogo size="xs" />
              </div>
              <div>
                <span className="font-bold text-[#003F2D] text-sm lg:hidden leading-none block">
                  মজুমদার খামার
                </span>
                <span className="hidden lg:block text-xs font-semibold text-[#003F2D] uppercase tracking-wider">
                  মজুমদার খামার ম্যানেজমেন্ট
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#003F2D] px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>সাইট দেখুন</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium text-xs transition-colors cursor-pointer border border-gray-200"
              title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>লগআউট</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown / Tabs */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm ${
                      isActive
                        ? 'bg-[#003F2D] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Persistent on small screens for fast thumb navigation) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1 px-2 flex justify-around items-center shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-xs font-semibold transition-all min-h-[48px] min-w-[56px] ${
                    isActive
                      ? 'text-[#003F2D] bg-emerald-50 font-bold scale-105'
                      : 'text-gray-500 hover:text-gray-900 active:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[11px] leading-tight truncate">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
