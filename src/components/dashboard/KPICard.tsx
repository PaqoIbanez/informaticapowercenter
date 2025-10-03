import { type ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  color = "blue",
}: KPICardProps) {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
    },
    green: {
      bg: "from-green-500 to-green-600",
      text: "text-green-600",
      light: "bg-green-50",
      border: "border-green-200",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      text: "text-purple-600",
      light: "bg-purple-50",
      border: "border-purple-200",
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      text: "text-orange-600",
      light: "bg-orange-50",
      border: "border-orange-200",
    },
    red: {
      bg: "from-red-500 to-red-600",
      text: "text-red-600",
      light: "bg-red-50",
      border: "border-red-200",
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in">
      {/* Fondo decorativo */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${currentColor.bg} opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300 animate-float`}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header con icono y título */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={`w-10 h-10 bg-gradient-to-br ${currentColor.bg} rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 icon-bounce`}>
                {icon}
              </div>
            )}
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              {title}
            </div>
          </div>
          
          {/* Indicador de tendencia */}
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium animate-pulse ${
              trend.isPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              <svg 
                className={`w-3 h-3 ${trend.isPositive ? "rotate-0" : "rotate-180"} transition-transform duration-300`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Valor principal */}
        <div className="mb-2">
          <div className={`text-3xl font-bold ${currentColor.text} group-hover:scale-105 transition-transform duration-200 inline-block animate-glow`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>

        {/* Descripción */}
        {description && (
          <div className="text-sm text-slate-500 leading-relaxed">
            {description}
          </div>
        )}

        {/* Barra de progreso decorativa */}
        <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${currentColor.bg} rounded-full transition-all duration-1000 group-hover:w-full animate-shimmer`}
            style={{ width: '60%' }}
          ></div>
        </div>
      </div>

      {/* Efecto hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover:translate-x-0"></div>
    </div>
  );
}
