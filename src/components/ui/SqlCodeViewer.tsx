import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";

interface SqlCodeViewerProps {
  sql: string;
  title: string;
  type: "pre" | "post";
  maxHeight?: string;
}

export const SqlCodeViewer = ({
  sql,
  title,
  maxHeight = "400px",
}: SqlCodeViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    if (sql && sql.trim()) {
      const highlighted = Prism.highlight(sql, Prism.languages.sql, "sql");
      setHighlightedCode(highlighted);
    }
  }, [sql]);

  const shouldCollapse = sql.split("\n").length > 15;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">{title}</h4>
          {shouldCollapse && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {isExpanded ? "Collapse" : "Expand"} ({sql.split("\n").length}{" "}
              lines)
            </button>
          )}
        </div>
      </div>
      <div className=" rounded-lg overflow-hidden">
        <div
          className="overflow-x-auto"
          style={{ maxHeight: isExpanded ? "none" : maxHeight }}
        >
          <pre className="p-4 text-xs">
            <code
              className="language-sql"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};
