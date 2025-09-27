// src/pages/Dashboard.tsx
import { DataTable } from "../components/common/DataTable";
import { KPICard } from "../components/dashboard/KPICard";
import MappingTypeChart from "../components/dashboard/MappingTypeChart";
import MappingGraph from "../components/mappings/MappingGraph";
import { useExtractionData } from "../hooks/useExtractionData";

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
      cell: ({ row }: any) => (row.original?.isValid === "YES" ? "Sí" : "No"),
    },
    {
      header: "#Transf.",
      cell: ({ row }: any) => row.original?.transformations?.length ?? 0,
    },
    {
      header: "#Instancias",
      cell: ({ row }: any) => row.original?.instances?.length ?? 0,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard IPC</h1>
      {loading && <div className="text-gray-600">Cargando extracción…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <KPICard label="Workflows" value={kpis.workflows} />
            <KPICard label="Sessions" value={kpis.sessions} />
            <KPICard label="Mappings" value={kpis.mappings} />
            <KPICard label="Sources" value={kpis.sources} />
            <KPICard label="Targets" value={kpis.targets} />
          </div>

          {/* Distribución por tipo de transformación */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium">
              Distribución de Transformations
            </h2>
            <MappingTypeChart mappings={mappings as any} />
          </section>

          {/* Tabla comparativa de Mappings */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Mappings</h2>
            <DataTable
              data={mappings as any}
              columns={mappingColumns as any}
              virtualized
              height={420}
            />
          </section>

          {/* Grafo de un Mapping (ejemplo: el primero) */}
          {mappings[0] && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  Mapping: {mappings[0].name}
                </h2>
                <span className="text-sm text-gray-500">
                  (demo con el primer mapping)
                </span>
              </div>
              <MappingGraph mapping={mappings[0] as any} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
