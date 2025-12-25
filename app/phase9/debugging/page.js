import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function DebuggingPage() {
  return (
    <LessonLayout
      title="9.2 Debugging Techniques"
      description="Learn debugging techniques for React Query: console logging, network inspection, cache inspection, query state debugging, and performance debugging"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Debugging React Query</h2>
        <p className="text-gray-700 mb-4">
          Effective debugging is crucial for understanding and fixing issues with React Query.
          This lesson covers various debugging techniques and tools.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Debugging Techniques:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Console logging and debugging</li>
            <li>Network inspection</li>
            <li>Cache inspection</li>
            <li>Query state debugging</li>
            <li>Performance debugging</li>
            <li>Common issues and solutions</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Console Logging</h2>
        <p className="text-gray-700 mb-4">
          Console logging is the simplest way to debug React Query. Log query states, data,
          and errors to understand what's happening.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Logging</h3>
        <CodeBlock
          title="Logging Query States"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Log query state
  console.log('Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    data: query.data,
    error: query.error,
  });

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>Error: {query.error.message}</div>;

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Options Logging</h3>
        <CodeBlock
          title="Logging Query Configuration"
          code={`function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    onSuccess: (data) => {
      console.log('Query succeeded:', data);
    },
    onError: (error) => {
      console.error('Query failed:', error);
    },
    onSettled: (data, error) => {
      console.log('Query settled:', { data, error });
    },
  });

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Logger Hook</h3>
        <CodeBlock
          title="Reusable Debugging Hook"
          code={`import { useQuery, UseQueryResult } from '@tanstack/react-query';

function useDebugQuery<TData, TError>(
  query: UseQueryResult<TData, TError>,
  label: string
) {
  React.useEffect(() => {
    console.log(\`[\${label}] Query state:\`, {
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      isSuccess: query.isSuccess,
      data: query.data,
      error: query.error,
      status: query.status,
      fetchStatus: query.fetchStatus,
    });
  }, [
    query.isLoading,
    query.isFetching,
    query.isError,
    query.isSuccess,
    query.data,
    query.error,
    label,
  ]);

  return query;
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  useDebugQuery(query, 'UserProfile');

  return <div>{query.data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Network Inspection</h2>
        <p className="text-gray-700 mb-4">
          Inspect network requests to understand when queries are fetching, what data is being
          sent, and what responses are received.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Browser DevTools Network Tab</h3>
        <CodeBlock
          title="Using Network Tab"
          code={`// In browser DevTools Network tab:
// 1. Filter by Fetch/XHR
// 2. Look for your API requests
// 3. Check request timing
// 4. Inspect request/response headers
// 5. View response data

// Common things to check:
// - Are requests being made?
// - Are requests duplicated?
// - What's the response time?
// - What's the response data?
// - Are there any errors?`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Logging Network Requests</h3>
        <CodeBlock
          title="Intercept and Log Requests"
          code={`// Create a wrapper for fetch
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const [url, options] = args;
  
  console.log('Fetch request:', {
    url,
    method: options?.method || 'GET',
    headers: options?.headers,
    body: options?.body,
  });

  const startTime = Date.now();
  
  try {
    const response = await originalFetch(...args);
    const endTime = Date.now();
    
    console.log('Fetch response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      duration: \`\${endTime - startTime}ms\`,
    });

    // Clone response to read body
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();
    console.log('Response data:', data);

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Now all fetch requests are logged`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function Logging</h3>
        <CodeBlock
          title="Log Query Function Calls"
          code={`function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('Fetching user:', userId);
      const startTime = Date.now();
      
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        
        const endTime = Date.now();
        console.log('User fetched:', {
          userId,
          data,
          duration: \`\${endTime - startTime}ms\`,
        });
        
        return data;
      } catch (error) {
        console.error('Failed to fetch user:', {
          userId,
          error,
        });
        throw error;
      }
    },
  });

  return <div>{query.data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Inspection</h2>
        <p className="text-gray-700 mb-4">
          Inspect the query cache to understand what data is cached, when it was cached,
          and when it becomes stale.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Inspecting Cache Programmatically</h3>
        <CodeBlock
          title="Access Query Cache"
          code={`import { useQueryClient } from '@tanstack/react-query';

function CacheInspector() {
  const queryClient = useQueryClient();

  const inspectCache = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    console.log('Cache contents:', {
      totalQueries: queries.length,
      queries: queries.map(query => ({
        queryKey: query.queryKey,
        state: query.state.status,
        dataUpdatedAt: query.state.dataUpdatedAt,
        data: query.state.data,
        error: query.state.error,
        isStale: query.isStale(),
        observers: query.getObserversCount(),
      })),
    });
  };

  return (
    <button onClick={inspectCache}>
      Inspect Cache
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Checking Specific Query</h3>
        <CodeBlock
          title="Inspect Single Query"
          code={`import { useQueryClient } from '@tanstack/react-query';

function QueryInspector({ queryKey }: { queryKey: readonly unknown[] }) {
  const queryClient = useQueryClient();

  const inspectQuery = () => {
    const query = queryClient.getQueryCache().find({ queryKey });
    
    if (!query) {
      console.log('Query not found in cache');
      return;
    }

    const state = queryClient.getQueryState({ queryKey });

    console.log('Query details:', {
      queryKey,
      state: query.state.status,
      data: query.state.data,
      error: query.state.error,
      dataUpdatedAt: query.state.dataUpdatedAt,
      errorUpdatedAt: query.state.errorUpdatedAt,
      isStale: query.isStale(),
      observers: query.getObserversCount(),
      queryOptions: query.options,
      queryState: state,
    });
  };

  return <button onClick={inspectQuery}>Inspect Query</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Subscription</h3>
        <CodeBlock
          title="Subscribe to Cache Changes"
          code={`import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

function CacheMonitor() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cache = queryClient.getQueryCache();

    const unsubscribe = cache.subscribe((event) => {
      console.log('Cache event:', {
        type: event.type,
        query: {
          queryKey: event.query.queryKey,
          state: event.query.state.status,
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return null; // This component just monitors
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query State Debugging</h2>
        <p className="text-gray-700 mb-4">
          Debug query states to understand why queries are in specific states and how they
          transition between states.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">State Transition Logging</h3>
        <CodeBlock
          title="Track State Changes"
          code={`import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const prevState = useRef(query.status);

  useEffect(() => {
    if (prevState.current !== query.status) {
      console.log('State transition:', {
        from: prevState.current,
        to: query.status,
        queryKey: ['user', userId],
      });
      prevState.current = query.status;
    }
  }, [query.status, userId]);

  useEffect(() => {
    console.log('Query state:', {
      status: query.status,
      fetchStatus: query.fetchStatus,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      isSuccess: query.isSuccess,
    });
  }, [
    query.status,
    query.fetchStatus,
    query.isLoading,
    query.isFetching,
    query.isError,
    query.isSuccess,
  ]);

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Debugging Enabled Option</h3>
        <CodeBlock
          title="Conditional Query Execution"
          code={`function UserProfile({ userId }: { userId: number }) {
  const [enabled, setEnabled] = React.useState(true);

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled,
  });

  console.log('Query enabled state:', {
    enabled,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    status: query.status,
  });

  return (
    <div>
      <button onClick={() => setEnabled(!enabled)}>
        Toggle Query
      </button>
      {query.data?.name}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance Debugging</h2>
        <p className="text-gray-700 mb-4">
          Debug performance issues by tracking query execution times, cache hits/misses,
          and unnecessary re-renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Performance Tracking</h3>
        <CodeBlock
          title="Measure Query Performance"
          code={`import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const startTime = React.useRef(Date.now());

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const fetchStart = Date.now();
      const data = await fetchUser(userId);
      const fetchEnd = Date.now();
      
      console.log('Query performance:', {
        queryKey: ['user', userId],
        fetchDuration: \`\${fetchEnd - fetchStart}ms\`,
      });
      
      return data;
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      const totalTime = Date.now() - startTime.current;
      console.log('Total query time:', {
        queryKey: ['user', userId],
        totalDuration: \`\${totalTime}ms\`,
      });
    }
  }, [query.isSuccess, userId]);

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Render Performance</h3>
        <CodeBlock
          title="Track Component Re-renders"
          code={`import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const renderCount = useRef(0);
  const prevProps = useRef({ userId });

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  useEffect(() => {
    renderCount.current += 1;
    console.log('Component render:', {
      renderCount: renderCount.current,
      userId,
      queryStatus: query.status,
      queryData: query.data,
    });
  });

  useEffect(() => {
    if (prevProps.current.userId !== userId) {
      console.log('Props changed:', {
        from: prevProps.current.userId,
        to: userId,
      });
      prevProps.current = { userId };
    }
  }, [userId]);

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Hit/Miss Tracking</h3>
        <CodeBlock
          title="Track Cache Performance"
          code={`import { useQuery, useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // Check if data exists in cache
      const cachedData = queryClient.getQueryData(['user', userId]);
      
      if (cachedData) {
        console.log('Cache HIT:', ['user', userId]);
      } else {
        console.log('Cache MISS:', ['user', userId]);
      }

      return fetchUser(userId);
    },
  });

  return <div>{query.data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Issues and Solutions</h2>
        <p className="text-gray-700 mb-4">
          Common issues with React Query and how to debug and fix them.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Issue 1: Query Not Fetching</h3>
        <CodeBlock
          title="Debug Query Not Fetching"
          code={`// Problem: Query doesn't fetch
// Debug steps:

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: true, // Check if enabled is true
  });

  // Debug checklist:
  console.log('Query debug:', {
    enabled: query.isLoading || query.isFetching, // Should be true initially
    queryKey: ['user', userId],
    hasObservers: true, // Component is mounted
    queryFn: typeof query.options.queryFn === 'function',
  });

  // Common causes:
  // 1. enabled: false
  // 2. Query key changes too often
  // 3. Component unmounts before fetch completes
  // 4. Query function throws error immediately

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Issue 2: Stale Data</h3>
        <CodeBlock
          title="Debug Stale Data"
          code={`// Problem: Query shows stale data
// Debug steps:

function UserProfile({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Check if data is stale
  const isStale = queryClient.getQueryState(['user', userId])?.dataUpdatedAt
    ? Date.now() - queryClient.getQueryState(['user', userId])!.dataUpdatedAt! > 1000 * 60 * 5
    : true;

  console.log('Stale check:', {
    isStale,
    dataUpdatedAt: queryClient.getQueryState(['user', userId])?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  });

  // Common causes:
  // 1. staleTime too high
  // 2. Cache not invalidated after mutation
  // 3. Query key doesn't match

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Issue 3: Unnecessary Refetches</h3>
        <CodeBlock
          title="Debug Unnecessary Refetches"
          code={`// Problem: Query refetches too often
// Debug steps:

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      console.log('Query function called - refetch triggered');
      return fetchUser(userId);
    },
    refetchOnWindowFocus: true, // Check this
    refetchOnMount: true, // Check this
    refetchOnReconnect: true, // Check this
    staleTime: 0, // Check if staleTime is 0
  });

  // Track refetch triggers
  useEffect(() => {
    console.log('Refetch triggers:', {
      refetchOnWindowFocus: query.options.refetchOnWindowFocus,
      refetchOnMount: query.options.refetchOnMount,
      refetchOnReconnect: query.options.refetchOnReconnect,
      staleTime: query.options.staleTime,
    });
  }, []);

  // Common causes:
  // 1. staleTime: 0 (data always stale)
  // 2. refetchOnWindowFocus: true
  // 3. Query key changes
  // 4. Component remounts

  return <div>{query.data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use DevTools</strong> - Visual debugging is easier than console logs</li>
            <li><strong>Log strategically</strong> - Don't log everything, focus on what matters</li>
            <li><strong>Check network tab</strong> - Verify requests are being made correctly</li>
            <li><strong>Inspect cache</strong> - Understand what's cached and when</li>
            <li><strong>Track state transitions</strong> - Understand query lifecycle</li>
            <li><strong>Measure performance</strong> - Identify bottlenecks</li>
            <li><strong>Remove debug code</strong> - Clean up before production</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 9: DevTools & Debugging.
          You now understand how to use DevTools and debug React Query applications effectively.
          You're ready to move on to Phase 10: Testing.
        </p>
      </div>
    </LessonLayout>
  );
}

