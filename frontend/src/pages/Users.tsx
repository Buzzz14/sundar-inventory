import UserManagement from "@/components/users/UserManagement";
import LogoutButton from "@/components/LogoutButton";
import Navigation from "@/components/Navigation";

const Users = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <LogoutButton />
      </div>
      <Navigation />
      <UserManagement />
    </div>
  );
};

export default Users;
