
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import ClientLayout from '@/components/layouts/ClientLayout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/client/CartItem';
import { formatCurrency } from '@/lib/utils';

const CartPage = () => {
  const { items, clearCart, totalItems, totalPrice } = useCart();
  
  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here.');
  };
  
  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Your Cart
          </h1>
          
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCart} className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
            </Button>
          )}
        </div>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{formatCurrency(5)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(totalPrice * 0.1)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-menu-purple">{formatCurrency(totalPrice + 5 + (totalPrice * 0.1))}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mb-4" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/menu">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default CartPage;
