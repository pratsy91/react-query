import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseQueryOptionsPage() {
  return (
    <LessonLayout
      title="1.3 useQuery Hook - Part 2: Caching & Refetch Options"
      description="Learn about staleTime, cacheTime, refetch options, and data transformation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">staleTime - Fresh vs Stale Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">staleTime</code> determines how long data is
          considered fresh. Fresh data won't trigger a background refetch.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Understanding Stale Time</h3>
        <CodeBlock
          title="Stale Time Examples"
          code={`// Data is always stale (default)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: 0, // Refetch immediately when data is accessed
});

// Data is fresh for 5 minutes
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: 1000 * 60 * 5, // 5 minutes
  // Data won't refetch for 5 minutes after initial fetch
});

// Data never becomes stale
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: Infinity, // Never refetch automatically
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Stale Time Behavior</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <pre className="text-gray-700 font-mono text-sm">
{`Timeline with staleTime: 5 minutes

0:00 - Query fetches, data marked as FRESH
0:01 - Component accesses data → No refetch (still fresh)
2:00 - Component accesses data → No refetch (still fresh)
4:59 - Component accesses data → No refetch (still fresh)
5:00 - Data becomes STALE (but still in cache)
5:01 - Component accesses data → Background refetch triggered
5:02 - Fresh data received, marked as FRESH again`}
          </pre>
        </div>

        <CodeBlock
          title="Use Cases for Different Stale Times"
          code={`// User profile - rarely changes, keep fresh longer
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: 1000 * 60 * 30, // 30 minutes
});

// Real-time data - always refetch
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0, // Always refetch
  refetchInterval: 5000, // Poll every 5 seconds
});

// Static reference data - never stale
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: Infinity, // Never refetch
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">cacheTime / gcTime - Garbage Collection</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">cacheTime</code> (v4) or <code className="bg-gray-100 px-1 rounded">gcTime</code> (v5+)
          determines how long unused data stays in cache before being garbage collected.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> In v5+, <code className="bg-gray-100 px-1 rounded">cacheTime</code> was renamed to
            <code className="bg-gray-100 px-1 rounded">gcTime</code> (garbage collection time) for clarity.
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Time Behavior</h3>
        <CodeBlock
          title="Cache Time Examples"
          code={`// Default: 5 minutes
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  cacheTime: 1000 * 60 * 5, // v4
  // gcTime: 1000 * 60 * 5, // v5+
});

// Keep in cache for 1 hour
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  cacheTime: 1000 * 60 * 60, // 1 hour
});

// Never garbage collect
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  cacheTime: Infinity,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Understanding Garbage Collection</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <pre className="text-gray-700 font-mono text-sm">
{`Garbage Collection Timeline:

1. Component mounts → Query fetches → Data cached
2. Component unmounts → Query becomes inactive
3. Timer starts: cacheTime countdown begins
4. If component remounts before cacheTime expires:
   → Data still in cache, no refetch needed
5. If cacheTime expires:
   → Data removed from cache (garbage collected)
   → Next mount will trigger a new fetch`}
          </pre>
        </div>

        <CodeBlock
          title="Cache Time vs Stale Time"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  staleTime: 1000 * 60 * 5,   // Fresh for 5 minutes
  cacheTime: 1000 * 60 * 30,  // Keep in cache for 30 minutes
  
  // Behavior:
  // - Data is fresh for 5 minutes (no refetch)
  // - After 5 minutes, data is stale but still cached
  // - If component unmounts, data stays in cache for 30 minutes
  // - If component remounts within 30 minutes, cached data is used
  // - After 30 minutes of inactivity, data is garbage collected
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Refetch Options</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query provides several options to control when queries refetch automatically.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchOnMount</h3>
        <CodeBlock
          title="Refetch on Component Mount"
          code={`// Always refetch when component mounts (default: true)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnMount: true,
});

// Use cached data if available (don't refetch)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnMount: false,
});

// Refetch only if data is stale
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnMount: 'always', // Always refetch
  // or
  refetchOnMount: true,     // Always refetch
  // or
  refetchOnMount: false,    // Never refetch
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchOnWindowFocus</h3>
        <CodeBlock
          title="Refetch on Window Focus"
          code={`// Refetch when user returns to window (default: true)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnWindowFocus: true,
});

// Don't refetch on window focus
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnWindowFocus: false,
});

// Useful for dashboards that should stay updated
useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchDashboard,
  refetchOnWindowFocus: true, // Refresh when user returns
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchOnReconnect</h3>
        <CodeBlock
          title="Refetch on Network Reconnect"
          code={`// Refetch when network reconnects (default: true)
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnReconnect: true,
});

// Don't refetch on reconnect
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  refetchOnReconnect: false,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchInterval - Polling</h3>
        <CodeBlock
          title="Automatic Polling"
          code={`// Poll every 5 seconds
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 5000, // 5 seconds
});

// Conditional polling
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: (query) => {
    // Only poll if there are unread notifications
    return query.state.data?.unreadCount > 0 ? 5000 : false;
  },
});

// Poll with delay function
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 5000,
  refetchIntervalInBackground: false, // Don't poll when tab is in background
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchIntervalInBackground</h3>
        <CodeBlock
          title="Background Polling Control"
          code={`// Continue polling even when tab is in background
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 5000,
  refetchIntervalInBackground: true,
});

// Stop polling when tab is in background (default: false)
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 5000,
  refetchIntervalInBackground: false,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">select - Data Transformation</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">select</code> option allows you to transform
          or select a portion of the data returned from the query function.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Data Selection</h3>
        <CodeBlock
          title="Selecting Specific Fields"
          code={`// Full data
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  // data: { id: 1, name: 'John', email: 'john@example.com', posts: [...] }
});

// Select only name
const { data: userName } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  select: (user) => user.name, // data: 'John'
});

// Select multiple fields
const { data: userInfo } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  select: (user) => ({
    name: user.name,
    email: user.email,
  }), // data: { name: 'John', email: 'john@example.com' }
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoization with select</h3>
        <CodeBlock
          title="Preventing Unnecessary Re-renders"
          code={`// Without select - re-renders when any field changes
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});

// With select - only re-renders when selected field changes
const { data: userName } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  select: (user) => user.name,
  // Component only re-renders if user.name changes
  // Even if user.email or other fields update, no re-render
});

// Complex transformation
const { data: postCount } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  select: (user) => user.posts?.length ?? 0,
  // Only re-renders if post count changes
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Select with Computed Values</h3>
        <CodeBlock
          title="Derived Data"
          code={`// Compute derived values
const { data: stats } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  select: (user) => ({
    fullName: \`\${user.firstName} \${user.lastName}\`,
    postCount: user.posts?.length ?? 0,
    hasPosts: (user.posts?.length ?? 0) > 0,
    averageLikes: user.posts?.reduce((sum, p) => sum + p.likes, 0) / (user.posts?.length || 1),
  }),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">placeholderData - Placeholder Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">placeholderData</code> provides data to display
          while the query is loading. Unlike initialData, placeholderData is not persisted to cache.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Static Placeholder Data</h3>
        <CodeBlock
          title="Simple Placeholder"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: {
    id: userId,
    name: 'Loading...',
    email: '',
  },
  // This data is shown immediately, before fetch completes
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Function Placeholder</h3>
        <CodeBlock
          title="Dynamic Placeholder"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: () => ({
    id: userId,
    name: 'Loading user...',
    email: '',
  }),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Previous Data as Placeholder</h3>
        <CodeBlock
          title="Keep Previous Data"
          code={`// Show previous data while new data loads
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: (previousData) => previousData,
  // When userId changes, show old user data while new user loads
});

// Or use keepPreviousData option (v4, deprecated in v5)
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  placeholderData: (previousData) => previousData,
  // Same effect as keepPreviousData: true (v4)
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">initialData - Initial Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">initialData</code> provides initial data that
          is persisted to cache. Useful for data from SSR, localStorage, or other sources.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Static Initial Data</h3>
        <CodeBlock
          title="Basic Initial Data"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  initialData: {
    id: userId,
    name: 'Unknown User',
    email: '',
  },
  // This data is cached and used if query hasn't fetched yet
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Function Initial Data</h3>
        <CodeBlock
          title="Dynamic Initial Data"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  initialData: () => {
    // Get from localStorage
    const cached = localStorage.getItem(\`user-\${userId}\`);
    return cached ? JSON.parse(cached) : undefined;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Initial Data from Cache</h3>
        <CodeBlock
          title="Using Previous Query Data"
          code={`// Use data from another query as initial data
const { data: userList } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  initialData: () => {
    // Find user in the list
    return userList?.find(u => u.id === userId);
  },
  enabled: !!userList, // Only run after userList is loaded
});`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Difference:</strong> <code className="bg-gray-100 px-1 rounded">initialData</code> is
            cached and treated as real data, while <code className="bg-gray-100 px-1 rounded">placeholderData</code>
            is temporary and not cached.
          </p>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover advanced options including
          suspense mode, error boundaries, structural sharing, and network modes.
        </p>
      </div>
    </LessonLayout>
  );
}

