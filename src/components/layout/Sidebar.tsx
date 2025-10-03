import { NavLink } from "react-router-dom";

// Iconos SVG modernos
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
  </svg>
);

const MappingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const WorkflowsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SessionsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SourcesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const TargetsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ToolsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const sections = [
  { path: "/", name: "Dashboard", icon: DashboardIcon },
  { path: "/mappings", name: "Mappings", icon: MappingsIcon },
  { path: "/workflows", name: "Workflows", icon: WorkflowsIcon },
  { path: "/sessions", name: "Sessions", icon: SessionsIcon },
  { path: "/sources", name: "Sources", icon: SourcesIcon },
  { path: "/targets", name: "Targets", icon: TargetsIcon },
  { path: "/tools", name: "Herramientas", icon: ToolsIcon },
];

export const Sidebar = () => (
  <aside className="w-64 gradient-secondary text-white shadow-xl relative overflow-hidden">
    {/* Efecto de fondo decorativo */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    
    <div className="relative z-10">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PowerCenter</h1>
            <p className="text-xs text-blue-200">ETL Analytics</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {sections.map((section) => (
            <NavLink
              key={section.name}
              to={section.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden ${
                  isActive 
                    ? "bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indicador activo */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-300 rounded-r-full"></div>
                  )}
                  
                  {/* Icono */}
                  <div className={`flex-shrink-0 mr-3 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}>
                    <section.icon />
                  </div>
                  
                  {/* Texto */}
                  <span className="flex-1">{section.name}</span>
                  
                  {/* Efecto hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover:translate-x-0"></div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer del sidebar */}
    </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 text-blue-200 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-subtle"></div>
          <span>Sistema activo</span>
        </div>
      </div>
  </aside>
);
