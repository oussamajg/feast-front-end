
import { supabase, type Category } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch categories for the current user
export const useCategories = (userId?: string) => {
  return useQuery({
    queryKey: ['categories', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');
        
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!userId,
  });
};

// Create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, userId }: { name: string; userId: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: userId }])
        .select('*')
        .single();
        
      if (error) throw error;
      return data as Category;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.userId] });
    },
  });
};

// Update an existing category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name, userId }: { id: string; name: string; userId: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .eq('user_id', userId) // For security, ensure user owns this category
        .select('*')
        .single();
        
      if (error) throw error;
      return data as Category;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.userId] });
    },
  });
};

// Delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      // First check if there are menu items using this category
      const { data: menuItems, error: checkError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('category_id', id)
        .limit(1);
        
      if (checkError) throw checkError;
      
      // If menu items exist, don't delete the category
      if (menuItems && menuItems.length > 0) {
        throw new Error('Cannot delete category with menu items. Remove menu items first.');
      }
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // For security, ensure user owns this category
        
      if (error) throw error;
      return { id, success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.userId] });
    },
  });
};
