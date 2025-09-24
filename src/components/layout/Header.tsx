import type { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">Dashboard ETL</h1>
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center space-x-2">
        <span>Usuario</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  </header>
);
