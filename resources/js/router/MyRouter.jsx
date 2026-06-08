import { ClientProvider } from "@/context/ClientContext";
import ClientForgotPasswordPage from "@/panels/auth/client/ClientForgotPasswordPage";
import ClientSignInPage from "@/panels/auth/client/ClientSignInPage";
import ClientSignUpPage from "@/panels/auth/client/ClientSignUpPage";
import ClientLayout from "@/panels/client/layout/ClientLayout";
import ClientAssignmentGridPage from "@/panels/client/pages/assignment/ClientAssignmentGridPage";
import ClientDashboardPage from "@/panels/client/pages/ClientDashboardPage";
import ClientAcademicRecordPage from "@/panels/client/pages/ClientAcademicRecordPage";
import ClientGradePage from "@/panels/client/pages/grade/ClientGradePage";
import ClientSubjectPage from "@/panels/client/pages/subject/ClientSubjectPage";
import ClientTeacherPage from "@/panels/client/pages/teacher/ClientTeacherPage";
import ClientTeacherRoutinePage from "@/panels/client/pages/teacher/ClientTeacherRoutinePage";
import GuestLayout from "@/panels/guest/layout/GuestLayout";
import HomePage from "@/panels/guest/pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

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
        path: "/client",
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/client/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <ClientDashboardPage />,
            },
            {
                path: "assignment-grid",
                element: <ClientAssignmentGridPage />,
            },
            {
                path: "academic-records",
                element: <ClientAcademicRecordPage />,
            },
            {
                path: "grades",
                element: <ClientGradePage />,
            },
            {
                path: "subjects",
                element: <ClientSubjectPage />,
            },
            {
                path: "teachers",
                element: <ClientTeacherPage />,
            },
            {
                path: "teacher-routines",
                element: <ClientTeacherRoutinePage />,
            },
        ],
    },
    {
        path: "/*",
        element: <div>Not found</div>,
    },
]);

const MyRouter = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ClientProvider>
                <RouterProvider router={router} />
            </ClientProvider>
            {ReactQueryDevtools ? (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            ) : null}
        </QueryClientProvider>
    );
};

export default MyRouter;
