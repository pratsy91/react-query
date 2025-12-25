import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ArchitecturePatternsPage() {
  return (
    <LessonLayout
      title="20.2 Architecture Patterns"
      description="Learn architecture patterns: feature-based organization, query/mutation organization, code splitting with queries, and micro-frontend integration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Architecture Patterns</h2>
        <p className="text-gray-700 mb-4">
          Good architecture patterns make React Query code maintainable, scalable, and easy to
          work with. Understanding these patterns helps you build better applications.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Architecture Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Feature-based organization</li>
            <li>Query/mutation organization</li>
            <li>Code splitting with queries</li>
            <li>Micro-frontend integration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Feature-Based Organization</h2>
        <p className="text-gray-700 mb-4">
          Organizing code by features keeps related queries, mutations, and components together.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Feature Structure</h3>
        <CodeBlock
          title="Feature-Based File Organization"
          code={`// Feature-based organization structure:

// features/
//   users/
//     api/
//       users.ts          // API functions
//     hooks/
//       useUsers.ts       // Query hooks
//       useUser.ts
//       useCreateUser.ts  // Mutation hooks
//       useUpdateUser.ts
//       useDeleteUser.ts
//     components/
//       UserList.tsx
//       UserForm.tsx
//     types/
//       user.ts           // TypeScript types
//     index.ts            // Public exports
//   posts/
//     api/
//       posts.ts
//     hooks/
//       usePosts.ts
//       usePost.ts
//       useCreatePost.ts
//     components/
//       PostList.tsx
//       PostForm.tsx
//     types/
//       post.ts
//     index.ts

// Example: features/users/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
}

// Example: features/users/hooks/useCreateUser.ts
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

// Example: features/users/index.ts
export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from './hooks';
export { UserList, UserForm } from './components';
export type { User } from './types';`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Key Factories</h3>
        <CodeBlock
          title="Feature-Specific Query Keys"
          code={`// features/users/queryKeys.ts
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
};

// Usage
function useUsers(filters?: string) {
  return useQuery({
    queryKey: userQueryKeys.list(filters),
    queryFn: () => usersApi.getAll(filters),
  });
}

function useUser(id: number) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => usersApi.getById(id),
  });
}

// Invalidation
function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query/Mutation Organization</h2>
        <p className="text-gray-700 mb-4">
          Organizing queries and mutations consistently makes code easier to find and maintain.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hooks Pattern</h3>
        <CodeBlock
          title="Organizing Custom Hooks"
          code={`// hooks/queries.ts - All query hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

// hooks/mutations.ts - All mutation hooks
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.update,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.id], data);
      queryClient.invalidateQueries(['users']);
    },
  });
}

// hooks/index.ts - Central export
export * from './queries';
export * from './mutations';`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">API Layer Organization</h3>
        <CodeBlock
          title="Organizing API Functions"
          code={`// api/users.ts - User API functions
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    return response.json();
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  },

  create: async (user: CreateUserDto): Promise<User> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  update: async (id: number, user: UpdateUserDto): Promise<User> => {
    const response = await fetch(\`/api/users/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(\`/api/users/\${id}\`, {
      method: 'DELETE',
    });
  },
};

// api/index.ts - Central export
export * from './users';
export * from './posts';
export * from './comments';`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Code Splitting with Queries</h2>
        <p className="text-gray-700 mb-4">
          Code splitting with queries allows you to load query code only when needed, improving
          initial bundle size.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Lazy Loading Queries</h3>
        <CodeBlock
          title="Code Splitting Query Hooks"
          code={`// Lazy load query hooks
import { lazy } from 'react';

// Main component
function App() {
  return (
    <Routes>
      <Route path="/users" element={<LazyUserPage />} />
      <Route path="/posts" element={<LazyPostPage />} />
    </Routes>
  );
}

// Lazy load components with queries
const LazyUserPage = lazy(() => import('./pages/UserPage'));
const LazyPostPage = lazy(() => import('./pages/PostPage'));

// pages/UserPage.tsx
// This file and its queries are only loaded when route is accessed
import { useUsers } from '../features/users';

export default function UserPage() {
  const { data: users } = useUsers();

  return <div>{users?.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}

// pages/PostPage.tsx
import { usePosts } from '../features/posts';

export default function PostPage() {
  const { data: posts } = usePosts();

  return <div>{posts?.map(p => <div key={p.id}>{p.title}</div>)}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Query Loading</h3>
        <CodeBlock
          title="Loading Queries Dynamically"
          code={`// Load query hooks dynamically
function DynamicQueryLoader({ feature }) {
  const [QueryComponent, setQueryComponent] = useState(null);

  useEffect(() => {
    // Dynamically import query hook
    import(\`./features/\${feature}/hooks\`)
      .then(module => {
        setQueryComponent(() => module[\`use\${feature}\`]);
      });
  }, [feature]);

  if (!QueryComponent) return <div>Loading...</div>;

  return <QueryComponent />;
}

// Prefetch queries for code-split routes
function usePrefetchRoute(route) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch query code and data
    Promise.all([
      import(\`./features/\${route}/hooks\`),
      queryClient.prefetchQuery({
        queryKey: [route],
        queryFn: () => fetch(\`/api/\${route}\`).then(r => r.json()),
      }),
    ]);
  }, [route, queryClient]);
}

// Usage in navigation
function Navigation() {
  const prefetchUsers = usePrefetchRoute('users');
  const prefetchPosts = usePrefetchRoute('posts');

  return (
    <nav>
      <Link to="/users" onMouseEnter={prefetchUsers}>Users</Link>
      <Link to="/posts" onMouseEnter={prefetchPosts}>Posts</Link>
    </nav>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Micro-Frontend Integration</h2>
        <p className="text-gray-700 mb-4">
          Integrating React Query in micro-frontend architectures requires careful consideration
          of query client sharing and isolation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Shared Query Client</h3>
        <CodeBlock
          title="Sharing Query Client Across Micro-Frontends"
          code={`// Shared QueryClient for all micro-frontends
// shared/queryClient.ts
export const sharedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

// Main app
function MainApp() {
  return (
    <QueryClientProvider client={sharedQueryClient}>
      <MicroFrontend1 />
      <MicroFrontend2 />
      <MicroFrontend3 />
    </QueryClientProvider>
  );
}

// Each micro-frontend uses shared client
function MicroFrontend1() {
  // Uses sharedQueryClient automatically
  const { data } = useQuery({
    queryKey: ['micro1', 'data'],
    queryFn: () => fetchMicro1Data(),
  });

  return <div>{data?.content}</div>;
}

// Benefits:
// - Shared cache across micro-frontends
// - Single source of truth
// - Better performance
// - Consistent data`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Isolated Query Clients</h3>
        <CodeBlock
          title="Isolated Query Clients for Micro-Frontends"
          code={`// Isolated QueryClient for each micro-frontend
// Each micro-frontend has its own client

// Micro-frontend 1
function MicroFrontend1() {
  const queryClient1 = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient1}>
      <MicroFrontend1Content />
    </QueryClientProvider>
  );
}

// Micro-frontend 2
function MicroFrontend2() {
  const queryClient2 = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient2}>
      <MicroFrontend2Content />
    </QueryClientProvider>
  );
}

// Benefits:
// - Complete isolation
// - Independent cache
// - No conflicts
// - Can unmount independently

// Hybrid approach: Shared + Isolated
function HybridMicroFrontend() {
  const sharedClient = useSharedQueryClient();
  const isolatedClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={sharedClient}>
      {/* Shared queries */}
      <SharedDataComponent />

      {/* Isolated queries */}
      <QueryClientProvider client={isolatedClient}>
        <IsolatedDataComponent />
      </QueryClientProvider>
    </QueryClientProvider>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Organize by features</strong> - Keep related code together</li>
            <li><strong>Use query key factories</strong> - Ensure consistency</li>
            <li><strong>Create custom hooks</strong> - Encapsulate query logic</li>
            <li><strong>Separate API layer</strong> - Keep API functions separate</li>
            <li><strong>Code split routes</strong> - Load queries on demand</li>
            <li><strong>Share query client wisely</strong> - Consider isolation needs</li>
            <li><strong>Export consistently</strong> - Use index files for exports</li>
            <li><strong>Document architecture</strong> - Make patterns clear</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">20.3 Best Practices Summary</strong>
          for code organization, naming conventions, documentation, and team collaboration.
        </p>
      </div>
    </LessonLayout>
  );
}

