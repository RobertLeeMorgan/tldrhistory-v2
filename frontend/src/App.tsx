import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EraProvider } from "./context/EraContext";
import CreatePost from "./pages/CreatePost";
import TimelinePage from "./pages/TimelinePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SuggestEdit from "./pages/SuggestEdit";
import User from "./pages/User";
import RootLayout from "./pages/RootLayout";
import ReviewSuggestions from "./pages/ReviewSuggestions";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { ToastProvider } from "./context/ToastContext";
import Cookies from "./pages/Cookies";

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles?: string[];
}

function ProtectedRoute({ element, roles }: ProtectedRouteProps) {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuth.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(isAuth.role || "")) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/timeline" replace /> },
      { path: "/timeline", element: <TimelinePage /> },
        { path: "/timeline/:groupSlug", element: <TimelinePage /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/user/:id", element: <User /> },
      {
        path: "/edit/:id",
        element: <ProtectedRoute element={<SuggestEdit />} />,
      },
      {
        path: "/create",
        element: <ProtectedRoute element={<CreatePost />} />,
      },
      {
        path: "/review-suggestions",
        element: (
          <ProtectedRoute
            element={<ReviewSuggestions />}
            roles={["ADMIN", "MODERATOR"]}
          />
        ),
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/cookies",
        element: <Cookies />,
      },
    ],
  },
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <EraProvider>
            <RouterProvider router={router} />
          </EraProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
