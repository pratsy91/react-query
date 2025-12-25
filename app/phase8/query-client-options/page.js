import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryClientOptionsPage() {
  return (
    <LessonLayout
      title="8.2 Query Client Options"
      description="Learn about QueryClient configuration: defaultOptions, queryCache, mutationCache, logger, and custom cache implementations"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">QueryClient Configuration</h2>
        <p className="text-gray-700 mb-4">
          The QueryClient constructor accepts configuration options that control how queries and
          mutations behave globally. Understanding these options is crucial for advanced usage.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">QueryClient Options:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>defaultOptions</strong> - Default options for queries and mutations</li>
            <li><strong>queryCache</strong> - Custom query cache implementation</li>
            <li><strong>mutationCache</strong> - Custom mutation cache implementation</li>
            <li><strong>logger</strong> - Custom logging implementation</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">defaultOptions</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">defaultOptions</code> property sets
          default options for all queries and mutations in your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete defaultOptions</h3>
        <CodeBlock
          title="All Default Options"
          code={`import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Caching
      staleTime: 0,
      cacheTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5, // v5+
      
      // Retry
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      
      // Data
      select: undefined,
      placeholderData: undefined,
      initialData: undefined,
      
      // Other
      enabled: true,
      suspense: false,
      useErrorBoundary: false,
      notifyOnChangeProps: undefined,
      structuralSharing: true,
      networkMode: 'online',
      queryKeyHashFn: undefined,
      meta: undefined,
    },
    mutations: {
      // Retry
      retry: 0,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Other
      networkMode: 'online',
      gcTime: 1000 * 60 * 5,
      meta: undefined,
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryCache</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryCache</code> option allows you to
          provide a custom query cache implementation. This is rarely needed but useful for advanced
          scenarios like persistence or custom caching logic.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Query Cache</h3>
        <CodeBlock
          title="Using Default Cache"
          code={`import { QueryClient, QueryCache } from '@tanstack/react-query';

// Default cache (automatically created)
const queryClient = new QueryClient();

// Access default cache
const queryCache = queryClient.getQueryCache();

// Default cache works for most use cases
// No need to provide custom cache unless you have specific requirements`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Query Cache</h3>
        <CodeBlock
          title="Custom Cache Implementation"
          code={`import { QueryClient, QueryCache } from '@tanstack/react-query';

// Create custom query cache
class CustomQueryCache extends QueryCache {
  // Override methods as needed
  find(queryKey, filters) {
    // Custom find logic
    return super.find(queryKey, filters);
  }

  findAll(filters) {
    // Custom findAll logic
    return super.findAll(filters);
  }

  // Add custom methods
  findStaleQueries() {
    return this.getAll().filter(query => {
      const state = query.state;
      if (!state.dataUpdatedAt) return false;
      
      const staleTime = query.options.staleTime ?? 0;
      return Date.now() - state.dataUpdatedAt > staleTime;
    });
  }
}

// Use custom cache
const queryClient = new QueryClient({
  queryCache: new CustomQueryCache(),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationCache</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">mutationCache</code> option allows you
          to provide a custom mutation cache implementation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Mutation Cache</h3>
        <CodeBlock
          title="Using Default Mutation Cache"
          code={`import { QueryClient, MutationCache } from '@tanstack/react-query';

// Default mutation cache (automatically created)
const queryClient = new QueryClient();

// Access default cache
const mutationCache = queryClient.getMutationCache();

// Default cache works for most use cases`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Mutation Cache</h3>
        <CodeBlock
          title="Custom Mutation Cache Implementation"
          code={`import { QueryClient, MutationCache } from '@tanstack/react-query';

// Create custom mutation cache
class CustomMutationCache extends MutationCache {
  // Override methods as needed
  find(filters) {
    // Custom find logic
    return super.find(filters);
  }

  findAll(filters) {
    // Custom findAll logic
    return super.findAll(filters);
  }

  // Add custom methods
  findPendingMutations() {
    return this.getAll().filter(
      mutation => mutation.state.status === 'pending'
    );
  }
}

// Use custom cache
const queryClient = new QueryClient({
  mutationCache: new CustomMutationCache(),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">logger</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">logger</code> option allows you to provide
          a custom logging implementation for debugging and monitoring.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Logger</h3>
        <CodeBlock
          title="Default Logging Behavior"
          code={`// By default, TanStack Query uses console for logging
// In production, logging is typically disabled

const queryClient = new QueryClient({
  // No logger specified - uses default console logging
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Logger</h3>
        <CodeBlock
          title="Custom Logging Implementation"
          code={`import { QueryClient } from '@tanstack/react-query';

// Custom logger interface
interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

// Custom logger implementation
const customLogger: Logger = {
  log: (...args) => {
    // Send to logging service
    sendToLoggingService('log', args);
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  warn: (...args) => {
    sendToLoggingService('warn', args);
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  error: (...args) => {
    sendToLoggingService('error', args);
    console.error(...args); // Always log errors
  },
};

// Use custom logger
const queryClient = new QueryClient({
  logger: customLogger,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Logging</h3>
        <CodeBlock
          title="Environment-Based Logging"
          code={`const queryClient = new QueryClient({
  logger: {
    log: (...args) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Query]', ...args);
      }
    },
    warn: (...args) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Query]', ...args);
      }
    },
    error: (...args) => {
      // Always log errors
      console.error('[Query Error]', ...args);
      // Send to error tracking
      logErrorToService(...args);
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Cache Implementations</h2>
        <p className="text-gray-700 mb-4">
          For advanced use cases, you can implement custom cache behavior by extending the base
          cache classes.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Persistent Query Cache</h3>
        <CodeBlock
          title="Cache with Persistence"
          code={`import { QueryCache, Query } from '@tanstack/react-query';

class PersistentQueryCache extends QueryCache {
  constructor() {
    super();
    this.loadFromStorage();
    this.subscribeToChanges();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('query-cache');
      if (stored) {
        const data = JSON.parse(stored);
        // Restore queries from storage
        data.forEach((queryData) => {
          // Restore query state
        });
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  subscribeToChanges() {
    this.subscribe((event) => {
      if (event.type === 'updated') {
        this.saveToStorage();
      }
    });
  }

  saveToStorage() {
    try {
      const queries = this.getAll();
      const serializable = queries.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      }));
      localStorage.setItem('query-cache', JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }
}

const queryClient = new QueryClient({
  queryCache: new PersistentQueryCache(),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Size-Limited Cache</h3>
        <CodeBlock
          title="Cache with Size Limits"
          code={`import { QueryCache } from '@tanstack/react-query';

class SizeLimitedQueryCache extends QueryCache {
  private maxSize: number;

  constructor(maxSize: number = 100) {
    super();
    this.maxSize = maxSize;
  }

  build(client, options, state) {
    const query = super.build(client, options, state);
    
    // Enforce size limit
    this.enforceSizeLimit();
    
    return query;
  }

  enforceSizeLimit() {
    const queries = this.getAll();
    
    if (queries.length > this.maxSize) {
      // Remove oldest queries
      const sorted = queries.sort((a, b) => {
        const aTime = a.state.dataUpdatedAt || 0;
        const bTime = b.state.dataUpdatedAt || 0;
        return aTime - bTime;
      });
      
      const toRemove = sorted.slice(0, queries.length - this.maxSize);
      toRemove.forEach(query => {
        this.remove(query);
      });
    }
  }
}

const queryClient = new QueryClient({
  queryCache: new SizeLimitedQueryCache(50), // Max 50 queries
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete QueryClient Setup</h2>
        <p className="text-gray-700 mb-4">
          Here's a complete example showing all QueryClient configuration options together.
        </p>

        <CodeBlock
          title="Full QueryClient Configuration"
          code={`import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

// Custom query cache
class CustomQueryCache extends QueryCache {
  // Add custom behavior
}

// Custom mutation cache
class CustomMutationCache extends MutationCache {
  // Add custom behavior
}

// Custom logger
const customLogger = {
  log: (...args) => console.log('[Query]', ...args),
  warn: (...args) => console.warn('[Query]', ...args),
  error: (...args) => console.error('[Query Error]', ...args),
};

// Complete QueryClient setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 3,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new CustomQueryCache(),
  mutationCache: new CustomMutationCache(),
  logger: customLogger,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use default options</strong> - Set sensible defaults for your app</li>
            <li><strong>Custom caches sparingly</strong> - Only when you need special behavior</li>
            <li><strong>Custom logger for production</strong> - Send logs to monitoring service</li>
            <li><strong>Test custom implementations</strong> - Ensure they work correctly</li>
            <li><strong>Document custom behavior</strong> - Make it clear to your team</li>
            <li><strong>Consider performance</strong> - Custom caches may impact performance</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">8.3 Cache Configuration</strong>
          for custom cache storage, serialization, size limits, and eviction policies.
        </p>
      </div>
    </LessonLayout>
  );
}

