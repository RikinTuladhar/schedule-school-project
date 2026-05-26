import { Home, List, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PlaceholderPage = () => {
  const location = useLocation();

  // Extract title from path, e.g., /admin/catalog/products -> Products
  const pathParts = location.pathname.split("/");
  const title = pathParts[pathParts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const parent = pathParts[pathParts.length - 2]?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Generate random data
  const [data] = useState(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `${title} Item ${i + 1}${i % 3 === 0 ? " > Sub Item" : ""}`,
      sortOrder: Math.floor(Math.random() * 20),
    }));
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-600">{title}</h1>
          <nav className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Link to="/admin" className="hover:text-blue-500">
              <Home size={12} />
            </Link>
            <span className="mx-1">›</span>
            {parent && (
              <>
                <Link to="#" className="text-gray-500 hover:text-blue-500">
                  {parent}
                </Link>
                <span className="mx-1">›</span>
              </>
            )}
            <span className="text-gray-500">{title}</span>
          </nav>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-[#1e91cf] text-white p-2.5 rounded hover:bg-[#1978ab] shadow-sm transition-colors"
            title="Add New"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
          <button
            className="bg-white text-gray-600 border border-gray-300 p-2.5 rounded hover:bg-gray-50 shadow-sm transition-colors"
            title="Rebuild"
          >
            <RefreshCw size={16} />
          </button>
          <button
            className="bg-[#d9534f] text-white p-2.5 rounded hover:bg-[#c9302c] shadow-sm transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-600 flex items-center gap-2 text-sm">
            <List size={16} className="text-[#1e91cf]" />
            {title} List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 bg-white border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-1">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 font-medium hover:underline cursor-pointer text-[#1e91cf]">{title} Name</th>
                <th className="px-4 py-3 font-medium text-right hover:underline cursor-pointer text-[#1e91cf]">
                  Sort Order
                </th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.name}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="bg-[#1e91cf] text-white p-2 rounded hover:bg-[#1978ab] shadow-sm transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No results!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
          <div>
            Showing 1 to {data.length} of {data.length} ({Math.ceil(data.length / 20) || 1} Pages)
          </div>
          <div>Showing {data.length} results</div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
