
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/services/menuItemService';
import { useCategories } from '@/services/categoryService';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { Card } from '@/components/ui/card';

const MenuItems = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: menuItems, isLoading } = useMenuItems(user?.id);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories(user?.id);
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedItem(null);
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (data: any, imageFile?: File) => {
    try {
      if (selectedItem) {
        await updateMutation.mutateAsync({
          id: selectedItem.id,
          ...data,
          userId: user?.id,
          imageFile,
          currentImageUrl: selectedItem.image_url
        });
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          userId: user?.id,
          imageFile
        });
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    try {
      await deleteMutation.mutateAsync({
        id: selectedItem.id,
        userId: user?.id,
      });
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      handleCloseDeleteDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isCategoriesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-purple mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading menu items...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Convert categories to format expected by MenuItemForm
  const formattedCategories = categories?.map((cat) => ({
    id: cat.id,
    name: cat.name,
  })) || [];

  // Find category name for each menu item
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-menu-purple hover:bg-menu-dark-purple">
          <Plus className="mr-2 h-4 w-4" /> Add Menu Item
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getCategoryName(item.category_id)}</TableCell>
                <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {item.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {menuItems?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No menu items found. Add your first menu item!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            categories={formattedCategories}
            onSubmit={handleSubmit}
            initialData={selectedItem ? {
              name: selectedItem.name,
              description: selectedItem.description,
              price: selectedItem.price.toString(),
              categoryId: selectedItem.category_id,
              imageUrl: selectedItem.image_url
            } : undefined}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
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
