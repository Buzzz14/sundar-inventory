import { Routes, Route } from "react-router-dom";
import Items from "@/pages/Items";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Items />} />
    </Routes>
  );
};

export default AppRoutes;
