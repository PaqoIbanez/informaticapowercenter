import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { SqlCodeViewer } from "../components/ui/SqlCodeViewer";
import type {
  IMappedMapping,
  IMappedSession,
  IMappedSource,
  IMappedTarget,
  IMappedWorkflow,
} from "../interfaces";

const Details = () => {
  const { objectType, objectId } = useParams<{
    objectType: string;
    objectId: string;
  }>();
  const navigate = useNavigate();
  const { data } = useAppData();

  if (!data) return <Loader />;

  // Find the object based on type and id
  let object:
    | IMappedMapping
    | IMappedWorkflow
    | IMappedSession
    | IMappedSource
    | IMappedTarget
    | null = null;
  let dependencies: string[] = [];

  switch (objectType) {
    case "mappings":
      object = data.mappings.find((m) => m.name === objectId) || null;
      if (object) {
        // Find dependencies: sources, targets, transformations
        const mapping = object as IMappedMapping;
        dependencies = [
          ...mapping.instances
            .filter((i) => i.type === "SOURCE")
            .map((i) => `Source: ${i.transformationName}`),
          ...mapping.instances
            .filter((i) => i.type === "TARGET")
            .map((i) => `Target: ${i.transformationName}`),
          ...mapping.transformations.map(
            (t) => `Transformation: ${t.name} (${t.type})`
          ),
        ];
      }
      break;
    case "workflows":
      object = data.workflows.find((w) => w.name === objectId) || null;
      if (object) {
        const workflow = object as IMappedWorkflow;
        dependencies = workflow.tasks.map(
          (t) => `Task: ${t.name} (${t.taskType})`
        );
      }
      break;
    case "sessions":
      object = data.sessions.find((s) => s.name === objectId) || null;
      if (object) {
        const session = object as IMappedSession;
        dependencies = [`Mapping: ${session.mappingName}`];
      }
      break;
    case "sources":
      object = data.sources.find((s) => s.name === objectId) || null;
      break;
    case "targets":
      object = data.targets.find((t) => t.name === objectId) || null;
      break;
    default:
      object = null;
  }

  if (!object) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Objeto no encontrado
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            El {objectType} "<span className="font-semibold text-slate-800">{objectId}</span>" no pudo ser encontrado.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              variant="primary"
              size="lg"
              fullWidth
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Volver atrás
            </Button>
            <Button
              to="/"
              variant="ghost"
              size="md"
              fullWidth
            >
              Ir al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderObjectDetails = () => {
    switch (objectType) {
      case "mappings":
        const mapping = object as IMappedMapping;

        // Categorize components with distinct filtering
        const sourceNames = Array.from(
          new Set(
            mapping.instances
              .filter((i) => i.type === "SOURCE")
              .map((i) => i.transformationName)
          )
        );

        const sources = sourceNames
          .map((name) =>
            mapping.instances.find(
              (i) => i.type === "SOURCE" && i.transformationName === name
            )
          )
          .filter(
            (source): source is NonNullable<typeof source> =>
              source !== undefined
          );

        const targetNames = Array.from(
          new Set(
            mapping.instances
              .filter((i) => i.type === "TARGET")
              .map((i) => i.transformationName)
          )
        );

        const targets = targetNames
          .map((name) =>
            mapping.instances.find(
              (i) => i.type === "TARGET" && i.transformationName === name
            )
          )
          .filter(
            (target): target is NonNullable<typeof target> =>
              target !== undefined
          );
        const sourceQualifiers = mapping.transformations.filter(
          (t) => t.type === "Source Qualifier"
        );
        const otherTransformations = mapping.transformations.filter(
          (t) => t.type !== "Source Qualifier"
        );

        return (
          <>
            {/* Header del Mapping */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{mapping.name}</h1>
                    <p className="text-slate-600 mt-1">Mapping de transformación de datos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    mapping.isValid === "YES" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      mapping.isValid === "YES" ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    {mapping.isValid === "YES" ? "Válido" : "Inválido"}
                  </span>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Volver
                  </Button>
                </div>
              </div>

              {/* Información básica mejorada */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Transformaciones</p>
                      <p className="text-xl font-bold text-blue-900">{mapping.transformations.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Instancias</p>
                      <p className="text-xl font-bold text-green-900">{mapping.instances.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Conectores</p>
                      <p className="text-xl font-bold text-purple-900">{mapping.connectors.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Variables</p>
                      <p className="text-xl font-bold text-orange-900">{mapping.variables.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {mapping.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{mapping.description}</p>
                </div>
              )}
            </div>

            {/* Sources y Source Qualifiers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sources */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Sources</h3>
                    <p className="text-sm text-slate-600">{sources.length} fuentes de datos</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sources.map((source, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-green-900 text-base">
                          {source.transformationName}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {source.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {source.name && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                            </svg>
                            <span className="text-sm text-green-700 font-medium">Nombre de negocio:</span>
                            <span className="text-sm text-green-800">{source.name}</span>
                          </div>
                        )}
                        
                        {source.description && (
                          <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <span className="text-sm text-green-700 font-medium">Descripción:</span>
                              <p className="text-sm text-green-800 mt-1">{source.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {sources.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-slate-500">No hay sources configurados</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Qualifiers */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Source Qualifiers</h3>
                    <p className="text-sm text-slate-600">{sourceQualifiers.length} calificadores de fuente</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sourceQualifiers.map((sq, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-blue-900 text-base">{sq.name}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sq.type}
                        </span>
                      </div>
                      
                      {sq.description && (
                        <div className="flex items-start space-x-2 mb-4">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span className="text-sm text-blue-700 font-medium">Descripción:</span>
                            <p className="text-sm text-blue-800 mt-1">{sq.description}</p>
                          </div>
                        </div>
                      )}

                      {/* Source Qualifier Attributes */}
                      {sq.attributes && sq.attributes.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h5 className="text-sm font-semibold text-blue-700">
                              Atributos ({sq.attributes.length})
                            </h5>
                          </div>
                          <div className="space-y-3">
                            {sq.attributes.map((attr, i) => {
                              if (
                                (i === 3 && attr.value === "0") ||
                                (i === 4 && attr.value === "Normal") ||
                                (i === 5 && attr.value === "NO") ||
                                (i === 6 && attr.value === "NO") ||
                                (i === 9 && attr.value === "NO") ||
                                (i === 10 && attr.value === "Never") ||
                                !attr.value
                              ) {
                                return null;
                              }

                              const isSqlAttribute = ['Sql Query', 'Pre SQL', 'Post SQL', 'Source Filter'].includes(attr.name);
                              const sqlType = attr.name === 'Post SQL' ? 'post' : 'pre';

                              return (
                                <div
                                  key={i}
                                  className="bg-white border border-blue-200/60 rounded-lg p-3 shadow-sm"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-900">{attr.name}</span>
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                      {attr.name}
                                    </span>
                                  </div>
                                  {isSqlAttribute ? (
                                    <SqlCodeViewer
                                      sql={attr.value}
                                      title={attr.name}
                                      type={sqlType}
                                      maxHeight="200px"
                                    />
                                  ) : (
                                    <div className="text-sm text-blue-800">
                                      {attr.value}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {sourceQualifiers.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <p className="text-slate-500">No hay source qualifiers configurados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transformations y Targets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Other Transformations */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Transformations</h3>
                    <p className="text-sm text-slate-600">{otherTransformations.length} transformaciones</p>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {otherTransformations.map((trans, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-yellow-900 text-base">{trans.name}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {trans.type}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {otherTransformations.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-slate-500">No hay transformaciones configuradas</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Targets */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Targets</h3>
                    <p className="text-sm text-slate-600">{targets.length} destinos de datos</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {targets.map((target, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-purple-900 text-base">
                          {target.transformationName}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {target.transformationType}
                        </span>
                      </div>
                      
                      {/* Display SQL attributes with syntax highlighting */}
                      {(() => {
                        const preSqlAttr = target.attributes?.find(attr => attr.name === 'Pre SQL');
                        const postSqlAttr = target.attributes?.find(attr => attr.name === 'Post SQL');

                        return (
                          <div className="mt-3 space-y-3">
                            {preSqlAttr && preSqlAttr.value && preSqlAttr.value.trim() && (
                              <SqlCodeViewer
                                sql={preSqlAttr.value}
                                title="Pre-SQL"
                                type="pre"
                                maxHeight="200px"
                              />
                            )}
                            {postSqlAttr && postSqlAttr.value && postSqlAttr.value.trim() && (
                              <SqlCodeViewer
                                sql={postSqlAttr.value}
                                title="Post-SQL"
                                type="post"
                                maxHeight="200px"
                              />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                  
                  {targets.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-slate-500">No hay targets configurados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SQL Commands Section */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">SQL Commands</h3>
                  <p className="text-sm text-slate-600">Comandos SQL asociados al mapping</p>
                </div>
              </div>

              {/* Find SQL commands from targets associated with this mapping */}
              {(() => {
                const mappingTargets = data?.targets?.filter(target =>
                  mapping.instances.some(instance =>
                    instance.type === "TARGET" && instance.transformationName === target.name
                  )
                ) || [];

                const sqlCommands: { preSql: string; postSql: string; targetName: string }[] = [];

                mappingTargets.forEach(target => {
                  const preSqlAttr = target.attributes?.find(attr => attr.name === "Pre SQL");
                  const postSqlAttr = target.attributes?.find(attr => attr.name === "Post SQL");

                  if ((preSqlAttr?.value && preSqlAttr.value.trim()) ||
                      (postSqlAttr?.value && postSqlAttr.value.trim())) {
                    sqlCommands.push({
                      preSql: preSqlAttr?.value || "",
                      postSql: postSqlAttr?.value || "",
                      targetName: target.name
                    });
                  }
                });

                if (sqlCommands.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 mb-2">No hay comandos SQL definidos</h4>
                      <p className="text-slate-500 max-w-md mx-auto">
                        Los comandos Pre-SQL y Post-SQL son opcionales y se ejecutan en las tablas de destino
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {sqlCommands.map((sql, index) => (
                      <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-indigo-900">
                            Target: {sql.targetName}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <SqlCodeViewer
                            sql={sql.preSql}
                            title="Pre-SQL Command"
                            type="pre"
                            maxHeight="300px"
                          />
                          <SqlCodeViewer
                            sql={sql.postSql}
                            title="Post-SQL Command"
                            type="post"
                            maxHeight="300px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </>
        );
      case "workflows":
        const workflow = object as IMappedWorkflow;
        return (
          <>
            {/* Header del Workflow */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{workflow.name}</h1>
                    <p className="text-slate-600 mt-1">Workflow de procesamiento</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    workflow.isValid === "YES" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      workflow.isValid === "YES" ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    {workflow.isValid === "YES" ? "Válido" : "Inválido"}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    workflow.isEnabled === "YES" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      workflow.isEnabled === "YES" ? "bg-blue-400" : "bg-gray-400"
                    }`}></div>
                    {workflow.isEnabled === "YES" ? "Habilitado" : "Deshabilitado"}
                  </span>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Volver
                  </Button>
                </div>
              </div>

              {/* Información básica y estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Tasks</p>
                      <p className="text-xl font-bold text-purple-900">{workflow.tasks.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Links</p>
                      <p className="text-xl font-bold text-blue-900">{workflow.links.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Variables</p>
                      <p className="text-xl font-bold text-green-900">{workflow.variables.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Servidor</p>
                      <p className="text-sm font-bold text-orange-900 truncate">{workflow.serverName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {workflow.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{workflow.description}</p>
                </div>
              )}
            </div>

            {/* Tasks Section */}
            {dependencies.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Tasks</h3>
                    <p className="text-sm text-slate-600">{dependencies.length} tareas configuradas</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dependencies.map((dep, index) => (
                    <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-indigo-900">{dep}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case "sessions":
        const session = object as IMappedSession;
        return (
          <>
            {/* Header de la Session */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{session.name}</h1>
                    <p className="text-slate-600 mt-1">Sesión de procesamiento</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    session.isValid === "YES" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      session.isValid === "YES" ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    {session.isValid === "YES" ? "Válida" : "Inválida"}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    session.reusable === "YES" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      session.reusable === "YES" ? "bg-blue-400" : "bg-gray-400"
                    }`}></div>
                    {session.reusable === "YES" ? "Reutilizable" : "No reutilizable"}
                  </span>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Volver
                  </Button>
                </div>
              </div>

              {/* Información de configuración */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Mapping</p>
                      <p className="text-sm font-bold text-emerald-900 truncate">{session.mappingName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Config Reference</p>
                      <p className="text-sm font-bold text-blue-900 truncate">{session.configReferenceName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Versión</p>
                      <p className="text-xl font-bold text-purple-900">{session.versionNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {session.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{session.description}</p>
                </div>
              )}
            </div>

            {/* Dependencies Section */}
            {dependencies.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Dependencias</h3>
                    <p className="text-sm text-slate-600">{dependencies.length} dependencias configuradas</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dependencies.map((dep, index) => (
                    <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-orange-900">{dep}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case "sources":
        const source = object as IMappedSource;
        return (
          <>
            {/* Header del Source */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{source.name}</h1>
                    <p className="text-slate-600 mt-1">Fuente de datos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    source.isFlatFile 
                      ? "bg-orange-100 text-orange-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      source.isFlatFile ? "bg-orange-400" : "bg-blue-400"
                    }`}></div>
                    {source.isFlatFile ? "Archivo Plano" : "Base de Datos"}
                  </span>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Volver
                  </Button>
                </div>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Tipo de BD</p>
                      <p className="text-sm font-bold text-cyan-900">{source.databaseType}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Propietario</p>
                      <p className="text-sm font-bold text-blue-900 truncate">{source.ownerName}</p>
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
                      <p className="text-sm text-green-600 font-medium">Total Campos</p>
                      <p className="text-xl font-bold text-green-900">{source.fields.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Tipo</p>
                      <p className="text-sm font-bold text-purple-900">{source.isFlatFile ? "Archivo" : "Tabla"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {source.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{source.description}</p>
                </div>
              )}
            </div>

            {/* Fields Section */}
            {source.fields.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Campos</h3>
                    <p className="text-sm text-slate-600">{source.fields.length} campos definidos</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {source.fields.slice(0, 12).map((field, index) => (
                    <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-indigo-900 truncate">{field.name}</p>
                          <p className="text-xs text-indigo-600 mt-1">{field.dataType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {source.fields.length > 12 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-sm text-slate-600">
                      ... y {source.fields.length - 12} campos más
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        );
      case "targets":
        const target = object as IMappedTarget;
        return (
          <>
            {/* Header del Target */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2h-2m-3-4l3 3m0 0l-3 3m3-3H9" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{target.name}</h1>
                    <p className="text-slate-600 mt-1">Destino de datos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                    <div className="w-2 h-2 rounded-full mr-2 bg-rose-400"></div>
                    Target
                  </span>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Volver
                  </Button>
                </div>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-rose-600 font-medium">Tipo de BD</p>
                      <p className="text-sm font-bold text-rose-900">{target.databaseType}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-pink-600 font-medium">Total Campos</p>
                      <p className="text-xl font-bold text-pink-900">{target.fields.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2h-2m-3-4l3 3m0 0l-3 3m3-3H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Tipo</p>
                      <p className="text-sm font-bold text-purple-900">Tabla Destino</p>
                    </div>
                  </div>
                </div>
              </div>

              {target.description && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{target.description}</p>
                </div>
              )}
            </div>

            {/* Fields Section */}
            {target.fields.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Campos</h3>
                    <p className="text-sm text-slate-600">{target.fields.length} campos definidos</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {target.fields.slice(0, 12).map((field, index) => (
                    <div key={index} className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-rose-900 truncate">{field.name}</p>
                          <p className="text-xs text-rose-600 mt-1">{field.dataType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {target.fields.length > 12 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-sm text-slate-600">
                      ... y {target.fields.length - 12} campos más
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        );
      default:
        return (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tipo de objeto no soportado</h3>
            <p className="text-gray-600">El tipo de objeto "{objectType}" no está soportado actualmente.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderObjectDetails()}
      </div>
    </div>
  );
};

export default Details;
