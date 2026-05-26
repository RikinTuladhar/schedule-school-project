import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

const GiftCertificatesPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gift Certificates</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <p className="text-gray-600 text-lg mb-8">Purchase a gift certificate for your friends and family!</p>
          <form className="max-w-lg">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient_name">
                Recipient's Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recipient_name"
                type="text"
                placeholder="Recipient's Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient_email">
                Recipient's Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recipient_email"
                type="email"
                placeholder="Recipient's Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount ($)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="amount"
                type="number"
                min="1"
                placeholder="Amount"
              />
            </div>
            <button
              className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              type="button"
            >
              Purchase Gift Certificate
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftCertificatesPage;
