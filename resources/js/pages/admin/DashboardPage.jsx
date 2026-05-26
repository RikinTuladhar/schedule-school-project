import { Calendar, CreditCard, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardWidget = ({ title, value, color, icon, link }) => (
  <div className={`rounded-lg text-white shadow relative overflow-hidden`} style={{ backgroundColor: color }}>
    <div className="p-4">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h2 className="text-3xl font-bold">{value}</h2>
          <div className="text-xs uppercase font-medium mt-1 opacity-80">{title}</div>
        </div>
        <div className="opacity-30">{icon}</div>
      </div>
    </div>
    <div className="bg-black/10 px-4 py-2 text-xs flex justify-between items-center group cursor-pointer hover:bg-black/20 transition-colors">
      <Link to={link || "#"} className="text-white/90 group-hover:text-white">
        View more...
      </Link>
      <span className="text-white/90 group-hover:text-white">→</span>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-600">Dashboard</h1>
          <nav className="text-xs text-gray-500 mt-1">
            <Link to="/admin" className="hover:text-blue-500">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span>Dashboard</span>
          </nav>
        </div>
        <button className="bg-[#1e91cf] text-white p-2 rounded hover:bg-[#1978ab]">
          <Calendar size={18} />
        </button>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardWidget
          title="TOTAL ORDERS"
          value="0"
          color="#1e91cf"
          icon={<ShoppingCart size={64} />}
          link="/admin/sales/orders"
        />
        <DashboardWidget
          title="TOTAL SALES"
          value="0"
          color="#1e91cf"
          icon={<CreditCard size={64} />}
          link="/admin/sales/orders"
        />
        <DashboardWidget
          title="TOTAL CUSTOMERS"
          value="0"
          color="#1e91cf" // Using same blue color as per screenshot/request, usually these might vary
          icon={<Users size={64} />}
          link="/admin/customers/customers"
        />
        <DashboardWidget title="PEOPLE ONLINE" value="0" color="#1e91cf" icon={<Users size={64} />} link="#" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* World Map Placeholder */}
        <div className="bg-white rounded shadow p-4 border border-gray-200 h-96">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <span className="text-gray-500">
              <Calendar size={16} />
            </span>
            <h3 className="font-semibold text-gray-600">World Map</h3>
          </div>
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 border border-dashed rounded">
            World Map Component Placeholder
          </div>
        </div>

        {/* Sales Analytics Placeholder */}
        <div className="bg-white rounded shadow p-4 border border-gray-200 h-96">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <span className="text-gray-500">
              <Calendar size={16} />
            </span>
            <h3 className="font-semibold text-gray-600">Sales Analytics</h3>
          </div>
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 border border-dashed rounded">
            Chart Component Placeholder
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded shadow border border-gray-200">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
            <span className="text-gray-500">
              <Calendar size={16} />
            </span>
            <h3 className="font-semibold text-gray-600">Recent Activity</h3>
          </div>
          <div className="p-8 text-center text-gray-500">No results!</div>
        </div>

        {/* Latest Orders */}
        <div className="bg-white rounded shadow border border-gray-200">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
            <span className="text-gray-500">
              <ShoppingCart size={16} />
            </span>
            <h3 className="font-semibold text-gray-600">Latest Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Added</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No results!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
