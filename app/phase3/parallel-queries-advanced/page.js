import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ParallelQueriesAdvancedPage() {
  return (
    <LessonLayout
      title="3.2 Parallel Queries - Part 2: useQueries Hook"
      description="Learn how to use the useQueries hook for dynamic parallel queries with complete coverage"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Introduction to useQueries</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useQueries</code> hook allows you to execute
          multiple queries in parallel when you have a dynamic number of queries or need to configure
          queries programmatically.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">When to Use useQueries:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Dynamic number of queries (e.g., fetching multiple items by ID)</li>
            <li>Queries based on arrays or lists</li>
            <li>Programmatic query configuration</li>
            <li>When you need to map over query results</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useQueries Usage"
          code={`import { useQueries } from '@tanstack/react-query';

function UserList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });

  // userQueries is an array of query results
  // Each has the same structure as useQuery result

  return (
    <div>
      {userQueries.map((query, index) => {
        if (query.isLoading) return <div key={index}>Loading...</div>;
        if (query.isError) return <div key={index}>Error: {query.error.message}</div>;
        return <div key={index}>{query.data.name}</div>;
      })}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dynamic Queries</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useQueries</code> is perfect for scenarios where
          you need to fetch data for a dynamic list of items.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Fetching Multiple Items</h3>
        <CodeBlock
          title="Dynamic Query Array"
          code={`function PostList({ postIds }) {
  const postQueries = useQueries({
    queries: postIds.map((postId) => ({
      queryKey: ['post', postId],
      queryFn: () => fetchPost(postId),
    })),
  });

  // All queries execute in parallel
  const isLoading = postQueries.some(query => query.isLoading);
  const hasError = postQueries.some(query => query.isError);

  if (isLoading) return <div>Loading posts...</div>;
  if (hasError) return <div>Some posts failed to load</div>;

  return (
    <div>
      {postQueries.map((query, index) => (
        <div key={postIds[index]}>
          {query.data && <h2>{query.data.title}</h2>}
        </div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Queries</h3>
        <CodeBlock
          title="Filtering Query Array"
          code={`function UserPosts({ userIds, includeInactive }) {
  const userQueries = useQueries({
    queries: userIds
      .filter(id => includeInactive || id.isActive) // Filter before creating queries
      .map((userId) => ({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
        enabled: userId.isActive, // Or use enabled per query
      })),
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Options Per Query</h2>
        <p className="text-gray-700 mb-4">
          Each query in the <code className="bg-gray-100 px-1 rounded">queries</code> array can have
          all the same options as <code className="bg-gray-100 px-1 rounded">useQuery</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Per-Query Configuration</h3>
        <CodeBlock
          title="Individual Query Options"
          code={`function UserDashboard({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((userId, index) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      
      // Each query can have its own options
      staleTime: index === 0 ? 1000 * 60 * 5 : 1000 * 60, // Different staleTime
      cacheTime: 1000 * 60 * 30,
      retry: userId.isImportant ? 3 : 1, // Different retry logic
      enabled: userId.shouldFetch, // Conditional fetching
      refetchOnWindowFocus: false,
      select: (data) => ({
        id: data.id,
        name: data.name,
        // Transform data per query
      }),
    })),
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Shared Options</h3>
        <CodeBlock
          title="Common Options for All Queries"
          code={`function ProductList({ productIds }) {
  const productQueries = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
    })),
    // Options that apply to all queries
    combine: (results) => {
      // Custom combine function (v5+)
      return {
        data: results.map(result => result.data),
        pending: results.some(result => result.isPending),
        error: results.find(result => result.isError)?.error,
      };
    },
  });

  // With combine, you get a single object instead of array
  return (
    <div>
      {productQueries.pending && <div>Loading...</div>}
      {productQueries.error && <div>Error: {productQueries.error.message}</div>}
      {productQueries.data?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling</h2>
        <p className="text-gray-700 mb-4">
          With <code className="bg-gray-100 px-1 rounded">useQueries</code>, you need to handle errors
          for each query individually, as some queries may succeed while others fail.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Individual Error Handling</h3>
        <CodeBlock
          title="Handle Errors Per Query"
          code={`function UserList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });

  return (
    <div>
      {userQueries.map((query, index) => {
        if (query.isLoading) {
          return <div key={index}>Loading user {userIds[index]}...</div>;
        }

        if (query.isError) {
          return (
            <div key={index} className="error">
              Failed to load user {userIds[index]}: {query.error.message}
              <button onClick={() => query.refetch()}>Retry</button>
            </div>
          );
        }

        return (
          <div key={index}>
            <h3>{query.data.name}</h3>
            <p>{query.data.email}</p>
          </div>
        );
      })}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Aggregated Error Handling</h3>
        <CodeBlock
          title="Collect and Display All Errors"
          code={`function UserList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });

  // Collect all errors
  const errors = userQueries
    .map((query, index) => ({
      userId: userIds[index],
      error: query.error,
    }))
    .filter(item => item.error);

  // Collect successful results
  const users = userQueries
    .map((query, index) => ({
      userId: userIds[index],
      data: query.data,
    }))
    .filter(item => item.data);

  return (
    <div>
      {errors.length > 0 && (
        <div className="errors">
          <h3>Failed to load {errors.length} user(s):</h3>
          {errors.map(({ userId, error }) => (
            <div key={userId}>
              User {userId}: {error.message}
            </div>
          ))}
        </div>
      )}

      <div>
        <h3>Loaded Users ({users.length}):</h3>
        {users.map(({ userId, data }) => (
          <div key={userId}>{data.name}</div>
        ))}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Loading States</h2>
        <p className="text-gray-700 mb-4">
          Managing loading states with <code className="bg-gray-100 px-1 rounded">useQueries</code>
          requires checking the state of each query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combined Loading State</h3>
        <CodeBlock
          title="Check if Any Query is Loading"
          code={`function UserList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });

  // Check if any query is loading
  const isLoading = userQueries.some(query => query.isLoading);
  
  // Check if all queries are done
  const isAllLoaded = userQueries.every(query => 
    query.isSuccess || query.isError
  );

  // Count loading queries
  const loadingCount = userQueries.filter(query => query.isLoading).length;

  if (isLoading) {
    return (
      <div>
        Loading users... ({loadingCount} remaining)
      </div>
    );
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
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Progressive Loading</h3>
        <CodeBlock
          title="Show Data as It Arrives"
          code={`function ProductList({ productIds }) {
  const productQueries = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
    })),
  });

  return (
    <div>
      {productQueries.map((query, index) => {
        const productId = productIds[index];

        if (query.isLoading) {
          return (
            <div key={productId} className="skeleton">
              Loading product {productId}...
            </div>
          );
        }

        if (query.isError) {
          return (
            <div key={productId} className="error">
              Failed to load product {productId}
            </div>
          );
        }

        // Show data as soon as it's available
        return (
          <div key={productId}>
            <h3>{query.data.name}</h3>
            <p>{query.data.price}</p>
          </div>
        );
      })}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Dependent useQueries</h3>
        <CodeBlock
          title="Queries That Depend on Other Queries"
          code={`function UserPosts({ userIds }) {
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
        enabled: !!query.data, // Only when user is loaded
      })),
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Combining Results</h3>
        <CodeBlock
          title="Merge Query Results"
          code={`function CombinedData({ ids }) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['item', id],
      queryFn: () => fetchItem(id),
    })),
  });

  // Combine all successful results
  const allData = queries
    .filter(query => query.isSuccess)
    .map(query => query.data);

  // Calculate aggregate values
  const total = allData.reduce((sum, item) => sum + item.value, 0);
  const average = allData.length > 0 ? total / allData.length : 0;

  return (
    <div>
      <div>Total: {total}</div>
      <div>Average: {average}</div>
      <div>Items: {allData.length}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript Support</h2>
        <CodeBlock
          title="Typed useQueries"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

function UserList({ userIds }: { userIds: number[] }) {
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
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">3.3 Infinite Queries & Pagination</strong>
          to implement infinite scrolling and paginated data loading.
        </p>
      </div>
    </LessonLayout>
  );
}

