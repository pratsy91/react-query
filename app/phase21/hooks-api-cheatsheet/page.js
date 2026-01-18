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
        <p className="text-gray-700 mb-4">
          <strong>useQuery</strong> is the primary hook for fetching and caching server data. It automatically handles caching, background refetching, error states, and loading states. The hook requires two essential parameters: <code className="bg-gray-100 px-1 rounded">queryKey</code> (a unique identifier array like <code className="bg-gray-100 px-1 rounded">['users']</code> or <code className="bg-gray-100 px-1 rounded">['user', userId]</code>) and <code className="bg-gray-100 px-1 rounded">queryFn</code> (a function that returns a promise, typically an async function that fetches data from an API).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> When <code className="bg-gray-100 px-1 rounded">useQuery</code> is called, React Query checks if data exists in the cache for that query key. If cached data exists and is fresh (within <code className="bg-gray-100 px-1 rounded">staleTime</code>), it returns the cached data immediately. If the data is stale or missing, it executes <code className="bg-gray-100 px-1 rounded">queryFn</code> to fetch new data. React Query automatically deduplicates requests—if multiple components use the same query key simultaneously, only one network request is made, and all components receive the same data.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Key options explained:</strong> <code className="bg-gray-100 px-1 rounded">staleTime: 1000 * 60 * 5</code> means data is considered fresh for 5 minutes—no automatic refetch occurs during this time. <code className="bg-gray-100 px-1 rounded">gcTime: 1000 * 60 * 30</code> (garbage collection time, formerly <code className="bg-gray-100 px-1 rounded">cacheTime</code>) determines how long unused data stays in cache before being removed. <code className="bg-gray-100 px-1 rounded">enabled: true</code> controls whether the query runs—set to <code className="bg-gray-100 px-1 rounded">false</code> to disable the query conditionally. <code className="bg-gray-100 px-1 rounded">retry: 3</code> means the query will retry up to 3 times on failure, with <code className="bg-gray-100 px-1 rounded">retryDelay: 1000</code> milliseconds between attempts.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Refetching behavior:</strong> <code className="bg-gray-100 px-1 rounded">refetchOnWindowFocus: true</code> automatically refetches data when the browser window regains focus (useful for keeping data fresh). <code className="bg-gray-100 px-1 rounded">refetchOnReconnect: true</code> refetches when the network reconnects. <code className="bg-gray-100 px-1 rounded">refetchInterval: false</code> disables polling—set to a number (e.g., <code className="bg-gray-100 px-1 rounded">5000</code>) to poll every 5 seconds.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Data transformation:</strong> The <code className="bg-gray-100 px-1 rounded">select</code> option transforms data before it's returned. This is useful for extracting specific fields or computing derived values. Importantly, <code className="bg-gray-100 px-1 rounded">select</code> also affects re-renders—components only re-render when the selected data changes, not when the entire data object changes (structural sharing).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Return values explained:</strong> <code className="bg-gray-100 px-1 rounded">data</code> contains the query result (undefined initially). <code className="bg-gray-100 px-1 rounded">error</code> contains the error object if the query failed. <code className="bg-gray-100 px-1 rounded">isLoading</code> is <code className="bg-gray-100 px-1 rounded">true</code> only during the initial load when there's no cached data. <code className="bg-gray-100 px-1 rounded">isFetching</code> is <code className="bg-gray-100 px-1 rounded">true</code> whenever any fetch is in progress (including refetches). <code className="bg-gray-100 px-1 rounded">isError</code> and <code className="bg-gray-100 px-1 rounded">isSuccess</code> indicate the query state. <code className="bg-gray-100 px-1 rounded">refetch</code> is a function to manually trigger a refetch. <code className="bg-gray-100 px-1 rounded">status</code> is a string: <code className="bg-gray-100 px-1 rounded">'pending'</code>, <code className="bg-gray-100 px-1 rounded">'error'</code>, or <code className="bg-gray-100 px-1 rounded">'success'</code>. <code className="bg-gray-100 px-1 rounded">fetchStatus</code> indicates fetching state: <code className="bg-gray-100 px-1 rounded">'fetching'</code>, <code className="bg-gray-100 px-1 rounded">'paused'</code>, or <code className="bg-gray-100 px-1 rounded">'idle'</code>.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Deprecated callbacks:</strong> <code className="bg-gray-100 px-1 rounded">onSuccess</code> and <code className="bg-gray-100 px-1 rounded">onError</code> are deprecated in v5. Use <code className="bg-gray-100 px-1 rounded">useEffect</code> instead to handle side effects based on query state changes.
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useMutation</strong> is used for creating, updating, or deleting data on the server (POST, PUT, PATCH, DELETE operations). Unlike queries, mutations are not automatically executed—they require explicit triggering via <code className="bg-gray-100 px-1 rounded">mutate()</code> or <code className="bg-gray-100 px-1 rounded">mutateAsync()</code>. This design allows you to control when mutations occur (e.g., on button click, form submit).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> The <code className="bg-gray-100 px-1 rounded">mutationFn</code> is the core function that performs the mutation. It receives <code className="bg-gray-100 px-1 rounded">variables</code> (the data you pass to <code className="bg-gray-100 px-1 rounded">mutate()</code>) and returns a promise. When you call <code className="bg-gray-100 px-1 rounded">mutation.mutate(variables)</code>, React Query executes the mutation and manages the loading, success, and error states automatically.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Lifecycle callbacks explained:</strong> The mutation lifecycle consists of four callbacks that execute in order: <code className="bg-gray-100 px-1 rounded">onMutate</code> runs synchronously before the mutation function executes—this is perfect for optimistic updates. It receives the <code className="bg-gray-100 px-1 rounded">variables</code> and can return a <code className="bg-gray-100 px-1 rounded">context</code> object (like previous data) for rollback purposes. <code className="bg-gray-100 px-1 rounded">onSuccess</code> runs after a successful mutation, receiving <code className="bg-gray-100 px-1 rounded">data</code> (the mutation result), <code className="bg-gray-100 px-1 rounded">variables</code> (what was passed to mutate), and <code className="bg-gray-100 px-1 rounded">context</code> (from onMutate). <code className="bg-gray-100 px-1 rounded">onError</code> runs if the mutation fails, receiving <code className="bg-gray-100 px-1 rounded">error</code>, <code className="bg-gray-100 px-1 rounded">variables</code>, and <code className="bg-gray-100 px-1 rounded">context</code>—use this to rollback optimistic updates. <code className="bg-gray-100 px-1 rounded">onSettled</code> runs after the mutation completes regardless of success or failure—use this for cleanup or final state updates.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Optimistic updates pattern:</strong> In the example, <code className="bg-gray-100 px-1 rounded">onMutate</code> cancels outgoing refetches with <code className="bg-gray-100 px-1 rounded">cancelQueries(['users'])</code> to prevent race conditions. It then snapshots the previous data with <code className="bg-gray-100 px-1 rounded">getQueryData(['users'])</code> and optimistically updates the cache with <code className="bg-gray-100 px-1 rounded">setQueryData(['users', variables.id], variables)</code>. The <code className="bg-gray-100 px-1 rounded">{`{ previous }`}</code> object is returned as context. If the mutation fails, <code className="bg-gray-100 px-1 rounded">onError</code> uses <code className="bg-gray-100 px-1 rounded">context.previous</code> to rollback the optimistic update.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Cache invalidation:</strong> After successful mutations, you typically invalidate related queries with <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> to trigger refetches and ensure data consistency. This is done in <code className="bg-gray-100 px-1 rounded">onSuccess</code> or <code className="bg-gray-100 px-1 rounded">onSettled</code>.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Usage methods:</strong> <code className="bg-gray-100 px-1 rounded">mutation.mutate({`{ name: 'John' }`})</code> triggers the mutation and returns void. <code className="bg-gray-100 px-1 rounded">mutation.mutateAsync({`{ name: 'John' }`})</code> returns a promise, allowing you to use <code className="bg-gray-100 px-1 rounded">await</code> or chain <code className="bg-gray-100 px-1 rounded">.then()</code>. Use <code className="bg-gray-100 px-1 rounded">mutateAsync</code> when you need to wait for the mutation to complete before proceeding.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Return values:</strong> <code className="bg-gray-100 px-1 rounded">mutate</code> and <code className="bg-gray-100 px-1 rounded">mutateAsync</code> are the execution functions. <code className="bg-gray-100 px-1 rounded">data</code> contains the mutation result (undefined until success). <code className="bg-gray-100 px-1 rounded">error</code> contains the error object if the mutation failed. <code className="bg-gray-100 px-1 rounded">isPending</code> (v5, formerly <code className="bg-gray-100 px-1 rounded">isLoading</code>) indicates if the mutation is in progress. <code className="bg-gray-100 px-1 rounded">isError</code> and <code className="bg-gray-100 px-1 rounded">isSuccess</code> indicate the mutation state. <code className="bg-gray-100 px-1 rounded">status</code> is a string: <code className="bg-gray-100 px-1 rounded">'idle'</code>, <code className="bg-gray-100 px-1 rounded">'pending'</code>, <code className="bg-gray-100 px-1 rounded">'error'</code>, or <code className="bg-gray-100 px-1 rounded">'success'</code>. <code className="bg-gray-100 px-1 rounded">reset</code> clears the mutation state back to idle.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Retry behavior:</strong> <code className="bg-gray-100 px-1 rounded">retry: 3</code> means the mutation will retry up to 3 times on failure. You can also pass a function <code className="bg-gray-100 px-1 rounded">{`retry: (failureCount, error) => failureCount < 3`}</code> for custom retry logic (e.g., don't retry on 404 errors).
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useInfiniteQuery</strong> is designed for paginated data and infinite scrolling scenarios. Unlike regular queries that fetch a single dataset, infinite queries manage multiple pages of data, automatically tracking which pages have been loaded and maintaining them in cache.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> The hook requires <code className="bg-gray-100 px-1 rounded">initialPageParam</code> (required in v5), which is the starting page parameter (e.g., <code className="bg-gray-100 px-1 rounded">0</code> for page numbers, <code className="bg-gray-100 px-1 rounded">null</code> for cursor-based pagination). The <code className="bg-gray-100 px-1 rounded">queryFn</code> receives an object with <code className="bg-gray-100 px-1 rounded">pageParam</code> and <code className="bg-gray-100 px-1 rounded">queryKey</code>—use <code className="bg-gray-100 px-1 rounded">pageParam</code> in your API call (e.g., <code className="bg-gray-100 px-1 rounded">{`fetchPosts(pageParam)`}</code>).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Pagination logic:</strong> <code className="bg-gray-100 px-1 rounded">getNextPageParam</code> is a function that receives <code className="bg-gray-100 px-1 rounded">lastPage</code> (the data from the most recent fetch) and <code className="bg-gray-100 px-1 rounded">allPages</code> (array of all pages fetched so far). It should return the next page parameter, or <code className="bg-gray-100 px-1 rounded">undefined</code> if there are no more pages. For example, if your API returns <code className="bg-gray-100 px-1 rounded">{`{ items: [...], nextCursor: 'abc123' }`}</code>, you'd return <code className="bg-gray-100 px-1 rounded">{`lastPage.nextCursor`}</code>. <code className="bg-gray-100 px-1 rounded">getPreviousPageParam</code> works similarly for reverse pagination.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Data structure:</strong> The returned <code className="bg-gray-100 px-1 rounded">data</code> object has two properties: <code className="bg-gray-100 px-1 rounded">data.pages</code> is an array where each element is the result from one page fetch (e.g., <code className="bg-gray-100 px-1 rounded">{`[{ items: [...] }, { items: [...] }]`}</code>). <code className="bg-gray-100 px-1 rounded">data.pageParams</code> is an array of the page parameters used for each page. To access all items across all pages, use <code className="bg-gray-100 px-1 rounded">{`data.pages.flatMap(page => page.items)`}</code>.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Loading more data:</strong> Call <code className="bg-gray-100 px-1 rounded">fetchNextPage()</code> to load the next page—this triggers <code className="bg-gray-100 px-1 rounded">queryFn</code> with the next page parameter determined by <code className="bg-gray-100 px-1 rounded">getNextPageParam</code>. <code className="bg-gray-100 px-1 rounded">fetchPreviousPage()</code> works similarly for reverse pagination. <code className="bg-gray-100 px-1 rounded">hasNextPage</code> is a boolean indicating if more pages are available (determined by whether <code className="bg-gray-100 px-1 rounded">getNextPageParam</code> returns a value). <code className="bg-gray-100 px-1 rounded">isFetchingNextPage</code> indicates if the next page is currently being fetched.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Page limits:</strong> <code className="bg-gray-100 px-1 rounded">maxPages: 10</code> limits the number of pages kept in memory. When the limit is reached, the oldest pages are removed. This prevents memory issues with very long infinite scroll lists.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Common patterns:</strong> For offset-based pagination, use <code className="bg-gray-100 px-1 rounded">{`initialPageParam: 0`}</code> and <code className="bg-gray-100 px-1 rounded">{`getNextPageParam: (lastPage, allPages) => allPages.length`}</code>. For cursor-based pagination, use <code className="bg-gray-100 px-1 rounded">{`initialPageParam: null`}</code> and <code className="bg-gray-100 px-1 rounded">{`getNextPageParam: (lastPage) => lastPage.nextCursor`}</code>. For timestamp-based pagination, use the timestamp as the page parameter.
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useQueries</strong> allows you to execute multiple queries in parallel, which is more efficient than using multiple <code className="bg-gray-100 px-1 rounded">useQuery</code> hooks because React Query can optimize the parallel execution. It accepts an object with a <code className="bg-gray-100 px-1 rounded">queries</code> array, where each element is a query configuration object (same structure as <code className="bg-gray-100 px-1 rounded">useQuery</code> options).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> Each query in the array runs independently and has its own loading, error, and success states. React Query handles caching, deduplication, and refetching for each query separately. The hook returns an array of query results, where each result has the exact same structure as a single <code className="bg-gray-100 px-1 rounded">useQuery</code> result (with <code className="bg-gray-100 px-1 rounded">data</code>, <code className="bg-gray-100 px-1 rounded">isLoading</code>, <code className="bg-gray-100 px-1 rounded">isError</code>, etc.).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Accessing results:</strong> Access individual query results by index: <code className="bg-gray-100 px-1 rounded">results[0].data</code> gets the data from the first query. You can also use array methods to aggregate states: <code className="bg-gray-100 px-1 rounded">{`results.every(r => r.isSuccess)`}</code> checks if all queries succeeded, <code className="bg-gray-100 px-1 rounded">{`results.some(r => r.isLoading)`}</code> checks if any query is loading, <code className="bg-gray-100 px-1 rounded">{`results.filter(r => r.isError).length`}</code> counts failed queries.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Dynamic queries:</strong> You can create dynamic query arrays by mapping over data. For example, if you have an array of user IDs, you can create queries for each: <code className="bg-gray-100 px-1 rounded">{`queries: userIds.map(id => ({ queryKey: ['user', id], queryFn: () => fetchUser(id) }))`}</code>. This is useful for fetching multiple related resources where the number of queries is determined at runtime.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Use cases:</strong> Common scenarios include dashboards that need multiple data sources (users, posts, comments), fetching related data for a list of items, or loading data for multiple tabs/views simultaneously. The parallel execution improves performance compared to sequential fetching.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Best practices:</strong> Keep the number of parallel queries reasonable (avoid hundreds of queries). Use consistent query key patterns for easier invalidation. Consider using <code className="bg-gray-100 px-1 rounded">enabled</code> to conditionally include queries. Aggregate loading/error states appropriately for your UI needs.
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useQueryClient</strong> provides access to the QueryClient instance, which is the central hub for managing queries and cache. The QueryClient is created when you set up React Query and is made available through context. This hook gives you programmatic control over the cache and queries, allowing you to read, write, invalidate, and prefetch data.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Cache reading:</strong> <code className="bg-gray-100 px-1 rounded">getQueryData(['users'])</code> returns the cached data for the specified query key, or <code className="bg-gray-100 px-1 rounded">undefined</code> if not cached. This is useful for checking if data exists before fetching, or for accessing data in callbacks where you don't have direct access to the query result.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Cache writing:</strong> <code className="bg-gray-100 px-1 rounded">setQueryData(['users'], newData)</code> directly updates the cache with new data. This is essential for optimistic updates—you can update the cache immediately before the server responds. You can also pass a function: <code className="bg-gray-100 px-1 rounded">{`setQueryData(['users'], (old) => [...old, newUser])`}</code> to update based on previous data.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Query state:</strong> <code className="bg-gray-100 px-1 rounded">getQueryState(['users'])</code> returns the full query state object, including <code className="bg-gray-100 px-1 rounded">status</code>, <code className="bg-gray-100 px-1 rounded">dataUpdatedAt</code>, <code className="bg-gray-100 px-1 rounded">error</code>, and <code className="bg-gray-100 px-1 rounded">isStale</code>. This is useful for debugging or conditional logic based on query state.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Invalidation:</strong> <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> marks queries matching the key as stale. By default, this triggers refetches for active queries (queries currently being observed by components). You can control this with options: <code className="bg-gray-100 px-1 rounded">{`invalidateQueries({ queryKey: ['users'], refetchType: 'none' })`}</code> to mark stale without refetching, or <code className="bg-gray-100 px-1 rounded">{`refetchType: 'all'`}</code> to refetch inactive queries too.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Refetching:</strong> <code className="bg-gray-100 px-1 rounded">refetchQueries(['users'])</code> forces immediate refetching of matching queries, regardless of stale status. Use this when you need to ensure fresh data immediately. <code className="bg-gray-100 px-1 rounded">removeQueries(['users'])</code> removes queries from cache entirely, while <code className="bg-gray-100 px-1 rounded">resetQueries(['users'])</code> resets queries to their initial state (clears data and error).
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Prefetching:</strong> <code className="bg-gray-100 px-1 rounded">prefetchQuery({`{ queryKey: ['users'], queryFn: fetchUsers }`})</code> fetches data in the background and caches it. This is non-blocking and doesn't throw errors—perfect for prefetching on hover or route changes. <code className="bg-gray-100 px-1 rounded">fetchQuery()</code> is similar but returns a promise and throws on error—use when you need to await the result.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Cancellation:</strong> <code className="bg-gray-100 px-1 rounded">cancelQueries(['users'])</code> cancels in-flight requests for matching queries. This is useful in optimistic updates to prevent race conditions where a refetch might overwrite your optimistic update.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Use cases:</strong> Essential for optimistic updates (setQueryData in onMutate), cache management (invalidate after mutations), prefetching (prefetchQuery on hover), programmatic data access (getQueryData in callbacks), and advanced cache manipulation (updating related queries, batch operations).
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useIsFetching</strong> is a utility hook that returns a number (count) or boolean indicating whether any queries are currently fetching. It's useful for showing global loading indicators, disabling actions during fetches, or tracking overall application loading state.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Basic usage:</strong> <code className="bg-gray-100 px-1 rounded">useIsFetching()</code> with no arguments returns the count of all queries currently fetching. You can use it as a boolean: <code className="bg-gray-100 px-1 rounded">{`const isFetching = useIsFetching() > 0`}</code> or check the count directly for more granular UI (e.g., show "Loading 3 items...").
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Filtering by query key:</strong> <code className="bg-gray-100 px-1 rounded">useIsFetching(['users'])</code> returns the count of fetching queries that match the query key. This uses the same matching logic as <code className="bg-gray-100 px-1 rounded">invalidateQueries</code>—partial matches are included (e.g., <code className="bg-gray-100 px-1 rounded">['users']</code> matches <code className="bg-gray-100 px-1 rounded">['users', 1]</code>). Use <code className="bg-gray-100 px-1 rounded">{`{ queryKey: ['users'], exact: true }`}</code> for exact matching only.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Predicate filtering:</strong> <code className="bg-gray-100 px-1 rounded">{`useIsFetching({ predicate: (query) => query.state.status === 'error' })`}</code> allows custom filtering logic. The predicate receives a query object with properties like <code className="bg-gray-100 px-1 rounded">queryKey</code>, <code className="bg-gray-100 px-1 rounded">state</code>, <code className="bg-gray-100 px-1 rounded">isStale</code>, etc. This is powerful for complex conditions like "show loading if any error queries are refetching".
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> The hook subscribes to query state changes and re-renders the component when the fetching count changes. It's efficient because it only re-renders when the count actually changes, not on every query state update.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Use cases:</strong> Global loading spinners, disabling submit buttons during fetches, showing "Syncing..." indicators, tracking background sync status, or displaying fetch progress in navigation bars.
        </p>
        <CodeBlock
          title="useIsFetching - Global Fetching State"
          code={`const isFetching = useIsFetching();                    // All queries
const isFetchingUsers = useIsFetching(['users']);        // Specific query
const isFetching = useIsFetching({ 
  predicate: (query) => query.state.status === 'error' 
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useIsMutating</h3>
        <p className="text-gray-700 mb-4">
          <strong>useIsMutating</strong> is similar to <code className="bg-gray-100 px-1 rounded">useIsFetching</code> but tracks mutations instead of queries. It returns a number (count) of how many mutations are currently in progress. This is essential for preventing concurrent mutations, showing global mutation indicators, or disabling UI during mutations.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Basic usage:</strong> <code className="bg-gray-100 px-1 rounded">useIsMutating()</code> with no arguments returns the count of all mutations currently pending. Use it as a boolean: <code className="bg-gray-100 px-1 rounded">{`const isMutating = useIsMutating() > 0`}</code> to check if any mutations are in progress.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Filtering by mutation key:</strong> <code className="bg-gray-100 px-1 rounded">useIsMutating(['updateUser'])</code> returns the count of mutations matching the mutation key. This is useful for tracking specific mutation types, like showing a loading state only for user updates, not for other mutations.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Use cases:</strong> Disable form submissions while mutations are in progress (<code className="bg-gray-100 px-1 rounded">{`disabled={useIsMutating() > 0}`}</code>), show global "Saving..." indicators, prevent duplicate mutations (check before calling mutate), or track mutation progress across the application.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Best practices:</strong> Use specific mutation keys for granular control. Combine with <code className="bg-gray-100 px-1 rounded">useIsFetching</code> for comprehensive loading state management. Consider debouncing rapid mutations to avoid flickering UI.
        </p>
        <CodeBlock
          title="useIsMutating - Global Mutation State"
          code={`const isMutating = useIsMutating();                    // All mutations
const isMutatingUsers = useIsMutating(['updateUser']);   // Specific mutation`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Suspense Hooks (v5+)</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useSuspenseQuery</h3>
        <p className="text-gray-700 mb-4">
          <strong>useSuspenseQuery</strong> (v5+) is a Suspense-compatible version of <code className="bg-gray-100 px-1 rounded">useQuery</code> that integrates with React's Suspense API. It must be wrapped in a React <code className="bg-gray-100 px-1 rounded">Suspense</code> boundary—without it, the component will throw an error.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>How it works:</strong> When the query is loading or fetching, <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> throws a promise. React's Suspense boundary catches this promise and displays the <code className="bg-gray-100 px-1 rounded">fallback</code> UI. Once the query completes (success or error), the promise resolves and the component renders. This eliminates the need for manual <code className="bg-gray-100 px-1 rounded">isLoading</code> checks—the component only renders when data is available.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Key differences from useQuery:</strong> Unlike <code className="bg-gray-100 px-1 rounded">useQuery</code>, <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> guarantees that <code className="bg-gray-100 px-1 rounded">data</code> is never <code className="bg-gray-100 px-1 rounded">undefined</code> when the component renders. There's no <code className="bg-gray-100 px-1 rounded">isLoading</code> or <code className="bg-gray-100 px-1 rounded">isPending</code> state—Suspense handles loading. Errors are thrown and should be caught with Error Boundaries.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Benefits:</strong> Cleaner component code (no conditional rendering for loading states), better UX (Suspense can show loading states at any level in the component tree), and type safety (TypeScript knows data is always defined). This pattern works well with React Server Components and streaming SSR.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Use cases:</strong> Critical data that must be available before rendering, server-rendered applications, or when you want Suspense to handle loading states at a higher level in your component tree.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Error handling:</strong> Errors thrown by <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> should be caught with Error Boundaries. You can't use <code className="bg-gray-100 px-1 rounded">isError</code> checks—errors propagate up to the nearest Error Boundary.
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useSuspenseInfiniteQuery</strong> is the Suspense-compatible version of <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code>. Like <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code>, it requires a Suspense boundary and throws during loading. This hook is ideal for infinite scrolling scenarios where you want Suspense to handle the initial loading state, while subsequent pages can be loaded incrementally with <code className="bg-gray-100 px-1 rounded">fetchNextPage()</code>.
        </p>
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
        <p className="text-gray-700 mb-4">
          <strong>useSuspenseQueries</strong> is the Suspense-compatible version of <code className="bg-gray-100 px-1 rounded">useQueries</code>. It allows you to execute multiple queries in parallel with Suspense support. All queries must complete before the component renders, ensuring all data is available. This is useful for fetching multiple related resources where you need all of them before rendering, such as a dashboard that requires user data, posts, and comments simultaneously.
        </p>
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
        <p className="text-gray-700 mb-4">
          QueryClient provides comprehensive cache management methods for reading, writing, invalidating, and refetching queries. These methods are essential for cache manipulation, optimistic updates, and programmatic data synchronization.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Reading cache:</strong> <code className="bg-gray-100 px-1 rounded">getQueryData(['users'])</code> returns the cached data for the query key, or <code className="bg-gray-100 px-1 rounded">undefined</code> if not cached. <code className="bg-gray-100 px-1 rounded">getQueryState(['users'])</code> returns the full query state object including <code className="bg-gray-100 px-1 rounded">status</code>, <code className="bg-gray-100 px-1 rounded">dataUpdatedAt</code>, <code className="bg-gray-100 px-1 rounded">error</code>, <code className="bg-gray-100 px-1 rounded">isStale</code>, and <code className="bg-gray-100 px-1 rounded">fetchStatus</code>. Use these to check cache contents before fetching or to access data in callbacks.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Writing cache:</strong> <code className="bg-gray-100 px-1 rounded">setQueryData(['users'], newData)</code> directly updates the cache. You can pass a function: <code className="bg-gray-100 px-1 rounded">{`setQueryData(['users'], (old) => [...old, newUser])`}</code> to update based on previous data. This is essential for optimistic updates—update the cache immediately before the server responds. The update triggers re-renders for all components using that query.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Invalidation:</strong> <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> marks matching queries as stale. By default, this triggers refetches for active queries (queries currently observed by components). Options include: <code className="bg-gray-100 px-1 rounded">refetchType: 'active'</code> (default, only active queries), <code className="bg-gray-100 px-1 rounded">'inactive'</code> (only inactive), <code className="bg-gray-100 px-1 rounded">'all'</code> (both), or <code className="bg-gray-100 px-1 rounded">'none'</code> (mark stale without refetching). <code className="bg-gray-100 px-1 rounded">exact: false</code> (default) allows partial key matching, <code className="bg-gray-100 px-1 rounded">exact: true</code> requires exact match. <code className="bg-gray-100 px-1 rounded">predicate</code> allows custom matching logic.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Refetching:</strong> <code className="bg-gray-100 px-1 rounded">refetchQueries(['users'])</code> forces immediate refetching regardless of stale status. Use when you need fresh data immediately. Options: <code className="bg-gray-100 px-1 rounded">type: 'active'</code> (default), <code className="bg-gray-100 px-1 rounded">'inactive'</code>, or <code className="bg-gray-100 px-1 rounded">'all'</code>. Returns a promise that resolves when refetching completes.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Removal and reset:</strong> <code className="bg-gray-100 px-1 rounded">removeQueries(['users'])</code> completely removes queries from cache. <code className="bg-gray-100 px-1 rounded">resetQueries(['users'])</code> resets queries to initial state (clears data and error, but keeps the query in cache). <code className="bg-gray-100 px-1 rounded">clear()</code> removes all queries from cache—use with caution.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Prefetching and fetching:</strong> <code className="bg-gray-100 px-1 rounded">prefetchQuery({`{ queryKey: ['users'], queryFn: fetchUsers }`})</code> fetches data in the background and caches it. This is non-blocking, doesn't throw errors, and returns a promise. Perfect for prefetching on hover or route changes. <code className="bg-gray-100 px-1 rounded">fetchQuery()</code> is similar but throws on error and returns the data—use when you need to await the result. <code className="bg-gray-100 px-1 rounded">ensureQueryData()</code> ensures data exists in cache—if missing or stale, it fetches; otherwise returns cached data. Useful for SSR or ensuring data availability.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Cancellation:</strong> <code className="bg-gray-100 px-1 rounded">cancelQueries(['users'])</code> cancels in-flight requests for matching queries. This is crucial in optimistic updates to prevent race conditions where a refetch might overwrite your optimistic update. Returns a promise that resolves when cancellation completes.
        </p>
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
        <p className="text-gray-700 mb-4">
          For advanced cache operations, you can access the underlying <code className="bg-gray-100 px-1 rounded">QueryCache</code> and <code className="bg-gray-100 px-1 rounded">MutationCache</code> instances. These provide low-level access to all queries and mutations. <code className="bg-gray-100 px-1 rounded">getAll()</code> returns all entries, <code className="bg-gray-100 px-1 rounded">find()</code> finds a specific entry, <code className="bg-gray-100 px-1 rounded">findAll()</code> finds all matching entries, and <code className="bg-gray-100 px-1 rounded">subscribe()</code> allows you to listen to cache events. This is useful for debugging, monitoring, or implementing custom cache behaviors.
        </p>
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
        <p className="text-gray-700 mb-4">
          Query options control how queries behave, including caching, refetching, error handling, and data transformation. <code className="bg-gray-100 px-1 rounded">staleTime</code> determines how long data is considered fresh (no refetch needed), while <code className="bg-gray-100 px-1 rounded">gcTime</code> (garbage collection time) determines how long unused data stays in cache. <code className="bg-gray-100 px-1 rounded">enabled</code> can disable queries conditionally, <code className="bg-gray-100 px-1 rounded">retry</code> controls retry behavior, and <code className="bg-gray-100 px-1 rounded">refetchOnWindowFocus</code> enables automatic refetching when the window regains focus. The <code className="bg-gray-100 px-1 rounded">select</code> option transforms data and can reduce re-renders by only subscribing to specific data slices.
        </p>
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
        <p className="text-gray-700 mb-4">
          Mutation options control mutation behavior and provide lifecycle hooks. The <code className="bg-gray-100 px-1 rounded">mutationFn</code> is required and defines the mutation operation. Lifecycle callbacks include <code className="bg-gray-100 px-1 rounded">onMutate</code> (before mutation, for optimistic updates), <code className="bg-gray-100 px-1 rounded">onSuccess</code> (after successful mutation), <code className="bg-gray-100 px-1 rounded">onError</code> (on failure), and <code className="bg-gray-100 px-1 rounded">onSettled</code> (after completion regardless of outcome). The <code className="bg-gray-100 px-1 rounded">context</code> returned from <code className="bg-gray-100 px-1 rounded">onMutate</code> is available in error handlers for rollback operations. <code className="bg-gray-100 px-1 rounded">retry</code> and <code className="bg-gray-100 px-1 rounded">retryDelay</code> control retry behavior for failed mutations.
        </p>
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

