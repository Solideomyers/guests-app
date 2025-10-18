import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    // @ts-expect-error - props exists on Component but TypeScript config doesn't recognize it
    if (this.props.onError) {
      // @ts-expect-error - props exists on Component
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // @ts-expect-error - setState exists on Component
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error message
      // @ts-expect-error - props exists on Component
      if (this.props.fallback) {
        // @ts-expect-error - props exists on Component
        return this.props.fallback;
      }

      return (
        <div className='flex items-center justify-center min-h-[400px] p-6'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full'>
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
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-red-900 mb-2'>
                  Algo salió mal
                </h3>
                <p className='text-sm text-red-700 mb-4'>
                  {this.state.error?.message ||
                    'Ha ocurrido un error inesperado. Por favor, intenta recargar la página.'}
                </p>
                <div className='flex gap-3'>
                  <button
                    onClick={this.handleReset}
                    className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                  >
                    Intentar de nuevo
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className='px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                  >
                    Recargar página
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // @ts-expect-error - props exists on Component
    return this.props.children;
  }
}

export default ErrorBoundary;
