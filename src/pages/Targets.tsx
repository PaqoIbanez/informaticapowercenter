import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Targets = () => {
  const { data, searchTerm } = useAppData();

  const filteredTargets = data?.targets?.filter((target) =>
    target.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Targets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTargets && filteredTargets.length > 0 ? (
          filteredTargets.map((target) => (
            <Card
              key={target.name}
              title={target.name}
              titleClassName="text-red-600"
            >
              <p>Tipo: {target.databaseType}</p>
              <div className="mt-2">
                <p className="font-medium">
                  Campos ({target.fields?.length || 0}):
                </p>
                <div className="max-h-20 overflow-y-auto text-sm">
                  {target.fields?.slice(0, 5).map((field, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{field.name}</span>
                      <span className="text-gray-500">{field.dataType}</span>
                    </div>
                  ))}
                  {(target.fields?.length || 0) > 5 && (
                    <p className="text-gray-400">
                      ... y {target.fields.length - 5} más
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p>No se encontraron targets que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default Targets;
