import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseQueryBasicsPage() {
  return (
    <LessonLayout
      title="1.3 useQuery Hook - Part 1: Basic Usage"
      description="Learn the fundamentals of the useQuery hook and its core options"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Introduction to useQuery</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useQuery</code> hook is the primary way to
          fetch and manage server state in TanStack Query. It handles loading states, error states,
          caching, and refetching automatically.
        </p>

        <CodeBlock
          title="Basic useQuery Example"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(res => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryKey - Query Identification</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryKey</code> is a required option that
          uniquely identifies your query. It determines how queries are cached and shared.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Array Keys</h3>
        <CodeBlock
          title="Basic Array Key"
          code={`useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Keys with Parameters</h3>
        <CodeBlock
          title="Dynamic Keys"
          code={`// Single parameter
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Multiple parameters
useQuery({
  queryKey: ['posts', userId, { status: 'published' }],
  queryFn: () => fetchUserPosts(userId, { status: 'published' }),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Nested Keys</h3>
        <CodeBlock
          title="Hierarchical Keys"
          code={`// Deep nesting for related data
useQuery({
  queryKey: ['users', userId, 'posts', postId, 'comments'],
  queryFn: () => fetchComments(userId, postId),
});`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Important:</strong> Query keys must be serializable (JSON-compatible).
            Functions, Symbols, and other non-serializable values should not be used directly.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryFn - The Query Function</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryFn</code> is an async function that
          returns a Promise. It's responsible for fetching your data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Query Function</h3>
        <CodeBlock
          title="Simple Async Function"
          code={`useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await fetch('/api/users');
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using Query Context</h3>
        <CodeBlock
          title="Accessing Query Key from Context"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ queryKey }) => {
    const [, id] = queryKey;
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Handling in queryFn</h3>
        <CodeBlock
          title="Proper Error Handling"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    // Throw error for non-2xx responses
    if (!response.ok) {
      throw new Error(\`Failed to fetch: \${response.statusText}\`);
    }
    
    return response.json();
  },
  // Errors are automatically caught and available in error state
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Cancellation</h3>
        <CodeBlock
          title="Using AbortSignal for Cancellation"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ signal }) => {
    const response = await fetch(\`/api/users/\${userId}\`, {
      signal, // Automatically cancels if query is cancelled
    });
    return response.json();
  },
});

// Query is automatically cancelled when:
// - Component unmounts
// - Query key changes
// - Query is manually cancelled`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">enabled - Conditional Fetching</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">enabled</code> option allows you to
          conditionally enable or disable a query. When disabled, the query won't execute.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Conditional Fetching</h3>
        <CodeBlock
          title="Enable Based on Condition"
          code={`function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch if userId exists
  });

  if (!userId) return <div>No user selected</div>;
  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dependent Queries</h3>
        <CodeBlock
          title="Query Depends on Another Query"
          code={`function UserPosts({ userId }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query depends on first
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only fetch posts after user is loaded
  });

  if (!user) return <div>Loading user...</div>;
  if (!posts) return <div>Loading posts...</div>;
  
  return <div>{posts.length} posts</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complex Conditions</h3>
        <CodeBlock
          title="Multiple Conditions"
          code={`function UserDashboard({ userId, isAuthenticated }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: isAuthenticated && !!userId && userId > 0,
  });

  // Query only runs when all conditions are true
  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">retry - Retry Logic</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">retry</code> option controls how many
          times a failed query will retry before giving up.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Retry Options</h3>
        <CodeBlock
          title="Retry Configuration"
          code={`// No retries
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: false,
});

// Retry 3 times (default)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: 3,
});

// Retry until success (not recommended)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: true, // Infinite retries
});

// Conditional retry function
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: (failureCount, error) => {
    // Don't retry on 404 errors
    if (error.status === 404) return false;
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">retryDelay - Custom Delay</h3>
        <CodeBlock
          title="Exponential Backoff"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  // Attempt 1: 1s delay
  // Attempt 2: 2s delay
  // Attempt 3: 4s delay
  // Max: 30s delay
});

// Fixed delay
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  retry: 3,
  retryDelay: 1000, // Always wait 1 second
});`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover caching options (staleTime,
          cacheTime), refetch options, and data transformation (select, placeholderData, initialData).
        </p>
      </div>
    </LessonLayout>
  );
}

