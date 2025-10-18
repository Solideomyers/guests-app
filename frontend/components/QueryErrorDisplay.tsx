import React from 'react';

interface QueryErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

/**
 * Query Error Display Component
 * Shows a friendly error message when API queries fail
 *
 * @example
 * <QueryErrorDisplay
 *   error={error}
 *   onRetry={refetch}
 *   title="No se pudieron cargar los invitados"
 * />
 */
const QueryErrorDisplay: React.FC<QueryErrorDisplayProps> = ({
  error,
  onRetry,
  title = 'Error al cargar datos',
  message,
}) => {
  // Get user-friendly error message
  const getErrorMessage = () => {
    if (message) return message;

    // Check for network errors
    if (
      error?.message?.includes('Network Error') ||
      error?.message?.includes('fetch')
    ) {
      return 'No se pudo conectar al servidor. Verifica tu conexión a internet y que el backend esté en ejecución.';
    }

    // Check for timeout
    if (error?.message?.includes('timeout')) {
      return 'La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.';
    }

    // Default error message
    return (
      error?.message ||
      'Ha ocurrido un error al cargar los datos. Por favor, intenta de nuevo.'
    );
  };

  return (
    <div className='flex items-center justify-center min-h-[300px] p-6'>
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <svg
              className='w-6 h-6 text-red-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-red-900 mb-2'>{title}</h3>
            <p className='text-sm text-red-700 mb-4'>{getErrorMessage()}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryErrorDisplay;
