'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-100 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500/10 p-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle>Something went wrong</CardTitle>
                  <CardDescription>
                    An error occurred while rendering this component
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="rounded-md bg-red-500/5 border border-red-500/20 p-3">
                  <p className="text-sm text-red-400 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <Button
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
