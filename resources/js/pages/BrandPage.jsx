import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

const BrandPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Brands</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Placeholders for brands */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="flex items-center justify-center h-32 bg-gray-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <span className="text-gray-400 font-bold text-xl">Brand {item}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrandPage;
