import { useAppData } from "../components/layout/MainLayout";

const Dashboard = () => {
  const { data } = useAppData();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard ETL</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Mappings</h3>
          <p>{data?.summary.totalMappings} disponibles</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Workflows</h3>
          <p>{data?.summary.totalWorkflows} disponibles</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Sources</h3>
          <p>{data?.summary.totalSources} disponibles</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Targets</h3>
          <p>{data?.summary.totalTargets} disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
