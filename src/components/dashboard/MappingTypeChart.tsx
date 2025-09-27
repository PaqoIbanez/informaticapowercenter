import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Mapping = {
  name: string;
  transformations?: { type: string }[];
};

export default function MappingTypeChart({
  mappings,
}: {
  mappings: Mapping[];
}) {
  const counts: Record<string, number> = {};
  mappings?.forEach((m) =>
    m.transformations?.forEach((t) => {
      counts[t.type] = (counts[t.type] ?? 0) + 1;
    })
  );
  const data = Object.entries(counts).map(([type, count]) => ({ type, count }));

  return (
    <div className="h-72 rounded-2xl border bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
