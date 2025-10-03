import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Targets = () => {
  const { data, searchTerm } = useAppData();

  const filteredTargets = data?.targets?.filter((target) =>
    target.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTargets = data?.targets?.length || 0;
  const targetsWithFields = data?.targets?.filter(t => t.fields && t.fields.length > 0).length || 0;
  const targetsWithDescription = data?.targets?.filter(t => t.description).length || 0;
  const uniqueDatabaseTypes = new Set(data?.targets?.map(t => t.databaseType)).size || 0;

  // Function to find dependencies for a target
  const getTargetDependencies = (targetName: string) => {
    const dependencies: {
      type: string;
      name: string;
      mapping?: string;
      workflow?: string;
    }[] = [];
    const seen = new Set<string>();

    // Find mappings that use this target
    const relatedMappings =
      data?.mappings?.filter((mapping) =>
        mapping.instances?.some(
          (instance) =>
            instance.type === "TARGET" &&
            instance.transformationName === targetName
        )
      ) || [];

    relatedMappings.forEach((mapping) => {
      const mappingKey = `Mapping:${mapping.name}`;
      if (!seen.has(mappingKey)) {
        seen.add(mappingKey);
        dependencies.push({
          type: "Mapping",
          name: mapping.name,
        });
      }

      // Find sessions that use this mapping
      const relatedSessions =
        data?.sessions?.filter(
          (session) => session.mappingName === mapping.name
        ) || [];

      relatedSessions.forEach((session) => {
        const sessionKey = `Session:${session.name}`;
        if (!seen.has(sessionKey)) {
          seen.add(sessionKey);
          dependencies.push({
            type: "Session",
            name: session.name,
            mapping: mapping.name,
          });
        }

        // Find workflows that contain this session
        const relatedWorkflows =
          data?.workflows?.filter((workflow) =>
            workflow.tasks?.some((task) => task.taskName === session.name)
          ) || [];

        relatedWorkflows.forEach((workflow) => {
          const workflowKey = `Workflow:${workflow.name}`;
          if (!seen.has(workflowKey)) {
            seen.add(workflowKey);
            dependencies.push({
              type: "Workflow",
              name: workflow.name,
              mapping: mapping.name,
            });
          }
        });
      });
    });

    return dependencies;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Targets</h1>
            <p className="text-slate-600">Gestión de destinos de datos y dependencias</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-red-900">{totalTargets}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Con Campos</p>
                <p className="text-2xl font-bold text-blue-900">{targetsWithFields}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Con Descripción</p>
                <p className="text-2xl font-bold text-green-900">{targetsWithDescription}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Tipos de BD</p>
                <p className="text-2xl font-bold text-purple-900">{uniqueDatabaseTypes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="space-y-6">
        {searchTerm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-red-800">
                Mostrando resultados para: <span className="font-semibold">"{searchTerm}"</span>
              </p>
              {filteredTargets && (
                <span className="text-red-600">({filteredTargets.length} encontrados)</span>
              )}
            </div>
          </div>
        )}

        {filteredTargets && filteredTargets.length > 0 ? (
          <div className="space-y-6">
            {filteredTargets.map((target) => {
              const dependencies = getTargetDependencies(target.name);

              return (
                <div key={target.name} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left side: Target Card */}
                    <div className="lg:w-1/3">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 h-full">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{target.name}</h3>
                            <p className="text-sm text-slate-600">Target</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Tipo:</span>
                            <span className="text-sm font-medium text-slate-900">{target.databaseType}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Campos:</span>
                            <span className="text-sm font-medium text-slate-900">{target.fields?.length || 0}</span>
                          </div>
                        </div>

                        {target.description && (
                          <div className="p-3 bg-white rounded-lg mb-4">
                            <p className="text-xs text-slate-500 mb-1">Descripción</p>
                            <p className="text-sm text-slate-700">{target.description}</p>
                          </div>
                        )}

                        <Card
                          title=""
                          to={`/powercenter/targets/${target.name}`}
                          titleClassName="!p-0 !border-0 !shadow-none !bg-transparent"
                        >
                          <div className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-3 text-center font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-200">
                            Ver Detalles
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Right side: Dependencies */}
                    <div className="lg:w-2/3">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Dependencias</h4>
                        <p className="text-sm text-slate-600">Mappings, sessions y workflows que utilizan este target</p>
                      </div>

                      {dependencies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Column 1: Mappings */}
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                              </div>
                              <h5 className="text-sm font-semibold text-blue-800">
                                Mappings ({dependencies.filter(dep => dep.type === 'Mapping').length})
                              </h5>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {dependencies.filter(dep => dep.type === 'Mapping').length > 0 ? (
                                dependencies.filter(dep => dep.type === 'Mapping').map((dep, index) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm text-slate-900 truncate">{dep.name}</p>
                                      <button
                                        onClick={() => window.open(`/powercenter/mappings/${dep.name}`, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                      >
                                        Ver
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-blue-600 text-sm">Sin mappings</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Sessions */}
                          <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                              </div>
                              <h5 className="text-sm font-semibold text-green-800">
                                Sessions ({dependencies.filter(dep => dep.type === 'Session').length})
                              </h5>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {dependencies.filter(dep => dep.type === 'Session').length > 0 ? (
                                dependencies.filter(dep => dep.type === 'Session').map((dep, index) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-slate-900 truncate">{dep.name}</p>
                                        <p className="text-xs text-green-600 truncate">Map: {dep.mapping}</p>
                                      </div>
                                      <button
                                        onClick={() => window.open(`/powercenter/sessions/${dep.name}`, '_blank')}
                                        className="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 rounded bg-green-100 hover:bg-green-200 transition-colors duration-200 ml-2"
                                      >
                                        Ver
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-green-600 text-sm">Sin sessions</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Column 3: Workflows */}
                          <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                              </div>
                              <h5 className="text-sm font-semibold text-purple-800">
                                Workflows ({dependencies.filter(dep => dep.type === 'Workflow').length})
                              </h5>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {dependencies.filter(dep => dep.type === 'Workflow').length > 0 ? (
                                dependencies.filter(dep => dep.type === 'Workflow').map((dep, index) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-slate-900 truncate">{dep.name}</p>
                                        <p className="text-xs text-purple-600 truncate">Map: {dep.mapping}</p>
                                      </div>
                                      <button
                                        onClick={() => window.open(`/powercenter/workflows/${dep.name}`, '_blank')}
                                        className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded bg-purple-100 hover:bg-purple-200 transition-colors duration-200 ml-2"
                                      >
                                        Ver
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-purple-600 text-sm">Sin workflows</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-8 text-center">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">No se encontraron dependencias</p>
                          <p className="text-slate-500 text-sm">Este target no está siendo utilizado por ningún mapping, session o workflow</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 shadow-md text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No se encontraron targets" : "No hay targets disponibles"}
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? `No se encontraron targets que coincidan con "${searchTerm}"`
                : "No hay targets configurados en el sistema"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Targets;
