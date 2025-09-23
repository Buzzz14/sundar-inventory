import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }}
    >
      Log out
    </Button>
  );
}


