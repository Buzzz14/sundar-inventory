import ItemList from "@/components/items/ItemList";
import LogoutButton from "@/components/LogoutButton";
import Navigation from "@/components/Navigation";

const Items = () => {
  return (
    <main className="p-6" role="main" aria-labelledby="items-title">
      <div className="flex items-center justify-between mb-4">
        <h1 id="items-title" className="text-2xl font-bold">Items</h1>
        <LogoutButton />
      </div>
      <Navigation />
      <ItemList />
    </main>
  );
};

export default Items;
