// src/App.tsx
import { useState, useEffect } from "react";
// Importa la nueva interfaz IFlatExtractionData y las interfaces mapeadas necesarias
import type { IFlatExtractionData } from "./interfaces/multi-workflow.interface"; 

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  // Usa la nueva interfaz IFlatExtractionData
  const [data, setData] = useState<IFlatExtractionData | null>(null); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Cargar datos del JSON, asumiendo que "extraction.json" está en la carpeta 'public'
    fetch("/extraction.json") 
      .then((response) => response.json())
      .then((json: IFlatExtractionData) => setData(json)) // Casteo a IFlatExtractionData
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const sections = [
    { id: "dashboard", name: "Dashboard", icon: "🏠" },
    { id: "mappings", name: "Mappings", icon: "🔄" },
    { id: "workflows", name: "Workflows", icon: "⚙️" },
    { id: "sessions", name: "Sessions", icon: "📊" },
    { id: "sources", name: "Sources", icon: "📥" },
    { id: "targets", name: "Targets", icon: "📤" },
  ];

  const renderContent = () => {
    if (!data) return <div className="p-6">Cargando datos...</div>;

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard ETL</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Mappings</h3>
                <p>{data.summary.totalMappings} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Workflows</h3>
                <p>{data.summary.totalWorkflows} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Sources</h3>
                <p>{data.summary.totalSources} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Targets</h3>
                <p>{data.summary.totalTargets} disponibles</p>
              </div>
            </div>
          </div>
        );
      case "mappings":
        const filteredMappings = data.mappings?.filter(mapping =>
          mapping.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Mappings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMappings?.map((mapping, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    {mapping.name}
                  </h3>
                  <p className="text-gray-600">Estado: {mapping.isValid}</p>
                  <p className="text-gray-600">
                    Transformaciones: {mapping.transformations?.length || 0}
                  </p>
                </div>
              )) || <p>No hay mappings disponibles.</p>}
            </div>
          </div>
        );
      case "workflows":
        const filteredWorkflows = data.workflows?.filter(workflow =>
          workflow.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkflows.map((workflow, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-green-600">
                    {workflow.name}
                  </h3>
                  <p className="text-gray-600">
                    Estado: {workflow.isValid} / {workflow.isEnabled}
                  </p>
                  <p className="text-gray-600">
                    Tareas: {workflow.tasks?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "sources":
        const filteredSources = data.sources?.filter(source =>
          source.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSources?.map((source, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-purple-600">
                    {source.name}
                  </h3>
                  <p className="text-gray-600">
                    Tipo: {source.databaseType}
                  </p>
                  <div className="text-gray-600">
                    <p className="font-medium">Campos ({source.fields?.length || 0}):</p>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {source.fields?.slice(0, 5).map((field, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{field.name}</span>
                          <span className="text-gray-500">{field.dataType}</span>
                        </div>
                      ))}
                      {(source.fields?.length || 0) > 5 && (
                        <p className="text-gray-400">... y {(source.fields.length - 5)} más</p>
                      )}
                    </div>
                  </div>
                </div>
              )) || <p>No hay sources disponibles.</p>}
            </div>
          </div>
        );
      case "targets":
        const filteredTargets = data.targets?.filter(target =>
          target.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTargets?.map((target, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-red-600">
                    {target.name}
                  </h3>
                  <p className="text-gray-600">
                    Tipo: {target.databaseType}
                  </p>
                  <div className="text-gray-600">
                    <p className="font-medium">Campos ({target.fields?.length || 0}):</p>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {target.fields?.slice(0, 5).map((field, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{field.name}</span>
                          <span className="text-gray-500">{field.dataType}</span>
                        </div>
                      ))}
                      {(target.fields?.length || 0) > 5 && (
                        <p className="text-gray-400">... y {(target.fields.length - 5)} más</p>
                      )}
                    </div>
                  </div>
                </div>
              )) || <p>No hay targets disponibles.</p>}
            </div>
          </div>
        );
      case "sessions":
        const filteredSessions = data.sessions?.filter(session =>
          session.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions?.map((session, index) => {
                // Ahora los detalles del mapeo se pueden buscar de data.mappings
                const mappedMapping = data.mappings.find(m => m.name === session.mappingName);

                const sourceNames = mappedMapping?.instances
                  .filter(inst => inst.type === 'SOURCE')
                  .map(inst => inst.name) || [];
                const targetNames = mappedMapping?.instances
                  .filter(inst => inst.type === 'TARGET')
                  .map(inst => inst.name) || [];
                const transformationNames = mappedMapping?.instances
                  .filter(inst => inst.type === 'TRANSFORMATION')
                  .map(inst => `${inst.name} (${inst.transformationType})`) || [];

                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-green-600">
                      {session.name}
                    </h3>
                    <p className="text-gray-600">Mapping: {session.mappingName}</p>
                    <p className="text-gray-600">Estado: {session.isValid}</p>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Sources ({sourceNames.length}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {sourceNames.slice(0, 3).map((src, idx) => (
                          <div key={idx}>{src}</div>
                        ))}
                        {sourceNames.length > 3 && (
                          <p className="text-gray-400">... y {sourceNames.length - 3} más</p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Targets ({targetNames.length}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {targetNames.slice(0, 3).map((tgt, idx) => (
                          <div key={idx}>{tgt}</div>
                        ))}
                        {targetNames.length > 3 && (
                          <p className="text-gray-400">... y {targetNames.length - 3} más</p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Transformaciones ({transformationNames.length}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {transformationNames.slice(0, 5).map((trans, idx) => (
                          <div key={idx}>{trans}</div>
                        ))}
                        {transformationNames.length > 5 && (
                          <p className="text-gray-400">... y {(transformationNames.length - 5)} más</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) || <p>No hay sesiones disponibles.</p>}
            </div>
          </div>
        );
      default:
        return <div className="p-6">Selecciona una sección.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold">PowerCenter ETL</h1>
        </div>
        <nav className="mt-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                activeSection === section.id ? "bg-gray-700" : ""
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;