import { Minus, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const ecoTax = 2.0;
  const vatRate = 0.2;
  const subtotal = getCartTotal();
  const vat = subtotal * vatRate;
  const total = subtotal + ecoTax + vat;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-6">Your shopping cart is empty!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-8 py-3 rounded-full font-bold uppercase text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-4 font-bold text-sm text-gray-700 border-b border-gray-200">
                <div className="col-span-1">Image</div>
                <div className="col-span-4">Product Name</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    {/* Image */}
                    <div className="col-span-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded border border-gray-100"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-12 md:col-span-4">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {item.variant && <p className="text-xs text-gray-500 mt-1">- Select 1 Pack</p>}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-12 md:col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-full h-10 w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 text-gray-500 hover:text-[#5cb85c] hover:bg-gray-50 rounded-l-full h-full flex items-center justify-center transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center text-sm font-bold text-gray-700 outline-none h-full border-x border-gray-100"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 text-gray-500 hover:text-[#5cb85c] hover:bg-gray-50 rounded-r-full h-full flex items-center justify-center transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-6 md:col-span-2">
                      <p className="font-bold text-gray-700">${parseFloat(item.price).toFixed(2)}</p>
                    </div>

                    {/* Total */}
                    <div className="col-span-5 md:col-span-2">
                      <p className="font-bold text-[#5cb85c] text-lg">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 bg-gray-800 hover:bg-red-500 text-white rounded transition-colors"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-[#5cb85c] font-medium transition-colors"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Sub-Total</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Eco Tax (-2.00)</span>
                  <span>${ecoTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-100">
                  <span>VAT (20%)</span>
                  <span>${vat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold pt-3">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-800">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  View Cart
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white py-3 px-4 rounded-full font-bold text-sm transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
