import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items }) => {
  return (
    <div className="bg-[#f5f5f5] py-4 mb-8">
      <div className="container mx-auto px-4">
        <ul className="flex items-center text-sm font-medium text-gray-600">
          <li>
            <a href="/" className="hover:text-[#5cb85c] transition-colors flex items-center">
              <Home size={14} className="mr-1" />
              Home
            </a>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              {index === items.length - 1 ? (
                <span className="text-gray-800 font-bold">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-[#5cb85c] transition-colors">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
