
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, X, Home, Book, Tag, Settings, LogOut,
  User, ChartBar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Menu Items', path: '/menu-items', icon: Book },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Statistics', path: '/statistics', icon: ChartBar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 transform bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out z-30",
          isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="font-bold text-xl text-menu-purple">MenuMaster</div>
            {isMobile && (
              <button onClick={toggleSidebar} className="p-2">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    location.pathname === item.path 
                      ? "bg-menu-light-purple text-menu-dark-purple" 
                      : "hover:bg-menu-light-purple/50"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    closeSidebarIfMobile();
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left font-normal hover:bg-menu-light-purple/50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : "ml-64"
      )}>
        {/* Top navbar */}
        <header className="bg-white shadow h-16 flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {isMobile && (
                <button onClick={toggleSidebar} className="p-2 mr-2">
                  <Menu size={20} />
                </button>
              )}
              <h1 className="text-xl font-semibold">
                {navItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-sm hidden sm:block">
                <p className="font-medium">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-menu-purple text-white flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
