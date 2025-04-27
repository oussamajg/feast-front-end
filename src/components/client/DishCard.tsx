
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface DishCardProps {
  dish: MenuItem;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart } = useCart();
  const imageUrl = dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish, 1);
  };

  return (
    <Link to={`/dish/${dish.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-menu-purple/30">
        {/* Image */}
        <div className="h-44 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-menu-purple">
              {dish.name}
            </h3>
            <span className="font-medium text-menu-purple">
              {formatCurrency(dish.price)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {dish.description}
          </p>
          
          <div className="mt-4">
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              className="w-full border-menu-purple text-menu-purple hover:bg-menu-light-purple"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
