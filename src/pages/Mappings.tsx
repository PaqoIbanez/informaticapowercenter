import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Mappings = () => {
  const { data, searchTerm } = useAppData();

  // Usamos optional chaining (?.) para evitar errores si data es null al inicio
  const filteredMappings = data?.mappings?.filter((mapping) =>
    mapping.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mappings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMappings && filteredMappings.length > 0 ? (
          filteredMappings.map((mapping) => (
            <Card
              key={mapping.name}
              title={mapping.name}
              titleClassName="text-blue-600"
            >
              <p>Estado: {mapping.isValid}</p>
              <p>Transformaciones: {mapping.transformations?.length || 0}</p>
            </Card>
          ))
        ) : (
          <p>No se encontraron mappings que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default Mappings;
