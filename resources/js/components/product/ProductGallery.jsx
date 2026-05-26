import { useState } from "react";

const ProductGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="border border-gray-100 rounded-lg overflow-hidden bg-white p-2">
        {images?.length > 0 ? (
          <img src={selectedImage} alt="Product Main" className="w-full h-auto object-contain max-h-[500px]" />
        ) : (
          <img src="/images/Image-not-found.png" alt="Image not found" className="w-full h-full object-contain" />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {images?.length > 0 ? (
          images?.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 flex-shrink-0 border-2 rounded-md cursor-pointer p-1 transition-all ${
                selectedImage === img ? "border-[#5cb85c]" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
            </div>
          ))
        ) : (
          <div className="w-20 h-20 flex-shrink-0 border-2 rounded-md cursor-pointer p-1 transition-all border-gray-100 hover:border-gray-300">
            <div className="w-20 h-20 flex-shrink-0 border-2 rounded-md cursor-pointer p-1 transition-all">
              <img src="/images/Image-not-found.png" alt="Image not found" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
