import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../components/layout/MainLayout";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";

type Attr = { name?: string; value?: string };
type Field = { name?: string; expression?: string; portType?: string };
type Transformation = {
  name: string;
  type: string;
  attributes?: Attr[];
  fields?: Field[];
};
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
type SourceOrTarget = {
  name: string;
  type?: string;
  databaseType?: string;
  fields?: { name: string }[];
};

const N = (s?: string) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
const HL = ({ text, q }: { text: string; q: string }) => {
  if (!q) return <>{text}</>;
  const i = N(text).indexOf(N(q));
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-yellow-200 rounded px-0.5">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
};

type Hit =
  | { kind: "object-usage"; mapping: string; detail: string; to?: string }
  | {
      kind: "expression";
      mapping: string;
      transformation: string;
      field: string;
      snippet: string;
      to?: string;
    }
  | {
      kind: "sql";
      mapping: string;
      transformation: string;
      attribute: string;
      snippet: string;
      to?: string;
    }
  | {
      kind: "connector";
      mapping: string;
      from: string;
      to: string;
      fromField?: string;
      toField?: string;
    }
  | {
      kind: "session-sql";
      session: string;
      attribute: string;
      snippet: string;
    };

export default function DependencySearcher() {
  const { data } = useAppData();
  const [query, setQuery] = useState("");
  if (!data) return <Loader />;

  const mappings = (data.mappings ?? []) as Mapping[];
  const sources = (data.sources ?? []) as SourceOrTarget[];
  const targets = (data.targets ?? []) as SourceOrTarget[];
  const sessions = (data.sessions ?? []) as any[];

  // Opciones para autocompletar: nombres de sources/targets y TODOS sus campos
  const objectOptions = useMemo(() => {
    const opts: string[] = [];
    for (const s of sources) {
      if (s.name) opts.push(s.name);
      for (const f of s.fields ?? [])
        if (f.name) opts.push(`${s.name}.${f.name}`);
    }
    for (const t of targets) {
      if (t.name) opts.push(t.name);
      for (const f of t.fields ?? [])
        if (f.name) opts.push(`${t.name}.${f.name}`);
    }
    return Array.from(new Set(opts)).sort();
  }, [sources, targets]);

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim();
    const Q = N(q);
    if (!q) return [];

    const result: Hit[] = [];
    const isObject =
      objectOptions.some((o) => N(o) === Q) ||
      [...sources, ...targets].some((o) => N(o.name) === Q);

    // 1) Si el término es exactamente un SOURCE/TARGET (o "objeto.campo"), listar dependencias por objeto
    if (isObject) {
      const [maybeObj, maybeField] = q.split(".");
      const objName = maybeObj;
      const lookingField = maybeField ?? "";

      for (const m of mappings) {
        const insts = m.instances ?? [];
        const cons = m.connectors ?? [];
        const transByName = new Map(
          m.transformations?.map((t) => [t.name, t]) ?? []
        );

        // ¿El mapping usa el objeto como SOURCE o TARGET?
        const using = insts.filter(
          (i) =>
            ["SOURCE", "TARGET"].includes(i.type) &&
            (N(i.transformationName) === N(objName) || N(i.name) === N(objName))
        );

        if (using.length) {
          // Si se especificó "objeto.campo", comprobar conectores/expresiones donde ese campo aparece
          if (lookingField) {
            const fld = lookingField;
            // conectores desde/hacia instancias que contengan el campo
            const consHits = cons.filter(
              (c) =>
                (using.some((u) => u.name === c.fromInstance) &&
                  N(c.fromField) === N(fld)) ||
                (using.some((u) => u.name === c.toInstance) &&
                  N(c.toField) === N(fld))
            );
            for (const ch of consHits) {
              result.push({
                kind: "connector",
                mapping: m.name,
                from: ch.fromInstance,
                to: ch.toInstance,
                fromField: ch.fromField,
                toField: ch.toField,
              });
            }

            // expresiones donde aparezca el campo
            for (const t of m.transformations ?? []) {
              for (const f of t.fields ?? []) {
                if (N(f.expression).includes(N(fld))) {
                  result.push({
                    kind: "expression",
                    mapping: m.name,
                    transformation: t.name,
                    field: f.name ?? "",
                    snippet: f.expression ?? "",
                    to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
                  });
                }
              }
            }

            // SQL & filtros
            for (const t of m.transformations ?? []) {
              for (const a of t.attributes ?? []) {
                const an = (a.name ?? "").toLowerCase();
                const isSqlLike = [
                  "sql query",
                  "pre sql",
                  "post sql",
                  "source filter",
                ].includes(an);
                if (isSqlLike && N(a.value).includes(N(fld))) {
                  result.push({
                    kind: "sql",
                    mapping: m.name,
                    transformation: t.name,
                    attribute: a.name ?? "",
                    snippet: a.value ?? "",
                    to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
                  });
                }
              }
            }
          }

          // Siempre añadimos un "usage" por mapping
          result.push({
            kind: "object-usage",
            mapping: m.name,
            detail: using
              .map((u) => `${u.type}: ${u.transformationName || u.name}`)
              .join(" · "),
            to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
          });
        }

        // si el objeto aparece como texto en SQL/expresiones (ej. OWNER.TABLA)
        for (const t of m.transformations ?? []) {
          for (const a of t.attributes ?? []) {
            const an = (a.name ?? "").toLowerCase();
            const isSqlLike = [
              "sql query",
              "pre sql",
              "post sql",
              "source filter",
            ].includes(an);
            if (isSqlLike && N(a.value).includes(N(objName))) {
              result.push({
                kind: "sql",
                mapping: m.name,
                transformation: t.name,
                attribute: a.name ?? "",
                snippet: a.value ?? "",
                to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
              });
            }
          }
        }
      }
    }

    // 2) Búsqueda libre: texto en expresiones, SQL y conectores (funciona para campos como LADA_INTERNACIONAL)
    for (const m of mappings) {
      for (const t of m.transformations ?? []) {
        for (const f of t.fields ?? []) {
          if (N(f.expression).includes(Q) || N(f.name).includes(Q)) {
            result.push({
              kind: "expression",
              mapping: m.name,
              transformation: t.name,
              field: f.name ?? "",
              snippet: f.expression ?? f.name ?? "",
              to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
            });
          }
        }
        for (const a of t.attributes ?? []) {
          const an = (a.name ?? "").toLowerCase();
          const isSqlLike = [
            "sql query",
            "pre sql",
            "post sql",
            "source filter",
          ].includes(an);
          if (isSqlLike && N(a.value).includes(Q)) {
            result.push({
              kind: "sql",
              mapping: m.name,
              transformation: t.name,
              attribute: a.name ?? "",
              snippet: a.value ?? "",
              to: `/powercenter/mappings/${encodeURIComponent(m.name)}`,
            });
          }
        }
      }

      for (const c of m.connectors ?? []) {
        if (N(c.fromField).includes(Q) || N(c.toField).includes(Q)) {
          result.push({
            kind: "connector",
            mapping: m.name,
            from: c.fromInstance,
            to: c.toInstance,
            fromField: c.fromField,
            toField: c.toField,
          });
        }
      }
    }

    // 3) Pre/Post SQL a nivel sesión (si aplica)
    for (const s of sessions ?? []) {
      for (const se of s.sessionExtensions ?? []) {
        for (const a of se.attributes ?? []) {
          const an = (a.name ?? "").toLowerCase();
          if (["pre sql", "post sql"].includes(an) && N(a.value).includes(Q)) {
            result.push({
              kind: "session-sql",
              session: s.name,
              attribute: a.name ?? "",
              snippet: a.value ?? "",
            });
          }
        }
      }
    }

    return result;
  }, [query, mappings, sources, targets, sessions, objectOptions]);

  // Agrupar por mapping para una visual más clara
  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) {
      const key =
        (h as any).mapping ?? `__SESSION__${(h as any).session ?? "?"}`;
      map.set(key, [...(map.get(key) ?? []), h]);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [hits]);

  return (
    <div className="space-y-6">
      {/* CINTILLO */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              list="pc-objects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe un objeto (Source/Target) o texto libre, ej. CADA_DWH_TELEFONO o LADA_INTERNACIONAL"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-2.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <datalist id="pc-objects">
              {objectOptions.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>
          <button
            className="rounded-xl px-3 py-2 text-sm bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            onClick={() => setQuery("")}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      {query && !hits.length ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-10 shadow-sm text-center">
          <p className="text-slate-600 font-medium">
            No se encontraron dependencias para “{query}”.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Prueba con el nombre completo del objeto o un término más
            específico.
          </p>
        </div>
      ) : null}

      {grouped.map(([group, list]) => {
        const isSession = group.startsWith("__SESSION__");
        const title = isSession
          ? `Sesión: ${group.replace("__SESSION__", "")}`
          : `Mapping: ${group}`;
        const total = list.length;

        return (
          <Card
            key={group}
            title={title}
            right={
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full">
                {total} {total === 1 ? "hallazgo" : "hallazgos"}
              </span>
            }
          >
            <div className="space-y-3">
              {list.map((h, idx) => {
                if (h.kind === "object-usage") {
                  return (
                    <div key={idx} className="flex items-start gap-2 py-1">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 border border-slate-200">
                        Uso
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">{h.detail}</p>
                        {h.to && (
                          <Link
                            className="text-xs text-indigo-600 hover:underline"
                            to={h.to}
                          >
                            Ver detalles
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                }
                if (h.kind === "connector") {
                  return (
                    <div key={idx} className="flex items-start gap-2 py-1">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-amber-100 border border-amber-200">
                        Conector
                      </span>
                      <div className="text-sm text-slate-800">
                        {h.from}.{h.fromField ?? "?"} → {h.to}.
                        {h.toField ?? "?"}
                      </div>
                    </div>
                  );
                }
                if (h.kind === "expression") {
                  return (
                    <div key={idx} className="flex items-start gap-2 py-1">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-green-100 border border-green-200">
                        Expresión
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">
                          {h.transformation} ·{" "}
                          <code className="font-mono">{h.field}</code>
                        </p>
                        {h.snippet && (
                          <pre className="mt-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-auto">
                            <HL text={h.snippet} q={query} />
                          </pre>
                        )}
                        {h.to && (
                          <Link
                            className="text-xs text-indigo-600 hover:underline"
                            to={h.to}
                          >
                            Ver mapping
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                }
                if (h.kind === "sql") {
                  return (
                    <div key={idx} className="flex items-start gap-2 py-1">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-blue-100 border border-blue-200">
                        SQL
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">
                          {h.transformation} ·{" "}
                          <span className="font-medium">{h.attribute}</span>
                        </p>
                        {h.snippet && (
                          <pre className="mt-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-auto">
                            <HL text={h.snippet} q={query} />
                          </pre>
                        )}
                        {h.to && (
                          <Link
                            className="text-xs text-indigo-600 hover:underline"
                            to={h.to}
                          >
                            Ver mapping
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                }
                // session-sql
                return (
                  <div key={idx} className="flex items-start gap-2 py-1">
                    <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-purple-100 border border-purple-200">
                      Sesión
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">
                        {h.session} ·{" "}
                        <span className="font-medium">{h.attribute}</span>
                      </p>
                      {h.snippet && (
                        <pre className="mt-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-auto">
                          <HL text={h.snippet} q={query} />
                        </pre>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
