import { useState, useMemo } from "react";
import {
  useGetItemsQuery,
  useDeleteItemMutation,
} from "@/redux/features/items/itemsApi";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import ItemFormModal from "../dialogs/AddItemDialog";
import DeleteDialog from "../dialogs/DeleteItemDialog";

const ItemsList = () => {
  const { data: items, isLoading, error } = useGetItemsQuery();
  const [deleteItem] = useDeleteItemMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemSlug, setEditItemSlug] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories } = useGetCategoriesQuery();

  const promptDelete = (slug: string) => {
    setSlugToDelete(slug);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!slugToDelete) return;
    try {
      await deleteItem(slugToDelete).unwrap();
      toast.success("Item deleted successfully");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete item";
      toast.error(message);
    } finally {
      setConfirmOpen(false);
      setSlugToDelete(null);
    }
  };

  const handleEdit = (slug: string) => {
    setEditItemSlug(slug);
    setModalOpen(true);
  };

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!selectedCategory) return items;
    return items.filter((item) => item.category?._id === selectedCategory);
  }, [items, selectedCategory]);

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p>Error loading items</p>;

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => {
            setEditItemSlug(null);
            setModalOpen(true);
          }}
        >
          Add New Item
        </Button>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md"
        >
          <option value="">All Categories</option>

          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Cost Price</TableCell>
            <TableCell>Min Sale Price</TableCell>
            <TableCell>Max Sale Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Reorder Level</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems?.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  {item.photos && item.photos.length > 0 ? (
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="size-12 rounded object-cover border"
                    />
                  ) : (
                    <div className="size-12 rounded border bg-muted" />
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.cost_price}</TableCell>
                <TableCell>{item.sale_price_min}</TableCell>
                <TableCell>{item.sale_price_max}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.reorder_level}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(item.slug)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => promptDelete(item.slug)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      <ItemFormModal
        open={modalOpen}
        setOpen={setModalOpen}
        editItemSlug={editItemSlug}
        setEditItemSlug={setEditItemSlug}
      />

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

export default ItemsList;
