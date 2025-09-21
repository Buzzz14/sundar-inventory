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
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  confirmOpen,
  setConfirmOpen,
  setSlugToDelete,
  confirmDelete,
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
            <DialogTitle>Delete this item?</DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone.</p>
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
