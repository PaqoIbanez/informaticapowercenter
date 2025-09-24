import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Workflows = () => {
  const { data, searchTerm } = useAppData();

  const filteredWorkflows = data?.workflows?.filter((workflow) =>
    workflow.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Workflows</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkflows && filteredWorkflows.length > 0 ? (
          filteredWorkflows.map((workflow) => (
            <Card
              key={workflow.name}
              title={workflow.name}
              titleClassName="text-green-600"
            >
              <p>
                Estado: {workflow.isValid} / {workflow.isEnabled}
              </p>
              <p>Tareas: {workflow.tasks?.length || 0}</p>
            </Card>
          ))
        ) : (
          <p>No se encontraron workflows que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default Workflows;
