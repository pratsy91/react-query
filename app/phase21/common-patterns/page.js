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

