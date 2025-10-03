interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export const Loader = ({ 
  size = "md", 
  text = "Cargando datos...", 
  fullScreen = true 
}: LoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  };

  const containerClasses = fullScreen 
    ? "flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    : "flex justify-center items-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner animado */}
        <div className="relative">
          {/* Círculo exterior */}
          <div className={`${sizeClasses[size]} border-4 border-slate-200 rounded-full animate-spin`}>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Círculo interior */}
          <div className={`absolute inset-2 border-2 border-slate-100 rounded-full`}>
            <div className="absolute inset-0 border-2 border-transparent border-b-purple-500 border-l-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>

          {/* Punto central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse-subtle"></div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="text-center space-y-2">
          <p className={`${textSizeClasses[size]} font-semibold text-slate-700`}>
            {text}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Barra de progreso decorativa */}
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" 
               style={{ 
                 animation: 'loading-bar 2s ease-in-out infinite',
                 width: '40%'
               }}>
          </div>
        </div>
      </div>
    </div>
  );
};
