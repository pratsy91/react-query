import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseQueriesDeepPage() {
  return (
    <LessonLayout
      title="5.4 useQueries Hook (Deep Dive)"
      description="Advanced patterns, TypeScript typing, error boundaries, and performance considerations for useQueries"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Deep Dive into useQueries</h2>
        <p className="text-gray-700 mb-4">
          This lesson covers advanced patterns, TypeScript integration, error handling, and performance
          optimization for the <code className="bg-gray-100 px-1 rounded">useQueries</code> hook.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Topics Covered:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Dynamic query arrays with complex logic</li>
            <li>TypeScript typing and generics</li>
            <li>Error boundary integration</li>
            <li>Performance optimization techniques</li>
            <li>Advanced query composition</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dynamic Query Arrays</h2>
        <p className="text-gray-700 mb-4">
          Create dynamic query arrays based on runtime conditions, user input, or computed values.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complex Dynamic Arrays</h3>
        <CodeBlock
          title="Advanced Dynamic Queries"
          code={`function DynamicQueries({ filters, sortBy }) {
  // Generate queries based on multiple conditions
  const queries = useQueries({
    queries: useMemo(() => {
      // Base queries
      const baseQueries = [
        {
          queryKey: ['users'],
          queryFn: fetchUsers,
        },
        {
          queryKey: ['posts'],
          queryFn: fetchPosts,
        },
      ];
      
      // Add filtered queries based on filters
      const filteredQueries = filters.map(filter => ({
        queryKey: ['filtered', filter.type, filter.value],
        queryFn: () => fetchFiltered(filter),
      }));
      
      // Add sorted queries
      const sortedQueries = sortBy.map(sort => ({
        queryKey: ['sorted', sort.field, sort.direction],
        queryFn: () => fetchSorted(sort),
      }));
      
      return [...baseQueries, ...filteredQueries, ...sortedQueries];
    }, [filters, sortBy]),
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Query Generation</h3>
        <CodeBlock
          title="Generate Queries Based on Conditions"
          code={`function ConditionalQueries({ userId, includePosts, includeComments }) {
  const queries = useQueries({
    queries: [
      // Always fetch user
      {
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      },
      // Conditionally fetch posts
      ...(includePosts ? [{
        queryKey: ['posts', userId],
        queryFn: () => fetchUserPosts(userId),
        enabled: includePosts,
      }] : []),
      // Conditionally fetch comments
      ...(includeComments ? [{
        queryKey: ['comments', userId],
        queryFn: () => fetchUserComments(userId),
        enabled: includeComments,
      }] : []),
    ],
  });
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript Typing</h2>
        <p className="text-gray-700 mb-4">
          Proper TypeScript typing ensures type safety and better developer experience with
          <code className="bg-gray-100 px-1 rounded">useQueries</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic TypeScript</h3>
        <CodeBlock
          title="Typed useQueries"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
}

function TypedQueries({ userIds }: { userIds: number[] }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId] as const,
      queryFn: (): Promise<User> => fetchUser(userId),
    })),
  });
  
  // TypeScript knows the structure
  userQueries.forEach((query) => {
    if (query.data) {
      // query.data is typed as User
      console.log(query.data.name);
    }
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Generic Types</h3>
        <CodeBlock
          title="Generic useQueries Hook"
          code={`function useTypedQueries<T>(
  queryKey: string[],
  queryFn: (id: number) => Promise<T>,
  ids: number[]
) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: [...queryKey, id] as const,
      queryFn: (): Promise<T> => queryFn(id),
    })),
  });
}

// Usage
function UserList({ userIds }: { userIds: number[] }) {
  const userQueries = useTypedQueries<User>(
    ['user'],
    fetchUser,
    userIds
  );
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Inferred Types</h3>
        <CodeBlock
          title="Type Inference"
          code={`function InferredTypes({ userIds }: { userIds: number[] }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: async () => {
        const user = await fetchUser(userId);
        // TypeScript infers return type from fetchUser
        return user; // Type: User
      },
    })),
  });
  
  // TypeScript automatically infers:
  // userQueries: UseQueryResult<User, Error>[]
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Boundaries</h2>
        <p className="text-gray-700 mb-4">
          Integrate <code className="bg-gray-100 px-1 rounded">useQueries</code> with React Error
          Boundaries for better error handling.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Boundary Integration</h3>
        <CodeBlock
          title="Error Boundaries with useQueries"
          code={`import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function UserList({ userIds }: { userIds: number[] }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      // Errors will be caught by ErrorBoundary
    })),
  });
  
  // Throw error if any query fails
  const error = userQueries.find(query => query.isError)?.error;
  if (error) {
    throw error; // Caught by ErrorBoundary
  }
  
  return (
    <div>
      {userQueries.map((query, index) => (
        <div key={userIds[index]}>
          {query.data?.name}
        </div>
      ))}
    </div>
  );
}

// Wrap with ErrorBoundary
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserList userIds={[1, 2, 3]} />
    </ErrorBoundary>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Error Handling</h3>
        <CodeBlock
          title="Handle Errors Per Query"
          code={`function SelectiveErrorHandling({ userIds }: { userIds: number[] }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      // Don't throw - handle errors individually
      useErrorBoundary: false,
    })),
  });
  
  // Handle errors per query
  const errors = userQueries
    .map((query, index) => ({
      userId: userIds[index],
      error: query.error,
    }))
    .filter(item => item.error);
  
  return (
    <div>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map(({ userId, error }) => (
            <div key={userId}>
              User {userId}: {error.message}
            </div>
          ))}
        </div>
      )}
      
      {userQueries.map((query, index) => {
        if (query.isError) return null;
        return <div key={userIds[index]}>{query.data?.name}</div>;
      })}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance Considerations</h2>
        <p className="text-gray-700 mb-4">
          Optimize performance when using <code className="bg-gray-100 px-1 rounded">useQueries</code>
          with many queries or complex operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoization</h3>
        <CodeBlock
          title="Memoize Query Array"
          code={`import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

function OptimizedQueries({ userIds }: { userIds: number[] }) {
  // Memoize query array to prevent recreation
  const queries = useMemo(() => {
    return userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    }));
  }, [userIds]); // Only recreate when userIds change
  
  const userQueries = useQueries({ queries });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Limiting Concurrent Queries</h3>
        <CodeBlock
          title="Batch Queries to Limit Concurrency"
          code={`function BatchedQueries({ userIds }: { userIds: number[] }) {
  const BATCH_SIZE = 10;
  
  const [currentBatch, setCurrentBatch] = useState(0);
  const batchIds = userIds.slice(0, (currentBatch + 1) * BATCH_SIZE);
  
  const userQueries = useQueries({
    queries: batchIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });
  
  const allLoaded = userQueries.every(query => 
    query.isSuccess || query.isError
  );
  
  useEffect(() => {
    if (allLoaded && batchIds.length < userIds.length) {
      // Load next batch
      setCurrentBatch(prev => prev + 1);
    }
  }, [allLoaded, batchIds.length, userIds.length]);
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Fetching</h3>
        <CodeBlock
          title="Only Fetch What's Needed"
          code={`function SelectiveFetching({ userIds, visibleIds }: { 
  userIds: number[];
  visibleIds: number[];
}) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      // Only fetch visible users immediately
      enabled: visibleIds.includes(userId),
      // Others will fetch when they become visible
    })),
  });
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Dependent useQueries</h3>
        <CodeBlock
          title="Queries That Depend on Other Queries"
          code={`function DependentQueries({ userIds }: { userIds: number[] }) {
  // First set of queries
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });
  
  // Second set depends on first
  const postQueries = useQueries({
    queries: userQueries
      .filter(query => query.isSuccess && query.data)
      .map((query) => ({
        queryKey: ['posts', query.data.id],
        queryFn: () => fetchUserPosts(query.data.id),
        enabled: !!query.data,
      })),
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Combining Results</h3>
        <CodeBlock
          title="Merge and Process Query Results"
          code={`function CombinedResults({ ids }: { ids: number[] }) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['item', id],
      queryFn: () => fetchItem(id),
    })),
  });
  
  // Combine all successful results
  const allData = useMemo(() => {
    return queries
      .filter(query => query.isSuccess)
      .map(query => query.data);
  }, [queries]);
  
  // Calculate aggregate values
  const total = useMemo(() => {
    return allData.reduce((sum, item) => sum + item.value, 0);
  }, [allData]);
  
  return (
    <div>
      <div>Total: {total}</div>
      <div>Items: {allData.length}</div>
    </div>
  );
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.5 useSuspenseQuery (v5+)</strong>
          for React Suspense integration with queries.
        </p>
      </div>
    </LessonLayout>
  );
}

