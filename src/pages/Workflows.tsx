import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Workflows = () => {
  const { data, searchTerm } = useAppData();

  const filteredWorkflows = data?.workflows?.filter((workflow) =>
    workflow.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWorkflows = data?.workflows?.length || 0;
  const validWorkflows = data?.workflows?.filter(w => w.isValid === "YES").length || 0;
  const enabledWorkflows = data?.workflows?.filter(w => w.isEnabled === "YES").length || 0;
  const invalidWorkflows = totalWorkflows - validWorkflows;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Workflows</h1>
            <p className="text-slate-600">Gestión de flujos de trabajo</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-green-900">{totalWorkflows}</p>
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
                <p className="text-sm text-blue-600 font-medium">Válidos</p>
                <p className="text-2xl font-bold text-blue-900">{validWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Habilitados</p>
                <p className="text-2xl font-bold text-emerald-900">{enabledWorkflows}</p>
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
                <p className="text-sm text-red-600 font-medium">Inválidos</p>
                <p className="text-2xl font-bold text-red-900">{invalidWorkflows}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="space-y-6">
        {searchTerm && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-green-800">
                Mostrando resultados para: <span className="font-semibold">"{searchTerm}"</span>
              </p>
              {filteredWorkflows && (
                <span className="text-green-600">({filteredWorkflows.length} encontrados)</span>
              )}
            </div>
          </div>
        )}

        {filteredWorkflows && filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.name}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors duration-200">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-slate-600">Workflow</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.isValid === "YES" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        workflow.isValid === "YES" ? "bg-blue-400" : "bg-red-400"
                      }`}></div>
                      {workflow.isValid === "YES" ? "Válido" : "Inválido"}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.isEnabled === "YES" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        workflow.isEnabled === "YES" ? "bg-emerald-400" : "bg-gray-400"
                      }`}></div>
                      {workflow.isEnabled === "YES" ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tareas</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {workflow.tasks?.length || 0}
                    </span>
                  </div>
                  
                  {workflow.attributes && workflow.attributes[0] && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Archivo de parámetros</p>
                      <p className="text-sm text-slate-700 font-mono truncate">
                        {workflow.attributes[0].value}
                      </p>
                    </div>
                  )}

                  {workflow.description && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 line-clamp-2">{workflow.description}</p>
                    </div>
                  )}
                </div>

                <Card
                  title=""
                  to={`/powercenter/workflows/${workflow.name}`}
                  titleClassName="!p-0 !border-0 !shadow-none !bg-transparent"
                >
                  <div className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-3 text-center font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
                    Ver Detalles
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 shadow-md text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No se encontraron workflows" : "No hay workflows disponibles"}
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? `No se encontraron workflows que coincidan con "${searchTerm}"`
                : "No hay workflows configurados en el sistema"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows;