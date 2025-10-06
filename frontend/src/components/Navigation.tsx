import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

const Navigation = () => {
  const location = useLocation();
  const { isSuperAdmin } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/items">
            <Button variant={isActive("/items") ? "default" : "outline"}>
              Items
            </Button>
          </Link>
          <Link to="/categories">
            <Button variant={isActive("/categories") ? "default" : "outline"}>
              Categories
            </Button>
          </Link>
          {isSuperAdmin && (
            <Link to="/users">
              <Button variant={isActive("/users") ? "default" : "outline"}>
                Users
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;




