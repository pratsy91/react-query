import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function NetworkOptimizationPage() {
  return (
    <LessonLayout
      title="11.3 Network Optimization"
      description="Learn network optimization techniques: request deduplication, cancellation, batching, and queuing"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Network Optimization</h2>
        <p className="text-gray-700 mb-4">
          Optimizing network requests reduces bandwidth usage, improves performance, and provides
          better user experience. React Query provides several built-in optimizations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Optimization Techniques:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Request deduplication</li>
            <li>Request cancellation</li>
            <li>Batch requests</li>
            <li>Request queuing</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Request Deduplication</h2>
        <p className="text-gray-700 mb-4">
          React Query automatically deduplicates identical requests. Multiple components requesting
          the same data will share a single network request.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automatic Deduplication</h3>
        <CodeBlock
          title="Request Deduplication Example"
          code={`// Multiple components request the same query
// React Query deduplicates automatically

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId), // Network request
  });
  return <div>{data?.name}</div>;
}

function UserAvatar({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same query key
    queryFn: () => fetchUser(userId), // Same query function
  });
  return <img src={data?.avatar} />;
}

function UserHeader({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same query key
    queryFn: () => fetchUser(userId), // Same query function
  });
  return <h1>{data?.name}</h1>;
}

// All three components mount simultaneously
// Only ONE network request is made
// All three components receive the same data
// React Query handles deduplication automatically`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">How Deduplication Works</h3>
        <CodeBlock
          title="Understanding Request Deduplication"
          code={`// React Query deduplicates based on:
// 1. Query key (must match exactly)
// 2. Active query state (query must be active)

// ✅ These are deduplicated (same key, active)
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
// Works across all components in your app
// Reduces network traffic significantly`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Deduplication Timing</h3>
        <CodeBlock
          title="When Deduplication Occurs"
          code={`// Deduplication occurs when:
// 1. Multiple queries with same key are active
// 2. Queries are requested within a short time window
// 3. Queries are in "fetching" state

function Component1() {
  // Request 1: Starts fetching
  const { data } = useQuery({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1), // Network request starts
  });
}

function Component2() {
  // Request 2: Deduplicated with Request 1
  const { data } = useQuery({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1), // No new network request
  });
}

// Both components receive data from the same request
// Network request is shared
// Reduces server load and improves performance`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Request Cancellation</h2>
        <p className="text-gray-700 mb-4">
          Cancel unnecessary requests to save bandwidth and prevent race conditions. React Query
          supports automatic and manual cancellation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automatic Cancellation</h3>
        <CodeBlock
          title="Automatic Request Cancellation"
          code={`// React Query automatically cancels requests when:
// 1. Query is no longer active (no observers)
// 2. Query key changes
// 3. Component unmounts

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      // signal is AbortSignal
      // Request is automatically cancelled if:
      // - userId changes
      // - Component unmounts
      // - Query becomes inactive

      const response = await fetch(\`/api/users/\${userId}\`, {
        signal, // Pass signal to fetch
      });

      return response.json();
    },
  });

  return <div>{data?.name}</div>;
}

// When userId changes:
// - Previous request is cancelled
// - New request is made
// - No wasted network requests`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Manual Cancellation</h3>
        <CodeBlock
          title="Manually Cancelling Requests"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        signal,
      });
      return response.json();
    },
  });

  const handleCancel = () => {
    // Manually cancel the query
    queryClient.cancelQueries({
      queryKey: ['user', userId],
    });
  };

  return (
    <div>
      <div>{data?.name}</div>
      <button onClick={handleCancel}>Cancel Request</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cancellation with AbortController</h3>
        <CodeBlock
          title="Using AbortController Directly"
          code={`function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      // Create AbortController if signal not provided
      const controller = signal || new AbortController();

      try {
        const response = await fetch(\`/api/users/\${userId}\`, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          throw new Error('Request cancelled');
        }

        return response.json();
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request was cancelled');
          throw error;
        }
        throw error;
      }
    },
  });

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Batch Requests</h2>
        <p className="text-gray-700 mb-4">
          Batching multiple requests into a single network call reduces overhead and improves
          performance. React Query doesn't batch automatically, but you can implement batching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Manual Batching</h3>
        <CodeBlock
          title="Batching Multiple Queries"
          code={`// Batch multiple user requests into one API call
function useBatchedUsers(userIds) {
  return useQuery({
    queryKey: ['users', 'batch', userIds.sort().join(',')],
    queryFn: async () => {
      // Single API call for multiple users
      const response = await fetch(\`/api/users/batch?ids=\${userIds.join(',')}\`);
      return response.json();
    },
    enabled: userIds.length > 0,
  });
}

// Usage
function UserList({ userIds }) {
  const { data: users } = useBatchedUsers(userIds);

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// Instead of N requests (one per user)
// Only 1 request is made (batched)`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Batching with useQueries</h3>
        <CodeBlock
          title="Batching with useQueries"
          code={`import { useQueries } from '@tanstack/react-query';

// Batch multiple queries efficiently
function useBatchedUserQueries(userIds) {
  return useQueries({
    queries: userIds.map(userId => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  });
}

// All queries are executed in parallel
// React Query handles deduplication
// More efficient than sequential requests

function UserList({ userIds }) {
  const queries = useBatchedUserQueries(userIds);

  return (
    <div>
      {queries.map((query, index) => (
        <div key={userIds[index]}>
          {query.isLoading && <div>Loading...</div>}
          {query.data && <div>{query.data.name}</div>}
        </div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Smart Batching</h3>
        <CodeBlock
          title="Intelligent Request Batching"
          code={`import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Batch requests with debouncing
function useBatchedRequests(requests, delay = 100) {
  const [batchedRequests, setBatchedRequests] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (requests.length > 0) {
        setBatchedRequests(requests);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [requests, delay]);

  return useQuery({
    queryKey: ['batch', batchedRequests],
    queryFn: async () => {
      // Batch all requests into one API call
      const results = await Promise.all(
        batchedRequests.map(req => req.queryFn())
      );
      return results;
    },
    enabled: batchedRequests.length > 0,
  });
}

// Usage: Collects requests over 100ms window
// Then batches them into a single request`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Request Queuing</h2>
        <p className="text-gray-700 mb-4">
          Queue requests to control concurrency and prevent overwhelming the server. React Query
          doesn't queue by default, but you can implement queuing.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Request Queue</h3>
        <CodeBlock
          title="Basic Request Queue"
          code={`// Simple queue implementation
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.queue = [];
    this.running = [];
    this.maxConcurrent = maxConcurrent;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running.length >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { request, resolve, reject } = this.queue.shift();
    this.running.push(request);

    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running = this.running.filter(r => r !== request);
      this.process(); // Process next request
    }
  }
}

const requestQueue = new RequestQueue(3); // Max 3 concurrent requests

// Usage
async function fetchUser(userId) {
  return requestQueue.add(() => 
    fetch(\`/api/users/\${userId}\`).then(r => r.json())
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Priority Queue</h3>
        <CodeBlock
          title="Priority-Based Request Queue"
          code={`// Priority queue for requests
class PriorityRequestQueue {
  constructor(maxConcurrent = 3) {
    this.queue = [];
    this.running = [];
    this.maxConcurrent = maxConcurrent;
  }

  async add(request, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, priority, resolve, reject });
      // Sort by priority (higher priority first)
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  async process() {
    if (this.running.length >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { request, resolve, reject } = this.queue.shift();
    this.running.push(request);

    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running = this.running.filter(r => r !== request);
      this.process();
    }
  }
}

const priorityQueue = new PriorityRequestQueue(3);

// Usage with priorities
async function fetchUser(userId, priority = 0) {
  return priorityQueue.add(
    () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    priority
  );
}

// High priority requests are processed first
fetchUser(1, 10); // High priority
fetchUser(2, 5);  // Medium priority
fetchUser(3, 0);  // Low priority`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Queue with React Query</h3>
        <CodeBlock
          title="Integrating Queue with React Query"
          code={`import { useQuery } from '@tanstack/react-query';

const requestQueue = new RequestQueue(3);

// Wrapper for queued requests
function useQueuedQuery(queryKey, queryFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Add request to queue
      return requestQueue.add(queryFn);
    },
    ...options,
  });
}

// Usage
function UserProfile({ userId }) {
  const { data } = useQueuedQuery(
    ['user', userId],
    () => fetch(\`/api/users/\${userId}\`).then(r => r.json())
  );

  return <div>{data?.name}</div>;
}

// All queries use the same queue
// Max 3 concurrent requests
// Other requests wait in queue`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Let React Query deduplicate</strong> - Automatic deduplication works well</li>
            <li><strong>Use cancellation</strong> - Cancel unnecessary requests</li>
            <li><strong>Batch when possible</strong> - Reduce number of requests</li>
            <li><strong>Queue for concurrency</strong> - Control concurrent requests</li>
            <li><strong>Use AbortSignal</strong> - Properly handle cancellation</li>
            <li><strong>Monitor network</strong> - Track request patterns</li>
            <li><strong>Optimize API design</strong> - Design APIs for batching</li>
            <li><strong>Test performance</strong> - Measure optimization impact</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 11: Performance Optimization.
          You now understand query optimization, rendering optimization, and network optimization
          techniques. You're ready to move on to Phase 12: Advanced Patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

