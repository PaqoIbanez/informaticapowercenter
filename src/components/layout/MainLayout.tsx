import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useEtlData } from "../../hooks/useEtlData";
import { Loader } from "../ui/Loader";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Contexto para pasar datos y estado a las páginas anidadas
type AppContextType = {
  data: ReturnType<typeof useEtlData>["data"];
  searchTerm: string;
};

export const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error } = useEtlData();

  if (loading) return <Loader />;
  if (error) return <div className="p-6">Error: {error}</div>;
  if (!data) return <div className="p-6">No se encontraron datos.</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mx-auto">
            <Outlet context={{ data, searchTerm } satisfies AppContextType} />
          </div>
        </main>
      </div>
    </div>
  );
};

// Hook para acceder fácilmente al contexto en las páginas
export function useAppData() {
  return useOutletContext<AppContextType>();
}
