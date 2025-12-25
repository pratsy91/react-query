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

