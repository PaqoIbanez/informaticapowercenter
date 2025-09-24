import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Sessions = () => {
  const { data, searchTerm } = useAppData();

  const filteredSessions = data?.sessions?.filter((session) =>
    session.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions && filteredSessions.length > 0 ? (
          filteredSessions.map((session) => {
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
              <Card
                key={session.name}
                title={session.name}
                titleClassName="text-teal-600"
              >
                <p>Mapping: {session.mappingName}</p>
                <p>Estado: {session.isValid}</p>
                <div className="mt-2 text-sm">
                  <p className="font-medium">
                    Sources ({sourceNames.length}):{" "}
                    {sourceNames.slice(0, 2).join(", ")}
                    {sourceNames.length > 2 ? "..." : ""}
                  </p>
                  <p className="font-medium">
                    Targets ({targetNames.length}):{" "}
                    {targetNames.slice(0, 2).join(", ")}
                    {targetNames.length > 2 ? "..." : ""}
                  </p>
                </div>
              </Card>
            );
          })
        ) : (
          <p>No se encontraron sesiones que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default Sessions;
