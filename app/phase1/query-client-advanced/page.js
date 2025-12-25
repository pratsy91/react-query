import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryClientAdvancedPage() {
  return (
    <LessonLayout
      title="1.4 Query Client Methods - Part 2: Advanced Cache Operations"
      description="Learn advanced QueryClient methods for refetching, removing, resetting, and managing queries"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchQueries - Manual Refetching</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">refetchQueries</code> allows you to manually
          trigger a refetch for queries, regardless of their stale status.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Refetch</h3>
        <CodeBlock
          title="Refetching Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function RefetchButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleRefetch = async () => {
    // Refetch specific query
    await queryClient.refetchQueries({
      queryKey: ['user', userId],
    });
  };
  
  return <button onClick={handleRefetch}>Refresh User</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Refetch Options</h3>
        <CodeBlock
          title="Refetch Configuration"
          code={`// Refetch active queries (default)
await queryClient.refetchQueries({
  queryKey: ['user'],
  type: 'active', // 'active' | 'inactive' | 'all'
});

// Refetch all queries (active and inactive)
await queryClient.refetchQueries({
  queryKey: ['user'],
  type: 'all',
});

// Refetch with predicate
await queryClient.refetchQueries({
  predicate: (query) => {
    return query.queryKey[0] === 'user' && 
           query.state.dataUpdatedAt < Date.now() - 60000; // Older than 1 minute
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Common Refetch Patterns"
          code={`// Refresh button
function RefreshButton() {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.refetchQueries({ type: 'active' });
  };
  
  return <button onClick={handleRefresh}>Refresh All</button>;
}

// Refetch after network reconnection
window.addEventListener('online', () => {
  queryClient.refetchQueries({ type: 'active' });
});

// Refetch stale queries
function refetchStaleQueries() {
  queryClient.refetchQueries({
    predicate: (query) => {
      const state = query.state;
      if (!state.dataUpdatedAt) return false;
      
      const staleTime = query.options.staleTime ?? 0;
      const isStale = Date.now() - state.dataUpdatedAt > staleTime;
      return isStale;
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">removeQueries - Removing from Cache</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">removeQueries</code> removes queries from the
          cache. This is useful for cleanup and memory management.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Removal</h3>
        <CodeBlock
          title="Removing Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function ClearCacheButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleClear = () => {
    // Remove specific query
    queryClient.removeQueries({
      queryKey: ['user', userId],
    });
  };
  
  return <button onClick={handleClear}>Clear User Cache</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Removal Options</h3>
        <CodeBlock
          title="Removal Patterns"
          code={`// Remove specific query
queryClient.removeQueries({
  queryKey: ['user', userId],
});

// Remove all user queries
queryClient.removeQueries({
  queryKey: ['user'],
});

// Remove with predicate
queryClient.removeQueries({
  predicate: (query) => {
    return query.queryKey[0] === 'user' && 
           query.state.dataUpdatedAt < Date.now() - 3600000; // Older than 1 hour
  },
});

// Remove all inactive queries
queryClient.removeQueries({
  type: 'inactive',
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Cache Cleanup Patterns"
          code={`// Cleanup on logout
function handleLogout() {
  queryClient.removeQueries();
  // Removes all queries from cache
}

// Remove old data
function cleanupOldQueries() {
  const oneHourAgo = Date.now() - 3600000;
  
  queryClient.removeQueries({
    predicate: (query) => {
      const updatedAt = query.state.dataUpdatedAt;
      return updatedAt && updatedAt < oneHourAgo;
    },
  });
}

// Remove user-specific data
function clearUserData(userId) {
  queryClient.removeQueries({
    predicate: (query) => {
      return query.queryKey.includes(userId);
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">resetQueries - Resetting Query State</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">resetQueries</code> resets queries to their
          initial state, clearing data and error states. Useful for form resets and error recovery.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Reset</h3>
        <CodeBlock
          title="Resetting Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function ResetButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleReset = () => {
    // Reset query to initial state
    queryClient.resetQueries({
      queryKey: ['user', userId],
    });
    
    // Query will refetch on next access
  };
  
  return <button onClick={handleReset}>Reset Query</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Reset Options</h3>
        <CodeBlock
          title="Reset Configuration"
          code={`// Reset and refetch
await queryClient.resetQueries({
  queryKey: ['user'],
  refetchType: 'active', // 'active' | 'inactive' | 'all' | 'none'
});

// Reset without refetch
queryClient.resetQueries({
  queryKey: ['user'],
  refetchType: 'none',
});

// Reset with predicate
queryClient.resetQueries({
  predicate: (query) => query.queryKey[0] === 'user',
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Reset Patterns"
          code={`// Reset form after error
function handleFormError() {
  queryClient.resetQueries({
    queryKey: ['form', formId],
  });
  // Clears error state, allows retry
}

// Reset all queries on app reset
function resetApp() {
  queryClient.resetQueries();
  // All queries reset to initial state
}

// Reset after logout
function handleLogout() {
  queryClient.resetQueries({
    predicate: () => true,
  });
  // Clear all query states
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">cancelQueries - Cancelling Requests</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">cancelQueries</code> cancels in-flight requests
          for queries. This is useful when you want to abort ongoing fetches.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Cancellation</h3>
        <CodeBlock
          title="Cancelling Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function CancelButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleCancel = () => {
    // Cancel in-flight request
    queryClient.cancelQueries({
      queryKey: ['user', userId],
    });
  };
  
  return <button onClick={handleCancel}>Cancel Request</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cancellation Options</h3>
        <CodeBlock
          title="Cancel Patterns"
          code={`// Cancel specific query
queryClient.cancelQueries({
  queryKey: ['user', userId],
});

// Cancel all user queries
queryClient.cancelQueries({
  queryKey: ['user'],
});

// Cancel with predicate
queryClient.cancelQueries({
  predicate: (query) => {
    return query.state.status === 'pending';
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Cancellation Patterns"
          code={`// Cancel on component unmount
useEffect(() => {
  return () => {
    queryClient.cancelQueries({
      queryKey: ['user', userId],
    });
  };
}, [userId]);

// Cancel on navigation
function handleNavigation() {
  queryClient.cancelQueries({ type: 'active' });
  navigate('/new-page');
}

// Cancel stale requests
function cancelStaleRequests() {
  queryClient.cancelQueries({
    predicate: (query) => {
      return query.state.fetchFailureCount > 3;
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">isFetching & isMutating - Status Checks</h2>
        <p className="text-gray-700 mb-4">
          These methods allow you to check if queries or mutations are currently in progress.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">isFetching</h3>
        <CodeBlock
          title="Checking Fetch Status"
          code={`import { useQueryClient } from '@tanstack/react-query';

function FetchingIndicator() {
  const queryClient = useQueryClient();
  
  // Check if any query is fetching
  const isFetching = queryClient.isFetching();
  
  // Check specific query
  const isUserFetching = queryClient.isFetching(['user', userId]);
  
  // Check with predicate
  const isUserQueriesFetching = queryClient.isFetching({
    predicate: (query) => query.queryKey[0] === 'user',
  });
  
  return (
    <div>
      {isFetching && <div>Loading...</div>}
      {isUserFetching && <div>Loading user...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">isMutating</h3>
        <CodeBlock
          title="Checking Mutation Status"
          code={`function MutationIndicator() {
  const queryClient = useQueryClient();
  
  // Check if any mutation is in progress
  const isMutating = queryClient.isMutating();
  
  // Check specific mutation
  const isUpdateMutating = queryClient.isMutating({
    mutationKey: ['updateUser'],
  });
  
  // Check with predicate
  const isUserMutationsMutating = queryClient.isMutating({
    predicate: (mutation) => {
      return mutation.options.mutationKey?.[0] === 'updateUser';
    },
  });
  
  return (
    <div>
      {isMutating && <div>Saving...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">getQueryCache & getMutationCache</h2>
        <p className="text-gray-700 mb-4">
          These methods provide direct access to the query and mutation cache instances for advanced operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">getQueryCache</h3>
        <CodeBlock
          title="Accessing Query Cache"
          code={`import { useQueryClient } from '@tanstack/react-query';

function AdvancedCacheOperations() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  
  // Get all queries
  const allQueries = queryCache.getAll();
  
  // Find specific query
  const userQuery = queryCache.find(['user', userId]);
  
  // Find all matching queries
  const userQueries = queryCache.findAll(['user']);
  
  // Subscribe to cache changes
  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      console.log('Cache event:', event);
      // event.type: 'added' | 'removed' | 'updated'
      // event.query: Query instance
    });
    
    return unsubscribe;
  }, [queryCache]);
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">getMutationCache</h3>
        <CodeBlock
          title="Accessing Mutation Cache"
          code={`function AdvancedMutationOperations() {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  
  // Get all mutations
  const allMutations = mutationCache.getAll();
  
  // Find specific mutation
  const updateMutation = mutationCache.find({
    mutationKey: ['updateUser'],
  });
  
  // Find all matching mutations
  const userMutations = mutationCache.findAll({
    predicate: (mutation) => {
      return mutation.options.mutationKey?.[0] === 'updateUser';
    },
  });
  
  // Subscribe to mutation cache changes
  useEffect(() => {
    const unsubscribe = mutationCache.subscribe((event) => {
      console.log('Mutation event:', event);
    });
    
    return unsubscribe;
  }, [mutationCache]);
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">clear - Clearing All Caches</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">clear</code> removes all queries and mutations
          from their respective caches.
        </p>

        <CodeBlock
          title="Clearing All Caches"
          code={`import { useQueryClient } from '@tanstack/react-query';

function ClearAllButton() {
  const queryClient = useQueryClient();
  
  const handleClearAll = () => {
    // Clear both query and mutation caches
    queryClient.clear();
    
    // All queries and mutations are removed
    // Next access will trigger fresh fetches
  };
  
  return <button onClick={handleClearAll}>Clear All Caches</button>;
}

// Use cases:
// - Logout
// - App reset
// - Memory cleanup
// - Testing`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">prefetchQuery - Prefetching Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">prefetchQuery</code> allows you to fetch and
          cache data before it's needed, improving perceived performance.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Prefetching</h3>
        <CodeBlock
          title="Prefetching Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserLink({ userId }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // Prefetch user data on hover
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <a 
      href={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
    >
      User {userId}
    </a>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Prefetch Options</h3>
        <CodeBlock
          title="Prefetch Configuration"
          code={`// Basic prefetch
await queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Prefetch with options
await queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
});

// Prefetch only if not in cache
const cachedData = queryClient.getQueryData(['user', userId]);
if (!cachedData) {
  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Prefetching Patterns"
          code={`// Prefetch on route hover
function UserCard({ userId }) {
  const queryClient = useQueryClient();
  
  return (
    <Link
      to={\`/users/\${userId}\`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ['user', userId],
          queryFn: () => fetchUser(userId),
        });
      }}
    >
      View User
    </Link>
  );
}

// Prefetch next page data
function Pagination({ currentPage }) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch next page
    queryClient.prefetchQuery({
      queryKey: ['posts', currentPage + 1],
      queryFn: () => fetchPosts(currentPage + 1),
    });
  }, [currentPage]);
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">prefetchInfiniteQuery - Prefetching Infinite Queries</h2>
        <p className="text-gray-700 mb-4">
          Similar to <code className="bg-gray-100 px-1 rounded">prefetchQuery</code>, but for infinite queries.
        </p>

        <CodeBlock
          title="Prefetching Infinite Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function InfiniteQueryPrefetch() {
  const queryClient = useQueryClient();
  
  const prefetchNextPage = async () => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  };
  
  return <button onClick={prefetchNextPage}>Prefetch Next Page</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">ensureQueryData - Ensure Data Exists</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">ensureQueryData</code> ensures data exists in cache,
          fetching it if it doesn't exist or is stale.
        </p>

        <CodeBlock
          title="Ensuring Query Data"
          code={`import { useQueryClient } from '@tanstack/react-query';

async function ensureUserData(userId) {
  const queryClient = useQueryClient();
  
  // Get data if exists, otherwise fetch
  const userData = await queryClient.ensureQueryData({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  // userData is guaranteed to exist (not undefined)
  return userData;
}

// Use in route loader (React Router)
async function userLoader({ params }) {
  const queryClient = new QueryClient();
  
  const user = await queryClient.ensureQueryData({
    queryKey: ['user', params.userId],
    queryFn: () => fetchUser(params.userId),
  });
  
  return { user };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">fetchQuery & fetchInfiniteQuery</h2>
        <p className="text-gray-700 mb-4">
          These methods fetch data directly without using hooks. Useful in non-React contexts or for
          imperative data fetching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">fetchQuery</h3>
        <CodeBlock
          title="Imperative Fetching"
          code={`import { useQueryClient } from '@tanstack/react-query';

async function fetchUserData(userId) {
  const queryClient = useQueryClient();
  
  try {
    const userData = await queryClient.fetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
    
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Use in event handlers
function handleButtonClick() {
  fetchUserData(userId).then(data => {
    console.log('User data:', data);
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">fetchInfiniteQuery</h3>
        <CodeBlock
          title="Imperative Infinite Fetch"
          code={`async function fetchAllPosts() {
  const queryClient = useQueryClient();
  
  const result = await queryClient.fetchInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  
  return result;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Default Options Methods</h2>
        <p className="text-gray-700 mb-4">
          These methods allow you to get and set default options for queries and mutations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">getDefaultOptions & setDefaultOptions</h3>
        <CodeBlock
          title="Global Default Options"
          code={`// Get current default options
const defaultOptions = queryClient.getDefaultOptions();
console.log(defaultOptions.queries);
console.log(defaultOptions.mutations);

// Set default options
queryClient.setDefaultOptions({
  queries: {
    staleTime: 1000 * 60 * 5,
    retry: 2,
  },
  mutations: {
    retry: 1,
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">setQueryDefaults & getQueryDefaults</h3>
        <CodeBlock
          title="Query-Specific Defaults"
          code={`// Set defaults for specific query key pattern
queryClient.setQueryDefaults(['user'], {
  staleTime: 1000 * 60 * 10, // 10 minutes
  cacheTime: 1000 * 60 * 60, // 1 hour
});

// All queries starting with ['user'] will use these defaults
useQuery({
  queryKey: ['user', userId], // Uses the defaults above
  queryFn: fetchUser,
});

// Get defaults for query key
const defaults = queryClient.getQueryDefaults(['user']);
console.log(defaults);`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">setMutationDefaults & getMutationDefaults</h3>
        <CodeBlock
          title="Mutation-Specific Defaults"
          code={`// Set defaults for specific mutation key
queryClient.setMutationDefaults(['updateUser'], {
  retry: 2,
  onError: (error) => {
    console.error('Update failed:', error);
  },
});

// All mutations with key ['updateUser'] will use these defaults
useMutation({
  mutationKey: ['updateUser'],
  mutationFn: updateUser,
  // Automatically uses the defaults above
});

// Get defaults for mutation key
const defaults = queryClient.getMutationDefaults(['updateUser']);
console.log(defaults);`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 1: Foundations & Core Concepts.
          You now understand the fundamentals of TanStack Query including setup, basic concepts,
          useQuery hook, and QueryClient methods. You're ready to move on to Phase 2: Mutations & Data Modification.
        </p>
      </div>
    </LessonLayout>
  );
}

