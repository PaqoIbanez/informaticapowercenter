import React, { useMemo } from "react";
import { useAppData } from "../components/layout/MainLayout";
import { Loader } from "../components/ui/Loader";

/** Tipos mínimos basados en extraction.json */
type Port = { name: string; portType?: string };
type Transformation = { name: string; type: string; fields?: Port[] };
type Instance = {
  name: string;
  type: "SOURCE" | "TARGET" | "TRANSFORMATION";
  transformationName: string;
  transformationType: string;
};
type Connector = {
  fromInstance: string;
  fromInstanceType: string;
  fromField?: string;
  toInstance: string;
  toInstanceType: string;
  toField?: string;
};
type Mapping = {
  name: string;
  transformations: Transformation[];
  instances: Instance[];
  connectors: Connector[];
};
type SourceDef = { name: string; fields?: { name: string }[] };

const norm = (s?: string) => (s ?? "").trim().toUpperCase();

/** ✅ FIX TS7031: tipamos children e intent correctamente */
type BadgeProps = {
  children: React.ReactNode;
  intent?: "neutral" | "success" | "warning" | "info";
};
function Badge({ children, intent = "neutral" }: BadgeProps) {
  const cls: Record<NonNullable<BadgeProps["intent"]>, string> = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cls[intent]}`}>
      {children}
    </span>
  );
}

function Card({
  title,
  right,
  children,
}: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-slate-800 font-semibold">{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function ExpressionValidator() {
  const { data, searchTerm } = useAppData(); // 🔗 usar el contexto real
  if (!data) return <Loader />;

  const mappings = (data.mappings ?? []) as Mapping[];
  const sources = (data.sources ?? []) as SourceDef[];

  const filteredMappings = useMemo(() => {
    const term = (searchTerm ?? "").toLowerCase();
    return term ? mappings.filter((m) => m.name.toLowerCase().includes(term)) : mappings;
  }, [mappings, searchTerm]);

  const results = useMemo(() => {
    return filteredMappings.map((m) => {
      const instances = m.instances ?? [];
      const transformations = m.transformations ?? [];
      const connectors = m.connectors ?? [];

      const tByName = new Map<string, Transformation>(
        transformations.map((t) => [t.name, t])
      );

      // Conjunto de instancias que son SQ en este mapping
      const sqNames = new Set(
        instances
          .filter((i) => i.transformationType === "Source Qualifier")
          .map((i) => i.name)
      );

      /** 1) EXPRESIONES: puertos INPUT o INPUT/OUTPUT sin conector de entrada */
      const expIssues: { trans: string; port: string }[] = [];
      for (const inst of instances) {
        if (inst.transformationType !== "Expression") continue; // excluir Source y SQ por pedido
        const t =
          tByName.get(inst.transformationName) || tByName.get(inst.name);
        const fields = t?.fields ?? [];
        for (const f of fields) {
          const ptype = (f.portType ?? "").toUpperCase();
          if (!ptype.includes("INPUT")) continue;
          const hasIncoming = connectors.some(
            (c) =>
              c.toInstance === inst.name && norm(c.toField) === norm(f.name)
          );
          if (!hasIncoming) {
            expIssues.push({ trans: inst.name, port: f.name });
          }
        }
      }

      /** 2) SOURCES → SQ: campos del Source no conectados a su(s) SQ */
      const srcGaps: { sourceInst: string; sqInst: string; fields: string[] }[] =
        [];

      for (const srcInst of instances.filter((i) => i.type === "SOURCE")) {
        const sourceName = srcInst.transformationName || srcInst.name;
        const sourceDef = sources.find((s) => norm(s.name) === norm(sourceName));
        if (!sourceDef) continue;

        // ¿A qué SQ(s) llega este Source en este mapping?
        const linkedSQs = new Set(
          connectors
            .filter(
              (c) =>
                c.fromInstance === srcInst.name &&
                (sqNames.has(c.toInstance) || c.toInstanceType === "Source Qualifier")
            )
            .map((c) => c.toInstance)
        );

        // Si no hay conectores hacia ningún SQ, entonces TODOS sus campos están “faltantes”
        if (linkedSQs.size === 0) {
          const allFields = (sourceDef.fields ?? []).map((f) => f.name);
          if (allFields.length) {
            srcGaps.push({
              sourceInst: srcInst.name,
              sqInst: "(sin SQ)",
              fields: allFields,
            });
          }
          continue;
        }

        // Para cada SQ destino, comparar el catálogo del Source vs lo realmente conectado
        for (const sqName of linkedSQs) {
          const connected = new Set(
            connectors
              .filter(
                (c) =>
                  c.fromInstance === srcInst.name &&
                  c.toInstance === sqName &&
                  c.fromField
              )
              .map((c) => norm(c.fromField))
          );
          const missing = (sourceDef.fields ?? [])
            .map((f) => f.name)
            .filter((fn) => !connected.has(norm(fn)));

          if (missing.length) {
            srcGaps.push({
              sourceInst: srcInst.name,
              sqInst: sqName,
              fields: missing,
            });
          }
        }
      }

      return {
        mappingName: m.name,
        expIssues,
        srcGaps,
      };
    });
  }, [filteredMappings, sources]);

  const totals = useMemo(() => {
    const exp = results.reduce((a, r) => a + r.expIssues.length, 0);
    const src = results.reduce(
      (a, r) => a + r.srcGaps.reduce((x, g) => x + g.fields.length, 0),
      0
    );
    return { exp, src };
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Header de la herramienta */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Validador de conexiones
          </h1>
          <p className="text-slate-600">
            • Expresiones con puertos de entrada sin conector &nbsp;|&nbsp; •
            Campos del Source no conectados a su Source Qualifier
          </p>
        </div>
        <div className="flex gap-2">
          <Badge intent="warning">Inputs sin conector: {totals.exp}</Badge>
          <Badge intent="info">Source→SQ faltantes: {totals.src}</Badge>
        </div>
      </div>

      {/* Lista por Mapping */}
      <div className="space-y-4">
        {results.map((r) => {
          const totalRows = r.expIssues.length + r.srcGaps.length;
          return (
            <Card
              key={r.mappingName}
              title={r.mappingName}
              right={
                <div className="flex gap-2">
                  <Badge intent="warning">{r.expIssues.length} inputs sin conector</Badge>
                  <Badge intent="info">
                    {
                      r.srcGaps.reduce((acc, g) => acc + g.fields.length, 0)
                    }{" "}
                    source→SQ faltantes
                  </Badge>
                </div>
              }
            >
              {/* Tabla de Expresiones */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">
                  Expresiones con puertos de entrada sin conector
                </h4>
                {r.expIssues.length ? (
                  <div className="overflow-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Transformación (Expression)</th>
                          <th className="px-3 py-2 text-left">Puerto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.expIssues.map((e, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-1.5">{e.trans}</td>
                            <td className="px-3 py-1.5 font-mono">{e.port}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Sin hallazgos.</p>
                )}
              </div>

              {/* Tabla Source → SQ */}
              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-semibold text-slate-700">
                  Campos del Source no conectados a su Source Qualifier
                </h4>
                {r.srcGaps.length ? (
                  <div className="overflow-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Source (instancia)</th>
                          <th className="px-3 py-2 text-left">SQ destino</th>
                          <th className="px-3 py-2 text-left">Campos faltantes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.srcGaps.map((g, idx) => (
                          <tr key={idx} className="border-t align-top">
                            <td className="px-3 py-1.5">{g.sourceInst}</td>
                            <td className="px-3 py-1.5">{g.sqInst}</td>
                            <td className="px-3 py-1.5">
                              <div className="flex flex-wrap gap-1">
                                {g.fields.map((f, i) => (
                                  <span
                                    key={i}
                                    className="rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2 py-0.5 font-mono"
                                  >
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Sin hallazgos.</p>
                )}
              </div>

              {!totalRows && (
                <div className="mt-4 text-slate-500 text-sm">
                  No se encontraron incidencias para este mapping.
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
