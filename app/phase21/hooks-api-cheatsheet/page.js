import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function HooksAPICheatsheetPage() {
  return (
    <LessonLayout
      title="21.1 Hooks & API Cheatsheet"
      description="Complete cheatsheet of all React Query hooks and API methods for interview preparation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query Hooks & API Cheatsheet</h2>
        <p className="text-gray-700 mb-4">
          Quick reference for all React Query hooks and API methods. Perfect for interview preparation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Core Hooks</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useQuery</h3>
        <CodeBlock
          title="useQuery - Basic Usage"
          code={`const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
  staleTime: 1000 * 60 * 5,      // 5 minutes
  gcTime: 1000 * 60 * 30,         // 30 minutes (v5)
  enabled: true,                   // Enable/disable query
  retry: 3,                        // Retry attempts
  retryDelay: 1000,                // Delay between retries
  refetchOnWindowFocus: true,       // Refetch on focus
  refetchOnReconnect: true,        // Refetch on reconnect
  refetchInterval: false,          // Polling interval
  select: (data) => data.users,    // Transform data
  onSuccess: (data) => {},         // Deprecated in v5
  onError: (error) => {},          // Deprecated in v5
});

// Return values:
// data - Query data
// error - Error object
// isLoading - Initial loading state
// isFetching - Fetching state (includes refetch)
// isError - Error state
// isSuccess - Success state
// isPending - Pending state (v5)
// refetch - Manual refetch function
// status - 'pending' | 'error' | 'success'
// fetchStatus - 'fetching' | 'paused' | 'idle'`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useMutation</h3>
        <CodeBlock
          title="useMutation - Basic Usage"
          code={`const mutation = useMutation({
  mutationFn: (variables) => fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(variables),
  }).then(r => r.json()),
  onMutate: async (variables) => {
    // Optimistic update
    await queryClient.cancelQueries(['users']);
    const previous = queryClient.getQueryData(['users']);
    queryClient.setQueryData(['users', variables.id], variables);
    return { previous };
  },
  onSuccess: (data, variables, context) => {
    queryClient.invalidateQueries(['users']);
  },
  onError: (error, variables, context) => {
    // Rollback
    queryClient.setQueryData(['users'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['users']);
  },
  retry: 3,
});

// Usage:
mutation.mutate({ name: 'John' });
mutation.mutateAsync({ name: 'John' }); // Returns promise

// Return values:
// mutate - Execute mutation
// mutateAsync - Execute mutation (async)
// data - Mutation result
// error - Error object
// isPending - Loading state (v5)
// isError - Error state
// isSuccess - Success state
// status - 'idle' | 'pending' | 'error' | 'success'
// reset - Reset mutation state`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useInfiniteQuery</h3>
        <CodeBlock
          title="useInfiniteQuery - Pagination"
          code={`const {
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
} = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  initialPageParam: 0,              // Required in v5
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  maxPages: 10,                     // Limit pages
});

// Access data:
data.pages[0]                        // First page
data.pages[data.pages.length - 1]    // Last page
data.pages.flatMap(page => page.items) // All items`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useQueries</h3>
        <CodeBlock
          title="useQueries - Parallel Queries"
          code={`const results = useQueries({
  queries: [
    { queryKey: ['user', 1], queryFn: () => fetchUser(1) },
    { queryKey: ['user', 2], queryFn: () => fetchUser(2) },
    { queryKey: ['user', 3], queryFn: () => fetchUser(3) },
  ],
});

// Results array with same structure as useQuery
results[0].data                      // First query data
results.every(r => r.isSuccess)      // All successful
results.some(r => r.isLoading)      // Any loading`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Utility Hooks</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useQueryClient</h3>
        <CodeBlock
          title="useQueryClient - Access QueryClient"
          code={`const queryClient = useQueryClient();

// Common methods:
queryClient.getQueryData(['users'])           // Get cached data
queryClient.setQueryData(['users'], data)     // Set cached data
queryClient.invalidateQueries(['users'])       // Invalidate queries
queryClient.refetchQueries(['users'])         // Refetch queries
queryClient.removeQueries(['users'])          // Remove queries
queryClient.resetQueries(['users'])           // Reset queries
queryClient.cancelQueries(['users'])          // Cancel queries
queryClient.prefetchQuery({...})              // Prefetch query
queryClient.fetchQuery({...})                 // Fetch query
queryClient.getQueryState(['users'])          // Get query state`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useIsFetching</h3>
        <CodeBlock
          title="useIsFetching - Global Fetching State"
          code={`const isFetching = useIsFetching();                    // All queries
const isFetchingUsers = useIsFetching(['users']);        // Specific query
const isFetching = useIsFetching({ 
  predicate: (query) => query.state.status === 'error' 
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useIsMutating</h3>
        <CodeBlock
          title="useIsMutating - Global Mutation State"
          code={`const isMutating = useIsMutating();                    // All mutations
const isMutatingUsers = useIsMutating(['updateUser']);   // Specific mutation`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Suspense Hooks (v5+)</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useSuspenseQuery</h3>
        <CodeBlock
          title="useSuspenseQuery - Suspense Integration"
          code={`// Must be wrapped in Suspense boundary
<Suspense fallback={<div>Loading...</div>}>
  <UserComponent />
</Suspense>

function UserComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1),
  });
  // No need to check isLoading - Suspense handles it
  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useSuspenseInfiniteQuery</h3>
        <CodeBlock
          title="useSuspenseInfiniteQuery"
          code={`const { data, fetchNextPage } = useSuspenseInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useSuspenseQueries</h3>
        <CodeBlock
          title="useSuspenseQueries"
          code={`const results = useSuspenseQueries({
  queries: [
    { queryKey: ['user', 1], queryFn: () => fetchUser(1) },
    { queryKey: ['user', 2], queryFn: () => fetchUser(2) },
  ],
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">QueryClient Methods</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Methods</h3>
        <CodeBlock
          title="QueryClient Cache Methods"
          code={`const queryClient = useQueryClient();

// Get/Set data
queryClient.getQueryData(['users'])              // Get cached data
queryClient.setQueryData(['users'], newData)     // Set cached data
queryClient.getQueryState(['users'])             // Get query state

// Invalidation
queryClient.invalidateQueries(['users'])         // Invalidate
queryClient.invalidateQueries({
  queryKey: ['users'],
  refetchType: 'active',                         // 'active' | 'inactive' | 'all' | 'none'
  exact: false,                                  // Exact match
  predicate: (query) => query.isStale(),         // Custom predicate
})

// Refetch
queryClient.refetchQueries(['users'])           // Refetch
queryClient.refetchQueries({
  queryKey: ['users'],
  type: 'active',                                // 'active' | 'inactive' | 'all'
})

// Remove/Reset
queryClient.removeQueries(['users'])            // Remove from cache
queryClient.resetQueries(['users'])             // Reset to initial state
queryClient.clear()                              // Clear all queries

// Cancel
queryClient.cancelQueries(['users'])            // Cancel in-flight requests

// Prefetch/Fetch
queryClient.prefetchQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
})

queryClient.fetchQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
})

// Ensure data
queryClient.ensureQueryData({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
})`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Access</h3>
        <CodeBlock
          title="QueryCache & MutationCache"
          code={`const queryCache = queryClient.getQueryCache();
const mutationCache = queryClient.getMutationCache();

// QueryCache methods
queryCache.getAll()                              // All queries
queryCache.find({ queryKey: ['users'] })        // Find query
queryCache.findAll({ queryKey: ['users'] })     // Find all matching
queryCache.subscribe(callback)                   // Subscribe to events
queryCache.clear()                               // Clear all

// MutationCache methods
mutationCache.getAll()                           // All mutations
mutationCache.find({ mutationKey: ['update'] })  // Find mutation
mutationCache.findAll({ mutationKey: ['update'] }) // Find all
mutationCache.subscribe(callback)               // Subscribe
mutationCache.clear()                            // Clear all`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Options Quick Reference</h2>
        
        <CodeBlock
          title="All Query Options"
          code={`useQuery({
  // Required
  queryKey: ['users'],                           // Query key
  queryFn: () => fetchUsers(),                   // Query function

  // Caching
  staleTime: 1000 * 60 * 5,                      // Consider fresh for 5min
  gcTime: 1000 * 60 * 30,                        // Keep in cache 30min (v5)
  cacheTime: 1000 * 60 * 30,                     // Deprecated, use gcTime

  // Control
  enabled: true,                                  // Enable/disable
  retry: 3,                                       // Retry attempts
  retryDelay: 1000,                               // Retry delay
  retryOnMount: true,                             // Retry on mount

  // Refetching
  refetchOnMount: true,                           // Refetch on mount
  refetchOnWindowFocus: true,                     // Refetch on focus
  refetchOnReconnect: true,                       // Refetch on reconnect
  refetchInterval: false,                         // Polling interval
  refetchIntervalInBackground: false,             // Poll in background

  // Data
  select: (data) => data.users,                   // Transform data
  placeholderData: undefined,                      // Placeholder data
  initialData: undefined,                        // Initial data
  initialDataUpdatedAt: 0,                        // Initial data timestamp

  // Error
  useErrorBoundary: false,                        // Use error boundary
  throwOnError: false,                            // Throw on error

  // Other
  structuralSharing: true,                        // Structural sharing
  notifyOnChangeProps: undefined,                 // Notify on specific props
  meta: {},                                       // Metadata
  networkMode: 'online',                          // 'online' | 'always' | 'offlineFirst'
})`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation Options Quick Reference</h2>
        
        <CodeBlock
          title="All Mutation Options"
          code={`useMutation({
  // Required
  mutationFn: (variables) => updateUser(variables), // Mutation function

  // Callbacks
  onMutate: async (variables) => {},              // Before mutation
  onSuccess: (data, variables, context) => {},    // On success
  onError: (error, variables, context) => {},    // On error
  onSettled: (data, error, variables, context) => {}, // On settled

  // Retry
  retry: 3,                                       // Retry attempts
  retryDelay: 1000,                               // Retry delay

  // Other
  mutationKey: ['updateUser'],                    // Mutation key
  gcTime: 1000 * 60 * 5,                         // Cache time
  meta: {},                                       // Metadata
  networkMode: 'online',                          // Network mode
})`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Review <strong className="ml-1">21.2 Interview Questions & Answers</strong>
          for common interview questions with detailed answers.
        </p>
      </div>
    </LessonLayout>
  );
}

