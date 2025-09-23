import ItemList from "@/components/items/ItemList";
import LogoutButton from "@/components/LogoutButton";

const Items = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        <LogoutButton />
      </div>
      <ItemList />
    </div>
  );
};

export default Items;
