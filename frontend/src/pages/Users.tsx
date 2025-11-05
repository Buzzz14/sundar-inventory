import UserManagement from "@/components/users/UserManagement";
import LogoutButton from "@/components/LogoutButton";
import Navigation from "@/components/Navigation";

const Users = () => {
  return (
    <main className="p-6" role="main" aria-labelledby="users-title">
      <div className="flex items-center justify-between mb-4">
        <h1 id="users-title" className="text-2xl font-bold">User Management</h1>
        <LogoutButton />
      </div>
      <Navigation />
      <UserManagement />
    </main>
  );
};

export default Users;
