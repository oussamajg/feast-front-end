
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { MenuItem } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: MenuItem & { quantity: number };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';
  
  return (
    <div className="p-4 flex">
      {/* Image */}
      <Link to={`/dish/${item.id}`} className="w-20 h-20 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover rounded"
        />
      </Link>
      
      {/* Content */}
      <div className="ml-4 flex-grow">
        <div className="flex justify-between mb-1">
          <Link to={`/dish/${item.id}`} className="font-medium text-gray-800 hover:text-menu-purple">
            {item.name}
          </Link>
          <span className="font-medium text-menu-purple">{formatCurrency(item.price * item.quantity)}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="mx-3 text-sm">{item.quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Remove Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-red-500"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
