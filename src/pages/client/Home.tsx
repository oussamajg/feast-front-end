
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { supabase, Category } from '@/lib/supabase';
import ClientLayout from '@/components/layouts/ClientLayout';
import CategoryCard from '@/components/client/CategoryCard';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['featuredCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(4);
        
      if (error) throw error;
      return data as Category[];
    }
  });

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-menu-light-purple to-purple-100 rounded-2xl overflow-hidden my-8">
        <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Discover Delicious Food for Every Taste
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Explore our diverse menu offering quality dishes prepared with fresh ingredients. From appetizers to desserts, we have something for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/menu">View Full Menu</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Delicious food showcase" 
                className="rounded-lg shadow-xl w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="my-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Popular Categories</h2>
          <Button variant="ghost" asChild>
            <Link to="/menu" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <p className="text-gray-500 col-span-4 text-center py-10">No categories found. Check back soon!</p>
            )}
          </div>
        )}
      </section>

      {/* Feature Sections */}
      <section className="my-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-menu-light-purple rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-menu-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Our delivery service ensures your food arrives hot and fresh to your door.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-menu-light-purple rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-menu-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
            <p className="text-gray-600">We use only the freshest ingredients to ensure quality and taste.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-menu-light-purple rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-menu-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Special Offers</h3>
            <p className="text-gray-600">Check our special deals and seasonal menus throughout the year.</p>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};

export default Home;
