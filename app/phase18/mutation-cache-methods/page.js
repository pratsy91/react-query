import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function MutationCacheMethodsPage() {
  return (
    <LessonLayout
      title="18.2 Mutation Cache Methods"
      description="Learn advanced Mutation Cache methods: findAll, find, subscribe, clear, and all mutation cache methods"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation Cache Methods</h2>
        <p className="text-gray-700 mb-4">
          The MutationCache provides methods to inspect and manipulate the mutation cache.
          These methods help you track and manage mutations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Mutation Cache Methods:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>mutationCache.findAll</li>
            <li>mutationCache.find</li>
            <li>mutationCache.subscribe</li>
            <li>mutationCache.clear</li>
            <li>All mutation cache methods</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Accessing Mutation Cache</h2>
        <p className="text-gray-700 mb-4">
          Access the mutation cache through the QueryClient to use mutation cache methods.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Getting Mutation Cache</h3>
        <CodeBlock
          title="Accessing Mutation Cache"
          code={`import { useQueryClient } from '@tanstack/react-query';

function MutationInspector() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  // Now you can use mutationCache methods
  const allMutations = mutationCache.getAll();

  return <div>Total mutations: {allMutations.length}</div>;
}

// Or directly from QueryClient
function DirectAccess() {
  const queryClient = useQueryClient();
  
  // QueryClient provides shortcuts
  const allMutations = queryClient.getMutationCache().getAll();
  
  return <div>Total mutations: {allMutations.length}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationCache.findAll</h2>
        <p className="text-gray-700 mb-4">
          Find all mutations matching a filter. Useful for tracking mutations and bulk operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic findAll Usage</h3>
        <CodeBlock
          title="Finding All Mutations"
          code={`import { useQueryClient } from '@tanstack/react-query';

function MutationInspector() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  // Find all mutations
  const allMutations = mutationCache.findAll();
  console.log('All mutations:', allMutations);

  // Find mutations by key
  const updateMutations = mutationCache.findAll({
    mutationKey: ['updateUser'],
  });
  console.log('Update mutations:', updateMutations);

  // Find mutations by predicate
  const pendingMutations = mutationCache.findAll({
    predicate: (mutation) => mutation.state.status === 'pending',
  });
  console.log('Pending mutations:', pendingMutations);

  // Find error mutations
  const errorMutations = mutationCache.findAll({
    predicate: (mutation) => mutation.state.status === 'error',
  });
  console.log('Error mutations:', errorMutations);

  return <div>Found {allMutations.length} mutations</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced findAll Filters</h3>
        <CodeBlock
          title="Complex findAll Filters"
          code={`function AdvancedMutationFinder() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  // Find mutations with specific status
  const successMutations = mutationCache.findAll({
    predicate: (mutation) => mutation.state.status === 'success',
  });

  // Find mutations older than threshold
  const oldMutations = mutationCache.findAll({
    predicate: (mutation) => {
      if (!mutation.state.submittedAt) return false;
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return mutation.state.submittedAt < oneHourAgo;
    },
  });

  // Find mutations by mutation key pattern
  const userMutations = mutationCache.findAll({
    predicate: (mutation) => {
      return Array.isArray(mutation.options.mutationKey) && 
             mutation.options.mutationKey[0] === 'user';
    },
  });

  // Find mutations with errors
  const failedMutations = mutationCache.findAll({
    predicate: (mutation) => mutation.state.error !== null,
  });

  return <div>Found {failedMutations.length} failed mutations</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationCache.find</h2>
        <p className="text-gray-700 mb-4">
          Find a single mutation matching the filter. Returns the first matching mutation or undefined.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic find Usage</h3>
        <CodeBlock
          title="Finding Single Mutation"
          code={`function FindMutation() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  // Find mutation by key
  const updateMutation = mutationCache.find({
    mutationKey: ['updateUser'],
  });

  if (updateMutation) {
    console.log('Mutation status:', updateMutation.state.status);
    console.log('Mutation variables:', updateMutation.state.variables);
  }

  // Find mutation by predicate
  const firstPendingMutation = mutationCache.find({
    predicate: (mutation) => mutation.state.status === 'pending',
  });

  // Find mutation by type
  const firstErrorMutation = mutationCache.find({
    predicate: (mutation) => mutation.state.status === 'error',
  });

  return <div>Mutation found: {updateMutation ? 'Yes' : 'No'}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using find for Mutation Inspection</h3>
        <CodeBlock
          title="Inspecting Specific Mutation"
          code={`function MutationInspector({ mutationKey }) {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  const mutation = mutationCache.find({ mutationKey });

  if (!mutation) {
    return <div>Mutation not found in cache</div>;
  }

  const mutationInfo = {
    key: mutation.options.mutationKey,
    status: mutation.state.status,
    variables: mutation.state.variables,
    data: mutation.state.data,
    error: mutation.state.error,
    submittedAt: mutation.state.submittedAt,
  };

  return (
    <div>
      <div>Status: {mutationInfo.status}</div>
      <div>Variables: {JSON.stringify(mutationInfo.variables)}</div>
      <div>Submitted: {new Date(mutationInfo.submittedAt).toLocaleString()}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationCache.subscribe</h2>
        <p className="text-gray-700 mb-4">
          Subscribe to mutation cache events to react to mutation additions, updates, and removals.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Subscription</h3>
        <CodeBlock
          title="Subscribing to Mutation Events"
          code={`import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function MutationSubscriber() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  useEffect(() => {
    // Subscribe to mutation cache events
    const unsubscribe = mutationCache.subscribe((event) => {
      console.log('Mutation cache event:', {
        type: event.type, // 'added', 'updated', 'removed'
        mutation: {
          mutationKey: event.mutation.options.mutationKey,
          status: event.mutation.state.status,
        },
      });
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [mutationCache]);

  return null; // This component just monitors
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Event Types</h3>
        <CodeBlock
          title="Handling Different Event Types"
          code={`function MutationEventMonitor() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  useEffect(() => {
    const unsubscribe = mutationCache.subscribe((event) => {
      switch (event.type) {
        case 'added':
          console.log('Mutation added:', event.mutation.options.mutationKey);
          break;
        
        case 'updated':
          console.log('Mutation updated:', {
            key: event.mutation.options.mutationKey,
            status: event.mutation.state.status,
            variables: event.mutation.state.variables,
          });
          break;
        
        case 'removed':
          console.log('Mutation removed:', event.mutation.options.mutationKey);
          break;
      }
    });

    return () => unsubscribe();
  }, [mutationCache]);

  return null;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Tracking Mutation States</h3>
        <CodeBlock
          title="Monitoring Mutation Lifecycle"
          code={`function MutationTracker() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  const [mutationHistory, setMutationHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = mutationCache.subscribe((event) => {
      if (event.type === 'updated') {
        const mutation = event.mutation;
        setMutationHistory(prev => [...prev, {
          key: mutation.options.mutationKey,
          status: mutation.state.status,
          timestamp: Date.now(),
        }]);
      }
    });

    return () => unsubscribe();
  }, [mutationCache]);

  return (
    <div>
      <h3>Mutation History</h3>
      {mutationHistory.map((entry, index) => (
        <div key={index}>
          {entry.key}: {entry.status} at {new Date(entry.timestamp).toLocaleTimeString()}
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationCache.clear</h2>
        <p className="text-gray-700 mb-4">
          Clear all mutations from the cache. Useful for cleanup and reset operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Clearing Mutations</h3>
        <CodeBlock
          title="Clearing Mutation Cache"
          code={`function MutationManager() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  const clearAll = () => {
    mutationCache.clear();
    console.log('Mutation cache cleared');
  };

  const clearCompleted = () => {
    const completedMutations = mutationCache.findAll({
      predicate: (mutation) => 
        mutation.state.status === 'success' || 
        mutation.state.status === 'error',
    });
    completedMutations.forEach(mutation => {
      mutationCache.remove(mutation);
    });
  };

  const clearOld = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const oldMutations = mutationCache.findAll({
      predicate: (mutation) => {
        if (!mutation.state.submittedAt) return false;
        return mutation.state.submittedAt < oneHourAgo;
      },
    });
    oldMutations.forEach(mutation => {
      mutationCache.remove(mutation);
    });
  };

  return (
    <div>
      <button onClick={clearAll}>Clear All Mutations</button>
      <button onClick={clearCompleted}>Clear Completed</button>
      <button onClick={clearOld}>Clear Old Mutations</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Mutation Cache Methods</h2>
        <p className="text-gray-700 mb-4">
          Complete overview of all MutationCache methods available.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete Method List</h3>
        <CodeBlock
          title="All MutationCache Methods"
          code={`// MutationCache provides these methods:

const mutationCache = queryClient.getMutationCache();

// Finding mutations
mutationCache.findAll(filters)  // Find all matching mutations
mutationCache.find(filters)      // Find first matching mutation
mutationCache.getAll()           // Get all mutations

// Mutation management
mutationCache.remove(mutation)   // Remove specific mutation
mutationCache.clear()            // Clear all mutations
mutationCache.build(client, options, state) // Build new mutation

// Subscriptions
mutationCache.subscribe(callback) // Subscribe to cache events

// Usage examples:
const allMutations = mutationCache.getAll();
const updateMutation = mutationCache.find({ 
  mutationKey: ['updateUser'] 
});
const pendingMutations = mutationCache.findAll({ 
  predicate: m => m.state.status === 'pending' 
});

// Remove mutations
const mutations = mutationCache.findAll({ 
  mutationKey: ['temp'] 
});
mutations.forEach(mutation => mutationCache.remove(mutation));

// Clear all
mutationCache.clear();

// Subscribe
const unsubscribe = mutationCache.subscribe((event) => {
  console.log('Event:', event.type, event.mutation.options.mutationKey);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Practical Examples</h3>
        <CodeBlock
          title="Real-World Mutation Cache Operations"
          code={`function MutationOperations() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  // Get mutation statistics
  const getMutationStats = () => {
    const allMutations = mutationCache.getAll();
    return {
      total: allMutations.length,
      pending: allMutations.filter(m => m.state.status === 'pending').length,
      success: allMutations.filter(m => m.state.status === 'success').length,
      error: allMutations.filter(m => m.state.status === 'error').length,
      idle: allMutations.filter(m => m.state.status === 'idle').length,
    };
  };

  // Get pending mutations
  const getPendingMutations = () => {
    return mutationCache.findAll({
      predicate: (mutation) => mutation.state.status === 'pending',
    });
  };

  // Track mutation progress
  const trackMutation = (mutationKey) => {
    const mutation = mutationCache.find({ mutationKey });
    if (mutation) {
      return {
        status: mutation.state.status,
        variables: mutation.state.variables,
        data: mutation.state.data,
        error: mutation.state.error,
      };
    }
    return null;
  };

  return (
    <div>
      <div>Stats: {JSON.stringify(getMutationStats())}</div>
      <div>Pending: {getPendingMutations().length}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use for tracking</strong> - Monitor mutation states and progress</li>
            <li><strong>Clean up subscriptions</strong> - Always unsubscribe from events</li>
            <li><strong>Clear old mutations</strong> - Prevent memory leaks</li>
            <li><strong>Check for null</strong> - find() may return undefined</li>
            <li><strong>Use predicates efficiently</strong> - Simple predicates are faster</li>
            <li><strong>Track important mutations</strong> - Monitor critical operations</li>
            <li><strong>Build utilities</strong> - Create helper functions with cache methods</li>
            <li><strong>Document usage</strong> - Mutation cache methods are low-level</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">18.3 Query Observer</strong>
          for useQueryObserver, useInfiniteQueryObserver, observer patterns, and subscriptions.
        </p>
      </div>
    </LessonLayout>
  );
}

