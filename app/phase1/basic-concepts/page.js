import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function BasicConceptsPage() {
  return (
    <LessonLayout
      title="1.2 Basic Query Concepts"
      description="Understand the fundamental concepts of TanStack Query: queries, keys, functions, states, and caching"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is a Query?</h2>
        <p className="text-gray-700 mb-4">
          A query in TanStack Query is a declarative dependency on an asynchronous source of data.
          Queries are used to fetch, cache, and synchronize server state in your React applications.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Characteristics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Queries are <strong>declarative</strong> - you describe what data you need, not how to fetch it</li>
            <li>Queries are <strong>cached</strong> - data is stored and reused automatically</li>
            <li>Queries are <strong>reactive</strong> - they automatically refetch when dependencies change</li>
            <li>Queries handle <strong>loading and error states</strong> automatically</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Query Example"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Keys and Their Structure</h2>
        <p className="text-gray-700 mb-4">
          Query keys are unique identifiers for queries. They determine how queries are cached,
          invalidated, and shared across components.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Query Keys</h3>
        <CodeBlock
          title="String Keys"
          code={`// Simple string key
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Array Keys (Recommended)</h3>
        <p className="text-gray-700 mb-4">
          Array keys are the recommended approach. They allow for hierarchical organization
          and easy partial matching.
        </p>

        <CodeBlock
          title="Array Query Keys"
          code={`// Single-level array
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Multi-level array (hierarchical)
useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
});

// Deep nesting
useQuery({
  queryKey: ['users', userId, 'posts', postId],
  queryFn: () => fetchUserPost(userId, postId),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Query Keys</h3>
        <CodeBlock
          title="Keys with Variables"
          code={`// Using variables in keys
const userId = 123;
const filter = 'active';

useQuery({
  queryKey: ['users', userId, { filter }],
  queryFn: () => fetchUsers({ userId, filter }),
});

// Keys automatically update when variables change
// This creates a new query when userId or filter changes`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Key Best Practices</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always use arrays</strong> - Even for simple keys, use <code className="bg-gray-100 px-1 rounded">['key']</code></li>
            <li><strong>Include all dependencies</strong> - Any variable that affects the query should be in the key</li>
            <li><strong>Be consistent</strong> - Use the same key structure across your app</li>
            <li><strong>Use objects for complex filters</strong> - <code className="bg-gray-100 px-1 rounded">{`['users', { status: 'active', page: 1 }]`}</code></li>
            <li><strong>Keep keys serializable</strong> - Keys must be JSON-serializable</li>
          </ul>
        </div>

        <CodeBlock
          title="Query Key Factory Pattern"
          code={`// Create a query key factory for consistency
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Usage
useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => fetchUser(userId),
});

// Easy invalidation
queryClient.invalidateQueries({ queryKey: userKeys.all });`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Functions</h2>
        <p className="text-gray-700 mb-4">
          A query function is an async function that returns a Promise. It's responsible for
          fetching the data for your query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Query Function</h3>
        <CodeBlock
          title="Simple Async Function"
          code={`async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function with Parameters</h3>
        <CodeBlock
          title="Using Query Context"
          code={`// Query function receives QueryFunctionContext
async function fetchUser({ queryKey }) {
  const [, userId] = queryKey;
  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});

// Or use arrow function
useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ queryKey }) => {
    const [, userId] = queryKey;
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Handling</h3>
        <CodeBlock
          title="Proper Error Handling in Query Functions"
          code={`async function fetchUser(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      // Throw error for non-2xx responses
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw or transform error
    throw new Error(\`Failed to fetch user: \${error.message}\`);
  }
}

useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  // Errors are automatically caught and available in error state
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function Context</h3>
        <p className="text-gray-700 mb-4">
          The query function receives a context object with useful information:
        </p>

        <CodeBlock
          title="QueryFunctionContext Properties"
          code={`async function fetchUser(context) {
  const {
    queryKey,        // The query key array
    signal,          // AbortSignal for cancellation
    meta,            // Meta information
    pageParam,       // For infinite queries
  } = context;

  // Use signal for cancellation
  const response = await fetch(\`/api/users/\${queryKey[1]}\`, {
    signal, // Automatically cancels request if query is cancelled
  });

  return response.json();
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query States</h2>
        <p className="text-gray-700 mb-4">
          Every query goes through several states during its lifecycle. Understanding these
          states is crucial for building robust UIs.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query State Properties</h3>
        <CodeBlock
          title="All Query State Properties"
          code={`const {
  // Data
  data,              // The data returned from queryFn (undefined until success)
  dataUpdatedAt,     // Timestamp when data was last updated
  
  // Status flags
  status,            // 'pending' | 'error' | 'success'
  isLoading,         // true when status is 'pending' and no cached data
  isError,           // true when status is 'error'
  isSuccess,         // true when status is 'success'
  isPending,         // true when status is 'pending' (v5+)
  
  // Fetching flags
  isFetching,        // true when fetching (including background refetch)
  isRefetching,      // true when refetching (not initial load)
  isInitialLoading,  // true when fetching for the first time
  
  // Error
  error,             // Error object if query failed
  
  // Refetch function
  refetch,           // Function to manually refetch
} = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">State Flow Diagram</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <pre className="text-gray-700 font-mono text-sm">
{`Query Lifecycle:

1. Initial State (no cache)
   status: 'pending'
   isLoading: true
   isFetching: true
   data: undefined

2. Success State
   status: 'success'
   isLoading: false
   isFetching: false
   isSuccess: true
   data: <fetched data>

3. Stale State (data exists but is stale)
   status: 'success'
   isLoading: false
   isFetching: true (background refetch)
   isRefetching: true
   data: <cached data>

4. Error State
   status: 'error'
   isLoading: false
   isFetching: false
   isError: true
   error: <error object>
   data: undefined (or previous data if keepPreviousData)`}
          </pre>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Practical State Usage</h3>
        <CodeBlock
          title="Handling All States"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Loading state (initial fetch)
  if (isLoading) {
    return <div>Loading user...</div>;
  }

  // Error state
  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  // Success state (with background refetch indicator)
  return (
    <div>
      {isFetching && <div>Updating...</div>}
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Fetching Lifecycle</h2>
        <p className="text-gray-700 mb-4">
          Understanding the complete lifecycle helps you optimize queries and handle edge cases.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Lifecycle Stages:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Mount</strong> - Component mounts, query is created</li>
            <li><strong>Fetch</strong> - Query function executes</li>
            <li><strong>Success/Error</strong> - Data received or error occurs</li>
            <li><strong>Caching</strong> - Data stored in cache</li>
            <li><strong>Stale Check</strong> - Query checks if data is stale</li>
            <li><strong>Background Refetch</strong> - Automatic refetch if stale</li>
            <li><strong>Unmount</strong> - Component unmounts, query may be garbage collected</li>
          </ol>
        </div>

        <CodeBlock
          title="Lifecycle Example with Logging"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    console.log('1. Fetching user...');
    const data = await fetchUser(userId);
    console.log('2. Data received:', data);
    return data;
  },
  onSuccess: (data) => {
    console.log('3. Query succeeded:', data);
  },
  onError: (error) => {
    console.log('3. Query failed:', error);
  },
  onSettled: (data, error) => {
    console.log('4. Query settled (success or error)');
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Caching Fundamentals</h2>
        <p className="text-gray-700 mb-4">
          Caching is at the heart of TanStack Query. Understanding how caching works is essential
          for building efficient applications.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Concepts</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Cache Key</strong> - The query key uniquely identifies cached data</li>
            <li><strong>Stale Time</strong> - How long data is considered fresh (default: 0)</li>
            <li><strong>Cache Time</strong> - How long unused data stays in cache (default: 5 minutes)</li>
            <li><strong>Garbage Collection</strong> - Unused queries are removed after cacheTime</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Stale vs Fresh Data</h3>
        <CodeBlock
          title="Understanding Stale Time"
          code={`// Data is fresh for 5 minutes
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Timeline:
// 0:00 - Data fetched, marked as fresh
// 0:01 - Data accessed, returned from cache (no refetch)
// 4:59 - Data accessed, returned from cache (no refetch)
// 5:00 - Data becomes stale, but still in cache
// 5:01 - Data accessed, returned from cache + background refetch triggered
// 5:02 - Fresh data received, cache updated`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Sharing</h3>
        <p className="text-gray-700 mb-4">
          Queries with the same key share the same cache entry. This means multiple components
          using the same query key will share data and refetch together.
        </p>

        <CodeBlock
          title="Cache Sharing Example"
          code={`// Component A
function UserHeader({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <h1>{data?.name}</h1>;
}

// Component B (same userId)
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same key = shared cache
    queryFn: () => fetchUser(userId),
  });
  return <div>{data?.email}</div>;
}

// Both components share the same cached data
// Only one network request is made
// Refetching in one component updates both`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Invalidation</h3>
        <CodeBlock
          title="Invalidating Cached Data"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateUser(userId, newData);
    
    // Invalidate and refetch
    queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
    
    // Or invalidate all user queries
    queryClient.invalidateQueries({
      queryKey: ['user'],
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Now that you understand the fundamentals, proceed to
          <strong className="ml-1">1.3 useQuery Hook</strong> to learn all the options and features.
        </p>
      </div>
    </LessonLayout>
  );
}

