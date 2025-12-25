import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function DefaultOptionsPage() {
  return (
    <LessonLayout
      title="8.1 Default Options"
      description="Learn how to configure default options for queries and mutations: global defaults, query defaults, mutation defaults, and option merging"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Understanding Default Options</h2>
        <p className="text-gray-700 mb-4">
          Default options allow you to set common configuration for all queries and mutations in your
          application. This reduces repetition and ensures consistency across your codebase.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Default Option Levels:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Global defaults</strong> - Apply to all queries/mutations</li>
            <li><strong>Query defaults</strong> - Apply to queries matching a key pattern</li>
            <li><strong>Mutation defaults</strong> - Apply to mutations matching a key pattern</li>
            <li><strong>Per-query defaults</strong> - Override defaults for specific queries</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Global Defaults</h2>
        <p className="text-gray-700 mb-4">
          Global defaults are set when creating the QueryClient and apply to all queries and mutations
          unless overridden.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Setting Global Defaults</h3>
        <CodeBlock
          title="QueryClient with Global Defaults"
          code={`import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default options for all queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Default options for all mutations
      retry: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Global Defaults Example</h3>
        <CodeBlock
          title="Complete Global Configuration"
          code={`const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Disable for all queries
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        toast.error(\`Error: \${error.message}\`);
      },
      onSuccess: (data) => {
        console.log('Mutation succeeded:', data);
      },
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Defaults</h2>
        <p className="text-gray-700 mb-4">
          Query defaults allow you to set default options for queries matching a specific key pattern.
          This is useful for grouping related queries with common configuration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Setting Query Defaults</h3>
        <CodeBlock
          title="setQueryDefaults Usage"
          code={`import { useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();

  // Set defaults for all queries starting with ['user']
  queryClient.setQueryDefaults(['user'], {
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });

  // All queries with key ['user', ...] will use these defaults
  // Example: ['user', 123], ['user', 456], ['user', 'list']
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Query Defaults</h3>
        <CodeBlock
          title="Different Defaults for Different Query Types"
          code={`function setupQueryDefaults() {
  const queryClient = useQueryClient();

  // User queries - long cache time
  queryClient.setQueryDefaults(['user'], {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
  });

  // Post queries - shorter cache time
  queryClient.setQueryDefaults(['post'], {
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });

  // Real-time queries - always refetch
  queryClient.setQueryDefaults(['notifications'], {
    staleTime: 0,
    refetchInterval: 5000,
  });

  // Static queries - never stale
  queryClient.setQueryDefaults(['countries'], {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}

// Usage
useQuery({
  queryKey: ['user', userId], // Uses user defaults
  queryFn: () => fetchUser(userId),
});

useQuery({
  queryKey: ['post', postId], // Uses post defaults
  queryFn: () => fetchPost(postId),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Getting Query Defaults</h3>
        <CodeBlock
          title="Retrieve Query Defaults"
          code={`function getQueryDefaults() {
  const queryClient = useQueryClient();

  // Get defaults for specific query key
  const userDefaults = queryClient.getQueryDefaults(['user']);
  console.log(userDefaults);

  // Use defaults
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Automatically uses defaults from ['user']
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation Defaults</h2>
        <p className="text-gray-700 mb-4">
          Mutation defaults allow you to set default options for mutations matching a specific key pattern.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Setting Mutation Defaults</h3>
        <CodeBlock
          title="setMutationDefaults Usage"
          code={`function setupMutationDefaults() {
  const queryClient = useQueryClient();

  // Set defaults for all mutations with key ['updateUser']
  queryClient.setMutationDefaults(['updateUser'], {
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      toast.error('Failed to update user');
    },
    onSuccess: (data) => {
      toast.success('User updated successfully');
    },
  });

  // All mutations with key ['updateUser'] will use these defaults
}

// Usage
function UpdateUserButton({ userId }) {
  const mutation = useMutation({
    mutationKey: ['updateUser'], // Uses defaults
    mutationFn: (data) => updateUser(userId, data),
    // onError and onSuccess from defaults are applied
  });

  return <button onClick={() => mutation.mutate({ name: 'New' })}>Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Mutation Defaults</h3>
        <CodeBlock
          title="Different Defaults for Different Mutations"
          code={`function setupMutationDefaults() {
  const queryClient = useQueryClient();

  // Update mutations
  queryClient.setMutationDefaults(['update'], {
    retry: 1,
    onSuccess: () => {
      toast.success('Updated successfully');
    },
  });

  // Delete mutations
  queryClient.setMutationDefaults(['delete'], {
    retry: false, // Don't retry deletes
    onError: (error) => {
      toast.error('Failed to delete');
    },
  });

  // Create mutations
  queryClient.setMutationDefaults(['create'], {
    retry: 2,
    onSuccess: (data) => {
      toast.success('Created successfully');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Per-Query Defaults</h2>
        <p className="text-gray-700 mb-4">
          You can override defaults for individual queries by providing options directly in the query.
          Per-query options take precedence over all default options.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Overriding Defaults</h3>
        <CodeBlock
          title="Per-Query Option Override"
          code={`// Global default: staleTime = 5 minutes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Query defaults: staleTime = 10 minutes for ['user']
queryClient.setQueryDefaults(['user'], {
  staleTime: 1000 * 60 * 10,
});

// Per-query override: staleTime = 1 minute (takes precedence)
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60, // Overrides both global and query defaults
  });

  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Option Precedence</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-900">Option Priority (highest to lowest):</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Per-query options</strong> - Options passed directly to useQuery</li>
            <li><strong>Query defaults</strong> - setQueryDefaults for matching key</li>
            <li><strong>Global defaults</strong> - defaultOptions in QueryClient</li>
            <li><strong>TanStack Query defaults</strong> - Built-in defaults</li>
          </ol>
        </div>

        <CodeBlock
          title="Option Precedence Example"
          code={`// 1. TanStack Query default: staleTime = 0
// 2. Global default: staleTime = 5 minutes
// 3. Query default: staleTime = 10 minutes (for ['user'])
// 4. Per-query: staleTime = 1 minute (wins!)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Level 2
    },
  },
});

queryClient.setQueryDefaults(['user'], {
  staleTime: 1000 * 60 * 10, // Level 3
});

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60, // Level 4 - This value is used
  });

  // Final staleTime: 1 minute
  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Option Merging</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query merges options from different levels. Some options are merged (like callbacks),
          while others are replaced (like staleTime).
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Callback Merging</h3>
        <CodeBlock
          title="Callbacks Are Merged"
          code={`// Global onError
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.log('Global error:', error);
      },
    },
  },
});

// Query-specific onError
queryClient.setQueryDefaults(['user'], {
  onError: (error) => {
    console.log('User query error:', error);
  },
});

// Per-query onError
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onError: (error) => {
    console.log('Specific query error:', error);
  },
  // All three onError callbacks will be called
  // Order: per-query, query-default, global
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Value Replacement</h3>
        <CodeBlock
          title="Values Are Replaced"
          code={`// Global: staleTime = 5 minutes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Query default: staleTime = 10 minutes (replaces global)
queryClient.setQueryDefaults(['user'], {
  staleTime: 1000 * 60 * 10,
});

// Per-query: staleTime = 1 minute (replaces both)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60, // Only this value is used
  // Final staleTime: 1 minute (not merged)
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Object Merging</h3>
        <CodeBlock
          title="Nested Objects Are Merged"
          code={`// Global meta
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      meta: {
        global: true,
      },
    },
  },
});

// Query default meta (merged with global)
queryClient.setQueryDefaults(['user'], {
  meta: {
    category: 'user',
  },
});

// Per-query meta (merged with both)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  meta: {
    userId: userId,
  },
  // Final meta: { global: true, category: 'user', userId: userId }
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Set global defaults first</strong> - Establish base configuration</li>
            <li><strong>Use query defaults for groups</strong> - Group related queries with same config</li>
            <li><strong>Override sparingly</strong> - Only override when necessary</li>
            <li><strong>Understand precedence</strong> - Know which options win</li>
            <li><strong>Document defaults</strong> - Make defaults clear to team</li>
            <li><strong>Test option merging</strong> - Verify callbacks are called correctly</li>
            <li><strong>Use TypeScript</strong> - Get type safety for defaults</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">8.2 Query Client Options</strong>
          to understand defaultOptions, queryCache, mutationCache, logger, and custom cache implementations.
        </p>
      </div>
    </LessonLayout>
  );
}

