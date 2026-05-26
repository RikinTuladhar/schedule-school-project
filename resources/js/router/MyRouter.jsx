import ClientSignInPage from "@/panels/auth/client/ClientSignInPage";
import ClientForgotPasswordPage from "@/panels/auth/client/ClientForgotPasswordPage";
import ClientSignUpPage from "@/panels/auth/client/ClientSignUpPage";
import GuestLayout from "@/panels/guest/layout/GuestLayout";
import HomePage from "@/panels/guest/pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();
const ReactQueryDevtools = import.meta.env.DEV
    ? lazy(() =>
          import("@tanstack/react-query-devtools").then((module) => ({
              default: module.ReactQueryDevtools,
          })),
      )
    : null;

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },
    {
        path: "/client/sign-in",
        element: <ClientSignInPage />,
    },
    {
        path: "/client/sign-up",
        element: <ClientSignUpPage />,
    },
    {
        path: "/client/forgot-password",
        element: <ClientForgotPasswordPage />,
    },
    {
        path: "/*",
        element: <div>Not found</div>,
    },
]);

const MyRouter = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {ReactQueryDevtools ? (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            ) : null}
        </QueryClientProvider>
    );
};

export default MyRouter;
