import type { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => (
  <header className="glass-effect border-b border-white/20 backdrop-blur-xl">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Título y breadcrumb */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Dashboard ETL</h1>
            <p className="text-sm text-slate-600 mt-1">
              Análisis y monitoreo de procesos ETL
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y acciones */}
        <div className="flex items-center space-x-6">
          {/* Barra de búsqueda mejorada */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar mappings, workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200/50 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                         placeholder-slate-400 text-slate-700 backdrop-blur-sm
                         transition-all duration-200 hover:bg-white/80"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Notificaciones */}
          <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84l3.12 3.12M4.03 8.86l3.12 3.12M1.01 11.88l3.12 3.12" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </button>

          {/* Configuración */}
          <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Perfil de usuario mejorado */}
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200/50">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Admin Usuario</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
                <span className="text-white font-semibold text-sm">AU</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
