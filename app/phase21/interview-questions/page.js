import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function InterviewQuestionsPage() {
  return (
    <LessonLayout
      title="21.2 Interview Questions & Answers"
      description="Common React Query interview questions with comprehensive answers"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query Interview Questions</h2>
        <p className="text-gray-700 mb-4">
          Comprehensive interview questions covering all aspects of React Query with detailed answers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Fundamentals</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q1: What is React Query and why use it?</h3>
        <p className="text-gray-700 mb-4">
          React Query (TanStack Query) is a powerful data-fetching library that solves common problems in React applications. It eliminates the need to manually manage loading states, error handling, caching, and data synchronization.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Key Problems It Solves:</strong> Without React Query, you'd need to manually manage: loading states with useState, error handling with try/catch, caching with useMemo or external libraries, refetching logic, request deduplication, and cache invalidation. React Query handles all of this automatically.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Automatic Caching:</strong> React Query automatically caches all query results using query keys as identifiers. The cache is intelligent—it knows when data is fresh (within staleTime) and when it's stale. It automatically refetches stale data in the background when components mount or when the window regains focus.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Request Deduplication:</strong> If multiple components request the same data simultaneously (same query key), React Query makes only one network request and shares the result. This prevents duplicate API calls and reduces server load.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Background Refetching:</strong> React Query keeps data fresh automatically. When you navigate away and come back, it refetches in the background. When the window regains focus, it refetches stale data. This ensures users always see up-to-date information without manual intervention.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Optimistic Updates:</strong> React Query makes it easy to update the UI optimistically—showing changes immediately before the server responds. If the mutation fails, it can automatically rollback. This creates a snappy, responsive user experience.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Built-in States:</strong> React Query provides comprehensive state flags: <code className="bg-gray-100 px-1 rounded">isLoading</code>, <code className="bg-gray-100 px-1 rounded">isFetching</code>, <code className="bg-gray-100 px-1 rounded">isError</code>, <code className="bg-gray-100 px-1 rounded">isSuccess</code>, and more. No need to manually track these states.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Developer Experience:</strong> React Query significantly reduces boilerplate code. A simple query that would require 20+ lines of state management code becomes just a few lines. The DevTools provide excellent debugging capabilities, showing cache contents, query states, and network activity.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Real-World Benefits:</strong> In the example, a single <code className="bg-gray-100 px-1 rounded">useQuery</code> call automatically handles: fetching data, caching it, showing loading states, handling errors, retrying on failure, refetching on window focus, and deduplicating requests. This would require multiple useState hooks, useEffect hooks, error boundaries, and manual cache management without React Query.
        </p>
        <CodeBlock
          title="Answer"
          code={`// React Query (TanStack Query) is a data-fetching library for React

// Key benefits:
// 1. Automatic caching - Data is cached automatically
// 2. Background updates - Keeps data fresh automatically
// 3. Request deduplication - Same query runs once
// 4. Optimistic updates - Update UI before server response
// 5. Error handling - Built-in error states and retry logic
// 6. Loading states - Built-in loading indicators
// 7. DevTools - Excellent debugging tools
// 8. TypeScript support - Full TypeScript support

// Example:
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
// Automatically handles caching, loading, errors, refetching`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q2: What's the difference between isLoading and isFetching?</h3>
        <p className="text-gray-700 mb-4">
          Understanding the difference between <code className="bg-gray-100 px-1 rounded">isLoading</code> and <code className="bg-gray-100 px-1 rounded">isFetching</code> is crucial for proper UI feedback and user experience. These two flags serve different purposes and should be used in different scenarios.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>isLoading explained:</strong> <code className="bg-gray-100 px-1 rounded">isLoading</code> is <code className="bg-gray-100 px-1 rounded">true</code> only during the initial load when there's no cached data available. It represents the "first-time loading" state. Once data exists in cache (even if stale), <code className="bg-gray-100 px-1 rounded">isLoading</code> becomes <code className="bg-gray-100 px-1 rounded">false</code> immediately, even if the query is refetching in the background. This is because React Query shows cached data immediately while refetching happens in the background.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>isFetching explained:</strong> <code className="bg-gray-100 px-1 rounded">isFetching</code> is <code className="bg-gray-100 px-1 rounded">true</code> whenever any fetch is in progress, including: initial loads (when there's no cache), refetches (when data is stale), background refetches (on window focus), manual refetches (via <code className="bg-gray-100 px-1 rounded">refetch()</code>), and polling (when <code className="bg-gray-100 px-1 rounded">refetchInterval</code> is set). It represents the "network activity" state.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Practical scenarios:</strong> In Scenario 1 (first load with no cache), both <code className="bg-gray-100 px-1 rounded">isLoading</code> and <code className="bg-gray-100 px-1 rounded">isFetching</code> are <code className="bg-gray-100 px-1 rounded">true</code>—show a full loading spinner. In Scenario 2 (refetch with cached data), <code className="bg-gray-100 px-1 rounded">isLoading</code> is <code className="bg-gray-100 px-1 rounded">false</code> (data is shown from cache) but <code className="bg-gray-100 px-1 rounded">isFetching</code> is <code className="bg-gray-100 px-1 rounded">true</code> (refetching in background)—show a subtle indicator like a small spinner or "Updating..." text. In Scenario 3 (data loaded, no fetch), both are <code className="bg-gray-100 px-1 rounded">false</code>—show the data normally.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>When to use each:</strong> Use <code className="bg-gray-100 px-1 rounded">isLoading</code> for initial loading UI (full-page spinners, skeleton screens, disabling the entire UI). Use <code className="bg-gray-100 px-1 rounded">isFetching</code> for background update indicators (small spinners, "Syncing..." badges, subtle loading states that don't block the UI). This creates a better UX where users see data immediately from cache while fresh data loads in the background.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Code example breakdown:</strong> The example shows how both flags behave in different scenarios. When <code className="bg-gray-100 px-1 rounded">isLoading</code> is true, you typically show a full loading state. When only <code className="bg-gray-100 px-1 rounded">isFetching</code> is true (and <code className="bg-gray-100 px-1 rounded">isLoading</code> is false), you show the cached data with a subtle indicator that fresh data is being fetched.
        </p>
        <CodeBlock
          title="Answer"
          code={`// isLoading: true only on initial load (no cached data)
// isFetching: true whenever a fetch is happening (including refetches)

const { data, isLoading, isFetching } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Scenario 1: First load
// isLoading: true, isFetching: true

// Scenario 2: Refetch with cached data
// isLoading: false, isFetching: true

// Scenario 3: Data loaded, no fetch
// isLoading: false, isFetching: false

// Use isLoading for initial loading UI (spinner)
// Use isFetching for background updates (subtle indicator)`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q3: Explain staleTime and gcTime (cacheTime)</h3>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">staleTime</code> and <code className="bg-gray-100 px-1 rounded">gcTime</code> (formerly <code className="bg-gray-100 px-1 rounded">cacheTime</code>) control different aspects of caching. <code className="bg-gray-100 px-1 rounded">staleTime</code> determines how long data is considered "fresh"—during this time, React Query won't refetch the data automatically. After <code className="bg-gray-100 px-1 rounded">staleTime</code> expires, data becomes "stale" but remains in cache. <code className="bg-gray-100 px-1 rounded">gcTime</code> determines how long unused (inactive) data stays in cache before being garbage collected. Setting <code className="bg-gray-100 px-1 rounded">staleTime: 0</code> means data is immediately stale (good for real-time data), while <code className="bg-gray-100 px-1 rounded">staleTime: Infinity</code> means data never becomes stale (good for static data).
        </p>
        <CodeBlock
          title="Answer"
          code={`// staleTime: How long data is considered fresh
// gcTime (cacheTime): How long unused data stays in cache

const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 5,  // 5 minutes - data is fresh for 5min
  gcTime: 1000 * 60 * 30,    // 30 minutes - keep in cache 30min
});

// staleTime = 5min:
// - Data fetched at 10:00 is fresh until 10:05
// - No refetch needed during this time
// - After 10:05, data is stale (but still in cache)

// gcTime = 30min:
// - If query is unused for 30min, it's removed from cache
// - Next time it's needed, it will fetch fresh data

// Common patterns:
// - Real-time data: staleTime: 0
// - Static data: staleTime: Infinity
// - User data: staleTime: 5min, gcTime: 30min`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Queries</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q4: How do you handle dependent queries?</h3>
        <p className="text-gray-700 mb-4">
          Dependent queries are queries that need data from another query before they can execute. The <code className="bg-gray-100 px-1 rounded">enabled</code> option is the key to implementing dependent queries. Set <code className="bg-gray-100 px-1 rounded">enabled: false</code> initially, then set it to <code className="bg-gray-100 px-1 rounded">true</code> when the dependency is available. You can use boolean expressions like <code className="bg-gray-100 px-1 rounded">enabled: !!user</code> to automatically enable the query when the user data exists. For multiple dependencies, chain them with logical operators like <code className="bg-gray-100 px-1 rounded">enabled: !!user && !!posts</code>. This pattern ensures queries execute in the correct order and prevents unnecessary API calls.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use 'enabled' option to make queries dependent

function UserProfile({ userId }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent query - only runs when user is loaded
  const { data: posts } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user,  // Only fetch when user exists
  });

  // Multiple dependencies
  const { data: comments } = useQuery({
    queryKey: ['user', userId, 'posts', posts?.id, 'comments'],
    queryFn: () => fetchComments(posts.id),
    enabled: !!user && !!posts,  // Wait for both
  });

  return <div>{/* ... */}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q5: How do you implement infinite scrolling?</h3>
        <p className="text-gray-700 mb-4">
          Infinite scrolling is implemented using <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code>, which manages paginated data across multiple pages. The hook requires <code className="bg-gray-100 px-1 rounded">initialPageParam</code> (the starting page parameter) and <code className="bg-gray-100 px-1 rounded">getNextPageParam</code> (a function that extracts the next page parameter from the last page's response). Data is stored in <code className="bg-gray-100 px-1 rounded">data.pages</code> (array of page results) and can be flattened with <code className="bg-gray-100 px-1 rounded">data.pages.flatMap()</code>. Call <code className="bg-gray-100 px-1 rounded">fetchNextPage()</code> when the user scrolls near the bottom, and use <code className="bg-gray-100 px-1 rounded">hasNextPage</code> to determine if more data is available.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use useInfiniteQuery for pagination

function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
  });

  // Flatten pages
  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q6: How do you prefetch data?</h3>
        <p className="text-gray-700 mb-4">
          Prefetching improves perceived performance by loading data before it's needed. Use <code className="bg-gray-100 px-1 rounded">queryClient.prefetchQuery()</code> to fetch and cache data in the background. Common prefetching strategies include prefetching on hover (when user hovers over a link), prefetching on route change (using <code className="bg-gray-100 px-1 rounded">useEffect</code> with route dependencies), or prefetching related data after a mutation. Prefetching with an appropriate <code className="bg-gray-100 px-1 rounded">staleTime</code> ensures the data stays fresh when the user navigates to the page. This creates a seamless user experience where data appears instantly.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use prefetchQuery for prefetching

function UserList() {
  const queryClient = useQueryClient();

  // Prefetch on hover
  const handleUserHover = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60 * 5,  // Keep fresh for 5min
    });
  };

  // Prefetch on route change
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });
  }, [queryClient]);

  return (
    <div>
      {users.map(user => (
        <Link
          key={user.id}
          to={\`/users/\${user.id}\`}
          onMouseEnter={() => handleUserHover(user.id)}
        >
          {user.name}
        </Link>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutations</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q7: How do you implement optimistic updates?</h3>
        <p className="text-gray-700 mb-4">
          Optimistic updates provide instant UI feedback by updating the cache before the server responds. The pattern involves three steps: cancel outgoing refetches to prevent race conditions, snapshot the previous data for rollback, and optimistically update the cache. Use <code className="bg-gray-100 px-1 rounded">onMutate</code> to perform the optimistic update and return a context object with the previous data. In <code className="bg-gray-100 px-1 rounded">onError</code>, use the context to rollback the optimistic update if the mutation fails. Finally, use <code className="bg-gray-100 px-1 rounded">onSettled</code> to refetch and ensure data consistency. This pattern makes the UI feel instant and responsive.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use onMutate for optimistic updates

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['user', newUser.id]);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', newUser.id]);

      // Optimistically update
      queryClient.setQueryData(['user', newUser.id], newUser);

      // Return context for rollback
      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['user', newUser.id], context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['user', variables.id]);
    },
  });
}

// Usage
const updateUser = useUpdateUser();
updateUser.mutate({ id: 1, name: 'New Name' });`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q8: How do you invalidate queries after mutation?</h3>
        <p className="text-gray-700 mb-4">
          After mutations, you need to update the cache to reflect server changes. There are several strategies: <code className="bg-gray-100 px-1 rounded">invalidateQueries()</code> marks queries as stale and triggers refetches for active queries, <code className="bg-gray-100 px-1 rounded">setQueryData()</code> directly updates the cache with new data (useful when you have the updated data from the mutation response), or a combination of both. Use <code className="bg-gray-100 px-1 rounded">onSuccess</code> or <code className="bg-gray-100 px-1 rounded">onSettled</code> callbacks to trigger invalidation. <code className="bg-gray-100 px-1 rounded">onSettled</code> runs regardless of success/failure, making it ideal for ensuring data consistency. You can invalidate specific queries, all queries matching a pattern, or use predicates for custom matching logic.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use onSuccess or onSettled to invalidate

function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Option 1: Invalidate list
      queryClient.invalidateQueries(['posts']);

      // Option 2: Update cache directly
      queryClient.setQueryData(['posts'], (old) => [data, ...old]);

      // Option 3: Invalidate specific query
      queryClient.invalidateQueries(['post', data.id]);

      // Option 4: Invalidate with predicate
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'posts',
      });
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries(['posts']);
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q9: How do you handle race conditions?</h3>
        <p className="text-gray-700 mb-4">
          React Query automatically handles race conditions for queries by canceling previous requests when the query key changes. However, for mutations, you may need additional strategies. React Query provides an <code className="bg-gray-100 px-1 rounded">AbortSignal</code> to each query function, which you can pass to fetch requests to cancel them. For mutations, use version numbers or timestamps to ensure only the latest mutation result is applied. The <code className="bg-gray-100 px-1 rounded">cancelQueries()</code> method can also be used to cancel in-flight queries. React Query's automatic request deduplication and cancellation prevent most race conditions, but understanding these mechanisms helps in edge cases.
        </p>
        <CodeBlock
          title="Answer"
          code={`// React Query handles race conditions automatically
// But you can also use AbortController

function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        signal,  // React Query provides AbortSignal
      });
      return response.json();
    },
  });
}

// React Query automatically:
// - Cancels previous requests when query key changes
// - Only uses the latest request result
// - Prevents race conditions

// For mutations, use version numbers:
function useUpdateUser() {
  const versionRef = useRef(0);

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables, context) => {
      const version = ++versionRef.current;
      // Only update if this is the latest version
      if (version === versionRef.current) {
        queryClient.setQueryData(['user', data.id], data);
      }
    },
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q10: How do you test React Query hooks?</h3>
        <p className="text-gray-700 mb-4">
          Testing React Query hooks requires wrapping components in a <code className="bg-gray-100 px-1 rounded">QueryClientProvider</code> with a test QueryClient. Create a test QueryClient with <code className="bg-gray-100 px-1 rounded">retry: false</code> to fail fast in tests. Use <code className="bg-gray-100 px-1 rounded">renderHook</code> from <code className="bg-gray-100 px-1 rounded">@testing-library/react</code> to test hooks in isolation. Mock API calls using <code className="bg-gray-100 px-1 rounded">jest.spyOn</code> or fetch mocking libraries. Use <code className="bg-gray-100 px-1 rounded">waitFor</code> to wait for async operations to complete. Test loading states, success states, error states, and side effects like cache updates. For integration tests, use tools like MSW (Mock Service Worker) to mock API responses.
        </p>
        <CodeBlock
          title="Answer"
          code={`// Use @testing-library/react-hooks and createTestQueryClient

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapper({ children }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

test('fetches user data', async () => {
  const { result } = renderHook(() => useUser(1), { wrapper });

  expect(result.current.isLoading).toBe(true);

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual({ id: 1, name: 'John' });
});

// Mock API
test('handles error', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

  const { result } = renderHook(() => useUser(1), { wrapper });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error.message).toBe('Network error');
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Q11: How do you optimize React Query performance?</h3>
        <p className="text-gray-700 mb-4">
          React Query performance optimization involves several strategies. Use <code className="bg-gray-100 px-1 rounded">select</code> to transform data and subscribe only to specific data slices, reducing re-renders when unrelated data changes. Set appropriate <code className="bg-gray-100 px-1 rounded">staleTime</code> values to reduce unnecessary refetches. Use pagination with <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code> instead of fetching all data at once. Debounce search queries to reduce API calls. Prefetch related data to improve perceived performance. React Query's structural sharing (enabled by default) prevents unnecessary re-renders when data structure is the same. Limit cache size and use code splitting to load queries on demand. These optimizations reduce network requests, improve rendering performance, and enhance user experience.
        </p>
        <CodeBlock
          title="Answer"
          code={`// 1. Use select to transform data
const { data: userNames } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (users) => users.map(u => u.name),  // Only subscribe to names
});

// 2. Set appropriate staleTime
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 5,  // Reduce refetches
});

// 3. Use pagination for large datasets
const { data } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts({ page: pageParam, limit: 20 }),
});

// 4. Debounce search queries
const debouncedSearch = useDebounce(search, 300);
const { data } = useQuery({
  queryKey: ['search', debouncedSearch],
  queryFn: () => search(debouncedSearch),
});

// 5. Prefetch related data
queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// 6. Use structural sharing (default)
// Prevents unnecessary re-renders when data structure is the same`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Review <strong className="ml-1">21.3 Common Patterns & Solutions</strong>
          for ready-to-use code patterns and solutions.
        </p>
      </div>
    </LessonLayout>
  );
}

