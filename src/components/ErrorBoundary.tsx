import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">
                            We're sorry, but an unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
                        >
                            Refresh Page
                        </button>
                        {this.state.error && (
                            <div className="mt-6 p-4 bg-black/30 rounded-lg text-left overflow-auto max-h-32">
                                <code className="text-xs text-red-400 font-mono">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
