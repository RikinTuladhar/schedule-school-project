import {
    ChevronDown,
    Globe,
    Heart,
    Menu,
    Phone,
    RefreshCw,
    Search,
    ShoppingCart,
    User,
    X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

const Header = () => {
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const { cartItems, getCartTotal, getCartCount, removeFromCart } = useCart();
    const { language, changeLanguage, t } = useLanguage();
    const { currency, changeCurrency, formatPrice, currencies } = useCurrency();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full font-sans">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 hidden md:block">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span className="hover:text-[#5cb85c] cursor-pointer transition-colors">
                            {t("contactUs")}
                        </span>
                        <span className="hover:text-[#5cb85c] cursor-pointer transition-colors">
                            {t("myAccount")}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-1 cursor-pointer hover:text-[#5cb85c]"
                                onClick={() =>
                                    setShowLanguageDropdown(
                                        !showLanguageDropdown
                                    )
                                }
                            >
                                <Globe size={12} />
                                <span>
                                    {language === "en" ? "English" : "Français"}
                                </span>
                                <ChevronDown size={10} />
                            </div>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-md z-50 min-w-[120px]">
                                    <button
                                        onClick={() => {
                                            changeLanguage("en");
                                            setShowLanguageDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => {
                                            changeLanguage("fr");
                                            setShowLanguageDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                                    >
                                        Français
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Currency Switcher */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-1 cursor-pointer hover:text-[#5cb85c]"
                                onClick={() =>
                                    setShowCurrencyDropdown(
                                        !showCurrencyDropdown
                                    )
                                }
                            >
                                <span>{currency}</span>
                                <ChevronDown size={10} />
                            </div>
                            {showCurrencyDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border border-gray-100 rounded-md z-50 min-w-[100px]">
                                    {Object.keys(currencies).map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => {
                                                changeCurrency(curr);
                                                setShowCurrencyDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                                        >
                                            {curr} ({currencies[curr].symbol})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1 cursor-pointer hover:text-[#5cb85c]">
                            <User size={12} />
                            <span>{t("myAccount")}</span>
                        </div>
                        <div className="flex items-center space-x-1 cursor-pointer hover:text-[#5cb85c]">
                            <Heart size={12} />
                            <span>{t("wishlist")}</span>
                        </div>
                        <div className="flex items-center space-x-1 cursor-pointer hover:text-[#5cb85c]">
                            <RefreshCw size={12} />
                            <span>{t("checkout")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white py-2 md:py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center gap-4 group">
                            <div className="rounded-full">
                                <ShoppingBagIcon className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#5cb85c] transition-colors">
                                    Lekali Foods
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">
                                    Best Choice for you
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-2xl w-full relative">
                        <div className="flex w-full border-2 border-[#5cb85c] rounded-full overflow-hidden h-11">
                            <div className="bg-gray-50 border-r border-gray-200 px-4 flex items-center cursor-pointer min-w-[140px] justify-between text-gray-600 text-sm hidden sm:flex">
                                <span>{t("allCategories")}</span>
                                <ChevronDown size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                className="flex-1 px-4 outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-6 transition-colors flex items-center justify-center">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="flex items-center space-x-6 relative">
                        <div
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => setShowCartDropdown((prev) => !prev)}
                        >
                            <div className="relative">
                                <ShoppingCart className="w-8 h-8 text-gray-700 group-hover:text-[#5cb85c] transition-colors" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#5cb85c] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {getCartCount()}
                                    </span>
                                )}
                            </div>
                            <div className="hidden lg:flex flex-col text-sm">
                                <span className="text-gray-400 text-xs">
                                    {t("total")}
                                </span>
                                <span className="font-bold text-gray-700">
                                    {formatPrice(getCartTotal())}
                                </span>
                            </div>

                            {/* Cart Dropdown */}
                            {showCartDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-[380px] bg-white shadow-xl border border-gray-100 rounded-lg z-50">
                                    {cartItems.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>{t("yourCartIsEmpty")}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Cart Items */}
                                            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
                                                {cartItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-none"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded border border-gray-100"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-800 truncate">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                x{" "}
                                                                {item.quantity}
                                                            </p>
                                                            <p className="text-sm font-bold text-[#5cb85c]">
                                                                {formatPrice(
                                                                    parseFloat(
                                                                        item.price
                                                                    ) *
                                                                        item.quantity
                                                                )}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFromCart(
                                                                    item.id
                                                                );
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <X
                                                                size={16}
                                                                className="text-gray-400 hover:text-red-500"
                                                            />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Cart Footer */}
                                            <div className="border-t border-gray-100 p-4 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-gray-700">
                                                        {t("subTotal")}
                                                    </span>
                                                    <span className="font-bold text-gray-800">
                                                        {formatPrice(
                                                            getCartTotal()
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{t("ecoTax")}</span>
                                                    <span>
                                                        {formatPrice(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{t("vat")}</span>
                                                    <span>
                                                        {formatPrice(
                                                            getCartTotal() * 0.2
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-base font-bold border-t border-gray-100 pt-3">
                                                    <span className="text-gray-700">
                                                        {t("total")}
                                                    </span>
                                                    <span className="text-gray-800">
                                                        {formatPrice(
                                                            getCartTotal() +
                                                                2 +
                                                                getCartTotal() *
                                                                    0.2
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => {
                                                            navigate("/cart");
                                                            setShowCartDropdown(
                                                                false
                                                            );
                                                        }}
                                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingCart
                                                            size={16}
                                                        />
                                                        {t("viewCart")}
                                                    </button>
                                                    <button className="flex-1 bg-[#5cb85c] hover:bg-[#4cae4c] text-white py-2 px-4 rounded-full font-bold text-sm transition-colors">
                                                        {t("checkout")}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-[#252525] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-12">
                        {/* Categories Dropdown Trigger - Desktop */}
                        <div className="hidden md:flex items-center bg-[#5cb85c] h-full px-6 min-w-[270px] cursor-pointer font-medium uppercase tracking-wide text-sm justify-between hover:bg-[#4cae4c] transition-colors">
                            <div className="flex items-center gap-3">
                                <Menu size={18} />
                                <span>{t("allCategories")}</span>
                            </div>
                            <ChevronDown size={14} />
                        </div>

                        {/* Main Nav Links */}
                        <div className="hidden md:flex flex-1 items-center px-6 space-x-8 text-sm font-medium">
                            {[
                                { key: "home", label: t("home"), link: "/" },
                                {
                                    key: "specials",
                                    label: t("specials"),
                                    link: "/specials",
                                },
                                {
                                    key: "contactUs",
                                    label: t("contactUs"),
                                    link: "/contact-us",
                                },
                                {
                                    key: "siteMap",
                                    label: t("siteMap"),
                                    link: "/site-map",
                                },
                                {
                                    key: "brand",
                                    label: t("brand"),
                                    link: "/brands",
                                },
                                {
                                    key: "giftCertificates",
                                    label: t("giftCertificates"),
                                    link: "/gift-certificates",
                                },
                            ].map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.link}
                                    className="hover:text-[#5cb85c] transition-colors uppercase text-xs tracking-wider"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Contact Info */}
                        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300">
                            <Phone size={14} className="text-[#5cb85c]" />
                            <span>{t("callUs")}: 123-456-7890</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal component for the Logo Icon placeholder
function ShoppingBagIcon({ className }) {
    return <img src="/images/logo.png" alt="" className="max-w-[100px]" />;
}

export default Header;
