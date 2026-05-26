import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("direct_bank_transfer");

  const subtotal = getCartTotal();
  const ecoTax = 2.0;
  const vatRate = 0.2;
  const vat = subtotal * vatRate;
  const total = subtotal + ecoTax + vat;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Simulate order processing
    alert("Order placed successfully!");
    clearCart();
    navigate("/");
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstName"
                    type="text"
                    placeholder="John"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="address"
                    type="text"
                    placeholder="123 Street Name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                    City / Town *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city"
                    type="text"
                    placeholder="City"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postcode">
                    Postcode / Zip *
                  </label>
                  <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="postcode"
                    type="text"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Your Order</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-bold border-b pb-2">
                  <span>Product</span>
                  <span>Total</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Eco Tax (-2.00)</span>
                    <span>${ecoTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (20%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="direct_bank_transfer"
                    name="payment_method"
                    value="direct_bank_transfer"
                    checked={paymentMethod === "direct_bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#5cb85c] focus:ring-[#5cb85c]"
                  />
                  <label htmlFor="direct_bank_transfer" className="ml-2 text-sm text-gray-700">
                    Direct Bank Transfer
                  </label>
                </div>
                <div className="text-xs text-gray-500 pl-6">
                  Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cheque_payment"
                    name="payment_method"
                    value="cheque_payment"
                    checked={paymentMethod === "cheque_payment"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#5cb85c] focus:ring-[#5cb85c]"
                  />
                  <label htmlFor="cheque_payment" className="ml-2 text-sm text-gray-700">
                    Cheque Payment
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#5cb85c] focus:ring-[#5cb85c]"
                  />
                  <label htmlFor="paypal" className="ml-2 text-sm text-gray-700">
                    PayPal
                  </label>
                </div>
              </div>

              {paymentMethod === "paypal" ? (
                <PayPalButtons
                  createOrder={async () => {
                    try {
                      const response = await fetch("http://localhost:8888/api/orders", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          cartItems: cartItems,
                        }),
                      });
                      const order = await response.json();
                      return order.id;
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  onApprove={async (data) => {
                    try {
                      const response = await fetch(`http://localhost:8888/api/orders/${data.orderID}/capture`, {
                        method: "POST",
                      });
                      const details = await response.json();
                      alert("Transaction completed by " + details.payer.name.given_name);
                      clearCart();
                      navigate("/");
                    } catch (error) {
                      console.error(error);
                      alert("Transaction failed!");
                    }
                  }}
                />
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white py-3 px-4 rounded-full font-bold text-sm transition-colors uppercase"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
