// src/pages/Dashboard.tsx
import { DataTable } from "../components/common/DataTable";
import { KPICard } from "../components/dashboard/KPICard";
import MappingTypeChart from "../components/dashboard/MappingTypeChart";
import MappingGraph from "../components/mappings/MappingGraph";
import { useExtractionData } from "../hooks/useExtractionData";
import { Loader } from "../components/ui/Loader";

// Iconos para los KPIs
const WorkflowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SessionIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MappingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const SourceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default function Dashboard() {
  const { data, loading, error } = useExtractionData();

  const mappings = data?.mappings ?? [];
  const s = data?.summary;

  const kpis = {
    workflows: s?.totalWorkflows ?? 0,
    sessions: s?.totalSessions ?? 0,
    mappings: s?.totalMappings ?? mappings.length,
    sources: s?.totalSources ?? 0,
    targets: s?.totalTargets ?? 0,
  };

  const mappingColumns = [
    { header: "Mapping", accessorKey: "name" },
    {
      header: "Válido",
      cell: ({ row }: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original?.isValid === "YES" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {row.original?.isValid === "YES" ? "Sí" : "No"}
        </span>
      ),
    },
    {
      header: "#Transf.",
      cell: ({ row }: any) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
          {row.original?.transformations?.length ?? 0}
        </span>
      ),
    },
    {
      header: "#Instancias",
      cell: ({ row }: any) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
          {row.original?.instances?.length ?? 0}
        </span>
      ),
    },
  ];

  if (loading) return <Loader text="Cargando dashboard..." />;
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error al cargar datos</h3>
        <p className="text-slate-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md animate-fade-in">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="animate-slide-in">
              <h1 className="text-2xl font-bold text-slate-900">Dashboard PowerCenter</h1>
              <p className="text-slate-600">Resumen general del sistema ETL</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 stagger-children">
            <div className="card-hover">
              <KPICard
                title="Workflows"
                value={kpis.workflows}
                icon={<WorkflowIcon />}
                color="blue"
                description="Total de workflows"
              />
            </div>
            <div className="card-hover">
              <KPICard
                title="Sessions"
                value={kpis.sessions}
                icon={<SessionIcon />}
                color="green"
                description="Total de sessions"
              />
            </div>
            <div className="card-hover">
              <KPICard
                title="Mappings"
                value={kpis.mappings}
                icon={<MappingIcon />}
                color="purple"
                description="Total de mappings"
              />
            </div>
            <div className="card-hover">
              <KPICard
                title="Sources"
                value={kpis.sources}
                icon={<SourceIcon />}
                color="orange"
                description="Total de sources"
              />
            </div>
            <div className="card-hover">
              <KPICard
                title="Targets"
                value={kpis.targets}
                icon={<TargetIcon />}
                color="red"
                description="Total de targets"
              />
            </div>
          </div>
        </div>

        {/* Distribución por tipo de transformación */}
        <section className="space-y-4 animate-slide-up delay-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
            <svg className="w-6 h-6 text-purple-600 icon-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span>Distribución de Transformaciones</span>
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-300 card-hover">
            <MappingTypeChart mappings={mappings as any} />
          </div>
        </section>

        {/* Tabla comparativa de Mappings */}
        <section className="space-y-4 animate-slide-up delay-300">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
            <svg className="w-6 h-6 text-green-600 icon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>Mappings Detallados</span>
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <DataTable
              data={mappings as any}
              columns={mappingColumns as any}
              virtualized
              height={420}
            />
          </div>
        </section>

        {/* Grafo de un Mapping (ejemplo: el primero) */}
        {mappings[0] && (
          <section className="space-y-4 animate-slide-up delay-400">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                <svg className="w-6 h-6 text-indigo-600 icon-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Mapping: {mappings[0].name}</span>
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 animate-shimmer">
                Vista de demostración
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-md hover:shadow-lg transition-all duration-300 card-hover">
              <MappingGraph mapping={mappings[0] as any} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
