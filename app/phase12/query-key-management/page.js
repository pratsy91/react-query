import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryKeyManagementPage() {
  return (
    <LessonLayout
      title="12.2 Query Key Management"
      description="Learn query key management: factories, hierarchical keys, dynamic key generation, and key normalization"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Key Management</h2>
        <p className="text-gray-700 mb-4">
          Proper query key management is crucial for React Query. Well-organized keys make
          invalidation, caching, and debugging much easier.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Management Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Query key factories</li>
            <li>Hierarchical keys</li>
            <li>Dynamic key generation</li>
            <li>Key normalization</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Key Factories</h2>
        <p className="text-gray-700 mb-4">
          Query key factories provide a centralized, type-safe way to generate query keys
          consistently across your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Factory Pattern</h3>
        <CodeBlock
          title="Simple Query Key Factory"
          code={`// Basic query key factory
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { data } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });

  return <div>{data?.name}</div>;
}

// Easy invalidation
queryClient.invalidateQueries({ queryKey: userKeys.all }); // All users
queryClient.invalidateQueries({ queryKey: userKeys.lists() }); // All lists`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Factory Pattern</h3>
        <CodeBlock
          title="Comprehensive Query Key Factory"
          code={`// Comprehensive factory for multiple entities
const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => 
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => 
      [...queryKeys.users.details(), id] as const,
    posts: (id: number) => 
      [...queryKeys.users.detail(id), 'posts'] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: PostFilters) => 
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => 
      [...queryKeys.posts.details(), id] as const,
    comments: (id: number) => 
      [...queryKeys.posts.detail(id), 'comments'] as const,
  },
} as const;

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
});

useQuery({
  queryKey: queryKeys.users.posts(userId),
  queryFn: () => fetchUserPosts(userId),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Hierarchical Keys</h2>
        <p className="text-gray-700 mb-4">
          Hierarchical keys allow you to invalidate related queries efficiently by using
          key prefixes and relationships.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Key Hierarchy Structure</h3>
        <CodeBlock
          title="Hierarchical Key Structure"
          code={`// Hierarchical key structure
// ['users'] - All user-related queries
// ['users', 'list'] - All user lists
// ['users', 'list', { filters }] - Specific user list
// ['users', 'detail'] - All user details
// ['users', 'detail', id] - Specific user
// ['users', 'detail', id, 'posts'] - User's posts

const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  posts: (id: number) => [...userKeys.detail(id), 'posts'] as const,
};

// Invalidation examples
// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: userKeys.all });

// Invalidate all user lists
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// Invalidate specific user and related queries
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
// This also invalidates: ['users', 'detail', userId, 'posts']`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Nested Relationships</h3>
        <CodeBlock
          title="Nested Key Relationships"
          code={`// Keys for nested relationships
const queryKeys = {
  users: {
    all: ['users'] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
    posts: (userId: number) => 
      [...queryKeys.users.detail(userId), 'posts'] as const,
    post: (userId: number, postId: number) => 
      [...queryKeys.users.posts(userId), postId] as const,
    postComments: (userId: number, postId: number) => 
      [...queryKeys.users.post(userId, postId), 'comments'] as const,
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.postComments(userId, postId),
  queryFn: () => fetchPostComments(userId, postId),
});

// Invalidation cascades
// Invalidate user -> invalidates all user posts -> invalidates all comments
queryClient.invalidateQueries({ 
  queryKey: queryKeys.users.detail(userId) 
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dynamic Key Generation</h2>
        <p className="text-gray-700 mb-4">
          Generate query keys dynamically based on runtime values while maintaining type safety
          and consistency.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Parameters</h3>
        <CodeBlock
          title="Keys with Dynamic Parameters"
          code={`// Dynamic key generation
function useUserPosts(userId: number, filters: PostFilters) {
  return useQuery({
    queryKey: ['users', userId, 'posts', filters],
    queryFn: () => fetchUserPosts(userId, filters),
  });
}

// With factory
const userKeys = {
  posts: (userId: number, filters: PostFilters) => 
    ['users', userId, 'posts', filters] as const,
};

// Usage
function PostsList({ userId }: { userId: number }) {
  const [filters, setFilters] = useState({ status: 'published' });
  
  const { data: posts } = useQuery({
    queryKey: userKeys.posts(userId, filters),
    queryFn: () => fetchUserPosts(userId, filters),
  });

  return <div>{posts?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Key Generation</h3>
        <CodeBlock
          title="Conditional Query Keys"
          code={`// Conditional key generation
function useSearchResults(query: string, filters: SearchFilters) {
  return useQuery({
    queryKey: [
      'search',
      query,
      filters.type,
      filters.sort,
      filters.dateRange,
    ],
    queryFn: () => search(query, filters),
    enabled: query.length > 0, // Only search if query exists
  });
}

// With factory
const searchKeys = {
  all: ['search'] as const,
  query: (query: string, filters: SearchFilters) => 
    [
      ...searchKeys.all,
      query,
      filters.type,
      filters.sort,
    ] as const,
};

// Usage
function SearchResults({ searchQuery }: { searchQuery: string }) {
  const filters = { type: 'all', sort: 'relevance' };
  
  const { data: results } = useQuery({
    queryKey: searchKeys.query(searchQuery, filters),
    queryFn: () => search(searchQuery, filters),
    enabled: searchQuery.length > 0,
  });

  return <div>{results?.map(result => <div key={result.id}>{result.title}</div>)}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Key Normalization</h2>
        <p className="text-gray-700 mb-4">
          Normalize query keys to ensure consistent key generation, especially when dealing
          with objects and complex parameters.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Object Key Normalization</h3>
        <CodeBlock
          title="Normalizing Object Keys"
          code={`// Problem: Objects create different keys even with same values
const filters1 = { status: 'published', sort: 'date' };
const filters2 = { status: 'published', sort: 'date' };

// These create different keys (different object references)
['posts', filters1] !== ['posts', filters2]

// Solution: Normalize objects
function normalizeFilters(filters: PostFilters): string {
  return JSON.stringify(
    Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        acc[key] = filters[key];
        return acc;
      }, {} as Record<string, any>)
  );
}

// Usage
function usePosts(filters: PostFilters) {
  return useQuery({
    queryKey: ['posts', normalizeFilters(filters)],
    queryFn: () => fetchPosts(filters),
  });
}

// Now filters with same values create same key`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Stable Key Generation</h3>
        <CodeBlock
          title="Creating Stable Keys"
          code={`// Stable key generation function
function createStableKey(parts: unknown[]): readonly unknown[] {
  return parts.map(part => {
    if (typeof part === 'object' && part !== null) {
      // Normalize objects
      return JSON.stringify(
        Object.keys(part)
          .sort()
          .reduce((acc, key) => {
            acc[key] = part[key];
            return acc;
          }, {} as Record<string, any>)
      );
    }
    return part;
  }) as readonly unknown[];
}

// Usage
function usePosts(filters: PostFilters) {
  return useQuery({
    queryKey: createStableKey(['posts', filters]),
    queryFn: () => fetchPosts(filters),
  });
}

// With factory
const postKeys = {
  list: (filters: PostFilters) => 
    createStableKey(['posts', 'list', filters]) as const,
};

// Usage
useQuery({
  queryKey: postKeys.list(filters),
  queryFn: () => fetchPosts(filters),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Key Hash Function</h3>
        <CodeBlock
          title="Custom Query Key Hash Function"
          code={`// Custom hash function for query keys
function hashQueryKey(queryKey: unknown[]): string {
  return queryKey
    .map(key => {
      if (typeof key === 'object' && key !== null) {
        return JSON.stringify(
          Object.keys(key)
            .sort()
            .reduce((acc, k) => {
              acc[k] = key[k];
              return acc;
            }, {} as Record<string, any>)
        );
      }
      return String(key);
    })
    .join('::');
}

// Use in QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashQueryKey,
    },
  },
});

// Now all query keys use the custom hash function
// Ensures consistent key matching`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use factories</strong> - Centralize key generation</li>
            <li><strong>Create hierarchies</strong> - Use hierarchical keys for relationships</li>
            <li><strong>Normalize objects</strong> - Ensure consistent key generation</li>
            <li><strong>Keep keys simple</strong> - Avoid deeply nested structures</li>
            <li><strong>Use TypeScript</strong> - Add types for key factories</li>
            <li><strong>Document keys</strong> - Make key structure clear</li>
            <li><strong>Test invalidation</strong> - Verify key matching works</li>
            <li><strong>Use constants</strong> - Define key parts as constants</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">12.3 Mutation Patterns</strong>
          for optimistic updates, undo/redo patterns, batch mutations, and transaction-like mutations.
        </p>
      </div>
    </LessonLayout>
  );
}

