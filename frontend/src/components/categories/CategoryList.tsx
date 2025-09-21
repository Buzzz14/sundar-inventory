import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Table, TableCell, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent } from "../ui/dialog";
import DeleteDialog from "../dialogs/DeleteDialog";
import AddCategoryDialog from "../dialogs/AddCategoryDialog";
import { useForm } from "react-hook-form";
import { categorySchema, type CategoryFormData } from "@/schemas/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";

const CategoryList = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [addCategory, { isLoading: addingCategory }] = useAddCategoryMutation();

  const [addCatOpen, setAddCatOpen] = useState(false);
  const [editCatOpen, setEditCatOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });

  const watchedName = watch("name");

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const promptDelete = (slug: string) => {
    setSlugToDelete(slug);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!slugToDelete) return;
    try {
      await deleteCategory(slugToDelete).unwrap();
      toast.success("Category deleted successfully");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete category";
      toast.error(message);
    } finally {
      setConfirmOpen(false);
      setSlugToDelete(null);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory({
      name: category.name,
      description: category.description || "",
      slug: category.slug || "",
    });
    setEditCatOpen(true);
  };

  // Reset form when editing category changes
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
        slug: editingCategory.slug || "",
      });
    }
  }, [editingCategory, reset]);

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCategory?.slug) return;
    try {
      await updateCategory({
        slug: editingCategory.slug,
        body: data,
      }).unwrap();
      toast.success("Category updated successfully");
      setEditCatOpen(false);
      setEditingCategory(null);
      reset();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update category";
      toast.error(message);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;
  
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => {
            setNewCatName("");
            setNewCatDesc("");
            setAddCatOpen(true);
          }}
        >
          Add New Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <tbody>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.slug}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleEdit({
                      name: category.name,
                      description: category.description,
                      slug: category.slug,
                    })}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => promptDelete(category.slug)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      <AddCategoryDialog
        addCatOpen={addCatOpen}
        setAddCatOpen={setAddCatOpen}
        newCatName={newCatName}
        setNewCatName={setNewCatName}
        newCatDesc={newCatDesc}
        setNewCatDesc={setNewCatDesc}
        addCategory={addCategory}
        addingCategory={addingCategory}
      />

      {/* Edit Category Dialog */}
      <Dialog open={editCatOpen} onOpenChange={setEditCatOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Edit Category</h3>
            
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="edit-name"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <input
                id="edit-description"
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-slug" className="text-sm font-medium">
                Slug (auto-generated)
              </label>
              <input
                id="edit-slug"
                value={watchedName ? generateSlug(watchedName) : (editingCategory?.slug || "")}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                {watchedName ? 
                  `New slug: ${generateSlug(watchedName)}` : 
                  "Slug will be updated automatically when you change the name"
                }
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditCatOpen(false);
                  setEditingCategory(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        slugToDelete={slugToDelete}
        setSlugToDelete={setSlugToDelete}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default CategoryList;
