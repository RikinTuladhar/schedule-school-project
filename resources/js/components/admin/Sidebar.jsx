import {
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/admin/dashboard",
  },
  {
    title: "Catalog",
    icon: <Tag size={18} />,
    children: [
      { title: "Categories", path: "/admin/catalog/categories" },
      { title: "Products", path: "/admin/catalog/products" },
      { title: "Recurring Profiles", path: "/admin/catalog/recurring-profiles" },
      { title: "Filters", path: "/admin/catalog/filters" },
      {
        title: "Attributes",
        children: [
          { title: "Attributes", path: "/admin/catalog/attributes" },
          { title: "Attribute Groups", path: "/admin/catalog/attribute-groups" },
        ],
      },
      { title: "Options", path: "/admin/catalog/options" },
      { title: "Manufacturers", path: "/admin/catalog/manufacturers" },
      { title: "Downloads", path: "/admin/catalog/downloads" },
      { title: "Reviews", path: "/admin/catalog/reviews" },
      { title: "Information", path: "/admin/catalog/information" },
    ],
  },
  {
    title: "Sales",
    icon: <ShoppingCart size={18} />,
    children: [
      { title: "Orders", path: "/admin/sales/orders" },
      { title: "Recurring Orders", path: "/admin/sales/recurring-orders" },
      { title: "Returns", path: "/admin/sales/returns" },
      { title: "Gift Vouchers", path: "/admin/sales/gift-vouchers" },
    ],
  },
  {
    title: "Customers",
    icon: <Users size={18} />,
    children: [
      { title: "Customers", path: "/admin/customers/customers" },
      { title: "Customer Groups", path: "/admin/customers/customer-groups" },
      { title: "Customer Approvals", path: "/admin/customers/customer-approvals" },
      { title: "Custom Fields", path: "/admin/customers/custom-fields" },
    ],
  },
  {
    title: "Marketing",
    icon: <FileText size={18} />,
    children: [
      { title: "Marketing", path: "/admin/marketing/marketing" },
      { title: "Coupons", path: "/admin/marketing/coupons" },
      { title: "Mail", path: "/admin/marketing/mail" },
    ],
  },
  {
    title: "System",
    icon: <Settings size={18} />,
    children: [
      { title: "Settings", path: "/admin/system/settings" },
      {
        title: "Users",
        children: [
          { title: "Users", path: "/admin/system/users" },
          { title: "User Groups", path: "/admin/system/user-groups" },
          { title: "API", path: "/admin/system/api" },
        ],
      },
      {
        title: "Localisation",
        children: [
          { title: "Store Location", path: "/admin/system/localisation/location" },
          { title: "Languages", path: "/admin/system/localisation/languages" },
          { title: "Currencies", path: "/admin/system/localisation/currencies" },
          { title: "Stock Statuses", path: "/admin/system/localisation/stock-statuses" },
          { title: "Order Statuses", path: "/admin/system/localisation/order-statuses" },
          {
            title: "Returns",
            children: [
              { title: "Return Statuses", path: "/admin/system/localisation/return-statuses" },
              { title: "Return Actions", path: "/admin/system/localisation/return-actions" },
              { title: "Return Reasons", path: "/admin/system/localisation/return-reasons" },
            ],
          },
          { title: "Countries", path: "/admin/system/localisation/countries" },
          { title: "Zones", path: "/admin/system/localisation/zones" },
          { title: "Geo Zones", path: "/admin/system/localisation/geo-zones" },
          {
            title: "Taxes",
            children: [
              { title: "Tax Classes", path: "/admin/system/localisation/tax-classes" },
              { title: "Tax Rates", path: "/admin/system/localisation/tax-rates" },
            ],
          },
          { title: "Length Classes", path: "/admin/system/localisation/length-classes" },
          { title: "Weight Classes", path: "/admin/system/localisation/weight-classes" },
        ],
      },
    ],
  },
];

const MenuItem = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    item.path === location.pathname || (hasChildren && location.pathname.startsWith(item.title.toLowerCase())); // Simple active check

  const toggle = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <Link
        to={item.path || "#"}
        onClick={toggle}
        className={`flex items-center justify-between py-3 px-4 text-gray-300 hover:bg-[#343538] hover:text-white transition-colors ${
          isActive ? "text-white bg-[#343538]" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className="text-[#64666a] group-hover:text-white">{item.icon}</span>}
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        {hasChildren && (
          <span className="text-gray-500">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
        )}
      </Link>
      {hasChildren && isOpen && (
        <ul className="bg-[#2a2b2e]">
          {item.children.map((child, index) => (
            <MenuItem key={index} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  return (
    <nav className="w-64 h-screen bg-[#1f1f1f]  overflow-y-auto shrink-0 transition-all duration-300 pb-20 sticky top-12 left-0 z-0 border-r border-[#3a3b3e]">
      <ul className="py-2">
        <li className="px-4 flex gap-2 items-center py-2 text-xs font-semibold text-[#686a6e] uppercase tracking-wider mb-2">
          <span>
            <Menu size={18} />
          </span>
          <span>Navigation</span>
        </li>
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
