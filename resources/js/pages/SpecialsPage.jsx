import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

const SpecialsPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Specials</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Check back later for our special offers!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialsPage;
