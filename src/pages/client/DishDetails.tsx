
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { supabase, MenuItem, Category } from '@/lib/supabase';
import ClientLayout from '@/components/layouts/ClientLayout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

const DishDetails = () => {
  const { dishId } = useParams<{ dishId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Fetch dish details
  const { data: dish, isLoading: loadingDish } = useQuery({
    queryKey: ['dish', dishId],
    queryFn: async () => {
      if (!dishId) throw new Error('Dish ID is required');
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', dishId)
        .single();
        
      if (error) throw error;
      return data as MenuItem;
    },
    enabled: !!dishId,
  });
  
  // Fetch category information
  const { data: category } = useQuery({
    queryKey: ['category', dish?.category_id],
    queryFn: async () => {
      if (!dish?.category_id) throw new Error('Category ID is required');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', dish.category_id)
        .single();
        
      if (error) throw error;
      return data as Category;
    },
    enabled: !!dish?.category_id,
  });
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (dish) {
      addToCart(dish, quantity);
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (loadingDish) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-menu-purple" />
        </div>
      </ClientLayout>
    );
  }
  
  if (!dish) {
    return (
      <ClientLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dish Not Found</h2>
          <p className="text-gray-600 mb-6">The dish you're looking for doesn't exist or has been removed.</p>
          <Button onClick={goBack}>Go Back</Button>
        </div>
      </ClientLayout>
    );
  }
  
  const imageUrl = dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';
  
  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={goBack} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dish Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src={imageUrl} 
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Dish Details */}
          <div>
            {category && (
              <div className="text-sm text-menu-purple mb-2 font-medium">
                {category.name}
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{dish.name}</h1>
            
            <div className="text-xl font-semibold text-menu-purple mb-4">
              {formatCurrency(dish.price)}
            </div>
            
            <div className="prose mb-6">
              <p className="text-gray-600">{dish.description}</p>
            </div>
            
            {dish.ingredients && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <p className="text-gray-600">{dish.ingredients}</p>
              </div>
            )}
            
            {dish.allergens && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Allergens</h3>
                <p className="text-gray-600">{dish.allergens}</p>
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <div className="w-24 mr-4">
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="text-center"
                />
              </div>
              <Button onClick={handleAddToCart} className="flex-1 bg-menu-purple hover:bg-menu-dark-purple">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default DishDetails;
