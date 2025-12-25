import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function PerformanceTuningPage() {
  return (
    <LessonLayout
      title="20.1 Performance Tuning"
      description="Learn performance tuning: profiling queries, identifying bottlenecks, optimization strategies, and monitoring and metrics"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Performance Tuning</h2>
        <p className="text-gray-700 mb-4">
          Performance tuning is essential for building fast, responsive applications. Understanding
          how to profile, identify bottlenecks, and optimize React Query usage is crucial.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Performance Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Profiling queries</li>
            <li>Identifying bottlenecks</li>
            <li>Optimization strategies</li>
            <li>Monitoring and metrics</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Profiling Queries</h2>
        <p className="text-gray-700 mb-4">
          Profiling helps you understand query performance, identify slow queries, and measure
          the impact of optimizations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using React Query DevTools</h3>
        <CodeBlock
          title="Profiling with DevTools"
          code={`// React Query DevTools provides profiling capabilities

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools 
        initialIsOpen={false}
        // DevTools shows:
        // - Query execution time
        // - Cache hit/miss rates
        // - Query status over time
        // - Network requests
      />
    </QueryClientProvider>
  );
}

// DevTools features for profiling:
// 1. Query Inspector
//    - View query execution time
//    - See cache status
//    - Check query options

// 2. Network Tab
//    - Monitor API calls
//    - See request/response times
//    - Identify slow endpoints

// 3. Cache Visualization
//    - See cache size
//    - Monitor cache hits/misses
//    - Track query dependencies`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Profiling</h3>
        <CodeBlock
          title="Building Custom Profiling"
          code={`// Custom profiling hook
function useQueryProfiler(queryKey) {
  const queryClient = useQueryClient();
  const [metrics, setMetrics] = useState({
    fetchCount: 0,
    totalTime: 0,
    averageTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
  });

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.find({ queryKey });

    if (!query) return;

    const startTime = performance.now();
    let fetchCount = 0;

    const unsubscribe = queryCache.subscribe((event) => {
      if (event.query.queryKey === queryKey) {
        if (event.type === 'updated') {
          const endTime = performance.now();
          const duration = endTime - startTime;

          fetchCount++;
          
          setMetrics(prev => ({
            fetchCount: prev.fetchCount + 1,
            totalTime: prev.totalTime + duration,
            averageTime: (prev.totalTime + duration) / (prev.fetchCount + 1),
            cacheHits: query.state.data ? prev.cacheHits + 1 : prev.cacheHits,
            cacheMisses: !query.state.data ? prev.cacheMisses + 1 : prev.cacheMisses,
          }));
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient, queryKey]);

  return metrics;
}

// Usage
function ProfiledComponent() {
  const metrics = useQueryProfiler(['users']);

  return (
    <div>
      <div>Fetches: {metrics.fetchCount}</div>
      <div>Avg Time: {metrics.averageTime.toFixed(2)}ms</div>
      <div>Cache Hit Rate: {(metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100).toFixed(2)}%</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Identifying Bottlenecks</h2>
        <p className="text-gray-700 mb-4">
          Identifying bottlenecks helps you focus optimization efforts on the areas that will
          have the biggest impact.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Common Bottlenecks</h3>
        <CodeBlock
          title="Identifying Performance Issues"
          code={`// Common bottlenecks in React Query:

// 1. Too many queries
// Problem: Fetching too much data at once
function Dashboard() {
  // ❌ Fetching 10+ queries simultaneously
  const { data: users } = useQuery(['users'], fetchUsers);
  const { data: posts } = useQuery(['posts'], fetchPosts);
  const { data: comments } = useQuery(['comments'], fetchComments);
  // ... 7 more queries

  // Solution: Use useQueries with limits
  // Or fetch data on demand
  // Or combine related queries
}

// 2. Unnecessary refetches
// Problem: Refetching too frequently
function UserList() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 1000, // ❌ Too frequent
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Solution: Increase staleTime
  // Reduce refetchInterval
  // Use refetchOnWindowFocus selectively
}

// 3. Large query results
// Problem: Fetching too much data
function PostList() {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(), // ❌ Returns 10,000 posts
  });

  // Solution: Use pagination
  // Use infinite queries
  // Use select to filter data
}

// 4. Expensive select functions
// Problem: Complex transformations on every render
function ExpensiveComponent() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: (users) => {
      // ❌ Complex calculation on every render
      return users
        .map(u => expensiveTransform(u))
        .filter(u => complexFilter(u))
        .sort((a, b) => complexSort(a, b));
    },
  });

  // Solution: Memoize select function
  // Use useMemo for transformations
  // Move logic to backend if possible
}

// 5. Cache size issues
// Problem: Too much data in cache
function LargeCache() {
  // ❌ Storing too much in cache
  // No cache cleanup
  // No gcTime limits

  // Solution: Set appropriate gcTime
  // Clean up old queries
  // Use cache size limits
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Bottleneck Detection Tools</h3>
        <CodeBlock
          title="Tools for Identifying Bottlenecks"
          code={`// 1. React DevTools Profiler
// - Identify slow renders
// - See component render times
// - Find unnecessary re-renders

// 2. Chrome DevTools Performance
// - Record performance
// - See JavaScript execution time
// - Identify long tasks

// 3. Network Tab
// - See request times
// - Identify slow endpoints
// - Check payload sizes

// 4. React Query DevTools
// - Query execution times
// - Cache hit rates
// - Query dependencies

// 5. Custom metrics
function usePerformanceMetrics() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  const metrics = {
    totalQueries: queryCache.getAll().length,
    activeQueries: queryCache.getAll().filter(q => q.getObserversCount() > 0).length,
    staleQueries: queryCache.getAll().filter(q => q.isStale()).length,
    fetchingQueries: queryCache.getAll().filter(q => q.state.fetchStatus === 'fetching').length,
  };

  return metrics;
}

// 6. Performance API
function measureQueryPerformance(queryKey, queryFn) {
  const startMark = \`query-start-\${queryKey.join('-')}\`;
  const endMark = \`query-end-\${queryKey.join('-')}\`;

  performance.mark(startMark);

  return queryFn().then((data) => {
    performance.mark(endMark);
    performance.measure(\`query-\${queryKey.join('-')}\`, startMark, endMark);

    const measure = performance.getEntriesByName(\`query-\${queryKey.join('-')}\`)[0];
    console.log(\`Query \${queryKey.join('/')} took \${measure.duration}ms\`);

    return data;
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Optimization Strategies</h2>
        <p className="text-gray-700 mb-4">
          Optimization strategies help you improve performance systematically.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Optimization</h3>
        <CodeBlock
          title="Optimizing Queries"
          code={`// 1. Increase staleTime
function OptimizedQuery() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // ✅ 5 minutes
    // Reduces unnecessary refetches
  });
}

// 2. Use select for transformations
function TransformedQuery() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: (users) => users.map(u => u.name), // ✅ Only subscribe to names
    // Reduces re-renders when other fields change
  });
}

// 3. Enable structural sharing
function SharedQuery() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    structuralSharing: true, // ✅ Default, prevents unnecessary updates
  });
}

// 4. Use pagination
function PaginatedQuery() {
  const [page, setPage] = useState(0);
  
  const { data } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers({ page, limit: 20 }), // ✅ Fetch only 20 items
  });
}

// 5. Debounce search queries
function DebouncedSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });
}

// 6. Prefetch related data
function PrefetchingComponent() {
  const queryClient = useQueryClient();

  const handleUserHover = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Optimization</h3>
        <CodeBlock
          title="Optimizing Cache"
          code={`// 1. Set appropriate gcTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30, // ✅ 30 minutes
      // Balance between memory and performance
    },
  },
});

// 2. Clean up old queries
function cleanupOldQueries() {
  const queryCache = queryClient.getQueryCache();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  queryCache.findAll({
    predicate: (query) => {
      if (!query.state.dataUpdatedAt) return false;
      return query.state.dataUpdatedAt < oneHourAgo && 
             query.getObserversCount() === 0;
    },
  }).forEach(query => {
    queryCache.remove(query);
  });
}

// 3. Limit cache size
function limitCacheSize(maxSize = 100) {
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();

  if (queries.length > maxSize) {
    // Remove oldest unused queries
    queries
      .filter(q => q.getObserversCount() === 0)
      .sort((a, b) => (a.state.dataUpdatedAt || 0) - (b.state.dataUpdatedAt || 0))
      .slice(0, queries.length - maxSize)
      .forEach(query => queryCache.remove(query));
  }
}

// 4. Use query key factories
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
};
// ✅ Prevents cache key collisions
// ✅ Ensures consistent keys`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Monitoring and Metrics</h2>
        <p className="text-gray-700 mb-4">
          Monitoring and metrics help you track performance over time and identify regressions.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Performance Monitoring</h3>
        <CodeBlock
          title="Setting Up Monitoring"
          code={`// Custom performance monitoring
function useQueryMonitoring() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    const metrics = {
      queryCount: 0,
      fetchCount: 0,
      errorCount: 0,
      averageFetchTime: 0,
      cacheHitRate: 0,
    };

    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type === 'added') {
        metrics.queryCount++;
      } else if (event.type === 'updated') {
        if (event.query.state.status === 'success') {
          metrics.fetchCount++;
        } else if (event.query.state.status === 'error') {
          metrics.errorCount++;
        }
      }
    });

    // Send metrics to monitoring service
    const interval = setInterval(() => {
      sendMetrics(metrics);
    }, 60000); // Every minute

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [queryCache]);
}

// Send to analytics
function sendMetrics(metrics) {
  // Send to your analytics service
  analytics.track('react_query_metrics', metrics);
}

// Performance marks
function trackQueryPerformance(queryKey, queryFn) {
  const startTime = performance.now();

  return queryFn().then((data) => {
    const duration = performance.now() - startTime;

    // Track slow queries
    if (duration > 1000) {
      console.warn(\`Slow query: \${queryKey.join('/')} took \${duration}ms\`);
      analytics.track('slow_query', {
        queryKey,
        duration,
      });
    }

    return data;
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Metrics Dashboard</h3>
        <CodeBlock
          title="Building Metrics Dashboard"
          code={`function MetricsDashboard() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  const metrics = useMemo(() => {
    const queries = queryCache.getAll();
    
    return {
      total: queries.length,
      active: queries.filter(q => q.getObserversCount() > 0).length,
      stale: queries.filter(q => q.isStale()).length,
      fetching: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      error: queries.filter(q => q.state.status === 'error').length,
      success: queries.filter(q => q.state.status === 'success').length,
    };
  }, [queryCache]);

  return (
    <div>
      <h2>Query Metrics</h2>
      <div>Total Queries: {metrics.total}</div>
      <div>Active: {metrics.active}</div>
      <div>Stale: {metrics.stale}</div>
      <div>Fetching: {metrics.fetching}</div>
      <div>Errors: {metrics.error}</div>
      <div>Success: {metrics.success}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Profile before optimizing</strong> - Measure first, optimize second</li>
            <li><strong>Focus on bottlenecks</strong> - Optimize what matters most</li>
            <li><strong>Set appropriate staleTime</strong> - Balance freshness and performance</li>
            <li><strong>Use select for transformations</strong> - Reduce re-renders</li>
            <li><strong>Monitor continuously</strong> - Track performance over time</li>
            <li><strong>Set cache limits</strong> - Prevent memory issues</li>
            <li><strong>Use pagination</strong> - Don't fetch everything at once</li>
            <li><strong>Debounce search queries</strong> - Reduce API calls</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">20.2 Architecture Patterns</strong>
          for feature-based organization, query/mutation organization, code splitting, and micro-frontend integration.
        </p>
      </div>
    </LessonLayout>
  );
}

