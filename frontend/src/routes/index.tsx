import { Routes, Route } from "react-router-dom";
import Items from "@/pages/Items";
import Categories from "@/pages/Categories";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/items" element={<Items />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
};

export default AppRoutes;
