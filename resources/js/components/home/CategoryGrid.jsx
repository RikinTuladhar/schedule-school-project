import { useLanguage } from "../../context/LanguageContext";
import { categories } from "../../data/category";

const CategoryGrid = () => {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 relative pl-4 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-[#5cb85c]">
                Top Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.slice(0, 6).map((cat) => (
                    <a
                        key={cat.id}
                        href="#"
                        className="flex flex-col items-center group"
                    >
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-[#5cb85c]/30 transition-all shadow-sm group-hover:shadow-md mb-3 p-8">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="font-bold text-gray-700 group-hover:text-[#5cb85c] transition-colors">
                            {cat.name}
                        </h4>
                        <span className="text-xs text-gray-400">
                            {cat.productCount} {t("products")}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;
