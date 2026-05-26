import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const categories = [
    "Dairy & Bakery",
    "Fruits & Vegetables",
    "Snack & Spice",
    "Juice & Drinks",
    "Chicken & Meat",
    "Fast Food",
    "Baby Care",
    "Rice & Flours",
    "Oils & Sauces",
];

const slides = [
    {
        img: "images/banner-1.webp",
        title: 'Authentic Nepal  <span class="text-[#51aa1b]">Lekali Foods</span>',
        desc: "We believe that every child has immense",
    },
    {
        img: "images/banner-2.webp",
        title: 'Authentic Nepal  <span class="text-[#51aa1b]">Lekali Foods</span>',
        desc: "We believe that every child has immense",
    },
    {
        img: "images/banner-3.webp",
        title: 'Authentic Nepal  <span class="text-[#51aa1b]">Lekali Foods</span>',
        desc: "We believe that every child has immense asdfaf",
    },
];

const HeroSection = () => {
    const totalSlides = slides.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % totalSlides);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isPlaying, totalSlides]);
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-6 h-[450px]">
                {/* Sidebar Categories - Desktop */}
                <div className="w-full md:w-[270px] hidden md:block bg-white border border-gray-200 rounded-sm flex-shrink-0">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 uppercase text-sm">
                        Top Categories
                    </div>
                    <ul className="flex flex-col">
                        {categories.map((cat, idx) => (
                            <li
                                key={idx}
                                className="border-b border-gray-50 last:border-none"
                            >
                                <a
                                    href="#"
                                    className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:text-[#5cb85c] hover:bg-gray-50 transition-colors group"
                                >
                                    <span>{cat}</span>
                                    <ChevronRight
                                        size={14}
                                        className="text-gray-300 group-hover:text-[#5cb85c]"
                                    />
                                </a>
                            </li>
                        ))}
                        <li className="mt-auto">
                            <a
                                href="#"
                                className="block px-4 py-3 text-sm text-[#5cb85c] font-medium hover:underline"
                            >
                                + More Categories
                            </a>
                        </li>
                    </ul>
                </div>

                {/* <div className="flex-1 rounded-lg overflow-hidden relative group">
          <div className="w-full h-full bg-gray-200 relative">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
              alt="Grocery Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center p-8 md:p-16">
              <div className="max-w-lg space-y-4 animate-in fade-in slide-in-from-left duration-700">
                <span className="bg-[#5cb85c] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                  Exclusive Offer
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                  Fresh Organic <br /> <span className="text-[#5cb85c]">Vegetables</span>
                </h2>
                <p className="text-white text-lg drop-shadow-sm font-medium">Get up to 30% off on your first order</p>
                <button className="mt-4 bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-8 py-3 rounded-full font-bold uppercase text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div> */}

                <div
                    className="flex-1 rounded-lg overflow-hidden relative group"
                    id="carousel-container"
                >
                    <div
                        ref={carouselRef}
                        id="carousel"
                        className="w-full h-full bg-gray-200 relative"
                        onMouseEnter={() => setIsPlaying(false)}
                        onMouseLeave={() => setIsPlaying(true)}
                    >
                        {slides.map((slide, i) => (
                            <div
                                key={i}
                                className={`slide absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
                                    currentIndex === i
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <img
                                    src={slide.img}
                                    alt={`Slide ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center bg-[radial-gradient(circle_at_top_left,rgba(20,37,75,1),rgba(20,37,75,0.1))]">
                                    <div className="max-w-[1200px] w-full mx-auto px-14 xl:px-4 py-2 text-white grid grid-cols-1 gap-2 lg:gap-6">
                                        <h2
                                            className="text-xl md:text-4xl lg:text-5xl font-extrabold uppercase leading-[1.2] max-w-[600px]"
                                            dangerouslySetInnerHTML={{
                                                __html: slide.title,
                                            }}
                                        />
                                        <p className="text-sm lg:text-lg font-light text-white/70 max-w-[600px]">
                                            {slide.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        id="prev"
                        aria-label="Previous Slide"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 shadow-lg focus:outline-none focus:ring-1 focus:ring-transparent flex items-center justify-center w-8 h-8 md:w-10 md:h-10 z-20 transition-opacity duration-300 cursor-pointer"
                        onClick={() => {
                            setCurrentIndex(
                                (prev) => (prev - 1 + totalSlides) % totalSlides
                            );
                            setIsPlaying(true);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15 18-6-6 6-6"
                            />
                        </svg>
                    </button>
                    <button
                        id="next"
                        aria-label="Next Slide"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 shadow-lg focus:outline-none focus:ring-1 focus:ring-transparent flex items-center justify-center w-8 h-8 md:w-10 md:h-10 z-20 transition-opacity duration-300 cursor-pointer"
                        onClick={() => {
                            setCurrentIndex((prev) => (prev + 1) % totalSlides);
                            setIsPlaying(true);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9 6 6 6-6 6"
                            />
                        </svg>
                    </button>

                    <div
                        id="dots"
                        className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2 z-20"
                    >
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={`w-2 h-2 rounded-full bg-white/70 hover:bg-white transition transform cursor-pointer ${
                                    currentIndex === i
                                        ? "scale-110 opacity-100"
                                        : "opacity-50"
                                }`}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    setIsPlaying(true);
                                }}
                                aria-label={`Slide ${i + 1}`}
                                aria-current={
                                    currentIndex === i ? "true" : "false"
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
