import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function OfflineSupportPage() {
  return (
    <LessonLayout
      title="12.5 Offline Support"
      description="Learn offline support patterns: network status detection, queue mutations, sync strategies, and conflict resolution"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Offline Support</h2>
        <p className="text-gray-700 mb-4">
          Offline support allows your application to work without network connectivity by
          queuing mutations and syncing when connection is restored.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Offline Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Network status detection</li>
            <li>Queue mutations</li>
            <li>Sync strategies</li>
            <li>Conflict resolution</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Network Status Detection</h2>
        <p className="text-gray-700 mb-4">
          Detect network connectivity status to enable offline features and provide user feedback.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Network Detection</h3>
        <CodeBlock
          title="Network Status Hook"
          code={`import { useState, useEffect } from 'react';

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Usage
function App() {
  const isOnline = useNetworkStatus();

  return (
    <div>
      {!isOnline && <div>You are offline</div>}
      {/* Your app */}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Network Detection</h3>
        <CodeBlock
          title="Network Status with Connection Info"
          code={`function useNetworkStatus() {
  const [status, setStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
    effectiveType: 'unknown',
  });

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection || 
                         (navigator as any).mozConnection || 
                         (navigator as any).webkitConnection;

      setStatus({
        isOnline: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
      });
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Queue Mutations</h2>
        <p className="text-gray-700 mb-4">
          Queue mutations when offline and execute them when connection is restored.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Mutation Queue</h3>
        <CodeBlock
          title="Simple Mutation Queue"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

function useOfflineMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState<Array<{ id: string; variables: any }>>([]);
  const isOnline = useNetworkStatus();

  // Execute queued mutations when online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      queue.forEach(async ({ id, variables }) => {
        try {
          await mutationFn(variables);
          setQueue(prev => prev.filter(item => item.id !== id));
        } catch (error) {
          console.error('Failed to sync mutation:', error);
        }
      });
    }
  }, [isOnline, queue, mutationFn]);

  const mutation = useMutation({
    mutationFn: async (variables) => {
      if (isOnline) {
        return mutationFn(variables);
      } else {
        // Queue for later
        const id = Date.now().toString();
        setQueue(prev => [...prev, { id, variables }]);
        return Promise.resolve({ queued: true, id });
      }
    },
    ...options,
  });

  return {
    ...mutation,
    queuedMutations: queue.length,
  };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const updateMutation = useOfflineMutation(
    (data) => updateUser(userId, data)
  );

  return (
    <div>
      <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
        Update
      </button>
      {updateMutation.queuedMutations > 0 && (
        <div>{updateMutation.queuedMutations} mutations queued</div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Persistent Mutation Queue</h3>
        <CodeBlock
          title="Queue with LocalStorage Persistence"
          code={`function usePersistentOfflineMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();
  const isOnline = useNetworkStatus();
  const storageKey = 'offline-mutations';

  // Load queue from storage
  const [queue, setQueue] = useState<Array<{ id: string; variables: any; timestamp: number }>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save queue to storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save queue:', error);
    }
  }, [queue]);

  // Execute queued mutations when online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      queue.forEach(async ({ id, variables }) => {
        try {
          await mutationFn(variables);
          setQueue(prev => prev.filter(item => item.id !== id));
        } catch (error) {
          console.error('Failed to sync mutation:', error);
        }
      });
    }
  }, [isOnline, queue, mutationFn]);

  const mutation = useMutation({
    mutationFn: async (variables) => {
      if (isOnline) {
        return mutationFn(variables);
      } else {
        const id = Date.now().toString();
        setQueue(prev => [...prev, { id, variables, timestamp: Date.now() }]);
        return Promise.resolve({ queued: true, id });
      }
    },
    ...options,
  });

  return {
    ...mutation,
    queuedMutations: queue.length,
  };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Sync Strategies</h2>
        <p className="text-gray-700 mb-4">
          Different sync strategies determine how and when to synchronize queued mutations
          with the server.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Immediate Sync</h3>
        <CodeBlock
          title="Sync Immediately When Online"
          code={`function useImmediateSync(mutationFn) {
  const isOnline = useNetworkStatus();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      // Sync all immediately
      Promise.all(
        queue.map(async ({ id, variables }) => {
          try {
            await mutationFn(variables);
            setQueue(prev => prev.filter(item => item.id !== id));
          } catch (error) {
            console.error('Sync failed:', error);
          }
        })
      );
    }
  }, [isOnline, queue, mutationFn]);

  return { queue, setQueue };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Batch Sync</h3>
        <CodeBlock
          title="Batch Sync Strategy"
          code={`function useBatchSync(mutationFn, batchSize = 5) {
  const isOnline = useNetworkStatus();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      // Sync in batches
      const batch = queue.slice(0, batchSize);
      
      Promise.all(
        batch.map(async ({ id, variables }) => {
          try {
            await mutationFn(variables);
            setQueue(prev => prev.filter(item => item.id !== id));
          } catch (error) {
            console.error('Batch sync failed:', error);
          }
        })
      ).then(() => {
        // Process next batch if queue not empty
        if (queue.length > batchSize) {
          setTimeout(() => {
            // Trigger next batch
          }, 1000);
        }
      });
    }
  }, [isOnline, queue, mutationFn, batchSize]);

  return { queue, setQueue };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Priority Sync</h3>
        <CodeBlock
          title="Priority-Based Sync"
          code={`function usePrioritySync(mutationFn) {
  const isOnline = useNetworkStatus();
  const [queue, setQueue] = useState<Array<{
    id: string;
    variables: any;
    priority: number;
  }>>([]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      // Sort by priority (higher first)
      const sorted = [...queue].sort((a, b) => b.priority - a.priority);
      
      sorted.forEach(async ({ id, variables }) => {
        try {
          await mutationFn(variables);
          setQueue(prev => prev.filter(item => item.id !== id));
        } catch (error) {
          console.error('Priority sync failed:', error);
        }
      });
    }
  }, [isOnline, queue, mutationFn]);

  const addToQueue = (variables: any, priority: number = 0) => {
    const id = Date.now().toString();
    setQueue(prev => [...prev, { id, variables, priority }]);
  };

  return { queue, addToQueue };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Conflict Resolution</h2>
        <p className="text-gray-700 mb-4">
          Conflict resolution handles situations where local changes conflict with server
          changes when syncing.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Last Write Wins</h3>
        <CodeBlock
          title="Last Write Wins Strategy"
          code={`function useLastWriteWins(mutationFn) {
  const mutation = useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (error.status === 409) { // Conflict
          // Get latest from server
          const latest = await fetchLatest();
          // Overwrite with local changes
          return await mutationFn({ ...latest, ...variables });
        }
        throw error;
      }
    },
  });

  return mutation;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Merge Strategy</h3>
        <CodeBlock
          title="Merge Conflict Resolution"
          code={`function useMergeStrategy(mutationFn, mergeFn) {
  const mutation = useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (error.status === 409) { // Conflict
          // Get server version
          const serverVersion = await fetchLatest();
          // Merge local and server changes
          const merged = mergeFn(serverVersion, variables);
          // Apply merged version
          return await mutationFn(merged);
        }
        throw error;
      }
    },
  });

  return mutation;
}

// Usage with merge function
function mergeUserData(server: User, local: User): User {
  return {
    ...server,
    ...local,
    // Merge arrays
    tags: [...new Set([...server.tags, ...local.tags])],
    // Keep latest timestamp
    updatedAt: new Date(),
  };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">User Resolution</h3>
        <CodeBlock
          title="User-Initiated Conflict Resolution"
          code={`function useUserResolution(mutationFn) {
  const [conflicts, setConflicts] = useState([]);

  const mutation = useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (error.status === 409) { // Conflict
          // Get server version
          const serverVersion = await fetchLatest();
          // Ask user to resolve
          setConflicts(prev => [...prev, {
            local: variables,
            server: serverVersion,
            resolve: (resolved) => {
              mutationFn(resolved);
              setConflicts(prev => prev.filter(c => c !== conflict));
            },
          }]);
          throw error;
        }
        throw error;
      }
    },
  });

  return { ...mutation, conflicts };
}

// Usage
function ConflictResolver({ conflicts }) {
  return (
    <div>
      {conflicts.map((conflict, index) => (
        <div key={index}>
          <div>Local: {JSON.stringify(conflict.local)}</div>
          <div>Server: {JSON.stringify(conflict.server)}</div>
          <button onClick={() => conflict.resolve(conflict.local)}>
            Use Local
          </button>
          <button onClick={() => conflict.resolve(conflict.server)}>
            Use Server
          </button>
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Detect network status</strong> - Know when offline</li>
            <li><strong>Queue mutations</strong> - Store for later sync</li>
            <li><strong>Persist queue</strong> - Use localStorage/IndexedDB</li>
            <li><strong>Sync when online</strong> - Execute queued mutations</li>
            <li><strong>Handle conflicts</strong> - Resolve data conflicts</li>
            <li><strong>Show sync status</strong> - Inform users about sync</li>
            <li><strong>Limit queue size</strong> - Prevent memory issues</li>
            <li><strong>Test offline scenarios</strong> - Verify offline behavior</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 12: Advanced Patterns & Best Practices.
          You now understand custom hooks, query key management, mutation patterns, error recovery,
          and offline support. You've mastered React Query!
        </p>
      </div>
    </LessonLayout>
  );
}

