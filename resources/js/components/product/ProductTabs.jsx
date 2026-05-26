import { useState } from "react";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-12">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-8 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-t-2 ${
            activeTab === "description"
              ? "border-[#5cb85c] text-[#5cb85c] bg-white border-l border-r -mb-[1px] border-b-transparent"
              : "border-transparent text-gray-600 hover:text-[#5cb85c] bg-gray-50"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-8 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-t-2 ${
            activeTab === "reviews"
              ? "border-[#5cb85c] text-[#5cb85c] bg-white border-l border-r -mb-[1px] border-b-transparent"
              : "border-transparent text-gray-600 hover:text-[#5cb85c] bg-gray-50"
          }`}
        >
          Reviews (0)
        </button>
      </div>

      <div className="border border-gray-200 p-6 text-gray-600 text-sm leading-relaxed">
        {activeTab === "description" ? (
          <div>
            <p>
              Stop in the name of love. The 30GB Apple iPod classic video offers up to 30 hours of music and video
              playback. That's 7,500 songs, 25,000 photos, or 75 hours of video. The new interface features a new way to
              browse your music and video collecting.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4">There are no reviews for this product.</p>
            {/* Review Form Placeholder */}
            <div className="space-y-4 max-w-lg">
              <h4 className="font-bold text-gray-800">Write a review</h4>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border border-gray-300 p-2 rounded outline-none focus:border-[#5cb85c]"
                />
                <textarea
                  placeholder="Your Review"
                  rows="4"
                  className="border border-gray-300 p-2 rounded outline-none focus:border-[#5cb85c]"
                ></textarea>
                <button className="bg-[#5cb85c] text-white px-6 py-2 rounded-full font-bold uppercase text-xs self-start hover:bg-[#4cae4c] transition-colors">
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
