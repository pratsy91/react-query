import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QuickReferencePage() {
  return (
    <LessonLayout
      title="21.4 Quick Reference Guide"
      description="Complete quick reference guide for all React Query concepts"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query Quick Reference</h2>
        <p className="text-gray-700 mb-4">
          Complete quick reference for all React Query concepts. Perfect for quick lookup during
          interviews or development.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Setup</h2>
        <p className="text-gray-700 mb-4">
          Setting up React Query involves three steps: installing the package, creating a QueryClient instance with default options, and wrapping your app with QueryClientProvider. The QueryClient manages the cache and query lifecycle. Default options allow you to set global behavior for all queries (like default staleTime, retry count, etc.), reducing boilerplate. The provider makes the QueryClient available to all components via context. This setup is typically done once at the root of your application.
        </p>
        <CodeBlock
          title="Basic Setup"
          code={`// 1. Install
npm install @tanstack/react-query

// 2. Create QueryClient
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 3,
    },
  },
});

// 3. Wrap app with Provider
import { QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Key Concepts</h2>
        
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Core Concepts:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Query Key</strong> - Unique identifier for cached data</li>
            <li><strong>Query Function</strong> - Function that fetches data</li>
            <li><strong>Stale Time</strong> - How long data is considered fresh</li>
            <li><strong>GC Time</strong> - How long unused data stays in cache</li>
            <li><strong>Cache</strong> - In-memory storage for query results</li>
            <li><strong>Observer</strong> - Component subscribed to query</li>
            <li><strong>Refetch</strong> - Re-execute query function</li>
            <li><strong>Invalidation</strong> - Mark query as stale</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query States</h2>
        <p className="text-gray-700 mb-4">
          React Query provides multiple state indicators to help you understand query status. The <code className="bg-gray-100 px-1 rounded">status</code> field indicates the overall query state (pending, error, or success), while <code className="bg-gray-100 px-1 rounded">fetchStatus</code> indicates the fetching state (idle, fetching, or paused). Boolean flags like <code className="bg-gray-100 px-1 rounded">isLoading</code>, <code className="bg-gray-100 px-1 rounded">isFetching</code>, <code className="bg-gray-100 px-1 rounded">isError</code>, and <code className="bg-gray-100 px-1 rounded">isSuccess</code> provide convenient checks. Understanding these states is crucial for proper UI rendering and user feedback.
        </p>
        <CodeBlock
          title="Query State Values"
          code={`// Status values
'pending'   // Initial state, no data yet
'error'     // Query failed
'success'   // Query succeeded

// Fetch status
'idle'      // Not fetching
'fetching'  // Currently fetching
'paused'    // Fetching paused

// Boolean flags
isLoading   // Initial load (no cached data)
isFetching  // Any fetch in progress
isError     // Error state
isSuccess   // Success state
isPending    // Pending state (v5)
isRefetching // Refetch in progress`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Options</h2>
        <p className="text-gray-700 mb-4">
          These are the most frequently used query and mutation options. Query options control caching (<code className="bg-gray-100 px-1 rounded">staleTime</code>, <code className="bg-gray-100 px-1 rounded">gcTime</code>), behavior (<code className="bg-gray-100 px-1 rounded">enabled</code>, <code className="bg-gray-100 px-1 rounded">retry</code>), and refetching (<code className="bg-gray-100 px-1 rounded">refetchOnWindowFocus</code>, <code className="bg-gray-100 px-1 rounded">refetchInterval</code>). The <code className="bg-gray-100 px-1 rounded">select</code> option transforms data and can reduce re-renders. Mutation options focus on lifecycle callbacks (<code className="bg-gray-100 px-1 rounded">onSuccess</code>, <code className="bg-gray-100 px-1 rounded">onError</code>, <code className="bg-gray-100 px-1 rounded">onSettled</code>) and retry behavior. Understanding these options is essential for effective React Query usage.
        </p>
        <CodeBlock
          title="Most Used Options"
          code={`// Query options
{
  queryKey: ['users'],                    // Required
  queryFn: () => fetchUsers(),            // Required
  staleTime: 1000 * 60 * 5,              // 5 minutes
  gcTime: 1000 * 60 * 30,                // 30 minutes
  enabled: true,                          // Enable/disable
  retry: 3,                               // Retry attempts
  refetchOnWindowFocus: true,             // Refetch on focus
  refetchInterval: false,                 // Polling
  select: (data) => data.users,           // Transform
}

// Mutation options
{
  mutationFn: (vars) => update(vars),     // Required
  onSuccess: (data) => {},               // Success callback
  onError: (error) => {},                // Error callback
  onSettled: () => {},                   // Settled callback
  retry: 3,                               // Retry attempts
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">QueryClient Methods</h2>
        <p className="text-gray-700 mb-4">
          QueryClient provides programmatic control over the cache and queries. Cache operations like <code className="bg-gray-100 px-1 rounded">getQueryData()</code> and <code className="bg-gray-100 px-1 rounded">setQueryData()</code> allow direct cache manipulation. Invalidation methods like <code className="bg-gray-100 px-1 rounded">invalidateQueries()</code> mark queries as stale, while <code className="bg-gray-100 px-1 rounded">refetchQueries()</code> forces immediate refetching. Prefetching methods like <code className="bg-gray-100 px-1 rounded">prefetchQuery()</code> and <code className="bg-gray-100 px-1 rounded">fetchQuery()</code> allow programmatic data fetching. These methods are essential for cache management, optimistic updates, and programmatic data synchronization.
        </p>
        <CodeBlock
          title="Essential Methods"
          code={`const queryClient = useQueryClient();

// Cache operations
queryClient.getQueryData(['users'])           // Get data
queryClient.setQueryData(['users'], data)     // Set data
queryClient.removeQueries(['users'])         // Remove

// Invalidation
queryClient.invalidateQueries(['users'])      // Mark stale
queryClient.refetchQueries(['users'])        // Refetch

// Prefetching
queryClient.prefetchQuery({...})            // Prefetch
queryClient.fetchQuery({...})                // Fetch

// Cache access
queryClient.getQueryCache()                  // Get cache
queryClient.getMutationCache()               // Get mutation cache`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Patterns</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dependent Query</h3>
        <p className="text-gray-700 mb-4">
          Dependent queries use the <code className="bg-gray-100 px-1 rounded">enabled</code> option to wait for prerequisite data before executing. The second query only runs when the first query's data is available. This pattern ensures queries execute in the correct order and prevents unnecessary API calls. The <code className="bg-gray-100 px-1 rounded">enabled: !!user</code> syntax automatically enables the query when user data exists, making the dependency relationship clear and maintainable.
        </p>
        <CodeBlock
          title="Dependent Query Pattern"
          code={`const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
  queryKey: ['user', userId, 'posts'],
  queryFn: () => fetchPosts(userId),
  enabled: !!user,  // Wait for user
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Optimistic Update</h3>
        <p className="text-gray-700 mb-4">
          Optimistic updates provide instant UI feedback by updating the cache before the server responds. The <code className="bg-gray-100 px-1 rounded">onMutate</code> callback cancels outgoing refetches, snapshots previous data, and optimistically updates the cache. If the mutation fails, <code className="bg-gray-100 px-1 rounded">onError</code> uses the context to rollback. Finally, <code className="bg-gray-100 px-1 rounded">onSettled</code> refetches to ensure data consistency. This pattern makes the UI feel instant and responsive, significantly improving user experience.
        </p>
        <CodeBlock
          title="Optimistic Update Pattern"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['user', id]);
    const previous = queryClient.getQueryData(['user', id]);
    queryClient.setQueryData(['user', id], newData);
    return { previous };
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(['user', id], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['user', id]);
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Invalidation After Mutation</h3>
        <p className="text-gray-700 mb-4">
          After mutations, you need to update the cache to reflect server changes. The <code className="bg-gray-100 px-1 rounded">onSuccess</code> callback is the perfect place to invalidate related queries. <code className="bg-gray-100 px-1 rounded">invalidateQueries()</code> marks queries as stale and triggers refetches for active queries. This ensures the UI displays the latest data after mutations. You can invalidate specific queries, all queries matching a pattern, or use predicates for custom matching logic.
        </p>
        <CodeBlock
          title="Invalidation Pattern"
          code={`const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Key Best Practices</h2>
        <p className="text-gray-700 mb-4">
          Query keys must be stable, serializable, and hierarchical. Stable keys don't change between renders (avoid functions, Date objects, or random values). Serializable keys can be converted to strings (objects are serialized, but object references change). Hierarchical keys like <code className="bg-gray-100 px-1 rounded">['users', 1, 'posts']</code> make invalidation easier—invalidating <code className="bg-gray-100 px-1 rounded">['users']</code> invalidates all user-related queries. Query key factories provide type safety and consistency. Avoid unstable keys that change every render, as they cause unnecessary refetches and cache misses.
        </p>
        <CodeBlock
          title="Query Key Patterns"
          code={`// ✅ Good: Stable, hierarchical keys
['users']                           // List
['users', 1]                        // Single item
['users', 1, 'posts']               // Related data
['users', { status: 'active' }]     // With filters (serialized)

// ✅ Use factories
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
};

// ❌ Bad: Unstable keys
['users', Date.now()]               // Changes every render
['users', { id: 1 }]                // Object reference changes
['users', () => Math.random()]      // Function reference changes`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance Tips</h2>
        
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use select</strong> - Transform data to reduce re-renders</li>
            <li><strong>Set staleTime</strong> - Reduce unnecessary refetches</li>
            <li><strong>Use pagination</strong> - Don't fetch all data at once</li>
            <li><strong>Debounce search</strong> - Reduce API calls</li>
            <li><strong>Prefetch on hover</strong> - Improve perceived performance</li>
            <li><strong>Use structural sharing</strong> - Default, prevents unnecessary updates</li>
            <li><strong>Limit cache size</strong> - Prevent memory issues</li>
            <li><strong>Code split routes</strong> - Load queries on demand</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Mistakes to Avoid</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-red-800">
            <li>❌ Invalidating queries in onSuccess (causes infinite loops)</li>
            <li>❌ Using unstable query keys (causes unnecessary refetches)</li>
            <li>❌ Not cleaning up subscriptions (memory leaks)</li>
            <li>❌ Missing dependencies in query keys (stale data)</li>
            <li>❌ Using onSuccess/onError (deprecated, use useEffect)</li>
            <li>❌ Not handling race conditions (stale data overwrites)</li>
            <li>❌ Fetching too much data (performance issues)</li>
            <li>❌ Not using select for transformations (unnecessary re-renders)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Version Differences</h2>
        <p className="text-gray-700 mb-4">
          React Query v5 introduced several breaking changes from v4. The most notable changes include renaming <code className="bg-gray-100 px-1 rounded">cacheTime</code> to <code className="bg-gray-100 px-1 rounded">gcTime</code>, renaming <code className="bg-gray-100 px-1 rounded">isLoading</code> to <code className="bg-gray-100 px-1 rounded">isPending</code> for mutations, requiring <code className="bg-gray-100 px-1 rounded">initialPageParam</code> for <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code>, deprecating <code className="bg-gray-100 px-1 rounded">onSuccess</code> and <code className="bg-gray-100 px-1 rounded">onError</code> in favor of <code className="bg-gray-100 px-1 rounded">useEffect</code>, and introducing new Suspense hooks. Understanding these changes is crucial when migrating or working with different versions.
        </p>
        <CodeBlock
          title="v4 to v5 Changes"
          code={`// v4 → v5 Changes:

// 1. cacheTime → gcTime
cacheTime: 1000 * 60 * 5  // v4
gcTime: 1000 * 60 * 5     // v5

// 2. mutation.isLoading → mutation.isPending
mutation.isLoading  // v4
mutation.isPending  // v5

// 3. useInfiniteQuery requires initialPageParam
useInfiniteQuery({
  initialPageParam: 0,  // Required in v5
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

// 4. onSuccess/onError deprecated
// Use useEffect instead

// 5. New Suspense hooks
useSuspenseQuery()
useSuspenseInfiniteQuery()
useSuspenseQueries()`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Interview Checklist</h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Be Ready to Explain:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ What React Query is and why use it</li>
            <li>✅ Difference between isLoading and isFetching</li>
            <li>✅ staleTime vs gcTime (cacheTime)</li>
            <li>✅ How to handle dependent queries</li>
            <li>✅ Optimistic updates pattern</li>
            <li>✅ Query invalidation strategies</li>
            <li>✅ Race condition handling</li>
            <li>✅ Performance optimization techniques</li>
            <li>✅ Error handling patterns</li>
            <li>✅ Testing React Query hooks</li>
            <li>✅ Query key best practices</li>
            <li>✅ Common pitfalls and how to avoid them</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>🎉 Complete! 🎉</strong> You've finished the entire React Query learning platform
          including the interview cheatsheet! You're now fully prepared for React Query interviews
          and ready to build amazing applications. Good luck! 🚀
        </p>
      </div>
    </LessonLayout>
  );
}

