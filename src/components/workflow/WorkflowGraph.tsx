import { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

type WorkflowTask = {
  name: string;
  taskType?: string;
};

type WorkflowLink = {
  fromTask: string;
  toTask: string;
  condition?: string;
};

type Workflow = {
  name: string;
  tasks: WorkflowTask[];
  links: WorkflowLink[];
};

export default function WorkflowGraph({ wf }: { wf: Workflow }) {
  const { nodes, edges } = useMemo(() => {
    const nodes = wf.tasks.map((t, i) => ({
      id: t.name,
      data: { label: `${t.taskType ?? "Task"}: ${t.name}` },
      position: { x: (i % 6) * 220, y: Math.floor(i / 6) * 120 },
      style: {
        borderRadius: 12,
        padding: 8,
        background: "#fff",
        border: "1px solid #e5e7eb",
      },
    }));
    const edges = wf.links.map((l) => ({
      id: `${l.fromTask}->${l.toTask}`,
      source: l.fromTask,
      target: l.toTask,
      label: l.condition,
      animated: true,
    }));
    return { nodes, edges };
  }, [wf]);

  return (
    <div className="h-[70vh] rounded-2xl border bg-white shadow-sm">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
