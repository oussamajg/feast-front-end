
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/supabase';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Default image if none provided
  const imageUrl = category.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80';

  return (
    <Link to={`/menu/${category.id}`} className="group">
      <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-menu-purple/30 bg-white">
        <div className="h-36 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-menu-purple">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{category.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
