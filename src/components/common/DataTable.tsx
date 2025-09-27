import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

/**
 * DataTable genérica con soporte opcional de virtualización.
 * - data: filas
 * - columns: ColumnDef<T>[]
 * - height: alto del contenedor para virtualización (px)
 * - virtualized: activar/desactivar virtualización
 */
export function DataTable<T>({
  data,
  columns,
  virtualized = false,
  height = 520,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
  virtualized?: boolean;
  height?: number;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
  });

  const rows = table.getRowModel().rows;

  // Virtualización de filas (opcional)
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 8,
  });

  const items = virtualized
    ? rowVirtualizer.getVirtualItems()
    : rows.map((_, i) => ({ index: i } as any));

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-3 py-2 text-left font-semibold text-gray-700"
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>

      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: virtualized ? height : "auto" }}
      >
        <table className="min-w-full text-sm">
          <tbody
            style={
              virtualized
                ? { height: rowVirtualizer.getTotalSize() }
                : undefined
            }
          >
            {items.map((vi: any) => {
              const row = rows[virtualized ? vi.index : vi.index];
              const style = virtualized
                ? ({
                    transform: `translateY(${vi.start}px)`,
                  } as React.CSSProperties)
                : undefined;
              return (
                <tr
                  key={row.id}
                  style={style}
                  className="border-t hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
