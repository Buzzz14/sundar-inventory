import React, { useEffect, useRef, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { itemSchema, type ItemFormValues } from "@/schemas/itemSchema";
import {
  useAddItemMutation,
  useUpdateItemMutation,
  useGetItemsQuery,
} from "@/redux/features/items/itemsApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { useAddCategoryMutation } from "@/redux/features/categories/categoriesApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddCategoryDialog from "./AddCategoryDialog";

interface ItemFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editItemSlug: string | null;
  setEditItemSlug: (slug: string | null) => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  setOpen,
  editItemSlug,
  setEditItemSlug,
}) => {
  const emptyValues: ItemFormValues = useMemo(
    () => ({
      name: "",
      category: "",
      company: "",
      description: "",
      cost_price: 0,
      min_profit_percent: 0,
      max_profit_percent: 0,
      stock: undefined,
      reorder_level: undefined,
      photos: [],
    }),
    []
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: emptyValues,
  });

  const photosRef = useRef<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const { data: items } = useGetItemsQuery();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const [addCategory, { isLoading: addingCategory }] = useAddCategoryMutation();

  const [addCatOpen, setAddCatOpen] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatDesc, setNewCatDesc] = React.useState("");

  useEffect(() => {
    if (editItemSlug && items) {
      const item = items.find((i) => i.slug === editItemSlug);
      if (item) {
        reset({
          name: item.name,
          category: item.category?._id ?? "",
          company: item.company,
          description: item.description,
          cost_price: item.cost_price,
          min_profit_percent: item.min_profit_percent,
          max_profit_percent: item.max_profit_percent,
          stock: item.stock,
          reorder_level: item.reorder_level,
          photos: item.photos,
        });
        setExistingPhotos(item.photos || []);
      }
    } else {
      reset(emptyValues);
      setExistingPhotos([]);
    }
  }, [editItemSlug, items, reset, emptyValues]);

  useEffect(() => {
    if (open && !editItemSlug) {
      reset();
      setSelectedPreviews([]);
      setExistingPhotos([]);
    }
  }, [open, editItemSlug, reset]);

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPreviews]);

  const onSubmit = async (data: ItemFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, String(v)));
        } else {
          formData.append(key, String(value));
        }
      });

      photosRef.current.forEach((file) => formData.append("photos", file));

      if (editItemSlug && existingPhotos.length > 0) {
        existingPhotos.forEach((photoUrl) =>
          formData.append("existingPhotos", photoUrl)
        );
      }

      if (editItemSlug) {
        await updateItem({ slug: editItemSlug, body: formData }).unwrap();
        toast.success("Item updated");
      } else {
        await addItem(formData).unwrap();
        toast.success("Item added");
      }
      reset(emptyValues);
      setOpen(false);
      setEditItemSlug(null);
      photosRef.current = [];
      setSelectedPreviews([]);
      setExistingPhotos([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete item";

      toast.error(message);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setEditItemSlug(null);
            reset(emptyValues);
            setSelectedPreviews([]);
            setExistingPhotos([]);
          }
        }}
      >
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 flex flex-col gap-2 w-[400px]"
          >
            <h2 className="text-lg font-semibold">
              {editItemSlug ? "Update Item" : "Add Item"}
            </h2>

            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input id="name" {...register("name")} />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}

            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              onChange={(e) => {
                if (e.target.value === "__add__") {
                  e.target.value = "";
                  setAddCatOpen(true);
                }
              }}
            >
              <option value="">Select category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option value="__add__">+ Add new category</option>
            </select>
            {categoriesLoading && (
              <span className="text-sm text-muted-foreground">
                Loading categories…
              </span>
            )}
            {categoriesError && (
              <span className="text-sm text-red-600">
                Failed to load categories
              </span>
            )}
            {errors.category && (
              <span className="text-red-600">{errors.category.message}</span>
            )}

            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            <input id="company" {...register("company")} />
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <input id="description" {...register("description")} />

            <label htmlFor="cost_price" className="text-sm font-medium">
              Cost Price
            </label>
            <input
              id="cost_price"
              type="number"
              {...register("cost_price", { valueAsNumber: true })}
            />
            <label htmlFor="min_profit_percent" className="text-sm font-medium">
              Min Profit %
            </label>
            <input
              id="min_profit_percent"
              type="number"
              {...register("min_profit_percent", { valueAsNumber: true })}
            />
            <label htmlFor="max_profit_percent" className="text-sm font-medium">
              Max Profit %
            </label>
            <input
              id="max_profit_percent"
              type="number"
              {...register("max_profit_percent", { valueAsNumber: true })}
            />
            <label htmlFor="stock" className="text-sm font-medium">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
            />
            <label htmlFor="reorder_level" className="text-sm font-medium">
              Reorder Level
            </label>
            <input
              id="reorder_level"
              type="number"
              {...register("reorder_level", { valueAsNumber: true })}
            />

            <label htmlFor="photos" className="text-sm font-medium">
              Photos (up to 5)
            </label>
            <input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                photosRef.current = files;
                const newPreviews = files.map((file) =>
                  URL.createObjectURL(file)
                );
                setSelectedPreviews((prev) => {
                  prev.forEach((url) => URL.revokeObjectURL(url));
                  return newPreviews;
                });
              }}
            />

            {(selectedPreviews.length > 0 || existingPhotos.length > 0) && (
              <div className="space-y-2">
                {selectedPreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">New Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPreviews.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = photosRef.current.filter(
                                (_, i) => i !== index
                              );
                              photosRef.current = newFiles;
                              const newPreviews = selectedPreviews.filter(
                                (_, i) => i !== index
                              );
                              setSelectedPreviews((prev) => {
                                prev.forEach((u) => URL.revokeObjectURL(u));
                                return newPreviews;
                              });
                              if (fileInputRef.current) {
                                const dt = new DataTransfer();
                                newFiles.forEach((file) => dt.items.add(file));
                                fileInputRef.current.files = dt.files;
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingPhotos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Existing Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingPhotos.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setExistingPhotos((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                onClick={() => {
                  setEditItemSlug(null);
                  reset(emptyValues);
                  setSelectedPreviews([]);
                  setExistingPhotos([]);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editItemSlug ? "Update" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AddCategoryDialog
        addCatOpen={addCatOpen}
        setAddCatOpen={setAddCatOpen}
        newCatName={newCatName}
        setNewCatName={setNewCatName}
        newCatDesc={newCatDesc}
        setNewCatDesc={setNewCatDesc}
        addCategory={addCategory}
        addingCategory={addingCategory}
        setValue={setValue}
      />
    </>
  );
};

export default ItemFormModal;
