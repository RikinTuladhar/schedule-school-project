import { Link } from "react-router-dom";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

const SiteMapPage = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/cart" },
    { name: "Specials", path: "/specials" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "Brand", path: "/brands" },
    { name: "Gift Certificates", path: "/gift-certificates" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Site Map</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-[#5cb85c] hover:underline hover:text-[#4cae4c] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiteMapPage;
