
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock category data
const initialCategories = [
  { id: '1', name: 'Appetizers' },
  { id: '2', name: 'Main Courses' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Drinks' },
  { id: '5', name: 'Specials' },
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [currentCategory, setCurrentCategory] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleOpenDialog = (category: { id: string; name: string } | null = null) => {
    setCurrentCategory(category);
    setCategoryName(category ? category.name : '');
    setError('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentCategory(null);
    setCategoryName('');
  };

  const handleOpenDeleteDialog = (category: { id: string; name: string }) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  const handleSaveCategory = () => {
    // Validation
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    // Check if name already exists (case insensitive)
    const nameExists = categories.some(
      cat => cat.name.toLowerCase() === categoryName.trim().toLowerCase() && 
        cat.id !== (currentCategory?.id || '')
    );

    if (nameExists) {
      setError('A category with this name already exists');
      return;
    }

    if (currentCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id ? { ...cat, name: categoryName.trim() } : cat
      ));
      toast({
        title: "Category updated",
        description: `${categoryName} has been updated successfully.`,
      });
    } else {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        name: categoryName.trim()
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Category created",
        description: `${categoryName} has been added successfully.`,
      });
    }
    
    handleCloseDialog();
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      setCategories(categories.filter(cat => cat.id !== currentCategory.id));
      toast({
        title: "Category deleted",
        description: `${currentCategory.name} has been deleted successfully.`,
      });
      handleCloseDeleteDialog();
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Button 
          className="bg-menu-purple hover:bg-menu-dark-purple"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {categories.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80%]">Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDeleteDialog(category)}
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
            <p className="text-gray-500">No categories found. Create your first category!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="categoryName" className="text-sm font-medium block mb-2">
              Category Name
            </label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              className="bg-menu-purple hover:bg-menu-dark-purple" 
              onClick={handleSaveCategory}
            >
              {currentCategory ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentCategory?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteCategory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Categories;
