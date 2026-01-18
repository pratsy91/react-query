import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CommonPatternsPage() {
  return (
    <LessonLayout
      title="21.3 Common Patterns & Solutions"
      description="Ready-to-use React Query patterns and solutions for common scenarios"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Patterns & Solutions</h2>
        <p className="text-gray-700 mb-4">
          Ready-to-use patterns and solutions for common React Query scenarios. Copy and adapt these
          patterns for your use cases.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">CRUD Operations</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete CRUD Pattern</h3>
        <p className="text-gray-700 mb-4">
          This pattern demonstrates a complete CRUD (Create, Read, Update, Delete) implementation using React Query. Each operation is encapsulated in a custom hook, providing a clean, reusable API for data operations.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Read Operations (Queries):</strong> <code className="bg-gray-100 px-1 rounded">useUsers()</code> fetches all users with query key <code className="bg-gray-100 px-1 rounded">['users']</code>. <code className="bg-gray-100 px-1 rounded">useUser(id)</code> fetches a single user with query key <code className="bg-gray-100 px-1 rounded">['user', id]</code>. The <code className="bg-gray-100 px-1 rounded">enabled: !!id</code> option prevents the query from running when <code className="bg-gray-100 px-1 rounded">id</code> is undefined or null—this is essential to avoid unnecessary API calls and errors.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Create Operation:</strong> <code className="bg-gray-100 px-1 rounded">useCreateUser()</code> uses <code className="bg-gray-100 px-1 rounded">useMutation</code> with a POST request. The <code className="bg-gray-100 px-1 rounded">mutationFn</code> sends the new user data to the API. In <code className="bg-gray-100 px-1 rounded">onSuccess</code>, <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> marks the users list as stale, triggering a refetch. This ensures the new user appears in the list immediately. You could also use <code className="bg-gray-100 px-1 rounded">setQueryData</code> to optimistically add the user to the cache.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Update Operation:</strong> <code className="bg-gray-100 px-1 rounded">useUpdateUser()</code> uses PUT/PATCH to update a user. The <code className="bg-gray-100 px-1 rounded">mutationFn</code> receives <code className="bg-gray-100 px-1 rounded">{`{ id, ...data }`}</code> (destructured to separate ID from update data). In <code className="bg-gray-100 px-1 rounded">onSuccess</code>, it does two things: <code className="bg-gray-100 px-1 rounded">setQueryData(['user', data.id], data)</code> directly updates the individual user cache with the server response (immediate update), and <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> refetches the list to ensure consistency. This dual approach provides instant UI updates while ensuring data consistency.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Delete Operation:</strong> <code className="bg-gray-100 px-1 rounded">useDeleteUser()</code> sends a DELETE request. The <code className="bg-gray-100 px-1 rounded">mutationFn</code> receives just the <code className="bg-gray-100 px-1 rounded">id</code>. In <code className="bg-gray-100 px-1 rounded">onSuccess</code>, it does two things: <code className="bg-gray-100 px-1 rounded">removeQueries(['user', id])</code> removes the individual user from cache (since it no longer exists), and <code className="bg-gray-100 px-1 rounded">invalidateQueries(['users'])</code> refetches the list to remove the deleted user. Using <code className="bg-gray-100 px-1 rounded">removeQueries</code> is important here because the user no longer exists—keeping it in cache would be incorrect.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Query Key Strategy:</strong> The hierarchical query keys (<code className="bg-gray-100 px-1 rounded">['users']</code> for list, <code className="bg-gray-100 px-1 rounded">['user', id]</code> for individual) allow granular cache management. Invalidating <code className="bg-gray-100 px-1 rounded">['users']</code> doesn't affect individual user queries, but you can invalidate both if needed. This pattern scales well for complex data relationships.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Best Practices:</strong> Always invalidate list queries after mutations to ensure consistency. Use <code className="bg-gray-100 px-1 rounded">setQueryData</code> for immediate updates when you have the server response. Use <code className="bg-gray-100 px-1 rounded">removeQueries</code> for delete operations. Use <code className="bg-gray-100 px-1 rounded">enabled</code> to prevent queries from running with invalid parameters. Encapsulate each operation in a custom hook for reusability and testability.
        </p>
        <CodeBlock
          title="Full CRUD Implementation"
          code={`// hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(\`/api/users/\${id}\`).then(r => r.json()),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) => fetch(\`/api/users/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.id], data);
      queryClient.invalidateQueries(['users']);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => fetch(\`/api/users/\${id}\`, {
      method: 'DELETE',
    }),
    onSuccess: (_, id) => {
      queryClient.removeQueries(['user', id]);
      queryClient.invalidateQueries(['users']);
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Search & Filtering</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Debounced Search</h3>
        <p className="text-gray-700 mb-4">
          Debouncing search queries prevents excessive API calls while the user is typing. The <code className="bg-gray-100 px-1 rounded">useDebounce</code> hook delays updating the debounced value until the user stops typing for a specified delay (e.g., 300ms). The search query uses the debounced value in its query key, so React Query only executes the query when the debounced value changes. The <code className="bg-gray-100 px-1 rounded">enabled</code> option ensures the query only runs when there's actual search text. This pattern significantly reduces API calls and improves performance, especially for expensive search operations.
        </p>
        <CodeBlock
          title="Search with Debouncing"
          code={`// hooks/useDebounce.ts
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useSearch.ts
export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetch(\`/api/search?q=\${debouncedQuery}\`).then(r => r.json()),
    enabled: debouncedQuery.length > 0,
  });
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('');
  const { data: results, isLoading } = useSearch(search);

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {isLoading && <div>Searching...</div>}
      {results?.map(result => <div key={result.id}>{result.title}</div>)}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filtered Queries</h3>
        <p className="text-gray-700 mb-4">
          Filtering can be implemented in two ways: server-side filtering (filters passed to the API) or client-side filtering (filtering cached data). For server-side filtering, include filters in the query key so React Query treats different filter combinations as separate queries. For client-side filtering, fetch all data once and use the <code className="bg-gray-100 px-1 rounded">select</code> option to filter and transform the data. Client-side filtering is faster for small datasets but requires fetching all data. Server-side filtering is better for large datasets but requires API support. The query key must include all filter parameters to ensure proper caching and invalidation.
        </p>
        <CodeBlock
          title="Filtering Pattern"
          code={`// hooks/useFilteredPosts.ts
export function useFilteredPosts(filters: { status?: string; category?: string }) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => fetch(\`/api/posts?\${new URLSearchParams(filters)}\`).then(r => r.json()),
  });
}

// Or client-side filtering
export function useFilteredPosts(filters) {
  const { data: allPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  return useQuery({
    queryKey: ['posts', 'filtered', filters],
    queryFn: () => allPosts,
    enabled: !!allPosts,
    select: (data) => {
      return data
        .filter(post => {
          if (filters.status && post.status !== filters.status) return false;
          if (filters.category && post.category !== filters.category) return false;
          return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Optimistic Updates</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Optimistic Update Pattern</h3>
        <p className="text-gray-700 mb-4">
          Optimistic updates provide instant UI feedback by updating the cache before the server responds. The pattern involves three key steps: canceling outgoing refetches with <code className="bg-gray-100 px-1 rounded">cancelQueries()</code> to prevent race conditions, snapshotting the previous data for potential rollback, and optimistically updating the cache with <code className="bg-gray-100 px-1 rounded">setQueryData()</code>. The <code className="bg-gray-100 px-1 rounded">onMutate</code> callback performs the optimistic update and returns a context object. If the mutation fails, <code className="bg-gray-100 px-1 rounded">onError</code> uses the context to rollback. Finally, <code className="bg-gray-100 px-1 rounded">onSettled</code> refetches to ensure data consistency. This pattern makes the UI feel instant and responsive.
        </p>
        <CodeBlock
          title="Complete Optimistic Update"
          code={`export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }) => 
      fetch(\`/api/todos/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      }).then(r => r.json()),
    
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['todos']);

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );

      return { previousTodos };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['todos']);
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dependent Queries</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cascading Queries</h3>
        <p className="text-gray-700 mb-4">
          Cascading queries execute in sequence, where each query depends on the previous one's data. Use the <code className="bg-gray-100 px-1 rounded">enabled</code> option to control when each query executes. The first query runs immediately, and subsequent queries wait for their dependencies. In this example, the user query runs first, then posts query runs when user exists, and finally comments query runs when both user and posts exist. This pattern ensures queries execute in the correct order and prevents unnecessary API calls. The combined loading state checks if any query is still loading.
        </p>
        <CodeBlock
          title="Dependent Query Pattern"
          code={`export function useUserProfile(userId: number) {
  // First query
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent query - waits for user
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user,  // Only fetch when user exists
  });

  // Another dependent query
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['user', userId, 'comments'],
    queryFn: () => fetchUserComments(userId),
    enabled: !!user && !!posts,  // Wait for both
  });

  return {
    user,
    posts,
    comments,
    isLoading: isUserLoading || isPostsLoading || isCommentsLoading,
  };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Parallel Queries</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Queries</h3>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useQueries</code> allows you to execute multiple queries in parallel, which is perfect for dashboards that need multiple data sources. Each query in the array runs independently and has its own loading, error, and success states. You can aggregate the results and create combined loading/error states. For dynamic queries (like fetching multiple users by IDs), map over the array of IDs to create query configurations. This pattern is more efficient than using multiple <code className="bg-gray-100 px-1 rounded">useQuery</code> hooks because React Query can optimize the parallel execution.
        </p>
        <CodeBlock
          title="Parallel Queries Pattern"
          code={`export function useDashboardData() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['stats', 'users'],
        queryFn: () => fetch('/api/stats/users').then(r => r.json()),
      },
      {
        queryKey: ['stats', 'orders'],
        queryFn: () => fetch('/api/stats/orders').then(r => r.json()),
      },
      {
        queryKey: ['stats', 'revenue'],
        queryFn: () => fetch('/api/stats/revenue').then(r => r.json()),
      },
    ],
  });

  const [users, orders, revenue] = results;

  return {
    users: users.data,
    orders: orders.data,
    revenue: revenue.data,
    isLoading: results.some(r => r.isLoading),
    isError: results.some(r => r.isError),
  };
}

// Or with dynamic queries
export function useMultipleUsers(userIds: number[]) {
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  return {
    users: results.map(r => r.data).filter(Boolean),
    isLoading: results.some(r => r.isLoading),
  };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Key Factories</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Type-Safe Query Keys</h3>
        <p className="text-gray-700 mb-4">
          Query key factories provide a centralized, type-safe way to manage query keys. This pattern prevents typos, ensures consistency, and makes refactoring easier. The factory uses a hierarchical structure where each level builds on the previous one. For example, <code className="bg-gray-100 px-1 rounded">users.detail(id)</code> creates <code className="bg-gray-100 px-1 rounded">['users', 'detail', id]</code>. This structure makes invalidation easier—invalidating <code className="bg-gray-100 px-1 rounded">users.all</code> invalidates all user-related queries. The <code className="bg-gray-100 px-1 rounded">as const</code> assertion ensures TypeScript infers literal types, providing better type safety and autocomplete.
        </p>
        <CodeBlock
          title="Query Key Factory Pattern"
          code={`// utils/queryKeys.ts
export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  
  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: { status?: string }) => 
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
    comments: (id: number) => [...queryKeys.posts.detail(id), 'comments'] as const,
  },
};

// Usage
const { data } = useQuery({
  queryKey: queryKeys.users.detail(1),
  queryFn: () => fetchUser(1),
});

// Invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Boundary Pattern</h3>
        <p className="text-gray-700 mb-4">
          React Query provides two approaches to error handling: error boundaries and manual error handling. Setting <code className="bg-gray-100 px-1 rounded">useErrorBoundary: true</code> makes the query throw errors to the nearest error boundary, which is useful for critical errors that should stop rendering. For manual error handling, check <code className="bg-gray-100 px-1 rounded">isError</code> and render error UI. The <code className="bg-gray-100 px-1 rounded">retry</code> option can be a function that receives the error and failure count, allowing custom retry logic (e.g., don't retry on 404 errors). This pattern gives you fine-grained control over error handling and user experience.
        </p>
        <CodeBlock
          title="Error Handling with Boundaries"
          code={`// Component with error boundary
function UserProfile({ userId }) {
  const { data: user, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    useErrorBoundary: true,  // Throw to error boundary
    retry: 3,
  });

  // This won't run if error is thrown
  return <div>{user.name}</div>;
}

// Or handle errors manually
function UserProfile({ userId }) {
  const { data: user, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error.status === 404) return false;
      return failureCount < 3;
    },
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{user?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prefetching</h2>
        
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Prefetch on Hover</h3>
        <p className="text-gray-700 mb-4">
          Prefetching on hover improves perceived performance by loading data before the user clicks. When the user hovers over a link, <code className="bg-gray-100 px-1 rounded">prefetchQuery()</code> fetches the data in the background and caches it. When the user clicks, the data is already available, making navigation feel instant. Setting an appropriate <code className="bg-gray-100 px-1 rounded">staleTime</code> ensures the prefetched data stays fresh. You can also prefetch on route changes using <code className="bg-gray-100 px-1 rounded">useEffect</code> with route dependencies. This pattern significantly improves user experience, especially on slower networks.
        </p>
        <CodeBlock
          title="Prefetching Pattern"
          code={`function UserList() {
  const queryClient = useQueryClient();

  const handleUserHover = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60 * 5,
    });
  };

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
}

// Prefetch on route change
function usePrefetchRoute(route: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [route],
      queryFn: () => fetch(\`/api/\${route}\`).then(r => r.json()),
    });
  }, [route, queryClient]);
}`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Review <strong className="ml-1">21.4 Quick Reference Guide</strong>
          for a complete quick reference of all React Query concepts.
        </p>
      </div>
    </LessonLayout>
  );
}

