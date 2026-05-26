import { ArrowLeftRight, Facebook, Heart, Linkedin, Minus, Plus, ShoppingCart, Star, Twitter } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCartWithQuantity } = useCart();

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const { currency, changeCurrency, formatPrice, currencies } = useCurrency();
  const handleAddToCart = (product) => {
    console.log(product);
    alert("Added To Cart");
    addToCartWithQuantity(product, quantity);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">{product.name}</h1>

      <div className="flex items-center gap-4">
        {/* Rating */}
        <div className="flex text-[#5cb85c]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < product.rating ? "currentColor" : "none"}
              className={i >= product.rating ? "text-gray-300" : ""}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">{product.reviews} Reviews</span>
        <span className="text-sm text-gray-500 border-l border-gray-300 pl-4">Write a review</span>
      </div>

      <div className="border-t border-b border-gray-100 py-4 space-y-2 text-sm">
        <div className="flex">
          <span className="w-32 font-bold text-gray-700">Brands:</span>
          <a href="#" className="text-[#5cb85c] hover:underline">
            {product.brand}
          </a>
        </div>
        <div className="flex">
          <span className="w-32 font-bold text-gray-700">Product Code:</span>
          <span className="text-gray-600">{product.code}</span>
        </div>
        <div className="flex">
          <span className="w-32 font-bold text-gray-700">Availability:</span>
          <span className="text-[#5cb85c] font-medium">{product.availability}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {product.oldPrice && (
          <span className="text-xl text-gray-400 line-through font-medium">${product.oldPrice}</span>
        )}
        <span className="text-4xl font-bold text-[#5cb85c]">{formatPrice(product.price)}</span>
        <span className="text-xs text-gray-400 font-normal">Ex Tax: {formatPrice(product.price)}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-gray-700 text-sm">Qty</span>
          <div className="flex items-center border border-gray-300 rounded-full h-10 w-fit">
            <button
              onClick={decrement}
              className="px-3 text-gray-500 hover:text-[#5cb85c] hover:bg-gray-50 rounded-l-full h-full flex items-center justify-center transition-colors"
            >
              <Minus size={14} />
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-12 text-center text-sm font-bold text-gray-700 outline-none h-full border-x border-gray-100"
            />
            <button
              onClick={increment}
              className="px-3 text-gray-500 hover:text-[#5cb85c] hover:bg-gray-50 rounded-r-full h-full flex items-center justify-center transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-3">
          <button
            onClick={() => handleAddToCart(product)}
            className="h-10 px-8 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold uppercase text-sm rounded-full flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
          <button
            className="h-10 w-10 border border-gray-300 rounded text-gray-600 hover:bg-[#5cb85c] hover:text-white hover:border-[#5cb85c] flex items-center justify-center transition-colors"
            title="Add to Wishlist"
          >
            <Heart size={18} />
          </button>
          <button
            className="h-10 w-10 border border-gray-300 rounded text-gray-600 hover:bg-[#5cb85c] hover:text-white hover:border-[#5cb85c] flex items-center justify-center transition-colors"
            title="Compare"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>
      </div>

      {/* Social Share (Mock) */}
      <div className="flex items-center gap-2 pt-4">
        <a href="#" className="bg-blue-600 text-white p-1.5 rounded-sm hover:-translate-y-0.5 transition-transform">
          <Facebook size={14} />
        </a>
        <a href="#" className="bg-sky-500 text-white p-1.5 rounded-sm hover:-translate-y-0.5 transition-transform">
          <Twitter size={14} />
        </a>
        <a href="#" className="bg-blue-700 text-white p-1.5 rounded-sm hover:-translate-y-0.5 transition-transform">
          <Linkedin size={14} />
        </a>
      </div>
    </div>
  );
};

export default ProductInfo;
