import { useState } from "react";
import { Card } from "../components/ui/Card";

// Placeholder components for each tool
const ExpressionValidator = () => {
  return (
    <Card title="">
      AQUI DEBE IR UNA LISTA DE OBJETOS DE POWER BI QUE NO TIENEN ALGUNOS
      CONECTORES DE ENTRADA
    </Card>
  );
};

const DependencySearcher = () => {
  return (
    <Card title="">
      AQUI DEBE HABER UNA LISTA DESPLEGABLE DE TODOS LOS OBJETOS DE POWER BI
      SOURCES Y TARGETS, CON OPCION PARA ESCRIBIR Y BUSCAR MAS RAPIDO, CUANDO
      SELECCIONE ALGUNO, DEBAJO DEBE ACTUALIZARSE CON TODOS LOS OBJETOS QUE
      TENGAN UNA DEPENDENCIA DE DICHO OBJETO
    </Card>
  );
};

const SqlDetector = () => {
  return (
    <Card title="">
      <>
        AQUI DEBEN DEBE HABER UN LISTADO DE LOS OBJETOS SQ SOURCE QUALIFIER Y
        TARGETS QUE TENGAN ALGUN VALOR EN SUS ATRIBUTOS PRESQL O POSTSQL
      </>
    </Card>
  );
};

const tabs = [
  {
    id: "validator",
    name: "Validador de Expresiones",
    component: ExpressionValidator,
  },
  {
    id: "searcher",
    name: "Buscador de Dependencias",
    component: DependencySearcher,
  },
  { id: "detector", name: "Detector de SQL", component: SqlDetector },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ExpressionValidator;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Herramientas
              </h1>
              <p className="text-slate-600">
                Herramientas especializadas para análisis y validación
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tool */}
        <div className="animate-fade-in">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
