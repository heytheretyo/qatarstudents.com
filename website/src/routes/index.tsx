import Login from "../pages/auth/Login";
import Home from "../pages/home";

const mainRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default mainRoutes;
