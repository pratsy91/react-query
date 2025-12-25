import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ParallelQueriesBasicsPage() {
  return (
    <LessonLayout
      title="3.2 Parallel Queries - Part 1: Multiple useQuery Hooks"
      description="Learn how to fetch multiple queries in parallel using multiple useQuery hooks"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What are Parallel Queries?</h2>
        <p className="text-gray-700 mb-4">
          Parallel queries are multiple queries that execute simultaneously, rather than waiting for
          one to complete before starting another. This improves performance by fetching data concurrently.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Faster loading</strong> - Multiple requests happen simultaneously</li>
            <li><strong>Better UX</strong> - Users see data as it arrives</li>
            <li><strong>Independent loading</strong> - Each query has its own loading state</li>
            <li><strong>Independent error handling</strong> - One failure doesn't block others</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Parallel Queries"
          code={`import { useQuery } from '@tanstack/react-query';

function Dashboard({ userId }) {
  // All these queries execute in parallel
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  const { data: followers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings', userId],
    queryFn: () => fetchUserSettings(userId),
  });

  // All queries run simultaneously
  // Each has its own loading/error state

  return (
    <div>
      {user && <div>User: {user.name}</div>}
      {posts && <div>Posts: {posts.length}</div>}
      {followers && <div>Followers: {followers.length}</div>}
      {settings && <div>Settings loaded</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Multiple useQuery Hooks</h2>
        <p className="text-gray-700 mb-4">
          The simplest way to run parallel queries is to use multiple <code className="bg-gray-100 px-1 rounded">useQuery</code>
          hooks in the same component. Each query executes independently.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Independent Queries</h3>
        <CodeBlock
          title="Multiple Independent Queries"
          code={`function UserProfile({ userId }) {
  // Query 1: User data
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Query 2: User posts (runs in parallel)
  const { 
    data: posts, 
    isLoading: postsLoading, 
    error: postsError 
  } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  // Query 3: User followers (runs in parallel)
  const { 
    data: followers, 
    isLoading: followersLoading, 
    error: followersError 
  } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
  });

  // Handle loading states
  if (userLoading || postsLoading || followersLoading) {
    return <div>Loading...</div>;
  }

  // Handle errors independently
  if (userError) return <div>Error loading user</div>;
  if (postsError) return <div>Error loading posts</div>;
  if (followersError) return <div>Error loading followers</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Posts: {posts.length}</p>
      <p>Followers: {followers.length}</p>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combined Loading States</h3>
        <CodeBlock
          title="Aggregating Loading States"
          code={`function Dashboard() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  // Combined loading state
  const isLoading = usersLoading || postsLoading || commentsLoading;

  // Combined error state
  const hasData = users && posts && comments;

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!hasData) {
    return <div>Some data failed to load</div>;
  }

  return (
    <div>
      <div>Users: {users.length}</div>
      <div>Posts: {posts.length}</div>
      <div>Comments: {comments.length}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Loading State Management</h2>
        <p className="text-gray-700 mb-4">
          When running multiple queries in parallel, you need to manage loading states effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Individual Loading Indicators</h3>
        <CodeBlock
          title="Show Loading for Each Query"
          code={`function UserDashboard({ userId }) {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats', userId],
    queryFn: () => fetchUserStats(userId),
  });

  return (
    <div>
      {userLoading ? (
        <div>Loading user...</div>
      ) : (
        <div>User: {user.name}</div>
      )}

      {postsLoading ? (
        <div>Loading posts...</div>
      ) : (
        <div>Posts: {posts.length}</div>
      )}

      {statsLoading ? (
        <div>Loading stats...</div>
      ) : (
        <div>Stats: {stats.views}</div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Progressive Loading</h3>
        <CodeBlock
          title="Show Data as It Arrives"
          code={`function Dashboard() {
  const { data: quickData, isLoading: quickLoading } = useQuery({
    queryKey: ['quick'],
    queryFn: fetchQuickData, // Fast endpoint
  });

  const { data: slowData, isLoading: slowLoading } = useQuery({
    queryKey: ['slow'],
    queryFn: fetchSlowData, // Slow endpoint
  });

  return (
    <div>
      {/* Show quick data immediately when ready */}
      {quickData && (
        <div>
          <h2>Quick Data</h2>
          <div>{quickData.content}</div>
        </div>
      )}

      {/* Show slow data when it arrives */}
      {slowData && (
        <div>
          <h2>Slow Data</h2>
          <div>{slowData.content}</div>
        </div>
      )}

      {/* Show loading indicator only for slow data if quick is done */}
      {quickData && slowLoading && (
        <div>Loading additional data...</div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling</h2>
        <p className="text-gray-700 mb-4">
          Each parallel query can fail independently. You need to handle errors for each query separately.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Individual Error Handling</h3>
        <CodeBlock
          title="Handle Errors Per Query"
          code={`function UserProfile({ userId }) {
  const { data: user, error: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts, error: postsError } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  const { data: followers, error: followersError } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
  });

  return (
    <div>
      {userError ? (
        <div>Error loading user: {userError.message}</div>
      ) : (
        user && <div>User: {user.name}</div>
      )}

      {postsError ? (
        <div>Error loading posts: {postsError.message}</div>
      ) : (
        posts && <div>Posts: {posts.length}</div>
      )}

      {followersError ? (
        <div>Error loading followers: {followersError.message}</div>
      ) : (
        followers && <div>Followers: {followers.length}</div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combined Error Handling</h3>
        <CodeBlock
          title="Aggregate Errors"
          code={`function Dashboard() {
  const { data: data1, error: error1 } = useQuery({
    queryKey: ['data1'],
    queryFn: fetchData1,
  });

  const { data: data2, error: error2 } = useQuery({
    queryKey: ['data2'],
    queryFn: fetchData2,
  });

  const { data: data3, error: error3 } = useQuery({
    queryKey: ['data3'],
    queryFn: fetchData3,
  });

  // Collect all errors
  const errors = [error1, error2, error3].filter(Boolean);

  if (errors.length > 0) {
    return (
      <div>
        <h2>Some data failed to load:</h2>
        {errors.map((error, index) => (
          <div key={index}>{error.message}</div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div>Data 1: {data1?.value}</div>
      <div>Data 2: {data2?.value}</div>
      <div>Data 3: {data3?.value}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance Considerations</h2>
        <p className="text-gray-700 mb-4">
          While parallel queries improve performance, there are some considerations to keep in mind.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Practices:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Limit concurrent requests</strong> - Too many parallel queries can overwhelm the server</li>
            <li><strong>Use useQueries for dynamic lists</strong> - When you have a variable number of queries</li>
            <li><strong>Consider request batching</strong> - Some APIs support batch endpoints</li>
            <li><strong>Monitor network usage</strong> - Parallel queries use more bandwidth</li>
            <li><strong>Use appropriate staleTime</strong> - Cache data to reduce redundant requests</li>
          </ul>
        </div>

        <CodeBlock
          title="Optimized Parallel Queries"
          code={`function OptimizedDashboard({ userId }) {
  // Use staleTime to prevent unnecessary refetches
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Only fetch if user exists
  const { data: settings } = useQuery({
    queryKey: ['settings', userId],
    queryFn: () => fetchUserSettings(userId),
    enabled: !!user, // Conditional fetch
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return <div>...</div>;
}`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover the <strong className="ml-1">useQueries</strong>
          hook for handling dynamic parallel queries and more advanced patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

