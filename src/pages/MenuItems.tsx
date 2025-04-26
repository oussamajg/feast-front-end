
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock categories
const categories = [
  { id: '1', name: 'Appetizers' },
  { id: '2', name: 'Main Courses' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Drinks' },
  { id: '5', name: 'Specials' },
];

// Mock menu items
const initialMenuItems = [
  { 
    id: '1', 
    name: 'Caesar Salad', 
    description: 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan cheese',
    price: 8.99,
    categoryId: '1',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=200&auto=format'
  },
  { 
    id: '2', 
    name: 'Margherita Pizza', 
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    categoryId: '2',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=200&auto=format'
  },
  { 
    id: '3', 
    name: 'Chocolate Lava Cake', 
    description: 'Warm chocolate cake with a molten chocolate center',
    price: 6.99,
    categoryId: '3',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=200&auto=format'
  },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
}

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const filteredMenuItems = filterCategory 
    ? menuItems.filter(item => item.categoryId === filterCategory)
    : menuItems;

  const handleOpenDialog = (item: MenuItem | null = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        image: item.image
      });
    } else {
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: ''
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (item: MenuItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMenuItem = () => {
    if (!validateForm()) {
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format' // Default image
    };

    if (currentItem) {
      // Update existing item
      setMenuItems(menuItems.map(item => 
        item.id === currentItem.id ? { ...item, ...itemData } : item
      ));
      toast({
        title: "Menu item updated",
        description: `${itemData.name} has been updated successfully.`,
      });
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...itemData
      };
      setMenuItems([...menuItems, newItem]);
      toast({
        title: "Menu item created",
        description: `${itemData.name} has been added successfully.`,
      });
    }
    
    handleCloseDialog();
  };

  const handleDeleteMenuItem = () => {
    if (currentItem) {
      setMenuItems(menuItems.filter(item => item.id !== currentItem.id));
      toast({
        title: "Menu item deleted",
        description: `${currentItem.name} has been deleted successfully.`,
      });
      handleCloseDeleteDialog();
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Menu Items</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Select 
              value={filterCategory} 
              onValueChange={setFilterCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="bg-menu-purple hover:bg-menu-dark-purple whitespace-nowrap"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredMenuItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <Image size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {categories.find(cat => cat.id === item.categoryId)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {filterCategory
                ? "No menu items found in this category"
                : "No menu items found. Add your first menu item!"}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-2">
                Item Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="text-sm font-medium block mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-7 ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="categoryId" className="text-sm font-medium block mb-2">
                  Category
                </label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                >
                  <SelectTrigger id="categoryId" className={errors.categoryId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="image" className="text-sm font-medium block mb-2">
                Image URL (optional)
              </label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for default image</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              className="bg-menu-purple hover:bg-menu-dark-purple" 
              onClick={handleSaveMenuItem}
            >
              {currentItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteMenuItem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MenuItems;
