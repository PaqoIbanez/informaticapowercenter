import { Button } from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Ilustración 404 */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-gradient animate-pulse-subtle">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Página no encontrada
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        {/* Ilustración decorativa */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg className="w-48 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <Button
            to="/"
            variant="primary"
            size="lg"
            fullWidth
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          >
            Volver al Dashboard
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="md"
            fullWidth
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Página anterior
          </Button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Button to="/mappings" variant="ghost" size="sm">
              Mappings
            </Button>
            <Button to="/workflows" variant="ghost" size="sm">
              Workflows
            </Button>
            <Button to="/sessions" variant="ghost" size="sm">
              Sessions
            </Button>
            <Button to="/sources" variant="ghost" size="sm">
              Sources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
