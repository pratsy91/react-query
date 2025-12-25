import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CacheConfigurationPage() {
  return (
    <LessonLayout
      title="4.1 Cache Configuration"
      description="Learn how to configure caching strategies, manage cache time, and optimize cache behavior"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Understanding Cache Configuration</h2>
        <p className="text-gray-700 mb-4">
          Cache configuration is crucial for optimizing performance and managing memory. TanStack Query
          provides several options to control how data is cached and when it becomes stale.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Concepts:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>staleTime</strong> - How long data is considered fresh</li>
            <li><strong>cacheTime/gcTime</strong> - How long unused data stays in cache</li>
            <li><strong>Cache invalidation</strong> - Marking data as stale</li>
            <li><strong>Cache persistence</strong> - Saving cache to storage</li>
            <li><strong>Cache size</strong> - Managing memory usage</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">staleTime Strategies</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">staleTime</code> determines how long data is
          considered fresh. Fresh data won't trigger background refetches.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 1: Always Fresh (Never Stale)</h3>
        <CodeBlock
          title="Data That Rarely Changes"
          code={`// Configuration data, reference data, static content
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: Infinity, // Never becomes stale
  // Data will only refetch if manually invalidated
});

// User profile (changes infrequently)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60 * 60, // 1 hour - stays fresh for 1 hour
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 2: Medium Freshness</h3>
        <CodeBlock
          title="Moderately Changing Data"
          code={`// Posts, comments, user lists
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 1000 * 60 * 5, // 5 minutes
  // Data is fresh for 5 minutes, then becomes stale
  // Stale data is still used, but triggers background refetch
});

// Dashboard data
useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchDashboard,
  staleTime: 1000 * 60 * 2, // 2 minutes
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 3: Always Stale (Real-time)</h3>
        <CodeBlock
          title="Frequently Changing Data"
          code={`// Real-time notifications
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0, // Always stale (default)
  refetchInterval: 5000, // Poll every 5 seconds
});

// Live chat messages
useQuery({
  queryKey: ['messages', chatId],
  queryFn: () => fetchMessages(chatId),
  staleTime: 0,
  refetchInterval: 2000, // Poll every 2 seconds
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 4: Conditional staleTime</h3>
        <CodeBlock
          title="Dynamic staleTime Based on Data"
          code={`useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: (query) => {
    // Adjust staleTime based on user role
    const user = query.state.data;
    if (user?.role === 'admin') {
      return 1000 * 60 * 10; // 10 minutes for admins
    }
    return 1000 * 60 * 5; // 5 minutes for regular users
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">cacheTime / gcTime Management</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">cacheTime</code> (v4) or <code className="bg-gray-100 px-1 rounded">gcTime</code> (v5+)
          determines how long unused data stays in cache before being garbage collected.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> In v5+, <code className="bg-white px-1 rounded">cacheTime</code> was renamed to
            <code className="bg-white px-1 rounded">gcTime</code> (garbage collection time) for clarity.
          </p>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Short Cache Time</h3>
        <CodeBlock
          title="Quick Cleanup for Memory Management"
          code={`// Large datasets that shouldn't stay in memory
useQuery({
  queryKey: ['largeList'],
  queryFn: fetchLargeList,
  cacheTime: 1000 * 60, // 1 minute
  // Unused data removed after 1 minute
});

// Temporary data
useQuery({
  queryKey: ['tempData'],
  queryFn: fetchTempData,
  cacheTime: 0, // Remove immediately when unused
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Medium Cache Time</h3>
        <CodeBlock
          title="Default Behavior"
          code={`// Default: 5 minutes
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  cacheTime: 1000 * 60 * 5, // 5 minutes (default)
  // Good balance between memory and performance
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Long Cache Time</h3>
        <CodeBlock
          title="Keep Data Available Longer"
          code={`// Data that's expensive to fetch
useQuery({
  queryKey: ['expensiveData'],
  queryFn: fetchExpensiveData,
  cacheTime: 1000 * 60 * 60, // 1 hour
  // Keep in cache for 1 hour even when unused
});

// Never garbage collect
useQuery({
  queryKey: ['criticalData'],
  queryFn: fetchCriticalData,
  cacheTime: Infinity, // Never remove
  // Use with caution - can cause memory issues
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Invalidation Patterns</h2>
        <p className="text-gray-700 mb-4">
          Cache invalidation is the process of marking cached data as stale so it will be refetched.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: After Mutations</h3>
        <CodeBlock
          title="Invalidate After Data Changes"
          code={`function UpdatePost({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Time-Based Invalidation</h3>
        <CodeBlock
          title="Invalidate After Time Period"
          code={`useEffect(() => {
  const interval = setInterval(() => {
    // Invalidate stale queries every 5 minutes
    queryClient.invalidateQueries({
      predicate: (query) => {
        const state = query.state;
        if (!state.dataUpdatedAt) return false;
        
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        return state.dataUpdatedAt < fiveMinutesAgo;
      },
    });
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, [queryClient]);`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Event-Based Invalidation</h3>
        <CodeBlock
          title="Invalidate on User Actions"
          code={`// Invalidate on window focus
window.addEventListener('focus', () => {
  queryClient.invalidateQueries({ type: 'active' });
});

// Invalidate on network reconnect
window.addEventListener('online', () => {
  queryClient.invalidateQueries({ type: 'active' });
});

// Invalidate on route change
useEffect(() => {
  const unsubscribe = router.subscribe(() => {
    queryClient.invalidateQueries({ type: 'active' });
  });
  
  return unsubscribe;
}, [router, queryClient]);`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Persistence</h2>
        <p className="text-gray-700 mb-4">
          Cache persistence allows you to save the query cache to storage (localStorage, sessionStorage, etc.)
          and restore it when the app loads.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Persistence Pattern</h3>
        <CodeBlock
          title="Save and Restore Cache"
          code={`import { QueryClient } from '@tanstack/react-query';

// Save cache to localStorage
function saveCache(cache) {
  const cacheData = {
    timestamp: Date.now(),
    cache: cache,
  };
  localStorage.setItem('react-query-cache', JSON.stringify(cacheData));
}

// Restore cache from localStorage
function restoreCache() {
  const cached = localStorage.getItem('react-query-cache');
  if (!cached) return undefined;
  
  const { cache, timestamp } = JSON.parse(cached);
  
  // Only restore if cache is less than 1 hour old
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  if (timestamp < oneHourAgo) {
    return undefined;
  }
  
  return cache;
}

// Use in QueryClient setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ... other options
    },
  },
});

// Subscribe to cache changes
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated') {
    saveCache(queryClient.getQueryCache().getAll());
  }
});

// Restore on mount
const restoredCache = restoreCache();
if (restoredCache) {
  restoredCache.forEach((query) => {
    queryClient.setQueryData(query.queryKey, query.state.data);
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using Persist Plugin</h3>
        <CodeBlock
          title="Official Persist Plugin (if available)"
          code={`// Note: This is a conceptual example
// Check TanStack Query docs for official persistence plugins

import { persistQueryClient } from '@tanstack/query-persist-client-core';

persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
  }),
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Size Management</h2>
        <p className="text-gray-700 mb-4">
          Managing cache size is important for memory optimization, especially in applications with
          large amounts of data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Limiting Cache Size</h3>
        <CodeBlock
          title="Remove Old Queries"
          code={`// Remove queries older than threshold
function cleanupOldQueries() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  queryClient.removeQueries({
    predicate: (query) => {
      const state = query.state;
      if (!state.dataUpdatedAt) return false;
      
      return state.dataUpdatedAt < oneHourAgo;
    },
  });
}

// Run cleanup periodically
useEffect(() => {
  const interval = setInterval(cleanupOldQueries, 10 * 60 * 1000);
  return () => clearInterval(interval);
}, []);`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Limiting Number of Queries</h3>
        <CodeBlock
          title="Keep Only N Most Recent Queries"
          code={`function limitCacheSize(maxQueries = 50) {
  const allQueries = queryClient.getQueryCache().getAll();
  
  if (allQueries.length <= maxQueries) return;
  
  // Sort by last access time
  const sorted = allQueries.sort((a, b) => {
    const aTime = a.state.dataUpdatedAt || 0;
    const bTime = b.state.dataUpdatedAt || 0;
    return bTime - aTime;
  });
  
  // Remove oldest queries
  const toRemove = sorted.slice(maxQueries);
  toRemove.forEach(query => {
    queryClient.removeQueries({ queryKey: query.queryKey });
  });
}

// Call periodically
useEffect(() => {
  const interval = setInterval(() => limitCacheSize(50), 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memory-Aware Cache Management</h3>
        <CodeBlock
          title="Monitor and Manage Memory"
          code={`function manageCacheMemory() {
  // Get all queries
  const queries = queryClient.getQueryCache().getAll();
  
  // Estimate memory usage (rough calculation)
  const estimateSize = (query) => {
    try {
      return JSON.stringify(query.state.data).length;
    } catch {
      return 0;
    }
  };
  
  const totalSize = queries.reduce((sum, query) => 
    sum + estimateSize(query), 0
  );
  
  const maxSize = 10 * 1024 * 1024; // 10MB limit
  
  if (totalSize > maxSize) {
    // Remove largest queries first
    const sorted = queries.sort((a, b) => 
      estimateSize(b) - estimateSize(a)
    );
    
    // Remove top 20% largest
    const toRemove = sorted.slice(0, Math.ceil(sorted.length * 0.2));
    toRemove.forEach(query => {
      queryClient.removeQueries({ queryKey: query.queryKey });
    });
  }
}

// Monitor memory periodically
useEffect(() => {
  const interval = setInterval(manageCacheMemory, 2 * 60 * 1000);
  return () => clearInterval(interval);
}, []);`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Match staleTime to data freshness</strong> - Static data: Infinity, dynamic: shorter times</li>
            <li><strong>Use appropriate cacheTime</strong> - Balance between memory and performance</li>
            <li><strong>Invalidate after mutations</strong> - Keep cache in sync with server</li>
            <li><strong>Monitor cache size</strong> - Prevent memory issues in long-running apps</li>
            <li><strong>Use persistence wisely</strong> - Only persist data that benefits from it</li>
            <li><strong>Clean up unused queries</strong> - Remove old data periodically</li>
            <li><strong>Consider data size</strong> - Large datasets need shorter cache times</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">4.2 Query Invalidation</strong>
          to understand all the ways to invalidate queries and keep your cache in sync.
        </p>
      </div>
    </LessonLayout>
  );
}

