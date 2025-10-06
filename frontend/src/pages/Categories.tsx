import CategoryList from "@/components/categories/CategoryList";
import LogoutButton from "@/components/LogoutButton";
import Navigation from "@/components/Navigation";

const Categories = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <LogoutButton />
      </div>
      <Navigation />
      <CategoryList />
    </div>
  );
};

export default Categories;
