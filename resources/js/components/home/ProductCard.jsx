import { ArrowLeftRight, Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    console.log(product);
    alert("Added To Cart");
    addToCart(product);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 relative group hover:shadow-lg transition-all duration-300">
      {/* Badges */}
      {product.discount && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">
          -{product.discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="bg-white p-2 rounded-full text-gray-600 hover:bg-[#5cb85c] hover:text-white transition-colors shadow-sm transform translate-y-4 group-hover:translate-y-0 duration-300">
            <Heart size={16} />
          </button>
          <button className="bg-white p-2 rounded-full text-gray-600 hover:bg-[#5cb85c] hover:text-white transition-colors shadow-sm transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
            <Eye size={16} />
          </button>
          <button className="bg-white p-2 rounded-full text-gray-600 hover:bg-[#5cb85c] hover:text-white transition-colors shadow-sm transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100">
            <ArrowLeftRight size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Rating */}
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < product.rating ? "currentColor" : "none"}
              className={i >= product.rating ? "text-gray-300" : ""}
            />
          ))}
        </div>

        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#5cb85c] cursor-pointer transition-colors min-h-[40px]">
          <Link to={`/product/${product.id}#product-page`}>{product.name}</Link>
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[#5cb85c] font-bold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-gray-100 hover:bg-[#5cb85c] hover:text-white text-gray-600 p-2 rounded-full transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
