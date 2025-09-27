// src/components/mappings/MappingGraph.tsx
import { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import type { Mapping } from "../../types/extraction";

export default function MappingGraph({ mapping }: { mapping: Mapping }) {
  const { nodes, edges } = useMemo(() => {
    const nodes = (mapping.instances ?? []).map((inst, i) => ({
      id: inst.name,
      data: { label: `${inst.transformationType}: ${inst.name}` },
      position: { x: (i % 6) * 240, y: Math.floor(i / 6) * 120 },
      style: {
        borderRadius: 12,
        padding: 8,
        background: "#fff",
        border: "1px solid #e5e7eb",
      },
    }));

    const edges = (mapping.connectors ?? []).map((c, idx) => ({
      id: `${c.fromInstance}->${c.toInstance}-${idx}`,
      source: c.fromInstance,
      target: c.toInstance,
      label:
        c.fromField && c.toField ? `${c.fromField} → ${c.toField}` : undefined,
      animated: true,
    }));

    return { nodes, edges };
  }, [mapping]);

  return (
    <div className="h-[70vh] rounded-2xl border bg-white shadow-sm">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
