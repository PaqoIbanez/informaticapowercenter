import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";

// Eager loading: Importa todos los componentes de página directamente
import Dashboard from "../pages/Dashboard";
import Details from "../pages/Details";
import Mappings from "../pages/Mappings";
import NotFound from "../pages/NotFound";
import Sessions from "../pages/Sessions";
import Sources from "../pages/Sources";
import Targets from "../pages/Targets";
import Tools from "../pages/Tools";
import Workflows from "../pages/Workflows";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "mappings",
        element: <Mappings />,
      },
      {
        path: "workflows",
        element: <Workflows />,
      },
      {
        path: "sessions",
        element: <Sessions />,
      },
      {
        path: "sources",
        element: <Sources />,
      },
      {
        path: "targets",
        element: <Targets />,
      },
      {
        path: "tools",
        element: <Tools />,
      },
      {
        path: "powercenter/:objectType/:objectId",
        element: <Details />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
