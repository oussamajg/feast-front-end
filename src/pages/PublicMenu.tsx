import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X, Loader2 } from 'lucide-react';
import { usePublicMenuItems } from '@/services/menuItemService';
import { Category, MenuItem } from '@/lib/supabase';

// If no restaurant ID is provided, use a demo restaurant
const demoRestaurant = {
  name: "Bella's Bistro",
  description: "Fine dining with a modern twist",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=100&auto=format",
};

const PublicMenu = () => {
  const { restaurantId } = useParams<{ restaurantId?: string }>();
  const { data, isLoading, error } = usePublicMenuItems(restaurantId);
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Default to empty arrays if no data yet or data is not in the expected format
  const categories = Array.isArray(data) ? [] : (data?.categories as Category[] || []);
  const menuItems = Array.isArray(data) ? [] : (data?.menuItems as MenuItem[] || []);
  
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );

  // Update active category when data loads
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter menu items by active category
  const filteredItems = activeCategory 
    ? menuItems.filter(item => item.category_id === activeCategory)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-menu-purple mx-auto mb-4" />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Could not load menu</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't load the menu. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-menu-purple hover:bg-menu-dark-purple"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state if no categories
  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 text-4xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold mb-2">Menu Not Available</h2>
          <p className="text-gray-600 mb-6">
            This restaurant hasn't published their menu yet.
          </p>
          <Button asChild className="bg-menu-purple hover:bg-menu-dark-purple">
            <Link to="/login">Restaurant Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={demoRestaurant.logo} 
              alt="Restaurant Logo" 
              className="h-12 w-12 rounded-full mr-3 object-cover"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{demoRestaurant.name}</h1>
              <p className="text-sm text-gray-500">{demoRestaurant.description}</p>
            </div>
          </div>
          
          {isMobile && (
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu size={20} />
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Categories */}
          <div 
            className={cn(
              "w-full md:w-1/4 lg:w-1/5", 
              isMobile && "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
              isMobile && !mobileSidebarOpen && "translate-x-full",
              isMobile && mobileSidebarOpen && "translate-x-0"
            )}
          >
            {isMobile && mobileSidebarOpen && (
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold">Categories</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            )}
            
            <div className="p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left",
                      activeCategory === category.id 
                        ? "bg-menu-light-purple text-menu-purple font-medium" 
                        : "hover:bg-menu-light-purple/50"
                    )}
                    onClick={() => {
                      setActiveCategory(category.id);
                      if (isMobile) setMobileSidebarOpen(false);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </nav>
            </div>
            
            {isMobile && mobileSidebarOpen && (
              <div className="absolute inset-0 bg-black/30 -z-10" onClick={() => setMobileSidebarOpen(false)} />
            )}
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {categories.find(cat => cat.id === activeCategory)?.name || 'Menu'}
              </h2>
              <div className="h-1 w-20 bg-menu-purple mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <span className="font-medium text-menu-purple">${Number(item.price).toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No items found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-lg">{demoRestaurant.name}</p>
              <p className="text-gray-400 text-sm">{demoRestaurant.description}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link to="/login" className="text-white hover:text-menu-purple transition-colors">
                Restaurant Login
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Menu App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;
