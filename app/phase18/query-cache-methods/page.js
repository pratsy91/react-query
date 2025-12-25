import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryCacheMethodsPage() {
  return (
    <LessonLayout
      title="18.1 Query Cache Methods"
      description="Learn advanced Query Cache methods: findAll, find, subscribe, clear, and all cache methods"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Cache Methods</h2>
        <p className="text-gray-700 mb-4">
          The QueryCache provides low-level methods to inspect and manipulate the query cache.
          These methods give you fine-grained control over cache operations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Query Cache Methods:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>queryCache.findAll</li>
            <li>queryCache.find</li>
            <li>queryCache.subscribe</li>
            <li>queryCache.clear</li>
            <li>All cache methods</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Accessing Query Cache</h2>
        <p className="text-gray-700 mb-4">
          Access the query cache through the QueryClient to use cache methods.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Getting Query Cache</h3>
        <CodeBlock
          title="Accessing Query Cache"
          code={`import { useQueryClient } from '@tanstack/react-query';

function CacheInspector() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  // Now you can use queryCache methods
  const allQueries = queryCache.getAll();

  return <div>Total queries: {allQueries.length}</div>;
}

// Or directly from QueryClient
function DirectAccess() {
  const queryClient = useQueryClient();
  
  // QueryClient provides shortcuts
  const allQueries = queryClient.getQueryCache().getAll();
  
  return <div>Total queries: {allQueries.length}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryCache.findAll</h2>
        <p className="text-gray-700 mb-4">
          Find all queries matching a filter. Useful for bulk operations and cache inspection.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic findAll Usage</h3>
        <CodeBlock
          title="Finding All Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function QueryInspector() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  // Find all queries
  const allQueries = queryCache.findAll();
  console.log('All queries:', allQueries);

  // Find queries by key prefix
  const userQueries = queryCache.findAll({
    queryKey: ['user'],
  });
  console.log('User queries:', userQueries);

  // Find queries by predicate
  const staleQueries = queryCache.findAll({
    predicate: (query) => query.isStale(),
  });
  console.log('Stale queries:', staleQueries);

  // Find queries by type
  const errorQueries = queryCache.findAll({
    predicate: (query) => query.state.status === 'error',
  });
  console.log('Error queries:', errorQueries);

  return <div>Found {allQueries.length} queries</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced findAll Filters</h3>
        <CodeBlock
          title="Complex findAll Filters"
          code={`function AdvancedQueryFinder() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  // Find queries with specific data
  const queriesWithData = queryCache.findAll({
    predicate: (query) => query.state.data !== undefined,
  });

  // Find queries older than 1 hour
  const oldQueries = queryCache.findAll({
    predicate: (query) => {
      if (!query.state.dataUpdatedAt) return false;
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return query.state.dataUpdatedAt < oneHourAgo;
    },
  });

  // Find queries with specific query key pattern
  const postQueries = queryCache.findAll({
    predicate: (query) => {
      return Array.isArray(query.queryKey) && 
             query.queryKey[0] === 'post';
    },
  });

  // Find queries with observers
  const activeQueries = queryCache.findAll({
    predicate: (query) => query.getObserversCount() > 0,
  });

  return <div>Found {activeQueries.length} active queries</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryCache.find</h2>
        <p className="text-gray-700 mb-4">
          Find a single query matching the filter. Returns the first matching query or undefined.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic find Usage</h3>
        <CodeBlock
          title="Finding Single Query"
          code={`function FindQuery() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  // Find query by exact key
  const userQuery = queryCache.find({
    queryKey: ['user', 1],
  });

  if (userQuery) {
    console.log('User data:', userQuery.state.data);
    console.log('Query status:', userQuery.state.status);
  }

  // Find query by predicate
  const firstStaleQuery = queryCache.find({
    predicate: (query) => query.isStale(),
  });

  // Find query by type
  const firstErrorQuery = queryCache.find({
    predicate: (query) => query.state.status === 'error',
  });

  return <div>Query found: {userQuery ? 'Yes' : 'No'}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using find for Cache Inspection</h3>
        <CodeBlock
          title="Inspecting Specific Query"
          code={`function QueryInspector({ queryKey }) {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  const query = queryCache.find({ queryKey });

  if (!query) {
    return <div>Query not found in cache</div>;
  }

  const queryInfo = {
    key: query.queryKey,
    status: query.state.status,
    data: query.state.data,
    error: query.state.error,
    dataUpdatedAt: query.state.dataUpdatedAt,
    isStale: query.isStale(),
    observers: query.getObserversCount(),
  };

  return (
    <div>
      <div>Status: {queryInfo.status}</div>
      <div>Is Stale: {queryInfo.isStale ? 'Yes' : 'No'}</div>
      <div>Observers: {queryInfo.observers}</div>
      <div>Updated: {new Date(queryInfo.dataUpdatedAt).toLocaleString()}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryCache.subscribe</h2>
        <p className="text-gray-700 mb-4">
          Subscribe to cache events to react to query additions, updates, and removals.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Subscription</h3>
        <CodeBlock
          title="Subscribing to Cache Events"
          code={`import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function CacheSubscriber() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    // Subscribe to cache events
    const unsubscribe = queryCache.subscribe((event) => {
      console.log('Cache event:', {
        type: event.type, // 'added', 'updated', 'removed'
        query: {
          queryKey: event.query.queryKey,
          status: event.query.state.status,
        },
      });
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [queryCache]);

  return null; // This component just monitors
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Event Types</h3>
        <CodeBlock
          title="Handling Different Event Types"
          code={`function CacheEventMonitor() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      switch (event.type) {
        case 'added':
          console.log('Query added:', event.query.queryKey);
          break;
        
        case 'updated':
          console.log('Query updated:', {
            key: event.query.queryKey,
            status: event.query.state.status,
            data: event.query.state.data,
          });
          break;
        
        case 'removed':
          console.log('Query removed:', event.query.queryKey);
          break;
      }
    });

    return () => unsubscribe();
  }, [queryCache]);

  return null;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Subscription</h3>
        <CodeBlock
          title="Subscribing to Specific Queries"
          code={`function SelectiveSubscriber({ queryKey }) {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      // Only handle events for specific query
      if (event.query.queryKey[0] === queryKey[0]) {
        console.log('Relevant query event:', event);
      }
    });

    return () => unsubscribe();
  }, [queryCache, queryKey]);

  return null;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryCache.clear</h2>
        <p className="text-gray-700 mb-4">
          Clear all queries from the cache. Useful for logout, reset, or cleanup operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Clearing Cache</h3>
        <CodeBlock
          title="Clearing All Queries"
          code={`function CacheManager() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  const clearAll = () => {
    queryCache.clear();
    console.log('Cache cleared');
  };

  const clearStale = () => {
    const staleQueries = queryCache.findAll({
      predicate: (query) => query.isStale(),
    });
    staleQueries.forEach(query => {
      queryCache.remove(query);
    });
  };

  return (
    <div>
      <button onClick={clearAll}>Clear All Cache</button>
      <button onClick={clearStale}>Clear Stale Queries</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Cache Methods</h2>
        <p className="text-gray-700 mb-4">
          Complete overview of all QueryCache methods available.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete Method List</h3>
        <CodeBlock
          title="All QueryCache Methods"
          code={`// QueryCache provides these methods:

const queryCache = queryClient.getQueryCache();

// Finding queries
queryCache.findAll(filters)     // Find all matching queries
queryCache.find(filters)         // Find first matching query
queryCache.getAll()              // Get all queries

// Query management
queryCache.remove(query)         // Remove specific query
queryCache.clear()               // Clear all queries
queryCache.build(client, options, state) // Build new query

// Subscriptions
queryCache.subscribe(callback)   // Subscribe to cache events

// Query access
queryCache.get(queryKey)         // Get query by key (if exists)

// Usage examples:
const allQueries = queryCache.getAll();
const userQuery = queryCache.find({ queryKey: ['user', 1] });
const userQueries = queryCache.findAll({ queryKey: ['user'] });
const staleQueries = queryCache.findAll({ 
  predicate: q => q.isStale() 
});

// Remove queries
const queries = queryCache.findAll({ queryKey: ['temp'] });
queries.forEach(query => queryCache.remove(query));

// Clear all
queryCache.clear();

// Subscribe
const unsubscribe = queryCache.subscribe((event) => {
  console.log('Event:', event.type, event.query.queryKey);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Practical Examples</h3>
        <CodeBlock
          title="Real-World Cache Operations"
          code={`function CacheOperations() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  // Get cache statistics
  const getCacheStats = () => {
    const allQueries = queryCache.getAll();
    return {
      total: allQueries.length,
      stale: allQueries.filter(q => q.isStale()).length,
      fetching: allQueries.filter(q => q.state.fetchStatus === 'fetching').length,
      error: allQueries.filter(q => q.state.status === 'error').length,
      success: allQueries.filter(q => q.state.status === 'success').length,
    };
  };

  // Clean up old queries
  const cleanupOldQueries = (maxAge = 60 * 60 * 1000) => {
    const now = Date.now();
    const oldQueries = queryCache.findAll({
      predicate: (query) => {
        if (!query.state.dataUpdatedAt) return false;
        return now - query.state.dataUpdatedAt > maxAge;
      },
    });
    
    oldQueries.forEach(query => {
      if (query.getObserversCount() === 0) {
        queryCache.remove(query);
      }
    });
  };

  // Get queries by category
  const getQueriesByCategory = (category) => {
    return queryCache.findAll({
      predicate: (query) => {
        return Array.isArray(query.queryKey) && 
               query.queryKey[0] === category;
      },
    });
  };

  return (
    <div>
      <div>Stats: {JSON.stringify(getCacheStats())}</div>
      <button onClick={() => cleanupOldQueries()}>Cleanup Old</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use for inspection</strong> - Cache methods are great for debugging</li>
            <li><strong>Clean up subscriptions</strong> - Always unsubscribe from events</li>
            <li><strong>Use predicates carefully</strong> - Complex predicates can be slow</li>
            <li><strong>Check for null</strong> - find() may return undefined</li>
            <li><strong>Clear selectively</strong> - Don't clear all unless necessary</li>
            <li><strong>Monitor performance</strong> - Cache operations can be expensive</li>
            <li><strong>Use for utilities</strong> - Build helper functions with cache methods</li>
            <li><strong>Document usage</strong> - Cache methods are low-level</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">18.2 Mutation Cache Methods</strong>
          for findAll, find, subscribe, clear, and all mutation cache methods.
        </p>
      </div>
    </LessonLayout>
  );
}

