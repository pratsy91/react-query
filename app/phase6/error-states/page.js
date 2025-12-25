import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ErrorStatesPage() {
  return (
    <LessonLayout
      title="6.3 Error States"
      description="Learn about error state properties, error display patterns, retry mechanisms, and error recovery strategies"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Understanding Error States</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query provides error state properties to help you handle and display errors
          effectively in your application.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Error State Properties:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>isError</strong> - Boolean indicating if query has error</li>
            <li><strong>error</strong> - Error object with details</li>
            <li><strong>status</strong> - Query status ('error')</li>
            <li><strong>failureCount</strong> - Number of failed attempts</li>
            <li><strong>failureReason</strong> - Last failure reason</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Error State Access"
          code={`function UserProfile({ userId }) {
  const { 
    data, 
    isError, 
    error, 
    status,
    failureCount,
    failureReason 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isError: true when query failed
  // error: Error object (null if no error)
  // status: 'error' when failed
  // failureCount: Number of retry attempts that failed
  // failureReason: Last error that occurred

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <p>Failed {failureCount} times</p>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isError - Error State Flag</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">isError</code> boolean indicates whether
          a query is in an error state.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Check Error State"
          code={`function UserProfile({ userId }) {
  const { data, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isError is true when:
  // - Query function throws an error
  // - All retry attempts have failed
  // - status is 'error'

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combined with Loading</h3>
        <CodeBlock
          title="Handle Loading and Error States"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">error Object</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">error</code> object contains information
          about what went wrong. It's null when there's no error.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Object Structure</h3>
        <CodeBlock
          title="Error Object Properties"
          code={`function UserProfile({ userId }) {
  const { error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError && error) {
    // Error object typically has:
    // - message: Error message string
    // - name: Error name (e.g., 'Error', 'TypeError')
    // - stack: Stack trace (in development)
    // - Custom properties (status, code, etc.)
    
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error status:', error.status); // If custom error
    console.log('Error code:', error.code); // If custom error
  }

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Accessing Error Properties</h3>
        <CodeBlock
          title="Extract Error Information"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    // Safely access error properties
    const errorMessage = error?.message || 'Unknown error';
    const errorStatus = error?.status || 0;
    const errorCode = error?.code || 'UNKNOWN';

    return (
      <div>
        <h2>Error</h2>
        <p>Message: {errorMessage}</p>
        <p>Status: {errorStatus}</p>
        <p>Code: {errorCode}</p>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Display Patterns</h2>
        <p className="text-gray-700 mb-4">
          Different patterns for displaying errors to users in a user-friendly way.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Error Message</h3>
        <CodeBlock
          title="Simple Error Message"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    return (
      <div className="error-message">
        <p>{error.message}</p>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Error Card</h3>
        <CodeBlock
          title="Styled Error Card"
          code={`function ErrorCard({ error, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}

function UserProfile({ userId }) {
  const { data, error, isError, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    return <ErrorCard error={error} onRetry={() => refetch()} />;
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Status-Based Errors</h3>
        <CodeBlock
          title="Different UI for Different Error Types"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    // Handle different error statuses
    if (error.status === 404) {
      return (
        <div className="not-found">
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      );
    }

    if (error.status === 403) {
      return (
        <div className="forbidden">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this user.</p>
        </div>
      );
    }

    if (error.status >= 500) {
      return (
        <div className="server-error">
          <h2>Server Error</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    // Generic error
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Retry Mechanisms</h2>
        <p className="text-gray-700 mb-4">
          Provide users with ways to retry failed queries manually.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Manual Retry with refetch</h3>
        <CodeBlock
          title="Retry Button"
          code={`function UserProfile({ userId }) {
  const { data, error, isError, refetch, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          disabled={isFetching}
        >
          {isFetching ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automatic Retry</h3>
        <CodeBlock
          title="Auto-Retry on Error"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: 3, // Automatic retry 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query automatically retries on error
  // User sees loading state during retries

  if (isError) {
    // Only show error if all retries failed
    return <div>Error: {error.message}</div>;
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Retry with Backoff</h3>
        <CodeBlock
          title="Smart Retry Strategy"
          code={`function UserProfile({ userId }) {
  const { data, error, isError, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
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
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Recovery</h2>
        <p className="text-gray-700 mb-4">
          Strategies for recovering from errors and getting the application back to a working state.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Recovery Pattern 1: Reset Query</h3>
        <CodeBlock
          title="Reset Query State"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const handleReset = () => {
    // Reset query to initial state
    queryClient.resetQueries({
      queryKey: ['user', userId],
    });
    // Query will refetch automatically
  };

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={handleReset}>Reset and Retry</button>
      </div>
    );
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Recovery Pattern 2: Fallback Data</h3>
        <CodeBlock
          title="Use Fallback on Error"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Use placeholder data on error
    placeholderData: (previousData) => {
      if (isError) {
        // Return fallback data
        return {
          id: userId,
          name: 'Unknown User',
          email: '',
        };
      }
      return previousData;
    },
  });

  // Always has data (either real or fallback)
  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Recovery Pattern 3: Error Boundary Recovery</h3>
        <CodeBlock
          title="Recover from Error Boundary"
          code={`import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={resetErrorBoundary}>
        Try Again
      </button>
    </div>
  );
}

function UserProfile({ userId }) {
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

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Recovery Pattern 4: Graceful Degradation</h3>
        <CodeBlock
          title="Show Partial Data on Error"
          code={`function UserDashboard({ userId }) {
  const { data: user, error: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts, error: postsError } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  // Show what we can, even if some queries fail
  return (
    <div>
      {userError ? (
        <div>Unable to load user</div>
      ) : (
        <div>User: {user.name}</div>
      )}

      {postsError ? (
        <div>Unable to load posts</div>
      ) : (
        <div>Posts: {posts.length}</div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always check isError</strong> - Before accessing error object</li>
            <li><strong>Provide retry options</strong> - Let users retry failed operations</li>
            <li><strong>Show user-friendly messages</strong> - Don't expose technical details</li>
            <li><strong>Handle different error types</strong> - Different UI for different errors</li>
            <li><strong>Use error boundaries</strong> - Catch errors at component tree level</li>
            <li><strong>Implement graceful degradation</strong> - Show partial data when possible</li>
            <li><strong>Log errors for debugging</strong> - Keep technical details in logs</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 6: Error Handling & Loading States.
          You now understand comprehensive error handling patterns, loading state management, and error
          recovery strategies. You're ready to move on to Phase 7: TypeScript Integration.
        </p>
      </div>
    </LessonLayout>
  );
}

