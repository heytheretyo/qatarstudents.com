import GoogleAuthCallback from "../pages/auth/GoogleAuthCallback";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Blog from "../pages/Blog";
import Home from "../pages/Home";

const mainRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/auth/google/callback",
    element: <GoogleAuthCallback />,
  },
];

export default mainRoutes;
