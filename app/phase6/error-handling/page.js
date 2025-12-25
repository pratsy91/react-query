import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ErrorHandlingPage() {
  return (
    <LessonLayout
      title="6.1 Error Handling Patterns"
      description="Learn comprehensive error handling patterns including error boundaries, per-query handling, global handling, and error transformation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling in TanStack Query</h2>
        <p className="text-gray-700 mb-4">
          Proper error handling is crucial for building robust applications. TanStack Query provides
          multiple ways to handle errors at different levels of your application.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Error Handling Levels:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Error Boundaries</strong> - Catch errors at component tree level</li>
            <li><strong>Per-Query</strong> - Handle errors for individual queries</li>
            <li><strong>Global</strong> - Handle errors for all queries/mutations</li>
            <li><strong>Custom</strong> - Transform and categorize errors</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Boundaries</h2>
        <p className="text-gray-700 mb-4">
          Error Boundaries are React components that catch JavaScript errors anywhere in their child
          component tree. They're perfect for catching query errors.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Error Boundary Setup</h3>
        <CodeBlock
          title="React Error Boundary"
          code={`import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Errors are thrown and caught by ErrorBoundary
    throwOnError: true, // Default for useSuspenseQuery
  });

  return <div>{data.name}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserProfile userId={123} />
    </ErrorBoundary>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Boundary with useSuspenseQuery</h3>
        <CodeBlock
          title="Suspense + Error Boundary"
          code={`import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function UserProfile({ userId }) {
  // useSuspenseQuery automatically throws errors
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{data.name}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={123} />
      </Suspense>
    </ErrorBoundary>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Nested Error Boundaries</h3>
        <CodeBlock
          title="Multiple Error Boundaries"
          code={`function App() {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <Suspense fallback={<div>Loading app...</div>}>
        <UserSection />
        <ErrorBoundary FallbackComponent={PostsErrorFallback}>
          <Suspense fallback={<div>Loading posts...</div>}>
            <PostsSection />
          </Suspense>
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
}

// Errors in UserSection caught by AppErrorFallback
// Errors in PostsSection caught by PostsErrorFallback`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Per-Query Error Handling</h2>
        <p className="text-gray-700 mb-4">
          Handle errors for individual queries using the error state and error handling callbacks.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Per-Query Handling</h3>
        <CodeBlock
          title="Handle Error in Component"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Handling with onError</h3>
        <CodeBlock
          title="Per-Query onError Callback"
          code={`function UserProfile({ userId }) {
  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    onError: (error) => {
      // Handle error for this specific query
      console.error('Failed to fetch user:', error);
      toast.error(\`Failed to load user: \${error.message}\`);
    },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Error Handling</h3>
        <CodeBlock
          title="Handle Different Error Types"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    // Handle different error types
    if (error.status === 404) {
      return <div>User not found</div>;
    }
    
    if (error.status === 403) {
      return <div>You don't have permission to view this user</div>;
    }
    
    if (error.status >= 500) {
      return (
        <div>
          <p>Server error. Please try again later.</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      );
    }
    
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Global Error Handling</h2>
        <p className="text-gray-700 mb-4">
          Set up global error handlers that catch errors from all queries and mutations in your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Global Query Error Handler</h3>
        <CodeBlock
          title="Default Error Handler for All Queries"
          code={`import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error, query) => {
        // Global error handler for all queries
        console.error('Query error:', error);
        
        // Log to error tracking service
        logErrorToService(error, {
          queryKey: query.queryKey,
          meta: query.meta,
        });
        
        // Show user-friendly notification
        if (error.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(\`Error: \${error.message}\`);
        }
      },
    },
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Global Mutation Error Handler</h3>
        <CodeBlock
          title="Default Error Handler for All Mutations"
          code={`const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error, variables, context, mutation) => {
        // Global error handler for all mutations
        console.error('Mutation error:', error);
        
        // Log to error tracking
        logErrorToService(error, {
          mutationKey: mutation.options.mutationKey,
          variables,
        });
        
        // Show notification
        toast.error(\`Operation failed: \${error.message}\`);
      },
    },
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combined Global Handling</h3>
        <CodeBlock
          title="Unified Error Handler"
          code={`const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error, query) => {
        handleGlobalError(error, {
          type: 'query',
          queryKey: query.queryKey,
        });
      },
    },
    mutations: {
      onError: (error, variables, context, mutation) => {
        handleGlobalError(error, {
          type: 'mutation',
          mutationKey: mutation.options.mutationKey,
        });
      },
    },
  },
});

function handleGlobalError(error, context) {
  // Centralized error handling
  console.error('Global error:', error, context);
  
  // Send to monitoring service
  sendToErrorTracking(error, context);
  
  // Show user notification
  if (error.status === 401) {
    // Unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error.status >= 500) {
    toast.error('Server error. Please try again later.');
  } else {
    toast.error(\`Error: \${error.message}\`);
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Retry Strategies</h2>
        <p className="text-gray-700 mb-4">
          Configure how queries and mutations retry after errors using different strategies.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Retry Configuration</h3>
        <CodeBlock
          title="Retry Options"
          code={`// No retries
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: false,
});

// Retry 3 times (default)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 3,
});

// Infinite retries (not recommended)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: true,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Retry</h3>
        <CodeBlock
          title="Smart Retry Logic"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors (client errors)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Retry up to 3 times for 5xx errors (server errors)
    if (error.status >= 500) {
      return failureCount < 3;
    }
    
    // Retry network errors
    if (error.name === 'NetworkError') {
      return failureCount < 5;
    }
    
    // Don't retry other errors
    return false;
  },
  retryDelay: (attemptIndex) => {
    // Exponential backoff
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Exponential Backoff</h3>
        <CodeBlock
          title="Progressive Retry Delays"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 3,
  retryDelay: (attemptIndex) => {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
});

// Custom backoff strategy
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 5,
  retryDelay: (attemptIndex, error) => {
    // Longer delay for rate limit errors
    if (error.status === 429) {
      return 5000; // 5 seconds
    }
    
    // Exponential backoff for other errors
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Error Types</h2>
        <p className="text-gray-700 mb-4">
          Create custom error classes to categorize and handle different types of errors more effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Error Classes</h3>
        <CodeBlock
          title="Define Custom Error Types"
          code={`// Custom error classes
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
    this.status = 0;
  }
}

class NotFoundError extends Error {
  constructor(message, resource) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.resource = resource;
  }
}

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.errors = errors;
  }
}

class ServerError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ServerError';
    this.status = status;
  }
}

// Use in query functions
async function fetchUser(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (response.status === 404) {
      throw new NotFoundError('User not found', 'user');
    }
    
    if (response.status >= 500) {
      throw new ServerError('Server error', response.status);
    }
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ServerError) {
      throw error; // Re-throw custom errors
    }
    throw new NetworkError('Network request failed');
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Handling Custom Errors</h3>
        <CodeBlock
          title="Handle Custom Error Types"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    // Handle different error types
    if (error instanceof NotFoundError) {
      return (
        <div>
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      );
    }
    
    if (error instanceof ValidationError) {
      return (
        <div>
          <h2>Validation Error</h2>
          <ul>
            {error.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    if (error instanceof ServerError) {
      return (
        <div>
          <h2>Server Error</h2>
          <p>Please try again later.</p>
        </div>
      );
    }
    
    if (error instanceof NetworkError) {
      return (
        <div>
          <h2>Network Error</h2>
          <p>Please check your internet connection.</p>
        </div>
      );
    }
    
    // Generic error
    return <div>Error: {error.message}</div>;
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Transformation</h2>
        <p className="text-gray-700 mb-4">
          Transform errors to provide better error messages and structure for your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Transform in Query Function</h3>
        <CodeBlock
          title="Transform Errors at Source"
          code={`async function fetchUser(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      // Transform API error to app error
      const errorData = await response.json().catch(() => ({}));
      
      throw new Error(
        errorData.message || 
        \`Failed to fetch user: \${response.statusText}\`
      );
    }
    
    return response.json();
  } catch (error) {
    // Transform network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    
    throw error;
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Transform in Error Handler</h3>
        <CodeBlock
          title="Transform in onError Callback"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onError: (error) => {
    // Transform error for user display
    let userMessage = 'An error occurred';
    
    if (error.status === 404) {
      userMessage = 'User not found';
    } else if (error.status === 403) {
      userMessage = 'You do not have permission';
    } else if (error.status >= 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error.message) {
      userMessage = error.message;
    }
    
    // Show transformed message
    toast.error(userMessage);
    
    // Log original error for debugging
    console.error('Original error:', error);
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Normalization</h3>
        <CodeBlock
          title="Normalize All Errors to Common Format"
          code={`function normalizeError(error) {
  // Normalize all errors to common structure
  return {
    message: error.message || 'An unknown error occurred',
    status: error.status || 0,
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: Date.now(),
    originalError: error,
  };
}

// Use in global error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error, query) => {
        const normalized = normalizeError(error);
        
        // All errors now have consistent structure
        handleError(normalized, {
          queryKey: query.queryKey,
        });
      },
    },
  },
});`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">6.2 Loading States</strong>
          to understand the different loading state properties and how to manage them effectively.
        </p>
      </div>
    </LessonLayout>
  );
}

