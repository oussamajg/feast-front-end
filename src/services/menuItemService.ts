
import { supabase, type MenuItem } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Upload an image to Supabase storage
export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase
    .storage
    .from('menu-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  // Get the public URL for the uploaded image
  const { data: publicUrl } = supabase
    .storage
    .from('menu-images')
    .getPublicUrl(data.path);
    
  return publicUrl.publicUrl;
};

// Fetch all menu items for the current user
export const useMenuItems = (userId?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ['menuItems', userId, categoryId],
    queryFn: async () => {
      if (!userId) return [];
      
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('user_id', userId);
        
      // Filter by category if provided
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!userId,
  });
};

// Create a new menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      price, 
      categoryId, 
      userId,
      imageFile
    }: { 
      name: string; 
      description: string;
      price: number;
      categoryId: string;
      userId: string;
      imageFile?: File;
    }) => {
      // Upload image if provided
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, userId);
      }
      
      // Create menu item
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ 
          name, 
          description, 
          price, 
          category_id: categoryId, 
          user_id: userId,
          image_url: imageUrl || null
        }])
        .select('*')
        .single();
        
      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.userId, variables.categoryId] });
    },
  });
};

// Update an existing menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id,
      name, 
      description, 
      price, 
      categoryId, 
      userId,
      imageFile,
      currentImageUrl
    }: { 
      id: string;
      name: string; 
      description: string;
      price: number;
      categoryId: string;
      userId: string;
      imageFile?: File;
      currentImageUrl?: string;
    }) => {
      // Upload image if a new one is provided
      let imageUrl = currentImageUrl || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, userId);
      }
      
      // Update menu item
      const { data, error } = await supabase
        .from('menu_items')
        .update({ 
          name, 
          description, 
          price, 
          category_id: categoryId,
          image_url: imageUrl || null
        })
        .eq('id', id)
        .eq('user_id', userId) // For security, ensure user owns this menu item
        .select('*')
        .single();
        
      if (error) throw error;
      return data as MenuItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.userId, variables.categoryId] });
    },
  });
};

// Delete a menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // For security, ensure user owns this menu item
        
      if (error) throw error;
      return { id, success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', variables.userId] });
    },
  });
};

// Get public menu items for a restaurant
export const usePublicMenuItems = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['publicMenu', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      // Get all categories for this restaurant
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', restaurantId)
        .order('name');
        
      if (catError) throw catError;
      
      // Get all menu items for this restaurant
      const { data: menuItems, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('user_id', restaurantId)
        .order('name');
        
      if (itemsError) throw itemsError;
      
      // Organize by category
      return {
        categories: categories,
        menuItems: menuItems,
      };
    },
    enabled: !!restaurantId,
  });
};
