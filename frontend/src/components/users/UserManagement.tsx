import { useState } from "react";
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "@/redux/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import type { User, UserRole } from "@/types";
import DeleteDialog from "../dialogs/DeleteDialog";

const UserManagement = () => {
  const { data, isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success("User role updated successfully");
      refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update user role";
      toast.error(message);
    }
  };

  const promptDelete = (user: User) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser({ userId: userToDelete._id }).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete user";
      toast.error(message);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users</p>;

  const users = data?.users || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => promptDelete(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      <DeleteDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        slugToDelete={userToDelete?._id || null}
        setSlugToDelete={() => setUserToDelete(null)}
        confirmDelete={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete user "${userToDelete?.email}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserManagement;
