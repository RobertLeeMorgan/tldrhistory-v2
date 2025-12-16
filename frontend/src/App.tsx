import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EraProvider } from "./context/EraContext";

import EraPage from "./pages/EraPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SuggestEdit from "./pages/SuggestEdit";
import User from "./pages/User";
import RootLayout from "./pages/RootLayout";
import ReviewSuggestions from "./pages/ReviewSuggestions";

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles?: string[];
}

function ProtectedRoute({ element, roles }: ProtectedRouteProps) {
  const { isAuth, loading } = useAuth();

  if (loading) return null;

  if (!isAuth.token) return <Navigate to="/login" />;

  if (roles) {
    if (!isAuth.role || !roles.includes(isAuth.role)) {
      return <Navigate to="/login" />;
    }
  }

  return element;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <EraPage /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/user/:id", element: <User /> },
      {
        path: "/edit/:id",
        element: <ProtectedRoute element={<SuggestEdit />} />,
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
    ],
  },
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EraProvider>
          <RouterProvider router={router} />
        </EraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
