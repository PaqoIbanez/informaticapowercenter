import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";

const Sources = () => {
  const { data, searchTerm } = useAppData();

  const filteredSources = data?.sources?.filter((source) =>
    source.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSources && filteredSources.length > 0 ? (
          filteredSources.map((source) => (
            <Card
              key={source.name}
              title={source.name}
              titleClassName="text-purple-600"
            >
              <p>Tipo: {source.databaseType}</p>
              <div className="mt-2">
                <p className="font-medium">
                  Campos ({source.fields?.length || 0}):
                </p>
                <div className="max-h-20 overflow-y-auto text-sm">
                  {source.fields?.slice(0, 5).map((field, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{field.name}</span>
                      <span className="text-gray-500">{field.dataType}</span>
                    </div>
                  ))}
                  {(source.fields?.length || 0) > 5 && (
                    <p className="text-gray-400">
                      ... y {source.fields.length - 5} más
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p>No se encontraron sources que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default Sources;
