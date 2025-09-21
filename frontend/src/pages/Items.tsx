import React from "react";
import ItemsList from "@/components/items/ItemsList";

const Items: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items</h1>
      
      <ItemsList />
    </div>
  );
};

export default Items;
