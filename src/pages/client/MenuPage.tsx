
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase, Category, MenuItem } from '@/lib/supabase';
import ClientLayout from '@/components/layouts/ClientLayout';
import DishCard from '@/components/client/DishCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const MenuPage = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);

  // Fetch all categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch menu items based on selected category
  const { data: menuItems, isLoading: loadingItems } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: async () => {
      let query = supabase.from('menu_items').select('*');
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !loadingCategories,
  });

  // Update selected category when URL param changes
  useEffect(() => {
    setSelectedCategory(categoryId);
  }, [categoryId]);

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of delicious dishes prepared with fresh ingredients by our expert chefs.
          </p>
        </div>

        {/* Categories Filter */}
        {loadingCategories ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-menu-purple" />
          </div>
        ) : (
          <div className="mb-8 overflow-x-auto pb-2">
            <Tabs 
              value={selectedCategory || 'all'} 
              onValueChange={(val) => setSelectedCategory(val === 'all' ? undefined : val)}
              className="w-full"
            >
              <TabsList className="mb-2 flex w-full h-auto flex-wrap gap-2">
                <TabsTrigger value="all" asChild>
                  <Link to="/menu" className={`px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-menu-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    All Categories
                  </Link>
                </TabsTrigger>
                {categories?.map(category => (
                  <TabsTrigger key={category.id} value={category.id} asChild>
                    <Link 
                      to={`/menu/${category.id}`}
                      className={`px-4 py-2 rounded-lg ${selectedCategory === category.id ? 'bg-menu-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category.name}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Menu Items */}
        {loadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {menuItems && menuItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <DishCard key={item.id} dish={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-600 mb-4">No items found in this category</h3>
                <p className="text-gray-500 mb-6">Try selecting a different category or check back later.</p>
                <Button asChild>
                  <Link to="/menu">View All Categories</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default MenuPage;
