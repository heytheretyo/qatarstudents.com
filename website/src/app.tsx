import { useRoutes } from "react-router-dom";
import Navbar from "./components/Navbar";

import routes from "./routes";

const App: React.FC = () => {
  const routeResult = useRoutes(routes);

  return (
    <>
      <Navbar />
      <main>{routeResult}</main>
    </>
  );
};

export default App;
