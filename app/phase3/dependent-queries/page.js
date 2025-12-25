import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function DependentQueriesPage() {
  return (
    <LessonLayout
      title="3.1 Dependent Queries"
      description="Learn how to create queries that depend on other queries using the enabled option"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What are Dependent Queries?</h2>
        <p className="text-gray-700 mb-4">
          Dependent queries are queries that only execute after another query has completed successfully.
          This is useful when you need data from one query to fetch data in another query.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Common Use Cases:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Fetching user details, then fetching user's posts</li>
            <li>Loading configuration, then loading data based on config</li>
            <li>Getting authentication status, then fetching protected data</li>
            <li>Loading parent data, then loading child data</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Dependent Query Pattern"
          code={`import { useQuery } from '@tanstack/react-query';

function UserPosts({ userId }) {
  // First query - fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query - depends on first query
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only fetch when user data is available
  });

  if (!user) return <div>Loading user...</div>;
  if (!posts) return <div>Loading posts...</div>;

  return (
    <div>
      <h1>{user.name}'s Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Sequential Queries with enabled</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">enabled</code> option is the primary way to
          create dependent queries. When <code className="bg-gray-100 px-1 rounded">enabled</code> is
          <code className="bg-gray-100 px-1 rounded">false</code>, the query won't execute.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic enabled Pattern</h3>
        <CodeBlock
          title="Simple Dependency"
          code={`function UserProfile({ userId }) {
  // First query
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent query - waits for user
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!user, // Only when user exists
  });

  if (userLoading) return <div>Loading user...</div>;
  if (profileLoading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{profile.bio}</p>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Conditions</h3>
        <CodeBlock
          title="Complex enabled Conditions"
          code={`function UserDashboard({ userId, isAuthenticated }) {
  // Query 1: User data
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: isAuthenticated && !!userId, // Multiple conditions
  });

  // Query 2: Depends on Query 1
  const { data: settings } = useQuery({
    queryKey: ['settings', userId],
    queryFn: () => fetchUserSettings(userId),
    enabled: !!user && user.hasSettings, // Depends on user AND property
  });

  // Query 3: Depends on Query 2
  const { data: preferences } = useQuery({
    queryKey: ['preferences', userId],
    queryFn: () => fetchUserPreferences(userId),
    enabled: !!settings && settings.preferencesEnabled,
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Dependencies</h2>
        <p className="text-gray-700 mb-4">
          Queries can depend on multiple conditions, including other queries, props, state, and
          computed values.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dependency on Query Data</h3>
        <CodeBlock
          title="Using Query Data in Dependencies"
          code={`function UserPosts({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent on user data AND specific property
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user && user.postsEnabled, // Check property
  });

  // Another dependent query using user data
  const { data: followers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: !!user && user.isPublic, // Different condition
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dependency on Multiple Queries</h3>
        <CodeBlock
          title="Query Depends on Multiple Queries"
          code={`function UserAnalytics({ userId }) {
  // Query 1
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Query 2
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user,
  });

  // Query 3 - depends on both Query 1 and Query 2
  const { data: analytics } = useQuery({
    queryKey: ['analytics', userId],
    queryFn: () => calculateAnalytics(userId, posts),
    enabled: !!user && !!posts && posts.length > 0, // Both must exist
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dependency on Props and State</h3>
        <CodeBlock
          title="Combining Query Data with Props/State"
          code={`function UserContent({ userId, selectedTab }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Depends on query, prop, AND state
  const { data: content } = useQuery({
    queryKey: ['content', userId, selectedTab],
    queryFn: () => fetchUserContent(userId, selectedTab),
    enabled: !!user && isEnabled && selectedTab !== null,
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complex Dependency Chains</h2>
        <p className="text-gray-700 mb-4">
          You can create chains of dependent queries where each query depends on the previous one.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Linear Dependency Chain</h3>
        <CodeBlock
          title="Sequential Query Chain"
          code={`function UserContent({ userId }) {
  // Step 1: Fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Step 2: Fetch user's organization (depends on Step 1)
  const { data: organization } = useQuery({
    queryKey: ['organization', user?.organizationId],
    queryFn: () => fetchOrganization(user.organizationId),
    enabled: !!user?.organizationId,
  });

  // Step 3: Fetch organization's members (depends on Step 2)
  const { data: members } = useQuery({
    queryKey: ['members', organization?.id],
    queryFn: () => fetchMembers(organization.id),
    enabled: !!organization?.id,
  });

  // Step 4: Fetch member details (depends on Step 3)
  const { data: memberDetails } = useQuery({
    queryKey: ['memberDetails', members?.map(m => m.id)],
    queryFn: () => fetchMemberDetails(members.map(m => m.id)),
    enabled: !!members && members.length > 0,
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Branching Dependencies</h3>
        <CodeBlock
          title="Multiple Branches from One Query"
          code={`function UserDashboard({ userId }) {
  // Root query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Branch 1: User posts
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user,
  });

  // Branch 2: User followers
  const { data: followers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: !!user,
  });

  // Branch 3: User settings
  const { data: settings } = useQuery({
    queryKey: ['settings', userId],
    queryFn: () => fetchUserSettings(userId),
    enabled: !!user,
  });

  // Combined query - depends on all branches
  const { data: dashboard } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => buildDashboard({ posts, followers, settings }),
    enabled: !!posts && !!followers && !!settings,
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Dependency Chains</h3>
        <CodeBlock
          title="Conditional Query Execution"
          code={`function UserContent({ userId, contentType }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Conditional chain based on user type
  const { data: permissions } = useQuery({
    queryKey: ['permissions', userId],
    queryFn: () => fetchPermissions(userId),
    enabled: !!user && user.role === 'admin', // Only for admins
  });

  // This query depends on permissions, but only if they exist
  const { data: adminData } = useQuery({
    queryKey: ['adminData', userId],
    queryFn: () => fetchAdminData(userId),
    enabled: !!permissions && permissions.canAccessAdmin,
  });

  // Alternative chain for non-admins
  const { data: userData } = useQuery({
    queryKey: ['userData', userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!user && user.role !== 'admin',
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use clear dependency conditions</strong> - Make enabled conditions explicit and readable</li>
            <li><strong>Avoid circular dependencies</strong> - Queries shouldn't depend on each other in a loop</li>
            <li><strong>Handle loading states</strong> - Show appropriate loading indicators for each query</li>
            <li><strong>Handle error states</strong> - If a parent query fails, dependent queries won't run</li>
            <li><strong>Use optional chaining</strong> - Use <code className="bg-white px-1 rounded">?.</code> when accessing nested properties</li>
            <li><strong>Consider query key stability</strong> - Ensure query keys don't change unnecessarily</li>
            <li><strong>Minimize dependency depth</strong> - Deep chains can be hard to debug and maintain</li>
          </ul>
        </div>

        <CodeBlock
          title="Good Dependency Pattern"
          code={`function UserContent({ userId }) {
  // Clear, explicit dependencies
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Clear enabled condition
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user && !userLoading, // Explicit condition
  });

  // Handle all states
  if (userLoading) return <div>Loading user...</div>;
  if (userError) return <div>Error loading user</div>;
  if (postsLoading) return <div>Loading posts...</div>;

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Authentication Flow</h3>
        <CodeBlock
          title="Auth-Dependent Queries"
          code={`function ProtectedContent({ userId }) {
  // Check authentication first
  const { data: auth } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuth,
  });

  // Only fetch user if authenticated
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!auth && auth.isAuthenticated,
  });

  // Only fetch protected data if user exists
  const { data: protectedData } = useQuery({
    queryKey: ['protected', userId],
    queryFn: () => fetchProtectedData(userId),
    enabled: !!user && user.hasAccess,
  });

  if (!auth?.isAuthenticated) return <div>Please login</div>;
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Configuration-Based Queries</h3>
        <CodeBlock
          title="Config-Dependent Queries"
          code={`function AppContent() {
  // Load configuration first
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
  });

  // Load features based on config
  const { data: features } = useQuery({
    queryKey: ['features'],
    queryFn: () => fetchFeatures(config.featureFlags),
    enabled: !!config && config.featureFlags,
  });

  // Load data based on enabled features
  const { data: content } = useQuery({
    queryKey: ['content'],
    queryFn: () => fetchContent(features),
    enabled: !!features && features.length > 0,
  });

  return <div>...</div>;
}`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">3.2 Parallel Queries</strong>
          to fetch multiple queries simultaneously and use the useQueries hook.
        </p>
      </div>
    </LessonLayout>
  );
}

