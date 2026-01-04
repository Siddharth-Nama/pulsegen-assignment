import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Upload, LogOut, User, Video } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100 selection:bg-red-500 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Pulse<span className="text-red-500">Gen</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <Link 
                    to="/" 
                    className={`text-sm font-medium transition-colors hover:text-red-400 ${isActive('/') ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    Dashboard
                  </Link>
                  {user.role !== 'viewer' && (
                    <Link 
                      to="/upload" 
                      className={`text-sm font-medium transition-colors hover:text-red-400 ${isActive('/upload') ? 'text-red-500' : 'text-gray-300'}`}
                    >
                      Upload
                    </Link>
                  )}
                  <div className="h-4 w-px bg-white/10 mx-2"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="truncate max-w-[100px]">{user.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-red-600/10 text-red-400 border border-red-500/20 rounded-full transition-all hover:border-red-500/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Log In</Link>
                  <Link 
                    to="/register" 
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-red-900/20 hover:shadow-red-600/40"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/5 absolute w-full left-0 animate-in slide-in-from-top-2">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-red-500 font-bold border border-white/10">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{user.role}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  
                  {user.role !== 'viewer' && (
                    <Link 
                      to="/upload" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      Upload Video
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-base font-medium bg-red-600/10 text-red-500 border border-red-500/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-3 py-3 rounded-lg text-base font-medium bg-red-600 text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PulseGen. All rights reserved.
          </p>
          <div className="mt-2 text-xs text-red-500/50 font-medium uppercase tracking-widest hover:text-red-500 transition-colors cursor-default">
            Made by Siddharth Nama
          </div>
        </div>
      </footer>
    </div>
  );
}
