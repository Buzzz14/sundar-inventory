import CategoryList from "@/components/categories/CategoryList";
import LogoutButton from "@/components/LogoutButton";
import Navigation from "@/components/Navigation";

const Categories = () => {
  return (
    <main className="p-6" role="main" aria-labelledby="categories-title">
      <div className="flex items-center justify-between mb-4">
        <h1 id="categories-title" className="text-2xl font-bold">
          Categories
        </h1>
        <LogoutButton />
      </div>
      <Navigation />
      <CategoryList />
    </main>
  );
};

export default Categories;
