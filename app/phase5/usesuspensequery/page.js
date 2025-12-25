import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseSuspenseQueryPage() {
  return (
    <LessonLayout
      title="5.5 useSuspenseQuery (v5+)"
      description="Learn how to use useSuspenseQuery for React Suspense integration, error boundaries, and concurrent features"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useSuspenseQuery?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> hook (v5+) is a
          Suspense-enabled version of <code className="bg-gray-100 px-1 rounded">useQuery</code>.
          It suspends the component while loading, eliminating the need for manual loading state checks.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This hook is only available in TanStack Query v5+. In v4, you would
            use <code className="bg-white px-1 rounded">useQuery</code> with the <code className="bg-white px-1 rounded">suspense</code> option.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Simpler code</strong> - No loading state checks needed</li>
            <li><strong>Better UX</strong> - Suspense boundaries handle loading</li>
            <li><strong>Concurrent features</strong> - Works with React 18+ concurrent rendering</li>
            <li><strong>Error boundaries</strong> - Errors automatically caught by boundaries</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useSuspenseQuery Usage"
          code={`import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

function UserProfile({ userId }) {
  // No loading state needed - component suspends while loading
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  // data is guaranteed to be available (not undefined)
  return <div>{data.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId={123} />
    </Suspense>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Suspense Integration</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> integrates seamlessly
          with React Suspense, suspending components during data fetching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Suspense Setup</h3>
        <CodeBlock
          title="Suspense Boundary Pattern"
          code={`import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userId={123} />
    </Suspense>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Nested Suspense Boundaries</h3>
        <CodeBlock
          title="Multiple Suspense Levels"
          code={`function UserDashboard({ userId }) {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  return (
    <div>
      <h1>{user.name}</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  );
}

function UserPosts({ userId }) {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Boundaries</h2>
        <p className="text-gray-700 mb-4">
          Errors from <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> are automatically
          thrown and can be caught by React Error Boundaries.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Boundary Setup</h3>
        <CodeBlock
          title="Catching Query Errors"
          code={`import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function UserProfile({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Errors are automatically thrown to ErrorBoundary
  });
  
  return <div>{data.name}</div>;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={123} />
      </Suspense>
    </ErrorBoundary>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Error Handling</h3>
        <CodeBlock
          title="Handle Some Errors Locally"
          code={`function SelectiveErrorHandling({ userId }) {
  // Option 1: Use regular useQuery for errors you want to handle
  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    throwOnError: false, // Don't throw to boundary
  });
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // Option 2: Use useSuspenseQuery with error boundary
  // Errors automatically go to boundary
  const { data: userData } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  return <div>{userData.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Loading States</h2>
        <p className="text-gray-700 mb-4">
          With <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code>, loading states
          are handled by Suspense boundaries, not in the component itself.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Suspense Fallback</h3>
        <CodeBlock
          title="Loading UI in Suspense Boundary"
          code={`function UserProfile({ userId }) {
  // No isLoading check needed
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  // Component only renders when data is available
  return <div>{data.name}</div>;
}

function App() {
  return (
    <Suspense fallback={
      <div className="loading">
        <div className="spinner" />
        <p>Loading user profile...</p>
      </div>
    }>
      <UserProfile userId={123} />
    </Suspense>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Background Refetching</h3>
        <CodeBlock
          title="Handling Background Refetches"
          code={`function UserProfile({ userId }) {
  const { data, isFetching } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  // isFetching indicates background refetch
  // Component doesn't suspend on refetch (only on initial load)
  
  return (
    <div>
      {isFetching && <div className="updating">Updating...</div>}
      <div>{data.name}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Concurrent Features</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> works with React 18+
          concurrent features like transitions and streaming.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Transitions</h3>
        <CodeBlock
          title="Use with React Transitions"
          code={`import { useTransition } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const [isPending, startTransition] = useTransition();
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  const handleChangeUser = (newUserId) => {
    startTransition(() => {
      // Update userId - Suspense will handle loading state
      setUserId(newUserId);
    });
  };
  
  return (
    <div>
      {isPending && <div>Transitioning...</div>}
      <div>{data.name}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Streaming SSR</h3>
        <CodeBlock
          title="Server-Side Rendering with Suspense"
          code={`// Next.js App Router example
async function UserPage({ params }) {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId={params.userId} />
    </Suspense>
  );
}

function UserProfile({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  return <div>{data.name}</div>;
}

// Server can stream the component as data becomes available`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Query Options</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseQuery</code> supports all the same
          options as <code className="bg-gray-100 px-1 rounded">useQuery</code>, except for loading-related options.
        </p>

        <CodeBlock
          title="Available Options"
          code={`const { data } = useSuspenseQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  
  // All standard options work
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
  retry: 3,
  retryDelay: 1000,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 5000,
  select: (user) => user.name,
  placeholderData: previousData,
  initialData: defaultUser,
  // ... all other useQuery options
  
  // Note: isLoading, isPending are not needed
  // Component suspends instead of showing loading state
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always wrap with Suspense</strong> - Required for useSuspenseQuery</li>
            <li><strong>Use Error Boundaries</strong> - Catch errors from queries</li>
            <li><strong>Provide meaningful fallbacks</strong> - Good UX during loading</li>
            <li><strong>Use for critical data</strong> - Data that must be available</li>
            <li><strong>Consider refetch states</strong> - Use isFetching for background updates</li>
            <li><strong>Works with concurrent features</strong> - Leverage React 18+ features</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.6 useSuspenseInfiniteQuery (v5+)</strong>
          for Suspense integration with infinite queries.
        </p>
      </div>
    </LessonLayout>
  );
}

