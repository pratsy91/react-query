import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseQueryClientPage() {
  return (
    <LessonLayout
      title="5.1 useQueryClient Hook"
      description="Learn how to access the QueryClient instance in components and custom hooks"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useQueryClient?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useQueryClient</code> hook provides access
          to the QueryClient instance within React components and custom hooks. This allows you to
          programmatically interact with the query cache and mutations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Use Cases:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Accessing query cache methods</li>
            <li>Invalidating queries after mutations</li>
            <li>Prefetching data</li>
            <li>Manually updating cache</li>
            <li>Accessing mutation cache</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useQueryClient Usage"
          code={`import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();
  
  // Now you can use all QueryClient methods
  const userData = queryClient.getQueryData(['user', 123]);
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Accessing QueryClient</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useQueryClient</code> hook returns the
          QueryClient instance that was provided via QueryClientProvider.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Access</h3>
        <CodeBlock
          title="Getting QueryClient Instance"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  
  // Access QueryClient methods
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">TypeScript Support</h3>
        <CodeBlock
          title="Typed QueryClient"
          code={`import { useQueryClient } from '@tanstack/react-query';

function TypedComponent() {
  // QueryClient is automatically typed
  const queryClient = useQueryClient();
  
  // Type-safe method calls
  const userData = queryClient.getQueryData<User>(['user', userId]);
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Using in Components</h2>
        <p className="text-gray-700 mb-4">
          Use <code className="bg-gray-100 px-1 rounded">useQueryClient</code> in components to
          perform cache operations, invalidations, and prefetching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Example 1: Invalidate After Mutation</h3>
        <CodeBlock
          title="Invalidate Queries in Component"
          code={`import { useQueryClient, useMutation } from '@tanstack/react-query';

function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate queries after successful mutation
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
    },
  });
  
  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update User
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Example 2: Prefetch on Hover</h3>
        <CodeBlock
          title="Prefetch in Component"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserLink({ userId }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // Prefetch user data on hover
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <a
      href={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
    >
      User {userId}
    </a>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Example 3: Manual Cache Update</h3>
        <CodeBlock
          title="Update Cache Directly"
          code={`import { useQueryClient } from '@tanstack/react-query';

function OptimisticLike({ postId }) {
  const queryClient = useQueryClient();
  
  const handleLike = () => {
    // Optimistically update cache
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      likes: old.likes + 1,
    }));
    
    // Then perform actual mutation
    likePost(postId);
  };
  
  return <button onClick={handleLike}>Like</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Using in Custom Hooks</h2>
        <p className="text-gray-700 mb-4">
          Create reusable custom hooks that use <code className="bg-gray-100 px-1 rounded">useQueryClient</code>
          to encapsulate query client operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hook: Invalidate User</h3>
        <CodeBlock
          title="Reusable Invalidation Hook"
          code={`import { useQueryClient } from '@tanstack/react-query';

function useInvalidateUser() {
  const queryClient = useQueryClient();
  
  return (userId) => {
    queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
    queryClient.invalidateQueries({
      queryKey: ['users'],
    });
  };
}

// Usage in component
function UserProfile({ userId }) {
  const invalidateUser = useInvalidateUser();
  
  const handleUpdate = async () => {
    await updateUser(userId, data);
    invalidateUser(userId);
  };
  
  return <button onClick={handleUpdate}>Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hook: Prefetch User</h3>
        <CodeBlock
          title="Reusable Prefetch Hook"
          code={`import { useQueryClient } from '@tanstack/react-query';

function usePrefetchUser() {
  const queryClient = useQueryClient();
  
  return async (userId) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
}

// Usage
function UserLink({ userId }) {
  const prefetchUser = usePrefetchUser();
  
  return (
    <a
      href={\`/users/\${userId}\`}
      onMouseEnter={() => prefetchUser(userId)}
    >
      User {userId}
    </a>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hook: Cache Operations</h3>
        <CodeBlock
          title="Complex Cache Operations Hook"
          code={`import { useQueryClient } from '@tanstack/react-query';

function useUserCache() {
  const queryClient = useQueryClient();
  
  return {
    // Get user data
    getUser: (userId) => {
      return queryClient.getQueryData(['user', userId]);
    },
    
    // Set user data
    setUser: (userId, userData) => {
      queryClient.setQueryData(['user', userId], userData);
    },
    
    // Invalidate user
    invalidateUser: (userId) => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
    },
    
    // Prefetch user
    prefetchUser: async (userId) => {
      await queryClient.prefetchQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      });
    },
    
    // Remove user from cache
    removeUser: (userId) => {
      queryClient.removeQueries({
        queryKey: ['user', userId],
      });
    },
  };
}

// Usage
function UserManager({ userId }) {
  const userCache = useUserCache();
  
  const handleRefresh = () => {
    userCache.invalidateUser(userId);
  };
  
  const handlePrefetch = () => {
    userCache.prefetchUser(userId);
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handlePrefetch}>Prefetch</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Accessing Cache Directly</h2>
        <p className="text-gray-700 mb-4">
          Use <code className="bg-gray-100 px-1 rounded">useQueryClient</code> to access the query
          and mutation caches directly for advanced operations.
        </p>

        <CodeBlock
          title="Direct Cache Access"
          code={`import { useQueryClient } from '@tanstack/react-query';

function CacheInspector() {
  const queryClient = useQueryClient();
  
  const inspectCache = () => {
    // Get query cache
    const queryCache = queryClient.getQueryCache();
    const allQueries = queryCache.getAll();
    
    // Get mutation cache
    const mutationCache = queryClient.getMutationCache();
    const allMutations = mutationCache.getAll();
    
    console.log('Queries:', allQueries);
    console.log('Mutations:', allMutations);
  };
  
  return <button onClick={inspectCache}>Inspect Cache</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use in custom hooks</strong> - Encapsulate query client operations</li>
            <li><strong>Don't overuse</strong> - Prefer query hooks when possible</li>
            <li><strong>Handle errors</strong> - Wrap operations in try-catch when needed</li>
            <li><strong>Use TypeScript</strong> - Get type safety for all methods</li>
            <li><strong>Cache operations</strong> - Use for cache manipulation, not data fetching</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.2 useIsFetching Hook</strong>
          to track global fetching state across all queries.
        </p>
      </div>
    </LessonLayout>
  );
}

