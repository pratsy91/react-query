import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CacheConfigurationPage() {
  return (
    <LessonLayout
      title="8.3 Cache Configuration"
      description="Learn advanced cache configuration: custom storage, serialization, size limits, and eviction policies"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Cache Configuration</h2>
        <p className="text-gray-700 mb-4">
          Advanced cache configuration allows you to customize how data is stored, serialized, and
          managed. This is useful for persistence, performance optimization, and memory management.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Custom cache storage (localStorage, sessionStorage, IndexedDB)</li>
            <li>Cache serialization and deserialization</li>
            <li>Cache size limits and management</li>
            <li>Cache eviction policies</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Cache Storage</h2>
        <p className="text-gray-700 mb-4">
          Implement custom storage backends to persist cache data across page reloads or sessions.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">localStorage Storage</h3>
        <CodeBlock
          title="Persist Cache to localStorage"
          code={`import { QueryCache } from '@tanstack/react-query';

class LocalStorageQueryCache extends QueryCache {
  private storageKey = 'react-query-cache';

  constructor() {
    super();
    this.loadFromStorage();
    this.subscribeToChanges();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const cacheData = JSON.parse(stored);
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        // Only restore if cache is less than 1 hour old
        if (cacheData.timestamp > oneHourAgo) {
          // Restore queries
          cacheData.queries.forEach((queryData) => {
            // Restore query state
            this.setQueryData(queryData.queryKey, queryData.data);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  subscribeToChanges() {
    this.subscribe((event) => {
      if (event.type === 'updated' || event.type === 'added') {
        this.saveToStorage();
      }
    });
  }

  saveToStorage() {
    try {
      const queries = this.getAll();
      const serializable = queries
        .filter(query => query.state.data) // Only save queries with data
        .map(query => ({
          queryKey: query.queryKey,
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
        }));

      const cacheData = {
        timestamp: Date.now(),
        queries: serializable,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }
}

const queryClient = new QueryClient({
  queryCache: new LocalStorageQueryCache(),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">sessionStorage Storage</h3>
        <CodeBlock
          title="Persist Cache to sessionStorage"
          code={`class SessionStorageQueryCache extends QueryCache {
  private storageKey = 'react-query-cache';

  constructor() {
    super();
    this.loadFromStorage();
    this.subscribeToChanges();
  }

  loadFromStorage() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        const cacheData = JSON.parse(stored);
        // Restore queries (sessionStorage persists only for tab session)
        cacheData.queries.forEach((queryData) => {
          this.setQueryData(queryData.queryKey, queryData.data);
        });
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  saveToStorage() {
    try {
      const queries = this.getAll();
      const serializable = queries
        .filter(query => query.state.data)
        .map(query => ({
          queryKey: query.queryKey,
          data: query.state.data,
        }));

      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({ queries: serializable })
      );
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">IndexedDB Storage</h3>
        <CodeBlock
          title="Persist Cache to IndexedDB"
          code={`class IndexedDBCache extends QueryCache {
  private dbName = 'react-query-cache';
  private storeName = 'queries';
  private db: IDBDatabase | null = null;

  constructor() {
    super();
    this.initDB().then(() => {
      this.loadFromStorage();
      this.subscribeToChanges();
    });
  }

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'queryKey' });
        }
      };
    });
  }

  async loadFromStorage() {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      request.result.forEach((item) => {
        this.setQueryData(item.queryKey, item.data);
      });
    };
  }

  async saveToStorage() {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    const queries = this.getAll();
    queries.forEach((query) => {
      if (query.state.data) {
        store.put({
          queryKey: query.queryKey,
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
        });
      }
    });
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Serialization</h2>
        <p className="text-gray-700 mb-4">
          Cache serialization converts cache data to a format that can be stored and later restored.
          Proper serialization is crucial for persistence.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Serialization</h3>
        <CodeBlock
          title="JSON Serialization"
          code={`class SerializableCache extends QueryCache {
  serialize(query) {
    // Basic JSON serialization
    try {
      return JSON.stringify({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
        errorUpdatedAt: query.state.errorUpdatedAt,
      });
    } catch (error) {
      console.error('Serialization failed:', error);
      return null;
    }
  }

  deserialize(serialized) {
    try {
      const data = JSON.parse(serialized);
      return {
        queryKey: data.queryKey,
        data: data.data,
        dataUpdatedAt: data.dataUpdatedAt,
      };
    } catch (error) {
      console.error('Deserialization failed:', error);
      return null;
    }
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Serialization</h3>
        <CodeBlock
          title="Handle Special Data Types"
          code={`class CustomSerializableCache extends QueryCache {
  serialize(query) {
    const data = query.state.data;
    
    // Handle Date objects
    const serialized = this.serializeValue(data);
    
    return JSON.stringify({
      queryKey: query.queryKey,
      data: serialized,
      dataUpdatedAt: query.state.dataUpdatedAt,
    });
  }

  serializeValue(value) {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    
    if (value instanceof Map) {
      return {
        __type: 'Map',
        value: Array.from(value.entries()),
      };
    }
    
    if (value instanceof Set) {
      return {
        __type: 'Set',
        value: Array.from(value),
      };
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.serializeValue(item));
    }
    
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [
          key,
          this.serializeValue(val),
        ])
      );
    }
    
    return value;
  }

  deserializeValue(value) {
    if (value && typeof value === 'object' && value.__type) {
      switch (value.__type) {
        case 'Date':
          return new Date(value.value);
        case 'Map':
          return new Map(value.value);
        case 'Set':
          return new Set(value.value);
        default:
          return value;
      }
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.deserializeValue(item));
    }
    
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [
          key,
          this.deserializeValue(val),
        ])
      );
    }
    
    return value;
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Size Limits</h2>
        <p className="text-gray-700 mb-4">
          Implement size limits to prevent the cache from growing too large and consuming excessive memory.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Count Limit</h3>
        <CodeBlock
          title="Limit Number of Queries"
          code={`class SizeLimitedCache extends QueryCache {
  private maxQueries: number;

  constructor(maxQueries: number = 100) {
    super();
    this.maxQueries = maxQueries;
  }

  build(client, options, state) {
    const query = super.build(client, options, state);
    
    // Enforce size limit after adding query
    setTimeout(() => this.enforceSizeLimit(), 0);
    
    return query;
  }

  enforceSizeLimit() {
    const queries = this.getAll();
    
    if (queries.length > this.maxQueries) {
      // Sort by last access time
      const sorted = queries.sort((a, b) => {
        const aTime = a.state.dataUpdatedAt || 0;
        const bTime = b.state.dataUpdatedAt || 0;
        return aTime - bTime; // Oldest first
      });
      
      // Remove oldest queries
      const toRemove = sorted.slice(0, queries.length - this.maxQueries);
      toRemove.forEach(query => {
        this.remove(query);
      });
    }
  }
}

const queryClient = new QueryClient({
  queryCache: new SizeLimitedCache(50), // Max 50 queries
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memory Size Limit</h3>
        <CodeBlock
          title="Limit Cache by Memory Size"
          code={`class MemoryLimitedCache extends QueryCache {
  private maxSizeBytes: number;

  constructor(maxSizeBytes: number = 10 * 1024 * 1024) { // 10MB default
    super();
    this.maxSizeBytes = maxSizeBytes;
  }

  estimateSize(query) {
    try {
      return JSON.stringify(query.state.data).length;
    } catch {
      return 0;
    }
  }

  getTotalSize() {
    return this.getAll().reduce(
      (sum, query) => sum + this.estimateSize(query),
      0
    );
  }

  enforceSizeLimit() {
    let totalSize = this.getTotalSize();
    
    if (totalSize <= this.maxSizeBytes) {
      return; // Within limit
    }

    // Remove largest queries until under limit
    const queries = this.getAll().sort((a, b) => 
      this.estimateSize(b) - this.estimateSize(a)
    );

    for (const query of queries) {
      if (totalSize <= this.maxSizeBytes) {
        break;
      }
      
      const querySize = this.estimateSize(query);
      this.remove(query);
      totalSize -= querySize;
    }
  }

  build(client, options, state) {
    const query = super.build(client, options, state);
    setTimeout(() => this.enforceSizeLimit(), 0);
    return query;
  }
}

const queryClient = new QueryClient({
  queryCache: new MemoryLimitedCache(5 * 1024 * 1024), // 5MB limit
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Eviction Policies</h2>
        <p className="text-gray-700 mb-4">
          Eviction policies determine which queries are removed from cache when limits are reached.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">LRU (Least Recently Used)</h3>
        <CodeBlock
          title="LRU Eviction Policy"
          code={`class LRUCache extends QueryCache {
  private maxSize: number;

  constructor(maxSize: number = 100) {
    super();
    this.maxSize = maxSize;
  }

  getAccessTime(query) {
    // Use dataUpdatedAt as access time
    return query.state.dataUpdatedAt || 0;
  }

  evictLRU() {
    const queries = this.getAll();
    
    if (queries.length <= this.maxSize) {
      return;
    }

    // Sort by access time (least recently used first)
    const sorted = queries.sort((a, b) => 
      this.getAccessTime(a) - this.getAccessTime(b)
    );

    // Remove least recently used
    const toRemove = sorted.slice(0, queries.length - this.maxSize);
    toRemove.forEach(query => {
      this.remove(query);
    });
  }

  build(client, options, state) {
    const query = super.build(client, options, state);
    setTimeout(() => this.evictLRU(), 0);
    return query;
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Time-Based Eviction</h3>
        <CodeBlock
          title="Evict Queries Older Than Threshold"
          code={`class TimeBasedEvictionCache extends QueryCache {
  private maxAge: number; // milliseconds

  constructor(maxAge: number = 60 * 60 * 1000) { // 1 hour default
    super();
    this.maxAge = maxAge;
    this.startEvictionTimer();
  }

  startEvictionTimer() {
    setInterval(() => {
      this.evictOldQueries();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  evictOldQueries() {
    const now = Date.now();
    const cutoff = now - this.maxAge;

    const queries = this.getAll();
    queries.forEach(query => {
      const updatedAt = query.state.dataUpdatedAt;
      
      if (updatedAt && updatedAt < cutoff) {
        // Query is older than maxAge
        this.remove(query);
      }
    });
  }
}

const queryClient = new QueryClient({
  queryCache: new TimeBasedEvictionCache(30 * 60 * 1000), // 30 minutes
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Priority-Based Eviction</h3>
        <CodeBlock
          title="Evict Based on Priority"
          code={`class PriorityBasedCache extends QueryCache {
  private maxSize: number;

  constructor(maxSize: number = 100) {
    super();
    this.maxSize = maxSize;
  }

  getPriority(query) {
    // Get priority from meta
    return query.options.meta?.priority ?? 0;
  }

  evictByPriority() {
    const queries = this.getAll();
    
    if (queries.length <= this.maxSize) {
      return;
    }

    // Sort by priority (lowest priority first)
    const sorted = queries.sort((a, b) => 
      this.getPriority(a) - this.getPriority(b)
    );

    // Remove lowest priority queries
    const toRemove = sorted.slice(0, queries.length - this.maxSize);
    toRemove.forEach(query => {
      this.remove(query);
    });
  }

  build(client, options, state) {
    const query = super.build(client, options, state);
    setTimeout(() => this.evictByPriority(), 0);
    return query;
  }
}

// Usage with priority
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  meta: { priority: 10 }, // High priority
});

useQuery({
  queryKey: ['temp', tempId],
  queryFn: () => fetchTemp(tempId),
  meta: { priority: 1 }, // Low priority (evicted first)
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Combined Cache Configuration</h2>
        <p className="text-gray-700 mb-4">
          Combine multiple cache features for a comprehensive cache solution.
        </p>

        <CodeBlock
          title="Complete Cache Implementation"
          code={`class AdvancedCache extends QueryCache {
  private maxSize: number;
  private maxAge: number;
  private storageKey: string;

  constructor(
    maxSize: number = 100,
    maxAge: number = 60 * 60 * 1000,
    storageKey: string = 'query-cache'
  ) {
    super();
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.storageKey = storageKey;
    
    this.loadFromStorage();
    this.subscribeToChanges();
    this.startEvictionTimer();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const cacheData = JSON.parse(stored);
        const now = Date.now();
        
        // Only restore queries that aren't too old
        cacheData.queries.forEach((queryData) => {
          if (now - queryData.dataUpdatedAt < this.maxAge) {
            this.setQueryData(queryData.queryKey, queryData.data);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  subscribeToChanges() {
    this.subscribe((event) => {
      if (event.type === 'updated' || event.type === 'added') {
        this.saveToStorage();
        this.enforceSizeLimit();
      }
    });
  }

  saveToStorage() {
    try {
      const queries = this.getAll()
        .filter(query => query.state.data)
        .map(query => ({
          queryKey: query.queryKey,
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
        }));

      localStorage.setItem(
        this.storageKey,
        JSON.stringify({ queries, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
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
      toRemove.forEach(query => this.remove(query));
    }
  }

  startEvictionTimer() {
    setInterval(() => {
      this.evictOldQueries();
    }, 5 * 60 * 1000);
  }

  evictOldQueries() {
    const now = Date.now();
    const cutoff = now - this.maxAge;

    this.getAll().forEach(query => {
      const updatedAt = query.state.dataUpdatedAt;
      if (updatedAt && updatedAt < cutoff) {
        this.remove(query);
      }
    });
  }
}

const queryClient = new QueryClient({
  queryCache: new AdvancedCache(50, 30 * 60 * 1000),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Choose appropriate storage</strong> - localStorage for persistence, sessionStorage for session</li>
            <li><strong>Handle serialization errors</strong> - Some data types can't be serialized</li>
            <li><strong>Set reasonable size limits</strong> - Balance between performance and memory</li>
            <li><strong>Use eviction policies</strong> - Prevent cache from growing indefinitely</li>
            <li><strong>Test persistence</strong> - Verify cache survives page reloads</li>
            <li><strong>Monitor cache size</strong> - Track memory usage</li>
            <li><strong>Handle storage errors</strong> - Storage may be full or unavailable</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 8: Query Client Configuration.
          You now understand default options, QueryClient configuration, and advanced cache management.
          You're ready to move on to Phase 9: DevTools & Debugging.
        </p>
      </div>
    </LessonLayout>
  );
}

