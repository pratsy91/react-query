import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function BackgroundRefetchingPage() {
  return (
    <LessonLayout
      title="4.4 Background Refetching"
      description="Learn how to configure automatic background refetching to keep data fresh without user interaction"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Background Refetching?</h2>
        <p className="text-gray-700 mb-4">
          Background refetching automatically updates cached data in the background without blocking
          the UI or requiring user interaction. This keeps data fresh while maintaining a responsive user experience.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Fresh data</strong> - Cache stays up-to-date automatically</li>
            <li><strong>Non-blocking</strong> - Updates happen in background</li>
            <li><strong>Seamless UX</strong> - Users see updates without manual refresh</li>
            <li><strong>Reduced perceived latency</strong> - Data updates while user works</li>
          </ul>
        </div>

        <CodeBlock
          title="Background Refetching Example"
          code={`import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const { data, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // isFetching indicates background refetch is happening
  return (
    <div>
      {isFetching && <div className="subtle-indicator">Updating...</div>}
      <div>{data?.content}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Background Updates</h2>
        <p className="text-gray-700 mb-4">
          Background updates happen automatically when data becomes stale. The UI continues to show
          cached data while fresh data is fetched in the background.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">How Background Updates Work</h3>
        <CodeBlock
          title="Background Update Flow"
          code={`function UserProfile({ userId }) {
  const { data, isFetching, isRefetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
    
    // Timeline:
    // 0:00 - Data fetched, marked as FRESH
    // 0:01 - Component shows cached data (no refetch)
    // 5:00 - Data becomes STALE (but still shown)
    // 5:01 - Component accessed, background refetch triggered
    //       - isFetching: true, isRefetching: true
    //       - data: still shows old cached data
    // 5:02 - Fresh data received, cache updated
    //       - isFetching: false, isRefetching: false
    //       - data: now shows fresh data
  });

  return (
    <div>
      {isRefetching && <div>Updating in background...</div>}
      <div>{data?.name}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Silent Background Updates</h3>
        <CodeBlock
          title="Update Without UI Indicators"
          code={`function SilentUpdate() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 0, // Always stale
    refetchInterval: 10000, // Poll every 10 seconds
    refetchIntervalInBackground: true, // Continue in background
    // Updates happen silently - no loading indicators needed
  });

  // Data updates automatically in background
  return <div>Notifications: {data?.count}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchOnWindowFocus</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">refetchOnWindowFocus</code> option refetches
          queries when the browser window regains focus. This is useful for keeping data fresh when
          users return to your app.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Refetch on Focus"
          code={`function Dashboard() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchOnWindowFocus: true, // Default: true
    // When user switches back to tab, data is refetched
  });

  return <div>{data?.content}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Disable for Specific Queries</h3>
        <CodeBlock
          title="Prevent Refetch on Focus"
          code={`function StaticContent() {
  const { data } = useQuery({
    queryKey: ['staticContent'],
    queryFn: fetchStaticContent,
    refetchOnWindowFocus: false, // Don't refetch on focus
    staleTime: Infinity, // Never becomes stale
    // Good for content that rarely changes
  });

  return <div>{data?.content}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Refetch on Focus</h3>
        <CodeBlock
          title="Smart Refetch Logic"
          code={`function SmartRefetch({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    refetchOnWindowFocus: (query) => {
      // Only refetch if data is older than 5 minutes
      const state = query.state;
      if (!state.dataUpdatedAt) return true;
      
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      return state.dataUpdatedAt < fiveMinutesAgo;
    },
  });

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchOnReconnect</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">refetchOnReconnect</code> option refetches
          queries when the network connection is restored. This ensures data is fresh after network
          interruptions.
        </p>

        <CodeBlock
          title="Refetch on Network Reconnect"
          code={`function OnlineData() {
  const { data } = useQuery({
    queryKey: ['onlineData'],
    queryFn: fetchOnlineData,
    refetchOnReconnect: true, // Default: true
    // When network reconnects, data is automatically refetched
  });

  return <div>{data?.content}</div>;
}

// Disable for offline-first apps
function OfflineFirstData() {
  const { data } = useQuery({
    queryKey: ['offlineData'],
    queryFn: fetchOfflineData,
    refetchOnReconnect: false, // Don't refetch on reconnect
    // Use cached data even after reconnection
  });

  return <div>{data?.content}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchInterval - Polling</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">refetchInterval</code> option enables
          automatic polling, refetching queries at regular intervals.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Fixed Interval Polling</h3>
        <CodeBlock
          title="Poll at Fixed Intervals"
          code={`function LiveNotifications() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 5000, // Poll every 5 seconds
    // Data is automatically refetched every 5 seconds
  });

  return <div>Notifications: {data?.count}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Polling</h3>
        <CodeBlock
          title="Poll Based on Conditions"
          code={`function ConditionalPolling() {
  const { data } = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: (query) => {
      // Only poll if status is 'pending'
      const status = query.state.data?.status;
      return status === 'pending' ? 2000 : false;
      // Poll every 2 seconds if pending, stop if completed
    },
  });

  return <div>Status: {data?.status}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Interval</h3>
        <CodeBlock
          title="Adjust Polling Frequency"
          code={`function AdaptivePolling() {
  const { data } = useQuery({
    queryKey: ['updates'],
    queryFn: fetchUpdates,
    refetchInterval: (query) => {
      const lastUpdate = query.state.data?.lastUpdate;
      if (!lastUpdate) return 5000; // Default: 5 seconds
      
      const timeSinceUpdate = Date.now() - lastUpdate;
      
      // Poll more frequently if no recent updates
      if (timeSinceUpdate > 60000) {
        return 2000; // Every 2 seconds
      }
      
      // Poll less frequently if updates are recent
      return 10000; // Every 10 seconds
    },
  });

  return <div>Updates: {data?.count}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchIntervalInBackground</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">refetchIntervalInBackground</code> option
          controls whether polling continues when the browser tab is in the background.
        </p>

        <CodeBlock
          title="Background Polling Control"
          code={`// Continue polling in background (default: false)
function BackgroundPolling() {
  const { data } = useQuery({
    queryKey: ['liveData'],
    queryFn: fetchLiveData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true, // Continue when tab is in background
    // Useful for real-time data that needs constant updates
  });

  return <div>{data?.value}</div>;
}

// Stop polling in background (default: false)
function ForegroundOnlyPolling() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    refetchInterval: 5000,
    refetchIntervalInBackground: false, // Stop when tab is in background
    // Saves resources when user isn't viewing the tab
  });

  return <div>{data?.value}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Silent Background Updates</h2>
        <p className="text-gray-700 mb-4">
          Silent background updates happen without showing loading indicators, providing a seamless
          user experience.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Implementation Pattern</h3>
        <CodeBlock
          title="Silent Updates Pattern"
          code={`function SilentUpdate() {
  const { data, isFetching } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    // Updates happen in background
  });

  // Only show loading on initial load, not on background refetch
  if (!data) {
    return <div>Loading...</div>;
  }

  // Background updates happen silently
  // isFetching is true during background refetch
  // but we don't show loading indicator
  return (
    <div>
      <div>{data.content}</div>
      {/* Optionally show subtle indicator */}
      {isFetching && (
        <div className="subtle-update-indicator">Updating...</div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Distinguish Initial Load from Refetch</h3>
        <CodeBlock
          title="Differentiate Loading States"
          code={`function SmartLoading({ userId }) {
  const { data, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // isLoading: true only on initial load (no cached data)
  // isFetching: true on any fetch (initial or refetch)
  // isRefetching: true only on background refetch

  if (isLoading) {
    return <div>Loading user...</div>; // Show on initial load
  }

  return (
    <div>
      <div>{data.name}</div>
      {isRefetching && (
        <div className="subtle">Refreshing...</div> // Subtle indicator for refetch
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use appropriate staleTime</strong> - Balance freshness with performance</li>
            <li><strong>Disable for static data</strong> - Don't refetch data that never changes</li>
            <li><strong>Limit polling frequency</strong> - Don't overwhelm the server</li>
            <li><strong>Stop polling in background</strong> - Save resources when tab is hidden</li>
            <li><strong>Show subtle indicators</strong> - Let users know data is updating</li>
            <li><strong>Distinguish initial load from refetch</strong> - Different UX for each</li>
            <li><strong>Use conditional polling</strong> - Only poll when necessary</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">4.5 Data Transformation</strong>
          to transform and normalize data using the select option.
        </p>
      </div>
    </LessonLayout>
  );
}

