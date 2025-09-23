import { useState, useEffect } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Cargar datos del JSON
    fetch("/extraction.json")
      .then((response) => response.json())
      .then((json) => setData(json))
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
                <p>{data.REPOSITORY.FOLDER.MAPPING?.length || 0} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Workflows</h3>
                <p>{data.REPOSITORY.FOLDER.WORKFLOW ? 1 : 0} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Sources</h3>
                <p>{data.REPOSITORY.FOLDER.SOURCE?.length || 0} disponibles</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Targets</h3>
                <p>{data.REPOSITORY.FOLDER.TARGET?.length || 0} disponibles</p>
              </div>
            </div>
          </div>
        );
      case "mappings":
        const filteredMappings = data.REPOSITORY.FOLDER.MAPPING?.filter(mapping =>
          mapping.$?.NAME?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {mapping.$?.NAME}
                  </h3>
                  <p className="text-gray-600">Estado: {mapping.$?.ISVALID}</p>
                  <p className="text-gray-600">
                    Transformaciones: {mapping.TRANSFORMATION?.length || 0}
                  </p>
                </div>
              )) || <p>No hay mappings disponibles.</p>}
            </div>
          </div>
        );
      case "workflows":
        const filteredWorkflows = data.REPOSITORY.FOLDER.WORKFLOW &&
          data.REPOSITORY.FOLDER.WORKFLOW.$.NAME?.toLowerCase().includes(searchTerm.toLowerCase())
          ? [data.REPOSITORY.FOLDER.WORKFLOW]
          : [];
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
                    {workflow.$.NAME}
                  </h3>
                  <p className="text-gray-600">
                    Estado: {workflow.ISVALID} / {workflow.ISENABLED}
                  </p>
                  <p className="text-gray-600">
                    Tareas: {workflow.TASKINSTANCE?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "sources":
        const filteredSources = data.REPOSITORY.FOLDER.SOURCE?.filter(source =>
          source.$?.NAME?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {source.$?.NAME}
                  </h3>
                  <p className="text-gray-600">
                    Tipo: {source.$?.DATABASETYPE}
                  </p>
                  <div className="text-gray-600">
                    <p className="font-medium">Campos ({source.SOURCEFIELD?.length || 0}):</p>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {source.SOURCEFIELD?.slice(0, 5).map((field, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{field.$?.NAME}</span>
                          <span className="text-gray-500">{field.$?.DATATYPE}</span>
                        </div>
                      ))}
                      {(source.SOURCEFIELD?.length || 0) > 5 && (
                        <p className="text-gray-400">... y {(source.SOURCEFIELD.length - 5)} más</p>
                      )}
                    </div>
                  </div>
                </div>
              )) || <p>No hay sources disponibles.</p>}
            </div>
          </div>
        );
      case "targets":
        const filteredTargets = data.REPOSITORY.FOLDER.TARGET?.filter(target =>
          target.$?.NAME?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {target.$?.NAME}
                  </h3>
                  <p className="text-gray-600">
                    Tipo: {target.$?.DATABASETYPE}
                  </p>
                  <div className="text-gray-600">
                    <p className="font-medium">Campos ({target.TARGETFIELD?.length || 0}):</p>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {target.TARGETFIELD?.slice(0, 5).map((field, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{field.$?.NAME}</span>
                          <span className="text-gray-500">{field.$?.DATATYPE}</span>
                        </div>
                      ))}
                      {(target.TARGETFIELD?.length || 0) > 5 && (
                        <p className="text-gray-400">... y {(target.TARGETFIELD.length - 5)} más</p>
                      )}
                    </div>
                  </div>
                </div>
              )) || <p>No hay targets disponibles.</p>}
            </div>
          </div>
        );
      case "sessions":
        const filteredSessions = data.REPOSITORY.FOLDER.WORKFLOW?.TASKINSTANCE?.filter(
          (task) => task.$?.TASKTYPE === "Session" &&
            task.$?.NAME?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const getMappingDetails = (task) => {
          let mappingName = task.ATTRIBUTE?.find(attr => attr.$?.NAME === 'Mapping Name')?.$?.VALUE;

          // Fallback: si no hay atributo, derivar del nombre de la sesión
          if (!mappingName) {
            const sessionName = task.$?.NAME;
            if (sessionName?.startsWith('s_m_')) {
              mappingName = sessionName.replace(/^s_m_/, 'm_');
            }
          }

          if (!mappingName) return { sources: [], targets: [], mapping: null };

          const mapping = data.REPOSITORY.FOLDER.MAPPING?.find(m => m.$?.NAME === mappingName);
          if (!mapping) return { sources: [], targets: [], mapping: null };

          const sources = mapping.INSTANCE?.filter(inst => inst.$?.TYPE === 'SOURCE')
            .map(inst => inst.$?.NAME) || [];

          const targets = mapping.INSTANCE?.filter(inst => inst.$?.TYPE === 'TARGET')
            .map(inst => inst.$?.NAME) || [];

          return { sources, targets, mapping };
        };

        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions?.map((task, index) => {
                const { sources, targets, mapping } = getMappingDetails(task);
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-green-600">
                      {task.$?.NAME}
                    </h3>
                    <p className="text-gray-600">Tipo: {task.$?.TASKTYPE}</p>
                    <p className="text-gray-600">Estado: {task.$?.ISENABLED}</p>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Sources ({sources.length}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {sources.slice(0, 3).map((src, idx) => (
                          <div key={idx}>{src}</div>
                        ))}
                        {sources.length > 3 && (
                          <p className="text-gray-400">... y {sources.length - 3} más</p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Targets ({targets.length}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {targets.slice(0, 3).map((tgt, idx) => (
                          <div key={idx}>{tgt}</div>
                        ))}
                        {targets.length > 3 && (
                          <p className="text-gray-400">... y {targets.length - 3} más</p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600 mt-2">
                      <p className="font-medium">Transformaciones ({mapping?.INSTANCE?.filter(inst => inst.$?.TYPE === 'TRANSFORMATION').length || 0}):</p>
                      <div className="max-h-16 overflow-y-auto text-sm">
                        {mapping?.INSTANCE?.filter(inst => inst.$?.TYPE === 'TRANSFORMATION').slice(0, 5).map((trans, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{trans.$?.TRANSFORMATION_NAME}</span>
                            <span className="text-gray-500">({trans.$?.TRANSFORMATION_TYPE})</span>
                          </div>
                        ))}
                        {(mapping?.INSTANCE?.filter(inst => inst.$?.TYPE === 'TRANSFORMATION').length || 0) > 5 && (
                          <p className="text-gray-400">... y {(mapping.INSTANCE.filter(inst => inst.$?.TYPE === 'TRANSFORMATION').length - 5)} más</p>
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
