import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CustomHooksPage() {
  return (
    <LessonLayout
      title="12.1 Custom Hooks"
      description="Learn to create reusable query hooks: parameterized hooks, hook composition, and type-safe custom hooks"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Hooks with React Query</h2>
        <p className="text-gray-700 mb-4">
          Creating custom hooks wraps React Query functionality, making queries reusable, consistent,
          and easier to maintain across your application.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Custom Hook Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Reusability across components</li>
            <li>Consistent query configuration</li>
            <li>Type safety with TypeScript</li>
            <li>Easier testing and maintenance</li>
            <li>Centralized query logic</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Creating Reusable Query Hooks</h2>
        <p className="text-gray-700 mb-4">
          Start with simple custom hooks that wrap useQuery with your specific configuration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Custom Hook</h3>
        <CodeBlock
          title="Simple Custom Query Hook"
          code={`import { useQuery } from '@tanstack/react-query';

// Basic custom hook
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// Usage
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hook with Options</h3>
        <CodeBlock
          title="Configurable Custom Hook"
          code={`import { useQuery } from '@tanstack/react-query';

// Custom hook with default options
function useUser(userId, options = {}) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    ...options, // Allow override
  });
}

// Usage with default options
function UserProfile({ userId }) {
  const { data: user } = useUser(userId);
  return <div>{user?.name}</div>;
}

// Usage with custom options
function UserProfileCustom({ userId }) {
  const { data: user } = useUser(userId, {
    staleTime: 1000 * 60 * 10, // Override: 10 minutes
    enabled: !!userId, // Additional option
  });
  return <div>{user?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Parameterized Hooks</h2>
        <p className="text-gray-700 mb-4">
          Create hooks that accept parameters to make them flexible and reusable for different scenarios.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Single Parameter Hook</h3>
        <CodeBlock
          title="Parameterized Query Hook"
          code={`// Hook with single parameter
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch if userId exists
  });
}

// Usage
function UserProfile({ userId }) {
  const { data: user } = useUser(userId);
  return <div>{user?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Parameters Hook</h3>
        <CodeBlock
          title="Hook with Multiple Parameters"
          code={`// Hook with multiple parameters
function usePosts(userId, filters = {}) {
  return useQuery({
    queryKey: ['posts', userId, filters],
    queryFn: () => fetchUserPosts(userId, filters),
    enabled: !!userId,
  });
}

// Usage
function PostsList({ userId }) {
  const { data: posts } = usePosts(userId, {
    status: 'published',
    sort: 'date',
  });
  
  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Parameters</h3>
        <CodeBlock
          title="Hook with Conditional Logic"
          code={`// Hook with conditional parameters
function useUserPosts(userId, options = {}) {
  const { includeDrafts = false, limit = 10 } = options;

  return useQuery({
    queryKey: ['posts', userId, includeDrafts, limit],
    queryFn: () => fetchUserPosts(userId, { includeDrafts, limit }),
    enabled: !!userId,
  });
}

// Usage
function PostsList({ userId }) {
  const { data: posts } = useUserPosts(userId, {
    includeDrafts: true,
    limit: 20,
  });

  return <div>{posts?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Hook Composition</h2>
        <p className="text-gray-700 mb-4">
          Compose multiple hooks together to create more complex functionality and share logic.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Composing Multiple Queries</h3>
        <CodeBlock
          title="Composed Query Hooks"
          code={`// Individual hooks
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

function useUserPosts(userId) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  });
}

// Composed hook
function useUserProfile(userId) {
  const userQuery = useUser(userId);
  const postsQuery = useUserPosts(userId);

  return {
    user: userQuery.data,
    posts: postsQuery.data,
    isLoading: userQuery.isLoading || postsQuery.isLoading,
    isError: userQuery.isError || postsQuery.isError,
    error: userQuery.error || postsQuery.error,
  };
}

// Usage
function UserProfile({ userId }) {
  const { user, posts, isLoading } = useUserProfile(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>{user?.name}</div>
      <div>{posts?.length} posts</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Composing with Mutations</h3>
        <CodeBlock
          title="Composing Queries and Mutations"
          code={`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query hook
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// Composed hook with query and mutation
function useUserWithUpdate(userId) {
  const queryClient = useQueryClient();
  const userQuery = useUser(userId);

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}

// Usage
function UserProfile({ userId }) {
  const { user, updateUser, isUpdating } = useUserWithUpdate(userId);

  const handleUpdate = () => {
    updateUser({ name: 'New Name' });
  };

  return (
    <div>
      <div>{user?.name}</div>
      <button onClick={handleUpdate} disabled={isUpdating}>
        Update
      </button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Type-Safe Custom Hooks</h2>
        <p className="text-gray-700 mb-4">
          Use TypeScript to create type-safe custom hooks that provide better developer experience
          and catch errors at compile time.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Type-Safe Hook</h3>
        <CodeBlock
          title="Typed Custom Hook"
          code={`import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiError {
  message: string;
  status: number;
}

// Type-safe custom hook
function useUser(userId: number): UseQueryResult<User, ApiError> {
  return useQuery<User, ApiError>({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });
}

// Usage - fully typed
function UserProfile({ userId }: { userId: number }) {
  const { data: user, error } = useUser(userId);

  // TypeScript knows:
  // - user: User | undefined
  // - error: ApiError | null

  if (error) {
    console.log(error.status); // ✅ Type-safe
  }

  return <div>{user?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Generic Type-Safe Hook</h3>
        <CodeBlock
          title="Generic Custom Hook"
          code={`import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

// Generic type-safe hook factory
function createUseEntity<TData, TError = Error>(
  entityName: string,
  fetchFn: (id: number) => Promise<TData>
) {
  return function useEntity(id: number): UseQueryResult<TData, TError> {
    return useQuery<TData, TError>({
      queryKey: [entityName, id],
      queryFn: (): Promise<TData> => fetchFn(id),
    });
  };
}

// Create typed hooks
const useUser = createUseEntity<User, ApiError>('user', fetchUser);
const usePost = createUseEntity<Post, ApiError>('post', fetchPost);
const useComment = createUseEntity<Comment, ApiError>('comment', fetchComment);

// Usage - all fully typed
function UserProfile({ userId }: { userId: number }) {
  const { data: user } = useUser(userId); // User | undefined
  const { data: post } = usePost(1); // Post | undefined
  return <div>{user?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Type-Safe Hook</h3>
        <CodeBlock
          title="Complex Typed Hook"
          code={`import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UseUserOptions {
  enabled?: boolean;
  staleTime?: number;
  select?: (user: User) => any;
}

// Type-safe hook with options
function useUser(
  userId: number,
  options?: UseUserOptions
): UseQueryResult<User, Error> {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
    enabled: options?.enabled ?? !!userId,
    staleTime: options?.staleTime,
    select: options?.select,
  });
}

// Usage with type inference
function UserProfile({ userId }: { userId: number }) {
  // TypeScript infers return type
  const { data: user } = useUser(userId);
  
  // With select - type is inferred
  const { data: userName } = useUser(userId, {
    select: (user) => user.name, // TypeScript knows: string
  });

  return <div>{userName}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Keep hooks focused</strong> - One hook, one responsibility</li>
            <li><strong>Use TypeScript</strong> - Add types for better DX</li>
            <li><strong>Allow option overrides</strong> - Make hooks flexible</li>
            <li><strong>Compose when needed</strong> - Build complex hooks from simple ones</li>
            <li><strong>Document hooks</strong> - Add JSDoc comments</li>
            <li><strong>Test hooks</strong> - Write tests for custom hooks</li>
            <li><strong>Reuse query keys</strong> - Use consistent key patterns</li>
            <li><strong>Handle edge cases</strong> - Validate parameters</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">12.2 Query Key Management</strong>
          for query key factories, hierarchical keys, dynamic key generation, and key normalization.
        </p>
      </div>
    </LessonLayout>
  );
}

