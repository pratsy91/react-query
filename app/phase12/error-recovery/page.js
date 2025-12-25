import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ErrorRecoveryPage() {
  return (
    <LessonLayout
      title="12.4 Error Recovery"
      description="Learn error recovery strategies: retry strategies, exponential backoff, circuit breakers, and fallback data"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Recovery Strategies</h2>
        <p className="text-gray-700 mb-4">
          Robust error recovery ensures your application handles failures gracefully and provides
          a good user experience even when things go wrong.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Recovery Strategies:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Retry strategies</li>
            <li>Exponential backoff</li>
            <li>Circuit breakers</li>
            <li>Fallback data</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Retry Strategies</h2>
        <p className="text-gray-700 mb-4">
          Retry strategies determine when and how to retry failed requests. Different strategies
          work better for different types of errors.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Retry Configuration</h3>
        <CodeBlock
          title="Simple Retry Strategy"
          code={`// Basic retry configuration
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 3, // Retry 3 times
  retryDelay: 1000, // Wait 1 second between retries
});

// Retry function
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => {
    // Linear backoff: 1s, 2s, 3s
    return (attemptIndex + 1) * 1000;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Retry</h3>
        <CodeBlock
          title="Conditional Retry Logic"
          code={`// Retry based on error type
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: (failureCount, error) => {
    // Network errors: retry
    if (error.name === 'NetworkError') {
      return failureCount < 5;
    }
    
    // Timeout errors: retry
    if (error.name === 'TimeoutError') {
      return failureCount < 3;
    }
    
    // Server errors (5xx): retry
    if (error.status >= 500) {
      return failureCount < 3;
    }
    
    // Client errors (4xx): don't retry
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Default: retry once
    return failureCount < 1;
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Exponential Backoff</h2>
        <p className="text-gray-700 mb-4">
          Exponential backoff increases the delay between retries exponentially, reducing server
          load and improving recovery chances.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Exponential Backoff</h3>
        <CodeBlock
          title="Exponential Backoff Implementation"
          code={`// Exponential backoff: 1s, 2s, 4s, 8s, ...
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 5,
  retryDelay: (attemptIndex) => {
    // Exponential: 2^attemptIndex * 1000ms
    return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30s
  },
});

// With jitter (random variation)
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 5,
  retryDelay: (attemptIndex) => {
    const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
    // Add random jitter (±20%)
    const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
    return baseDelay + jitter;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Exponential Backoff</h3>
        <CodeBlock
          title="Configurable Exponential Backoff"
          code={`// Reusable exponential backoff function
function exponentialBackoff(
  attemptIndex: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000,
  multiplier: number = 2
): number {
  const delay = Math.min(baseDelay * multiplier ** attemptIndex, maxDelay);
  return delay;
}

// Usage
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  retry: 5,
  retryDelay: (attemptIndex) => 
    exponentialBackoff(attemptIndex, 1000, 30000, 2),
});

// With different configurations
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
  retry: 3,
  retryDelay: (attemptIndex) => 
    exponentialBackoff(attemptIndex, 500, 10000, 1.5), // Slower growth
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Circuit Breakers</h2>
        <p className="text-gray-700 mb-4">
          Circuit breakers prevent cascading failures by stopping requests when a service is
          consistently failing, giving it time to recover.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Circuit Breaker</h3>
        <CodeBlock
          title="Simple Circuit Breaker Implementation"
          code={`// Circuit breaker state
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}

  canExecute(): boolean {
    if (this.state === 'open') {
      // Check if timeout has passed
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

const circuitBreaker = new CircuitBreaker(5, 60000);

// Usage in query
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    if (!circuitBreaker.canExecute()) {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fetchUser(userId);
      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      circuitBreaker.recordFailure();
      throw error;
    }
  },
  retry: false, // Don't retry when circuit is open
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Circuit Breaker</h3>
        <CodeBlock
          title="Advanced Circuit Breaker with Time Windows"
          code={`// Circuit breaker with time windows
class AdvancedCircuitBreaker {
  private failures: number[] = [];
  private successes: number[] = [];
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private lastStateChange = Date.now();

  constructor(
    private failureThreshold = 5,
    private successThreshold = 2,
    private timeout = 60000,
    private windowSize = 60000 // 1 minute window
  ) {}

  canExecute(): boolean {
    this.cleanOldEntries();

    if (this.state === 'open') {
      if (Date.now() - this.lastStateChange > this.timeout) {
        this.state = 'half-open';
        this.lastStateChange = Date.now();
        return true;
      }
      return false;
    }

    return true;
  }

  recordSuccess() {
    this.cleanOldEntries();
    this.successes.push(Date.now());

    if (this.state === 'half-open') {
      if (this.successes.length >= this.successThreshold) {
        this.state = 'closed';
        this.lastStateChange = Date.now();
        this.failures = [];
        this.successes = [];
      }
    } else {
      this.failures = [];
    }
  }

  recordFailure() {
    this.cleanOldEntries();
    this.failures.push(Date.now());

    if (this.failures.length >= this.failureThreshold) {
      this.state = 'open';
      this.lastStateChange = Date.now();
    }
  }

  private cleanOldEntries() {
    const now = Date.now();
    this.failures = this.failures.filter(
      time => now - time < this.windowSize
    );
    this.successes = this.successes.filter(
      time => now - time < this.windowSize
    );
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Fallback Data</h2>
        <p className="text-gray-700 mb-4">
          Fallback data provides default values when queries fail, ensuring the UI remains
          functional even during errors.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Static Fallback Data</h3>
        <CodeBlock
          title="Using Fallback Data"
          code={`// Static fallback data
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  placeholderData: {
    id: userId,
    name: 'Loading...',
    email: '',
  },
  // Or use initialData for persistent fallback
  initialData: {
    id: userId,
    name: 'Guest User',
    email: 'guest@example.com',
  },
});

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    placeholderData: { id: userId, name: 'Loading...', email: '' },
  });

  // user is never undefined due to placeholderData
  return <div>{user.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Fallback Data</h3>
        <CodeBlock
          title="Function-Based Fallback"
          code={`// Fallback data from function
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  placeholderData: (previousData) => {
    // Use previous data if available
    if (previousData) {
      return previousData;
    }
    
    // Otherwise use default
    return {
      id: userId,
      name: 'Guest User',
      email: 'guest@example.com',
    };
  },
});

// Fallback from cache
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  placeholderData: () => {
    // Try to get from cache
    const cached = queryClient.getQueryData(['user', userId]);
    if (cached) return cached;
    
    // Or get similar data
    const similarUser = queryClient.getQueryData(['user', userId - 1]);
    if (similarUser) {
      return { ...similarUser, id: userId };
    }
    
    // Default fallback
    return { id: userId, name: 'Loading...', email: '' };
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Fallback UI</h3>
        <CodeBlock
          title="Fallback UI on Error"
          code={`function UserProfile({ userId }: { userId: number }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: { id: userId, name: 'Loading...', email: '' },
  });

  // Show fallback UI on error
  if (isError) {
    return (
      <div>
        <div>Failed to load user</div>
        <div>Using cached data if available</div>
        {data && <div>{data.name}</div>}
      </div>
    );
  }

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use exponential backoff</strong> - Reduce server load</li>
            <li><strong>Don't retry 4xx errors</strong> - Client errors won't succeed</li>
            <li><strong>Implement circuit breakers</strong> - Prevent cascading failures</li>
            <li><strong>Provide fallback data</strong> - Keep UI functional</li>
            <li><strong>Set max retry limits</strong> - Prevent infinite retries</li>
            <li><strong>Log retry attempts</strong> - Monitor error patterns</li>
            <li><strong>Show user feedback</strong> - Inform about retries</li>
            <li><strong>Test error scenarios</strong> - Verify recovery works</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">12.5 Offline Support</strong>
          for network status detection, queue mutations, sync strategies, and conflict resolution.
        </p>
      </div>
    </LessonLayout>
  );
}

