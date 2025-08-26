import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a Firebase internal error
    if (error.message?.includes("INTERNAL ASSERTION FAILED")) {
      console.warn("Firebase internal error detected in Error Boundary");
    }
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Force reload if it's a Firebase internal error
    if (this.state.error?.message?.includes("INTERNAL ASSERTION FAILED")) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isFirebaseError = this.state.error?.message?.includes("INTERNAL ASSERTION FAILED");
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                {isFirebaseError ? 'Temporary Data Issue' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFirebaseError ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    We're experiencing a temporary issue with data loading. This usually resolves quickly.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    This is a known issue with Firebase Firestore that occurs occasionally and doesn't affect your data.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    An unexpected error occurred. Please try refreshing the page.
                  </p>
                  {this.state.error && (
                    <details className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                      <summary className="cursor-pointer">Error details</summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs">
                        {this.state.error.message}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isFirebaseError ? 'Reload Page' : 'Try Again'}
                </Button>
                
                {!isFirebaseError && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    Refresh Page
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-400 text-center">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
