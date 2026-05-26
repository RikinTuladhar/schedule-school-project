import { Suspense, lazy, useEffect, useState } from "react"; // Added Suspense
import { useLocation, useParams } from "react-router-dom";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import Breadcrumb from "../components/product/Breadcrumb";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductTabs from "../components/product/ProductTabs";
import { products } from "../data/product";

// If you want to use Suspense for the ProductSection (Related Products)
const ProductSection = lazy(() => import("../components/home/ProductSection"));

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    if (id) {
      setLoading(true); // Reset loading state when id changes
      const foundProduct = products.find((p) => p.id === Number(id));
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [id]);

  const breadcrumbItems = [
    { label: "Category", href: "#" },
    { label: product?.name || "Product", href: "#" },
  ];

  // 1. LOADING GUARD: This prevents the crash!
  // It stops the code from reaching the return statement until product exists.
  if (loading || !product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <div id="product-page"></div>
      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Gallery */}
          <div className="w-full">
            <ProductGallery images={product?.images} />
          </div>

          {/* Right Column: Info */}
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <ProductTabs />

        {/* Related Products wrapped in Suspense */}
        <div className="mt-16">
          <Suspense fallback={<div>Loading related products...</div>}>
            <ProductSection title="Related Products" />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
