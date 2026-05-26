import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import BrandPage from "../pages/BrandPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ContactUsPage from "../pages/ContactUsPage";
import GiftCertificatesPage from "../pages/GiftCertificatesPage";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import SiteMapPage from "../pages/SiteMapPage";
import SpecialsPage from "../pages/SpecialsPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import PlaceholderPage from "../pages/admin/PlaceholderPage";
import AddCategoriesPage from "../pages/admin/categories/AddCategoriesPage";
import CategoriesPage from "../pages/admin/categories/CategoriesPage.";
import EditCategoriesPage from "../pages/admin/categories/EditCategoriesPage";

const MyRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/product/:id",
            element: <ProductPage />,
        },
        {
            path: "/cart",
            element: <CartPage />,
        },
        {
            path: "/specials",
            element: <SpecialsPage />,
        },
        {
            path: "/contact-us",
            element: <ContactUsPage />,
        },
        {
            path: "/site-map",
            element: <SiteMapPage />,
        },
        {
            path: "/brands",
            element: <BrandPage />,
        },
        {
            path: "/gift-certificates",
            element: <GiftCertificatesPage />,
        },
        {
            path: "/checkout",
            element: <CheckoutPage />,
        },
        {
            path: "/admin/login",
            element: <AdminLoginPage />,
        },
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "/admin/dashboard",
                    element: <DashboardPage />,
                },
                {
                    path: "/admin/catalog/categories",
                    element: <CategoriesPage />,
                },

                {
                    path: "/admin/catalog/categories/add",
                    element: <AddCategoriesPage />,
                },
                {
                    path: "/admin/catalog/categories/edit/:id",
                    element: <EditCategoriesPage />,
                },
                {
                    path: "*",
                    element: <PlaceholderPage />,
                },
            ],
        },
        {
            path: "/*",
            element: <div>Not found</div>,
        },
    ]);
    return <RouterProvider router={router} />;
};

export default MyRouter;
