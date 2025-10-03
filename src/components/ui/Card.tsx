import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  titleClassName?: string;
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "default" | "gradient" | "glass" | "minimal";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  badge?: string | number;
  status?: "success" | "warning" | "error" | "info";
}

export const Card = ({
  title,
  titleClassName,
  children,
  to,
  onClick,
  variant = "default",
  size = "md",
  icon,
  badge,
  status,
}: CardProps) => {
  // Clases base según variante
  const variantClasses = {
    default: "bg-white border border-slate-200/60 shadow-md hover:shadow-xl",
    gradient: "bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-lg hover:shadow-xl",
    glass: "glass-effect border border-white/30 shadow-lg hover:shadow-xl",
    minimal: "bg-white/80 border border-slate-100 shadow-sm hover:shadow-md",
  };

  // Clases de tamaño
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Clases de título según variante
  const getTitleClasses = () => {
    if (titleClassName) return titleClassName;
    
    switch (variant) {
      case "gradient":
        return "text-gradient";
      case "glass":
        return "text-slate-800 font-semibold";
      case "minimal":
        return "text-slate-700 font-medium";
      default:
        return "text-slate-800 font-semibold";
    }
  };

  // Indicador de estado
  const statusColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const cardContent = (
    <div className="relative">
      {/* Indicador de estado */}
      {status && (
        <div className={`absolute -top-2 -right-2 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white shadow-sm`}></div>
      )}

      {/* Header con icono y badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
              {icon}
            </div>
          )}
          <h3 className={`text-lg ${getTitleClasses()} truncate flex-1`}>
            {title}
          </h3>
        </div>
        
        {badge && (
          <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
            {badge}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="text-slate-600 space-y-2 leading-relaxed">
        {children}
      </div>

      {/* Efecto decorativo para variante gradient */}
      {variant === "gradient" && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
      )}
    </div>
  );

  // Clases comunes para interactividad
  const interactiveClasses = "group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer";
  const baseClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${interactiveClasses}`;

  if (to) {
    return (
      <Link to={to} className={`block ${baseClasses}`}>
        {cardContent}
        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full text-left ${baseClasses}`}>
        {cardContent}
        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </button>
    );
  }

  return (
    <div className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-xl transition-all duration-300 hover:shadow-lg`}>
      {cardContent}
    </div>
  );
};

