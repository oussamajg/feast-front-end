
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// Mock restaurant data
const restaurant = {
  name: "Bella's Bistro",
  description: "Fine dining with a modern twist",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=100&auto=format",
};

// Mock categories
const categories = [
  { id: '1', name: 'Appetizers' },
  { id: '2', name: 'Main Courses' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Drinks' },
  { id: '5', name: 'Specials' },
];

// Mock menu items
const menuItems = [
  { 
    id: '1', 
    name: 'Caesar Salad', 
    description: 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan cheese',
    price: 8.99,
    categoryId: '1',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=400&auto=format'
  },
  { 
    id: '2', 
    name: 'Bruschetta', 
    description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, tomato, and herbs',
    price: 7.99,
    categoryId: '1',
    image: 'https://images.unsplash.com/photo-1572695157671-bbc5f95a1a04?q=80&w=400&auto=format'
  },
  { 
    id: '3', 
    name: 'Margherita Pizza', 
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    categoryId: '2',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=400&auto=format'
  },
  { 
    id: '4', 
    name: 'Grilled Salmon', 
    description: 'Fresh salmon fillet grilled to perfection with lemon butter sauce',
    price: 16.99,
    categoryId: '2',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format'
  },
  { 
    id: '5', 
    name: 'Chocolate Lava Cake', 
    description: 'Warm chocolate cake with a molten chocolate center',
    price: 6.99,
    categoryId: '3',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format'
  },
  { 
    id: '6', 
    name: 'Tiramisu', 
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 7.99,
    categoryId: '3',
    image: 'https://images.unsplash.com/photo-1586040140378-b5607a1dfd6e?q=80&w=400&auto=format'
  },
  { 
    id: '7', 
    name: 'House Cocktail', 
    description: 'Our signature cocktail with gin, elderflower, and fresh lime',
    price: 9.99,
    categoryId: '4',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400&auto=format'
  },
  { 
    id: '8', 
    name: 'Seasonal Special Pasta', 
    description: 'Chef\'s special pasta with seasonal ingredients',
    price: 15.99,
    categoryId: '5',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&auto=format'
  },
];

const PublicMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredItems = menuItems.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {restaurant.logo && (
              <img 
                src={restaurant.logo} 
                alt={restaurant.name} 
                className="h-12 w-12 rounded-full mr-3 object-cover"
              />
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{restaurant.name}</h1>
              <p className="text-sm text-gray-500">{restaurant.description}</p>
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
                {categories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              <div className="h-1 w-20 bg-menu-purple mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="menu-card">
                    <div className="h-48 overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
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
                        <span className="font-medium text-menu-purple">${item.price.toFixed(2)}</span>
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
              <p className="font-bold text-lg">{restaurant.name}</p>
              <p className="text-gray-400 text-sm">{restaurant.description}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link to="/login" className="text-white hover:text-menu-purple transition-colors">
                Restaurant Login
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;

// Missing X icon component
function X(props: React.ComponentProps<'svg'> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
