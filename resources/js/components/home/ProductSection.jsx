import { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { products as allProducts } from "../../data/product";
import ProductCard from "./ProductCard";

const tabs = ["All", "Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Meat & Seafood", "Beverages"];

const ProductSection = ({ title }) => {
  const [activeTab, setActiveTab] = useState("All");
  const { formatPrice } = useCurrency();

  // Filter products based on active tab
  const filteredProducts =
    activeTab === "All" ? allProducts.slice(0, 5) : allProducts.filter((p) => p.category === activeTab).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-2 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 relative pl-4 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-[#5cb85c]">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-sm rounded-full transition-colors ${
                activeTab === tab ? "bg-[#5cb85c] text-white" : "text-gray-500 hover:text-[#5cb85c] hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
