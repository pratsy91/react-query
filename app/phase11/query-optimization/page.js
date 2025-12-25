import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryOptimizationPage() {
  return (
    <LessonLayout
      title="11.1 Query Optimization"
      description="Learn query optimization techniques: deduplication, structural sharing, memoization, notifyOnChangeProps, and selective subscriptions"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Optimization</h2>
        <p className="text-gray-700 mb-4">
          Optimizing queries is crucial for performance. React Query provides several built-in
          optimizations and options to fine-tune query behavior.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Optimization Techniques:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Query deduplication</li>
            <li>Structural sharing</li>
            <li>Memoization</li>
            <li>notifyOnChangeProps</li>
            <li>Selective subscriptions</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Deduplication</h2>
        <p className="text-gray-700 mb-4">
          React Query automatically deduplicates identical queries. Multiple components requesting
          the same query will share a single network request.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automatic Deduplication</h3>
        <CodeBlock
          title="Query Deduplication Example"
          code={`// Multiple components requesting the same query
// React Query automatically deduplicates

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <div>{data?.name}</div>;
}

function UserAvatar({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same query key
    queryFn: () => fetchUser(userId), // Same query function
  });
  return <img src={data?.avatar} alt={data?.name} />;
}

function UserHeader({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same query key
    queryFn: () => fetchUser(userId), // Same query function
  });
  return <h1>{data?.name}</h1>;
}

// All three components share the same query
// Only ONE network request is made
// All components receive the same cached data`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">How Deduplication Works</h3>
        <CodeBlock
          title="Understanding Query Deduplication"
          code={`// React Query deduplicates based on:
// 1. Query key (must match exactly)
// 2. Query function (must be the same)
// 3. Query options (some options affect deduplication)

// ✅ These are deduplicated (same key)
useQuery({ queryKey: ['user', 1], queryFn: fetchUser });
useQuery({ queryKey: ['user', 1], queryFn: fetchUser });

// ❌ These are NOT deduplicated (different keys)
useQuery({ queryKey: ['user', 1], queryFn: fetchUser });
useQuery({ queryKey: ['user', 2], queryFn: fetchUser });

// ❌ These are NOT deduplicated (different functions)
useQuery({ queryKey: ['user', 1], queryFn: fetchUser });
useQuery({ queryKey: ['user', 1], queryFn: fetchUserV2 });

// Deduplication happens automatically
// No configuration needed
// Works across all components in your app`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Structural Sharing</h2>
        <p className="text-gray-700 mb-4">
          Structural sharing ensures that unchanged data references remain the same, preventing
          unnecessary re-renders. React Query enables this by default.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">What is Structural Sharing?</h3>
        <CodeBlock
          title="Structural Sharing Explained"
          code={`// Structural sharing compares old and new data
// Only changed parts create new references
// Unchanged parts keep the same references

// Example:
// Old data: { id: 1, name: 'John', posts: [1, 2, 3] }
// New data: { id: 1, name: 'John', posts: [1, 2, 3, 4] }

// With structural sharing:
// - id: same reference (unchanged)
// - name: same reference (unchanged)
// - posts: new reference (changed - new item added)
// - posts[0], posts[1], posts[2]: same references (unchanged)

// This prevents unnecessary re-renders
// Components only re-render when their data actually changes`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Enabling/Disabling Structural Sharing</h3>
        <CodeBlock
          title="Controlling Structural Sharing"
          code={`// Structural sharing is enabled by default
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  structuralSharing: true, // Default: true
});

// Disable if you need new references every time
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  structuralSharing: false, // Always create new references
});

// Use cases for disabling:
// - When you need to detect all updates
// - When working with mutable data
// - When debugging reference issues`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Structural Sharing</h3>
        <CodeBlock
          title="Custom Structural Sharing Function"
          code={`// You can provide a custom structural sharing function
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  structuralSharing: (oldData, newData) => {
    // Custom comparison logic
    if (!oldData || !newData) return newData;
    
    // Only update if name changed
    if (oldData.name === newData.name) {
      return oldData; // Return old reference
    }
    
    return newData; // Return new reference
  },
});

// Or set globally
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      structuralSharing: (oldData, newData) => {
        // Global structural sharing logic
        return newData;
      },
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Memoization</h2>
        <p className="text-gray-700 mb-4">
          Memoization prevents unnecessary recalculations. Use React's memoization hooks and
          React Query's select option to optimize data transformations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using select for Memoization</h3>
        <CodeBlock
          title="Memoized Data Selection"
          code={`// select option memoizes the transformation
// Component only re-renders when selected data changes

function UserProfile({ userId }) {
  // Transform data with select
  const userName = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only extract name
  });

  // Component only re-renders when name changes
  // Not when other user properties change
  return <div>{userName.data}</div>;
}

// Multiple selections from same query
function UserDetails({ userId }) {
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });

  const { data: email } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.email,
  });

  // Each select is memoized independently
  return (
    <div>
      <div>{name}</div>
      <div>{email}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useMemo with Query Data</h3>
        <CodeBlock
          title="Combining useMemo with Queries"
          code={`import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

function UserStats({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Memoize computed values
  const stats = useMemo(() => {
    if (!user) return null;
    
    return {
      fullName: \`\${user.firstName} \${user.lastName}\`,
      initials: \`\${user.firstName[0]}\${user.lastName[0]}\`,
      postCount: user.posts?.length || 0,
    };
  }, [user]);

  // stats only recalculates when user changes
  return <div>{stats?.fullName}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoizing Query Functions</h3>
        <CodeBlock
          title="Memoized Query Functions"
          code={`import { useMemo } from 'react';

function UserProfile({ userId, filters }) {
  // Memoize query function to prevent recreation
  const queryFn = useMemo(
    () => () => fetchUser(userId, filters),
    [userId, filters]
  );

  const { data } = useQuery({
    queryKey: ['user', userId, filters],
    queryFn,
  });

  return <div>{data?.name}</div>;
}

// Or use useCallback
import { useCallback } from 'react';

function UserProfile({ userId, filters }) {
  const queryFn = useCallback(
    () => fetchUser(userId, filters),
    [userId, filters]
  );

  const { data } = useQuery({
    queryKey: ['user', userId, filters],
    queryFn,
  });

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">notifyOnChangeProps</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">notifyOnChangeProps</code> option controls
          which properties trigger component re-renders. This can significantly reduce unnecessary renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Behavior</h3>
        <CodeBlock
          title="Default notifyOnChangeProps"
          code={`// By default, component re-renders on any query state change
function UserProfile({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Component re-renders when:
  // - data changes
  // - isLoading changes
  // - isFetching changes
  // - error changes
  // - Any other property changes

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Notifications</h3>
        <CodeBlock
          title="Controlling Re-render Triggers"
          code={`// Only re-render when specific properties change
function UserProfile({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    notifyOnChangeProps: ['data', 'error'], // Only notify on data/error changes
  });

  // Component only re-renders when:
  // - data changes
  // - error changes
  // NOT when isLoading or isFetching changes

  return <div>{query.data?.name}</div>;
}

// Track mode: only notify on data changes
function UserName({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    notifyOnChangeProps: ['data'], // Only data changes
  });

  return <div>{query.data?.name}</div>;
}

// Track mode: notify on all changes (default)
function UserProfileFull({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    notifyOnChangeProps: 'all', // All changes (default)
  });

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Performance Impact</h3>
        <CodeBlock
          title="Optimizing with notifyOnChangeProps"
          code={`// Without optimization: re-renders on every state change
function UserList() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  // Re-renders when:
  // - data changes
  // - isLoading changes (true -> false)
  // - isFetching changes (true -> false, false -> true)

  return (
    <div>
      {data?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// With optimization: only re-renders on data changes
function UserListOptimized() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    notifyOnChangeProps: ['data'], // Only data changes
  });

  // Re-renders only when:
  // - data changes

  return (
    <div>
      {data?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Selective Subscriptions</h2>
        <p className="text-gray-700 mb-4">
          Selective subscriptions allow components to subscribe only to specific parts of query state,
          reducing unnecessary re-renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using select for Subscriptions</h3>
        <CodeBlock
          title="Selective Query Subscriptions"
          code={`// Subscribe only to specific data
function UserName({ userId }) {
  // Only subscribe to name property
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only subscribe to name
  });

  // Component only re-renders when name changes
  // Not when email, avatar, or other properties change
  return <div>{name}</div>;
}

function UserEmail({ userId }) {
  // Only subscribe to email property
  const { data: email } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.email, // Only subscribe to email
  });

  // Component only re-renders when email changes
  return <div>{email}</div>;
}

// Both components use the same query
// But only subscribe to their specific data
// Reduces unnecessary re-renders`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Selective Subscriptions</h3>
        <CodeBlock
          title="Multiple Components with Selective Subscriptions"
          code={`// Component 1: Only needs name
function UserName({ userId }) {
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });
  return <div>{name}</div>;
}

// Component 2: Only needs email
function UserEmail({ userId }) {
  const { data: email } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.email,
  });
  return <div>{email}</div>;
}

// Component 3: Only needs avatar
function UserAvatar({ userId }) {
  const { data: avatar } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.avatar,
  });
  return <img src={avatar} />;
}

// All three components share the same query
// Each only re-renders when their specific data changes
// Maximum performance optimization`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combining with notifyOnChangeProps</h3>
        <CodeBlock
          title="Maximum Optimization"
          code={`// Combine select with notifyOnChangeProps for maximum optimization
function UserName({ userId }) {
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only extract name
    notifyOnChangeProps: ['data'], // Only notify on data changes
  });

  // Component only re-renders when:
  // - name actually changes
  // NOT when:
  // - isLoading changes
  // - isFetching changes
  // - Other user properties change

  return <div>{name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Let React Query deduplicate</strong> - Don't manually deduplicate queries</li>
            <li><strong>Keep structural sharing enabled</strong> - Only disable if necessary</li>
            <li><strong>Use select for transformations</strong> - Memoize data transformations</li>
            <li><strong>Use notifyOnChangeProps</strong> - Reduce unnecessary re-renders</li>
            <li><strong>Subscribe selectively</strong> - Only subscribe to needed data</li>
            <li><strong>Memoize query functions</strong> - Prevent function recreation</li>
            <li><strong>Profile before optimizing</strong> - Measure performance first</li>
            <li><strong>Don't over-optimize</strong> - Optimize only when needed</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">11.2 Rendering Optimization</strong>
          for component splitting, query result memoization, preventing unnecessary re-renders, and React.memo integration.
        </p>
      </div>
    </LessonLayout>
  );
}

