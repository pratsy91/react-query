import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseQueryAdvancedPage() {
  return (
    <LessonLayout
      title="1.3 useQuery Hook - Part 3: Advanced Options"
      description="Learn about suspense mode, error boundaries, structural sharing, and other advanced options"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">suspense - Suspense Mode</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">suspense</code> option enables React Suspense
          integration. When enabled, the query will suspend the component while loading.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> In v5+, use <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code>
            hook instead of the suspense option.
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Suspense Usage</h3>
        <CodeBlock
          title="Suspense with useQuery (v4)"
          code={`import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    suspense: true, // Enable suspense mode
  });

  // Component suspends while loading
  // No need to check isLoading - data is guaranteed to be available
  return <div>{data.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId={123} />
    </Suspense>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Boundaries with Suspense</h3>
        <CodeBlock
          title="Error Handling in Suspense Mode"
          code={`import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return <div>Error: {error.message}</div>;
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
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">useErrorBoundary - Error Boundaries</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useErrorBoundary</code> option determines
          whether query errors should be thrown to the nearest error boundary.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Error Boundary Usage</h3>
        <CodeBlock
          title="Throwing Errors to Boundary"
          code={`import { ErrorBoundary } from 'react-error-boundary';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    useErrorBoundary: true, // Throw errors to error boundary
  });

  return <div>{data.name}</div>;
}

function ErrorFallback({ error }) {
  return <div>Error: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserProfile userId={123} />
    </ErrorBoundary>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Error Boundaries</h3>
        <CodeBlock
          title="Selective Error Handling"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  useErrorBoundary: (error) => {
    // Only throw 500 errors to boundary
    // Handle 404 errors locally
    return error.status >= 500;
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">notifyOnChangeProps - Selective Subscriptions</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">notifyOnChangeProps</code> option allows you
          to control which property changes trigger a re-render. This can optimize performance.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Behavior</h3>
        <CodeBlock
          title="All Changes Trigger Re-render"
          code={`// By default, any property change triggers re-render
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});

// Component re-renders when:
// - data changes
// - isLoading changes
// - error changes
// - isFetching changes
// - etc.`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Subscriptions</h3>
        <CodeBlock
          title="Only Subscribe to Specific Properties"
          code={`// Only re-render when data or error changes
const { data, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  notifyOnChangeProps: ['data', 'error'],
  // Component won't re-render when:
  // - isFetching changes
  // - isLoading changes
  // - isRefetching changes
  // - etc.
});

// Track only specific properties
const { data, isFetching } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  notifyOnChangeProps: ['data', 'isFetching'],
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Track All Changes</h3>
        <CodeBlock
          title="Explicitly Track All"
          code={`// Track all properties (default behavior)
const query = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  notifyOnChangeProps: 'all',
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">structuralSharing - Structural Sharing</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">structuralSharing</code> (enabled by default)
          ensures that if data hasn't structurally changed, the same reference is returned to prevent
          unnecessary re-renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">How Structural Sharing Works</h3>
        <CodeBlock
          title="Reference Equality"
          code={`// With structuralSharing: true (default)
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  structuralSharing: true,
});

// If fetched data is structurally identical to cached data:
// - Same object reference is returned
// - React.memo won't trigger re-render
// - Prevents unnecessary component updates

// If data structure changed:
// - New object reference is returned
// - Component re-renders as expected`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Disabling Structural Sharing</h3>
        <CodeBlock
          title="When to Disable"
          code={`// Disable structural sharing
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  structuralSharing: false,
  // New object reference always returned
  // Useful if you need reference changes to trigger effects
});

// Custom structural sharing function
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  structuralSharing: (oldData, newData) => {
    // Custom comparison logic
    if (oldData?.id === newData?.id) {
      return oldData; // Return old reference if IDs match
    }
    return newData; // Return new data
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">meta - Metadata</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">meta</code> option allows you to attach
          custom metadata to queries. This is useful for logging, analytics, or custom logic.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Meta Usage</h3>
        <CodeBlock
          title="Attaching Metadata"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  meta: {
    errorMessage: 'Failed to load user',
    logLevel: 'error',
    analytics: {
      event: 'user_view',
      userId: userId,
    },
  },
});

// Access meta in query function context
async function fetchUser({ queryKey, meta }) {
  console.log('Meta:', meta);
  // Use meta for logging, analytics, etc.
  const response = await fetch(\`/api/users/\${queryKey[1]}\`);
  return response.json();
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using Meta in Error Handlers</h3>
        <CodeBlock
          title="Meta in Global Error Handler"
          code={`const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error, query) => {
        // Access meta from query
        const errorMessage = query.meta?.errorMessage || 'Unknown error';
        console.error(errorMessage, error);
        
        // Send to analytics
        if (query.meta?.analytics) {
          trackError(query.meta.analytics, error);
        }
      },
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">gcTime - Garbage Collection Time (v5+)</h2>
        <p className="text-gray-700 mb-4">
          In v5+, <code className="bg-gray-100 px-1 rounded">cacheTime</code> was renamed to
          <code className="bg-gray-100 px-1 rounded">gcTime</code> for clarity. It works the same way.
        </p>

        <CodeBlock
          title="gcTime Usage (v5+)"
          code={`// v5+ syntax
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  gcTime: 1000 * 60 * 30, // 30 minutes
});

// v4 syntax (still works in v5 for compatibility)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  cacheTime: 1000 * 60 * 30, // 30 minutes
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">networkMode - Network Mode</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">networkMode</code> option controls when
          queries should execute based on network connectivity.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Network Mode Options</h3>
        <CodeBlock
          title="Network Mode Values"
          code={`// online (default) - Only fetch when online
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  networkMode: 'online',
});

// always - Fetch even when offline (queues for when online)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  networkMode: 'always',
});

// offlineFirst - Use cache when offline, fetch when online
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  networkMode: 'offlineFirst',
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Network Mode Examples"
          code={`// Critical data - always try to fetch
useQuery({
  queryKey: ['auth', 'user'],
  queryFn: fetchCurrentUser,
  networkMode: 'always', // Queue if offline, fetch when online
});

// Non-critical data - only when online
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  networkMode: 'online', // Don't fetch when offline
});

// Cache-first approach
useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  networkMode: 'offlineFirst', // Use cache offline, fetch when online
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryKeyHashFn - Custom Key Hashing</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryKeyHashFn</code> allows you to customize
          how query keys are hashed. This is rarely needed but useful for special cases.
        </p>

        <CodeBlock
          title="Custom Key Hashing"
          code={`// Default hashing (JSON.stringify)
const queryClient = new QueryClient({
  queryKeyHashFn: (queryKey) => {
    // Custom hashing logic
    return JSON.stringify(queryKey);
  },
});

// Example: Case-insensitive keys
const queryClient = new QueryClient({
  queryKeyHashFn: (queryKey) => {
    const normalized = queryKey.map(key => {
      if (typeof key === 'string') return key.toLowerCase();
      if (typeof key === 'object' && key !== null) {
        return Object.fromEntries(
          Object.entries(key).map(([k, v]) => [k.toLowerCase(), v])
        );
      }
      return key;
    });
    return JSON.stringify(normalized);
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Deprecated Options (Understanding Only)</h2>
        <p className="text-gray-700 mb-4">
          These options are deprecated but you may encounter them in older code. Understanding them
          helps with migration and legacy codebases.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">onSuccess, onError, onSettled</h3>
        <CodeBlock
          title="Deprecated Callbacks (v4 and earlier)"
          code={`// Deprecated in v5, use useEffect instead
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  onSuccess: (data) => {
    console.log('User loaded:', data);
    // Side effects here
  },
  onError: (error) => {
    console.error('Error:', error);
    // Error handling here
  },
  onSettled: (data, error) => {
    console.log('Query settled');
    // Runs after success or error
  },
});

// Modern approach (v5+)
const { data, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});

useEffect(() => {
  if (data) {
    console.log('User loaded:', data);
  }
}, [data]);

useEffect(() => {
  if (error) {
    console.error('Error:', error);
  }
}, [error]);`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Migration:</strong> Replace deprecated callbacks with <code className="bg-gray-100 px-1 rounded">useEffect</code>
            hooks that depend on the query result properties.
          </p>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Now that you've mastered useQuery, proceed to
          <strong className="ml-1">1.4 Query Client Methods</strong> to learn how to interact with
          the query cache programmatically.
        </p>
      </div>
    </LessonLayout>
  );
}

