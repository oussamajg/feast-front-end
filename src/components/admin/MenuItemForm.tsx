
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Image, X } from 'lucide-react';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  categories: { id: string; name: string }[];
  onSubmit: (data: MenuItemFormData, imageFile?: File) => void;
  initialData?: Partial<MenuItemFormData>;
  isSubmitting?: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  categories,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price?.toString() || '',
      categoryId: initialData?.categoryId || '',
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
      form.setValue('imageUrl', ''); // Clear URL field when uploading a file
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    form.setValue('imageUrl', '');
  };

  const handleSubmit = async (data: MenuItemFormData) => {
    try {
      await onSubmit(data, imageFile || undefined);
      setImageFile(null);
      if (!initialData) {
        // Only reset form for new items, not when editing
        form.reset();
        setPreviewUrl(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter item description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Image</FormLabel>
          
          {previewUrl ? (
            <div className="relative mt-2 w-full max-w-[300px]">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="rounded-md object-cover w-full h-[200px]" 
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
                <Image className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Upload an image or provide URL</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-full
                    file:border-0 file:text-sm file:font-semibold
                    file:bg-menu-light-purple file:text-menu-purple
                    hover:file:bg-menu-purple hover:file:text-white
                    cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter image URL" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value) {
                      setPreviewUrl(e.target.value);
                      setImageFile(null); // Clear file if URL is provided
                    } else if (!imageFile) {
                      setPreviewUrl(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Menu Item'}
        </Button>
      </form>
    </Form>
  );
};

export default MenuItemForm;
