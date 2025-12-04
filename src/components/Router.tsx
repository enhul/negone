import { MemberProvider } from '@/integrations';
import { RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import AboutPage from '@/components/pages/AboutPage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import RecipesPage from '@/components/pages/RecipesPage';
import ProgressPage from '@/components/pages/ProgressPage';

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />, // MIXED ROUTE: Shows different content for authenticated vs anonymous users
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "recipes",
            element: <RecipesPage />,
          },
          {
            path: "profile",
            element: (
              <MemberProtectedRoute messageToSignIn="Профайл үзэхийн тулд нэвтэрнэ үү">
                <ProfilePage />
              </MemberProtectedRoute>
            ),
          },
          {
            path: "dashboard",
            element: (
              <MemberProtectedRoute messageToSignIn="Хяналтын самбар үзэхийн тулд нэвтэрнэ үү">
                <DashboardPage />
              </MemberProtectedRoute>
            ),
          },
          {
            path: "progress",
            element: (
              <MemberProtectedRoute messageToSignIn="Ахиц дэвшил бүртгэхийн тулд нэвтэрнэ үү">
                <ProgressPage />
              </MemberProtectedRoute>
            ),
          },
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
