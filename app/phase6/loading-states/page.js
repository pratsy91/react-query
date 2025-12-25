import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function LoadingStatesPage() {
  return (
    <LessonLayout
      title="6.2 Loading States"
      description="Master loading state management: isLoading vs isFetching, isInitialLoading, isRefetching, isPending, and loading UI patterns"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Understanding Loading States</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query provides multiple loading state properties to help you build responsive UIs.
          Understanding the differences between them is crucial for proper loading state management.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Loading State Properties:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>isLoading</strong> - Initial load (no cached data)</li>
            <li><strong>isFetching</strong> - Any fetch in progress (including refetch)</li>
            <li><strong>isInitialLoading</strong> - First load (alias for isLoading)</li>
            <li><strong>isRefetching</strong> - Background refetch (not initial load)</li>
            <li><strong>isPending</strong> - Pending state (v5+, replaces isLoading)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isLoading vs isFetching</h2>
        <p className="text-gray-700 mb-4">
          Understanding the difference between <code className="bg-gray-100 px-1 rounded">isLoading</code>
          and <code className="bg-gray-100 px-1 rounded">isFetching</code> is crucial for proper UI behavior.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">isLoading - Initial Load Only</h3>
        <CodeBlock
          title="isLoading Behavior"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isLoading: true only when:
  // - No cached data exists
  // - Query is fetching for the first time
  // - status is 'pending' AND no data exists

  if (isLoading) {
    return <div>Loading user for the first time...</div>;
  }

  // After first load, isLoading is always false
  // Even if data is refetched, isLoading stays false

  return (
    <div>
      {isFetching && <div>Updating...</div>}
      <div>{data.name}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">isFetching - Any Fetch in Progress</h3>
        <CodeBlock
          title="isFetching Behavior"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isFetching: true when:
  // - Initial fetch (no cached data)
  // - Background refetch (cached data exists)
  // - Manual refetch
  // - Any fetch operation in progress

  return (
    <div>
      {isLoading && <div>Initial loading...</div>}
      {!isLoading && isFetching && <div>Refreshing...</div>}
      {data && <div>{data.name}</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Comparison Table</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Scenario</th>
                <th className="text-left p-2">isLoading</th>
                <th className="text-left p-2">isFetching</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Initial load (no cache)</td>
                <td className="p-2">true</td>
                <td className="p-2">true</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Background refetch (has cache)</td>
                <td className="p-2">false</td>
                <td className="p-2">true</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Manual refetch (has cache)</td>
                <td className="p-2">false</td>
                <td className="p-2">true</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Data loaded, not fetching</td>
                <td className="p-2">false</td>
                <td className="p-2">false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isInitialLoading</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">isInitialLoading</code> is an alias for
          <code className="bg-gray-100 px-1 rounded">isLoading</code>. It's true only during the
          initial fetch when no cached data exists.
        </p>

        <CodeBlock
          title="isInitialLoading Usage"
          code={`function UserProfile({ userId }) {
  const { data, isInitialLoading, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isInitialLoading === isLoading
  // true only on first load (no cached data)

  if (isInitialLoading) {
    return <div>Loading user for the first time...</div>;
  }

  // Show data with background update indicator
  return (
    <div>
      {isFetching && <div className="subtle">Updating...</div>}
      <div>{data.name}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isRefetching</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">isRefetching</code> is true when a query is
          fetching but not for the first time. It's useful for showing subtle loading indicators
          during background updates.
        </p>

        <CodeBlock
          title="isRefetching Usage"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isRefetching: true when:
  // - Query is fetching
  // - AND cached data exists (not initial load)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isRefetching && (
        <div className="subtle-indicator">
          Refreshing data...
        </div>
      )}
      <div>{data.name}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isPending (v5+)</h2>
        <p className="text-gray-700 mb-4">
          In v5+, <code className="bg-gray-100 px-1 rounded">isPending</code> replaces
          <code className="bg-gray-100 px-1 rounded">isLoading</code> for consistency with mutations.
          It represents the pending state of a query.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> In v5+, <code className="bg-white px-1 rounded">isLoading</code>
            is deprecated in favor of <code className="bg-white px-1 rounded">isPending</code>.
            <code className="bg-white px-1 rounded">isLoading</code> still works for backward compatibility.
          </p>
        </div>

        <CodeBlock
          title="isPending Usage (v5+)"
          code={`function UserProfile({ userId }) {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isPending: true when status is 'pending'
  // Same as isLoading in v4

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isFetching && <div>Updating...</div>}
      <div>{data.name}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Loading State Management</h2>
        <p className="text-gray-700 mb-4">
          Best practices for managing loading states across your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Initial Load vs Refetch</h3>
        <CodeBlock
          title="Different UI for Initial Load and Refetch"
          code={`function UserProfile({ userId }) {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Show full loading screen on initial load
  if (isLoading) {
    return (
      <div className="full-screen-loader">
        <div className="spinner" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  // Show subtle indicator for refetch
  return (
    <div>
      {isRefetching && (
        <div className="refetch-indicator">
          <span>🔄</span> Updating...
        </div>
      )}
      <div>{data.name}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Combined Loading States</h3>
        <CodeBlock
          title="Aggregate Loading States"
          code={`function Dashboard() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Combined loading state
  const isLoading = usersLoading || postsLoading;

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div>Users: {users.length}</div>
      <div>Posts: {posts.length}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Skeleton Screens</h2>
        <p className="text-gray-700 mb-4">
          Skeleton screens provide a better UX than loading spinners by showing the structure of
          content that will load.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Skeleton</h3>
        <CodeBlock
          title="Skeleton Screen Pattern"
          code={`function UserProfileSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-line" style={{ width: '60%' }} />
      <div className="skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton-line" style={{ width: '40%' }} />
    </div>
  );
}

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <div>
      <img src={data.avatar} alt={data.name} />
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">List Skeleton</h3>
        <CodeBlock
          title="Skeleton for Lists"
          code={`function PostListSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton-post">
          <div className="skeleton-line" style={{ width: '70%' }} />
          <div className="skeleton-line" style={{ width: '100%' }} />
          <div className="skeleton-line" style={{ width: '50%' }} />
        </div>
      ))}
    </div>
  );
}

function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <PostListSkeleton />;
  }

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Loading Indicators</h2>
        <p className="text-gray-700 mb-4">
          Different types of loading indicators for various scenarios.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Spinner</h3>
        <CodeBlock
          title="Spinner Loading Indicator"
          code={`function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Progress Bar</h3>
        <CodeBlock
          title="Progress Bar Indicator"
          code={`function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: \`\${progress}%\` }}
      />
    </div>
  );
}

function DataLoader() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <ProgressBar progress={50} />; // Simulated progress
  }

  return (
    <div>
      {isFetching && <ProgressBar progress={100} />}
      <div>{data.content}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Inline Loading</h3>
        <CodeBlock
          title="Inline Loading Indicator"
          code={`function InlineLoader() {
  return <span className="inline-loader">⏳</span>;
}

function UserProfile({ userId }) {
  const { data, isRefetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <div>
      <h1>
        {data.name}
        {isRefetching && <InlineLoader />}
      </h1>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use isLoading for initial load</strong> - Show full loading UI</li>
            <li><strong>Use isRefetching for updates</strong> - Show subtle indicators</li>
            <li><strong>Prefer skeleton screens</strong> - Better UX than spinners</li>
            <li><strong>Don't block UI on refetch</strong> - Show data with update indicator</li>
            <li><strong>Use isPending in v5+</strong> - More consistent naming</li>
            <li><strong>Combine loading states</strong> - Aggregate when needed</li>
            <li><strong>Provide meaningful messages</strong> - Tell users what's loading</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">6.3 Error States</strong>
          to understand error state properties and error recovery patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

