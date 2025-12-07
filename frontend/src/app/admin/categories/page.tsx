'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryDialog } from '@/components/admin/CategoryDialog';
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

export default function CategoriesPage() {
  const { accessToken } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.categories.getAll() as any;
      setCategories(response.categories || []);
    } catch (error: any) {
      toast.error('Kategoriler yüklenemedi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory || !accessToken) return;

    try {
      await api.categories.delete(deletingCategory._id, accessToken);
      toast.success('Kategori silindi');
      fetchCategories();
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (error: any) {
      // Backend'den gelen hata mesajını göster
      const errorMessage = error.response?.data?.message || error.message || 'Kategori silinirken bir hata oluştu';
      toast.error(errorMessage, {
        duration: 5000, // Daha uzun süre göster
      });
      // Hata durumunda dialog'u kapatma, kullanıcı mesajı okusun
    }
  };

  const handleDialogSuccess = () => {
    fetchCategories();
    setDialogOpen(false);
  };

  const handleMoveUp = async (category: Category, index: number) => {
    if (index === 0 || !accessToken) return;
    
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    
    const orders = newCategories.map((cat, idx) => ({
      id: cat._id,
      displayOrder: idx,
    }));

    try {
      await api.categories.reorder(orders, accessToken);
      await fetchCategories();
      toast.success('Sıralama güncellendi');
    } catch (error: any) {
      toast.error('Sıralama güncellenemedi');
    }
  };

  const handleMoveDown = async (category: Category, index: number) => {
    if (index === categories.length - 1 || !accessToken) return;
    
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    
    const orders = newCategories.map((cat, idx) => ({
      id: cat._id,
      displayOrder: idx,
    }));

    try {
      await api.categories.reorder(orders, accessToken);
      await fetchCategories();
      toast.success('Sıralama güncellendi');
    } catch (error: any) {
      toast.error('Sıralama güncellenemedi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategoriler</h1>
          <p className="text-muted-foreground mt-2">
            Ürün kategorilerini yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kategori
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Görsel</TableHead>
              <TableHead>İsim</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Henüz kategori eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow 
                  key={category._id}
                  className="transition-all duration-300 ease-in-out"
                >
                  <TableCell>
                    {category.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                        alt={category.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        Yok
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(category, index)}
                        disabled={index === 0}
                        title="Yukarı taşı"
                        className="transition-all hover:scale-110"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(category, index)}
                        disabled={index === categories.length - 1}
                        title="Aşağı taşı"
                        className="transition-all hover:scale-110"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                        className="transition-all hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(category)}
                        className="transition-all hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingCategory?.name}</strong> kategorisini silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
