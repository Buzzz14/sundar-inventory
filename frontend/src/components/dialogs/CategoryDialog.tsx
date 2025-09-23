import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { useAddCategoryMutation } from "@/redux/features/categories/categoriesApi";
import type { ItemFormValues } from "@/schemas/itemSchema";
import type { UseFormSetValue } from "react-hook-form";

interface CategoryDialogProps {
  addCatOpen: boolean;
  setAddCatOpen: (open: boolean) => void;
  newCatName: string;
  setNewCatName: (name: string) => void;
  newCatDesc: string;
  setNewCatDesc: (desc: string) => void;
  addCategory: ReturnType<typeof useAddCategoryMutation>[0];
  addingCategory: boolean;
  setValue?: UseFormSetValue<ItemFormValues>;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  addCatOpen,
  setAddCatOpen,
  newCatName,
  setNewCatName,
  newCatDesc,
  setNewCatDesc,
  addCategory,
  addingCategory,
  setValue,
}) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newCatName.trim()) return;

    try {
      const created = await addCategory({
        name: newCatName.trim(),
        description: newCatDesc || undefined,
      }).unwrap();

      setValue?.("category", created._id as unknown as string, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setAddCatOpen(false);
      setNewCatName("");
      setNewCatDesc("");
      toast.success("Category added successfully");
    } catch {
      toast.error("Failed to add category");
    }
  };

  return (
    <>
      <Dialog open={addCatOpen} onOpenChange={setAddCatOpen}>
        <DialogContent>
          <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <h3 className="text-base font-semibold">Add Category</h3>

            <label htmlFor="newCatName" className="text-sm font-medium">
              Name
            </label>
            <input
              id="newCatName"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />

            <label htmlFor="newCatDesc" className="text-sm font-medium">
              Description
            </label>
            <input
              id="newCatDesc"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddCatOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={addingCategory}>
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryDialog;
