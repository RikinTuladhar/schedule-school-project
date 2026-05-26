import CategoryGrid from "../components/home/CategoryGrid";
import FeaturesSection from "../components/home/FeaturesSection";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import ProductSection from "../components/home/ProductSection";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pb-8">
                <HeroSection />
                <CategoryGrid />

                <ProductSection title="Top Saver Today" />

                {/* Discount Banner in middle */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-100 rounded-lg h-48 relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt="Banner"
                            />
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-8">
                                <h4 className="text-white text-xl font-bold mb-2">
                                    Organic Fruits
                                </h4>
                                <button className="self-start text-white bg-[#5cb85c] px-4 py-2 text-xs font-bold uppercase rounded-full hover:bg-white hover:text-[#5cb85c] transition-colors">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg h-48 relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt="Banner"
                            />
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-8">
                                <h4 className="text-white text-xl font-bold mb-2">
                                    Fresh Vegetables
                                </h4>
                                <button className="self-start text-white bg-[#5cb85c] px-4 py-2 text-xs font-bold uppercase rounded-full hover:bg-white hover:text-[#5cb85c] transition-colors">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductSection title="Best Selling Products" />

                <FeaturesSection />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
