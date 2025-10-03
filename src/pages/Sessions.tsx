import { Link } from "react-router-dom";
import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Sessions = () => {
  const { data, searchTerm } = useAppData();

  const filteredSessions = data?.sessions?.filter((session) =>
    session.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSessions = data?.sessions?.length || 0;
  const validSessions = data?.sessions?.filter(s => s.isValid === "YES").length || 0;
  const reusableSessions = data?.sessions?.filter(s => s.reusable === "YES").length || 0;
  const invalidSessions = totalSessions - validSessions;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sessions</h1>
            <p className="text-slate-600">Gestión de sesiones de ejecución</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-teal-900">{totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Válidas</p>
                <p className="text-2xl font-bold text-blue-900">{validSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-cyan-600 font-medium">Reutilizables a</p>
                <p className="text-2xl font-bold text-cyan-900">{reusableSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Inválidas</p>
                <p className="text-2xl font-bold text-red-900">{invalidSessions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-6">
        {searchTerm && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-teal-800">
                Mostrando resultados para: <span className="font-semibold">"{searchTerm}"</span>
              </p>
              {filteredSessions && (
                <span className="text-teal-600">({filteredSessions.length} encontradas)</span>
              )}
            </div>
          </div>
        )}

        {filteredSessions && filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const mappedMapping = data?.mappings.find(
                (m) => m.name === session.mappingName
              );

              const sourceNames =
                mappedMapping?.instances
                  .filter((inst) => inst.type === "SOURCE")
                  .map((inst) => inst.name) || [];
              const targetNames =
                mappedMapping?.instances
                  .filter((inst) => inst.type === "TARGET")
                  .map((inst) => inst.name) || [];
              const transformationNames =
                mappedMapping?.instances
                  .filter((inst) => inst.type === "TRANSFORMATION")
                  .map((inst) => `${inst.name} (${inst.transformationType})`) ||
                [];

              return (
                <div
                  key={session.name}
                  className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors duration-200">
                          {session.name}
                        </h3>
                        <p className="text-sm text-slate-600">Session</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.isValid === "YES" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          session.isValid === "YES" ? "bg-blue-400" : "bg-red-400"
                        }`}></div>
                        {session.isValid === "YES" ? "Válida" : "Inválida"}
                      </span>
                      {session.reusable && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          session.reusable === "YES" 
                            ? "bg-cyan-100 text-cyan-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            session.reusable === "YES" ? "bg-cyan-400" : "bg-gray-400"
                          }`}></div>
                          {session.reusable === "YES" ? "Reutilizable" : "No reutilizable"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Mapping asociado</p>
                      <p className="text-sm text-slate-700 font-medium">{session.mappingName}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-blue-600 font-medium">Sources</p>
                        <p className="text-blue-900 font-bold">{sourceNames.length}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-green-600 font-medium">Targets</p>
                        <p className="text-green-900 font-bold">{targetNames.length}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <p className="text-purple-600 font-medium">Transf.</p>
                        <p className="text-purple-900 font-bold">{transformationNames.length}</p>
                      </div>
                    </div>

                    {sourceNames.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Sources ({sourceNames.length})</p>
                        <p className="text-sm text-blue-800">
                          {sourceNames.slice(0, 2).join(", ")}
                          {sourceNames.length > 2 ? "..." : ""}
                        </p>
                      </div>
                    )}

                    {targetNames.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">Targets ({targetNames.length})</p>
                        <p className="text-sm text-green-800">
                          {targetNames.slice(0, 2).join(", ")}
                          {targetNames.length > 2 ? "..." : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    title=""
                    to={`/powercenter/sessions/${session.name}`}
                  >
                    <div className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg p-3 text-center font-medium hover:from-teal-600 hover:to-cyan-700 transition-all duration-200">
                      Ver Detalles
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 shadow-md text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No se encontraron sesiones" : "No hay sesiones disponibles"}
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? `No se encontraron sesiones que coincidan con "${searchTerm}"`
                : "No hay sesiones configuradas en el sistema"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
