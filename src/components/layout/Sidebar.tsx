import { NavLink } from "react-router-dom";
const sections = [
  { path: "/", name: "Dashboard", icon: "🏠" },
  { path: "/mappings", name: "Mappings", icon: "🔄" },
  { path: "/workflows", name: "Workflows", icon: "⚙️" },
  { path: "/sessions", name: "Sessions", icon: "📊" },
  { path: "/sources", name: "Sources", icon: "📥" },
  { path: "/targets", name: "Targets", icon: "📤" },
];
export const Sidebar = () => (
  <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg">
    <div className="p-4">
      <h1 className="text-xl font-bold">PowerCenter ETL</h1>
    </div>
    <nav className="mt-4">
      {sections.map((section) => (
        <NavLink
          key={section.name}
          to={section.path}
          className={({ isActive }) =>
            `w-full text-left px-4 py-2 block hover:bg-gray-700 transition-colors ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          <span className="mr-2">{section.icon}</span>
          {section.name}
        </NavLink>
      ))}
    </nav>
  </aside>
);
