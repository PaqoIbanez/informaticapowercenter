import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">
        Página no encontrada
      </h2>
      <p className="text-gray-500 mt-2">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
