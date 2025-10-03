import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Mappings = () => {
  const { data, searchTerm } = useAppData();

  // Usamos optional chaining (?.) para evitar errores si data es null al inicio
  const filteredMappings = data?.mappings?.filter((mapping) =>
    mapping.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMappings = data?.mappings?.length || 0;
  const validMappings = data?.mappings?.filter(m => m.isValid === "YES").length || 0;
  const invalidMappings = totalMappings - validMappings;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mappings</h1>
            <p className="text-slate-600">Gestión de transformaciones de datos</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{totalMappings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Válidos</p>
                <p className="text-2xl font-bold text-green-900">{validMappings}</p>
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
                <p className="text-2xl font-bold text-red-900">{invalidMappings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mappings Grid */}
      <div className="space-y-6">
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-blue-800">
                Mostrando resultados para: <span className="font-semibold">"{searchTerm}"</span>
              </p>
              {filteredMappings && (
                <span className="text-blue-600">({filteredMappings.length} encontrados)</span>
              )}
            </div>
          </div>
        )}

        {filteredMappings && filteredMappings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredMappings.map((mapping) => (
              <div
                key={mapping.name}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                        {mapping.name}
                      </h3>
                      <p className="text-sm text-slate-600">Mapping</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    mapping.isValid === "YES" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      mapping.isValid === "YES" ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    {mapping.isValid === "YES" ? "Válido" : "Inválido"}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Transformaciones</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {mapping.transformations?.length || 0}
                    </span>
                  </div>
                  
                  {mapping.description && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 line-clamp-2">{mapping.description}</p>
                    </div>
                  )}
                </div>

                <Card
                  title=""
                  to={`/powercenter/mappings/${mapping.name}`}
                  titleClassName="!p-0 !border-0 !shadow-none !bg-transparent"
                >
                  <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-3 text-center font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No se encontraron mappings" : "No hay mappings disponibles"}
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? `No se encontraron mappings que coincidan con "${searchTerm}"`
                : "No hay mappings configurados en el sistema"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mappings;
