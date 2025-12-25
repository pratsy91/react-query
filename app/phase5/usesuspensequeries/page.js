import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseSuspenseQueriesPage() {
  return (
    <LessonLayout
      title="5.7 useSuspenseQueries (v5+)"
      description="Learn how to use useSuspenseQueries for Suspense integration with multiple parallel queries"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useSuspenseQueries?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useSuspenseQueries</code> hook (v5+) is a
          Suspense-enabled version of <code className="bg-gray-100 px-1 rounded">useQueries</code>.
          It suspends the component until all queries have loaded, then provides access to all results.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This hook is only available in TanStack Query v5+.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Parallel loading</strong> - All queries load simultaneously</li>
            <li><strong>Suspense integration</strong> - Suspends until all queries complete</li>
            <li><strong>Simpler code</strong> - No loading state checks needed</li>
            <li><strong>Error boundaries</strong> - Errors automatically caught</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useSuspenseQueries Usage"
          code={`import { useSuspenseQueries } from '@tanstack/react-query';
import { Suspense } from 'react';

function UserDashboard({ userId }) {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      },
      {
        queryKey: ['posts', userId],
        queryFn: () => fetchUserPosts(userId),
      },
      {
        queryKey: ['followers', userId],
        queryFn: () => fetchFollowers(userId),
      },
    ],
  });
  
  // All queries are guaranteed to have data
  const [userResult, postsResult, followersResult] = results;
  
  return (
    <div>
      <h1>{userResult.data.name}</h1>
      <div>Posts: {postsResult.data.length}</div>
      <div>Followers: {followersResult.data.length}</div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <UserDashboard userId={123} />
    </Suspense>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Multiple Suspense Queries</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseQueries</code> suspends until all
          queries in the array have completed successfully.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Parallel Loading</h3>
        <CodeBlock
          title="All Queries Load in Parallel"
          code={`function ParallelData({ userId }) {
  const results = useSuspenseQueries({
    queries: [
      { queryKey: ['user', userId], queryFn: () => fetchUser(userId) },
      { queryKey: ['posts', userId], queryFn: () => fetchUserPosts(userId) },
      { queryKey: ['settings', userId], queryFn: () => fetchUserSettings(userId) },
    ],
  });
  
  // Component suspends until ALL queries complete
  // All queries run in parallel for better performance
  
  const [user, posts, settings] = results.map(r => r.data);
  
  return (
    <div>
      <div>User: {user.name}</div>
      <div>Posts: {posts.length}</div>
      <div>Settings: {settings.theme}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Query Arrays</h3>
        <CodeBlock
          title="Dynamic useSuspenseQueries"
          code={`import { useMemo } from 'react';

function DynamicQueries({ userIds }: { userIds: number[] }) {
  const results = useSuspenseQueries({
    queries: useMemo(() => {
      return userIds.map((userId) => ({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      }));
    }, [userIds]),
  });
  
  // Suspends until all users are loaded
  const users = results.map(r => r.data);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Boundaries</h2>
        <p className="text-gray-700 mb-4">
          Errors from any query in <code className="bg-gray-100 px-1 rounded">useSuspenseQueries</code>
          are thrown and can be caught by Error Boundaries.
        </p>

        <CodeBlock
          title="Error Handling"
          code={`import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Failed to load data</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Dashboard({ userId }) {
  const results = useSuspenseQueries({
    queries: [
      { queryKey: ['user', userId], queryFn: () => fetchUser(userId) },
      { queryKey: ['posts', userId], queryFn: () => fetchUserPosts(userId) },
    ],
  });
  
  // If any query fails, error is thrown to ErrorBoundary
  const [user, posts] = results.map(r => r.data);
  
  return (
    <div>
      <div>{user.name}</div>
      <div>{posts.length} posts</div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard userId={123} />
      </Suspense>
    </ErrorBoundary>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript Support</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseQueries</code> has full TypeScript
          support with proper type inference.
        </p>

        <CodeBlock
          title="Typed useSuspenseQueries"
          code={`interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
}

function TypedQueries({ userId }: { userId: number }) {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: ['user', userId] as const,
        queryFn: (): Promise<User> => fetchUser(userId),
      },
      {
        queryKey: ['posts', userId] as const,
        queryFn: (): Promise<Post[]> => fetchUserPosts(userId),
      },
    ],
  });
  
  // TypeScript knows the types
  const [userResult, postsResult] = results;
  // userResult.data: User
  // postsResult.data: Post[]
  
  return (
    <div>
      <div>{userResult.data.name}</div>
      <div>{postsResult.data.length} posts</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Query Options</h2>
        <p className="text-gray-700 mb-4">
          Each query in <code className="bg-gray-100 px-1 rounded">useSuspenseQueries</code> can have
          all the same options as <code className="bg-gray-100 px-1 rounded">useQuery</code>.
        </p>

        <CodeBlock
          title="Per-Query Options"
          code={`const results = useSuspenseQueries({
  queries: [
    {
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60 * 5, // Per-query options
      cacheTime: 1000 * 60 * 30,
    },
    {
      queryKey: ['posts', userId],
      queryFn: () => fetchUserPosts(userId),
      staleTime: 1000 * 60 * 2, // Different options
      select: (posts) => posts.slice(0, 10), // Transform data
    },
  ],
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Combining Results</h3>
        <CodeBlock
          title="Process All Results Together"
          code={`function CombinedResults({ userId }: { userId: number }) {
  const results = useSuspenseQueries({
    queries: [
      { queryKey: ['user', userId], queryFn: () => fetchUser(userId) },
      { queryKey: ['posts', userId], queryFn: () => fetchUserPosts(userId) },
      { queryKey: ['stats', userId], queryFn: () => fetchUserStats(userId) },
    ],
  });
  
  const [user, posts, stats] = results.map(r => r.data);
  
  // Combine all data
  const dashboardData = {
    user,
    postCount: posts.length,
    totalLikes: stats.totalLikes,
    averageLikes: stats.totalLikes / posts.length,
  };
  
  return (
    <div>
      <div>User: {dashboardData.user.name}</div>
      <div>Posts: {dashboardData.postCount}</div>
      <div>Avg Likes: {dashboardData.averageLikes}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Conditional Queries</h3>
        <CodeBlock
          title="Conditional Query Array"
          code={`function ConditionalQueries({ userId, includePosts, includeComments }: {
  userId: number;
  includePosts: boolean;
  includeComments: boolean;
}) {
  const results = useSuspenseQueries({
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
      }] : []),
      // Conditionally fetch comments
      ...(includeComments ? [{
        queryKey: ['comments', userId],
        queryFn: () => fetchUserComments(userId),
      }] : []),
    ],
  });
  
  const user = results[0].data;
  const posts = includePosts ? results[1]?.data : null;
  const comments = includeComments ? results[includePosts ? 2 : 1]?.data : null;
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Wrap with Suspense</strong> - Required for useSuspenseQueries</li>
            <li><strong>Use Error Boundaries</strong> - Catch errors from any query</li>
            <li><strong>Memoize query arrays</strong> - Prevent unnecessary recreations</li>
            <li><strong>All queries must succeed</strong> - Component suspends until all complete</li>
            <li><strong>Use for related data</strong> - Data that should load together</li>
            <li><strong>Consider query count</strong> - Too many queries may impact performance</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 5: Advanced Hooks & Utilities.
          You now understand useQueryClient, useIsFetching, useIsMutating, useQueries deep dive,
          and all Suspense hooks. You're ready to move on to Phase 6: Error Handling & Loading States.
        </p>
      </div>
    </LessonLayout>
  );
}

