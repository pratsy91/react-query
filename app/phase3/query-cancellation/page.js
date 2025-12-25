import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryCancellationPage() {
  return (
    <LessonLayout
      title="3.4 Query Cancellation"
      description="Learn how to cancel queries using AbortController, automatic cancellation, and manual cancellation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Query Cancellation?</h2>
        <p className="text-gray-700 mb-4">
          Query cancellation allows you to abort in-flight requests. This is useful for cleaning up
          requests when components unmount, when queries become irrelevant, or when you want to cancel
          a request manually.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Prevent memory leaks</strong> - Clean up requests on unmount</li>
            <li><strong>Save bandwidth</strong> - Cancel unnecessary requests</li>
            <li><strong>Improve performance</strong> - Stop outdated requests</li>
            <li><strong>Better UX</strong> - Avoid race conditions and stale data</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Cancellation Example"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      // signal is AbortSignal provided by TanStack Query
      const response = await fetch(\`/api/users/\${userId}\`, {
        signal, // Pass signal to fetch
      });
      return response.json();
    },
  });

  // Query is automatically cancelled when:
  // - Component unmounts
  // - Query key changes
  // - Query is manually cancelled

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">AbortController Integration</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query uses the AbortController API to cancel requests. The <code className="bg-gray-100 px-1 rounded">signal</code>
          is automatically provided to your query function.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using signal in queryFn</h3>
        <CodeBlock
          title="AbortSignal in Query Function"
          code={`import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async ({ signal }) => {
      // signal is AbortSignal from AbortController
      
      // Pass to fetch
      const response = await fetch('/api/users', {
        signal, // Automatically cancels if query is cancelled
      });
      
      return response.json();
    },
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Axios Integration</h3>
        <CodeBlock
          title="Cancellation with Axios"
          code={`import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      // Axios supports cancellation via CancelToken or signal
      const response = await axios.get(\`/api/users/\${userId}\`, {
        signal, // Pass signal to axios
      });
      
      return response.data;
    },
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Request Libraries</h3>
        <CodeBlock
          title="Using signal with Custom Libraries"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      // Check if already cancelled
      if (signal.aborted) {
        throw new Error('Query was cancelled');
      }

      // Use signal in your custom request
      const controller = new AbortController();
      
      // Listen for cancellation
      signal.addEventListener('abort', () => {
        controller.abort();
      });

      // Make request with your custom library
      return await customFetch(\`/api/users/\${userId}\`, {
        signal: controller.signal,
      });
    },
  });

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Automatic Cancellation</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query automatically cancels queries in several scenarios without any additional code.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Component Unmount</h3>
        <CodeBlock
          title="Automatic Cancellation on Unmount"
          code={`function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
  });

  // When component unmounts, query is automatically cancelled
  // No need to manually clean up

  return <div>{data?.name}</div>;
}

// If UserProfile unmounts while request is in flight,
// the request is automatically cancelled`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Key Change</h3>
        <CodeBlock
          title="Cancellation on Key Change"
          code={`function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Key includes userId
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
  });

  // When userId changes:
  // 1. Previous query is cancelled
  // 2. New query starts with new userId
  // This prevents race conditions

  return <div>{data?.name}</div>;
}

// Example: userId changes from 1 to 2
// Query for userId=1 is cancelled
// New query for userId=2 starts`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Becomes Disabled</h3>
        <CodeBlock
          title="Cancellation When Disabled"
          code={`function UserProfile({ userId, enabled }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
    enabled: enabled, // Query enabled/disabled based on prop
  });

  // When enabled changes from true to false:
  // - In-flight request is cancelled
  // - Query stops fetching

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Manual Cancellation</h2>
        <p className="text-gray-700 mb-4">
          You can manually cancel queries using the QueryClient's <code className="bg-gray-100 px-1 rounded">cancelQueries</code>
          method or by using the query's cancellation capabilities.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using queryClient.cancelQueries</h3>
        <CodeBlock
          title="Cancel Queries Programmatically"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
  });

  const handleCancel = () => {
    // Cancel specific query
    queryClient.cancelQueries({ queryKey: ['user', userId] });
  };

  const handleCancelAll = () => {
    // Cancel all queries
    queryClient.cancelQueries();
  };

  return (
    <div>
      <div>{data?.name}</div>
      <button onClick={handleCancel}>Cancel Query</button>
      <button onClick={handleCancelAll}>Cancel All</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cancel on Navigation</h3>
        <CodeBlock
          title="Cancel on Route Change"
          code={`import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
  });

  const handleNavigation = () => {
    // Cancel queries before navigation
    queryClient.cancelQueries({ queryKey: ['user', userId] });
    navigate('/dashboard');
  };

  return (
    <div>
      <div>{data?.name}</div>
      <button onClick={handleNavigation}>Go to Dashboard</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cancel Stale Queries</h3>
        <CodeBlock
          title="Cancel Based on Conditions"
          code={`function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      return response.json();
    },
  });

  useEffect(() => {
    // Cancel queries older than 1 minute
    const cancelStaleQueries = () => {
      queryClient.cancelQueries({
        predicate: (query) => {
          const state = query.state;
          if (!state.dataUpdatedAt) return false;
          
          const oneMinuteAgo = Date.now() - 60000;
          return state.dataUpdatedAt < oneMinuteAgo && 
                 query.state.status === 'pending';
        },
      });
    };

    const interval = setInterval(cancelStaleQueries, 10000);
    return () => clearInterval(interval);
  }, [queryClient]);

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cancellation in Mutations</h2>
        <p className="text-gray-700 mb-4">
          Mutations can also be cancelled, though it's less common. Mutations are typically not cancelled
          automatically, but you can cancel them manually.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation Cancellation</h3>
        <CodeBlock
          title="Cancel Mutations"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateUser({ userId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ signal, ...data }) => {
      // Note: mutations don't automatically get signal
      // You need to create your own AbortController
      const controller = new AbortController();
      
      // Listen for external cancellation
      signal?.addEventListener('abort', () => {
        controller.abort();
      });

      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return response.json();
    },
  });

  const handleCancel = () => {
    // Cancel mutation
    queryClient.cancelMutations({ mutationKey: ['updateUser'] });
  };

  return (
    <div>
      <button onClick={() => mutation.mutate({ name: 'New Name' })}>
        Update
      </button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling for Cancellation</h2>
        <p className="text-gray-700 mb-4">
          When a query is cancelled, it throws an AbortError. You should handle this gracefully.
        </p>

        <CodeBlock
          title="Handling AbortError"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`, { signal });
        return response.json();
      } catch (error) {
        // Check if error is from cancellation
        if (error.name === 'AbortError') {
          // Query was cancelled - this is expected, don't treat as error
          throw error; // Re-throw to let TanStack Query handle it
        }
        // Other errors
        throw error;
      }
    },
    // TanStack Query automatically handles AbortError
    // It won't set error state for cancelled queries
  });

  // error will be null for cancelled queries
  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always use signal</strong> - Pass signal to fetch/axios for automatic cancellation</li>
            <li><strong>Don't treat cancellation as error</strong> - AbortError is expected behavior</li>
            <li><strong>Cancel on unmount</strong> - Automatic, but be aware of it</li>
            <li><strong>Cancel stale requests</strong> - Cancel outdated queries when new ones start</li>
            <li><strong>Use query key changes</strong> - Changing keys automatically cancels old queries</li>
            <li><strong>Cancel on navigation</strong> - Cancel queries when leaving pages</li>
            <li><strong>Handle cleanup</strong> - Clean up any side effects in query functions</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 3: Advanced Query Patterns.
          You now understand dependent queries, parallel queries, infinite queries, and query cancellation.
          You're ready to move on to Phase 4: Caching & State Management.
        </p>
      </div>
    </LessonLayout>
  );
}

