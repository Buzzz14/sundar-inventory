import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface DeleteDialogProps {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  slugToDelete: string | null;
  setSlugToDelete: (slug: string | null) => void;
  confirmDelete: () => Promise<void>;
  title?: string;
  description?: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  confirmOpen,
  setConfirmOpen,
  setSlugToDelete,
  confirmDelete,
  title = "Delete this item?",
  description = "This action cannot be undone.",
}) => {
  return (
    <>
      <Dialog
        open={confirmOpen}
        onOpenChange={(v) => {
          setConfirmOpen(v);
          if (!v) setSlugToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p>{description}</p>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setConfirmOpen(false);
                setSlugToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" type="button" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
