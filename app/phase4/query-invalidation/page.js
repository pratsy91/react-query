import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryInvalidationPage() {
  return (
    <LessonLayout
      title="4.2 Query Invalidation"
      description="Master query invalidation with all options: exact matching, partial matching, predicates, and refetch types"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Query Invalidation?</h2>
        <p className="text-gray-700 mb-4">
          Query invalidation marks queries as stale and optionally refetches them. This is the primary
          way to keep your cache synchronized with server state after mutations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Invalidation Effects:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Marks queries as <strong>stale</strong> - Data is no longer considered fresh</li>
            <li>Optionally <strong>refetches</strong> - Can trigger immediate refetch</li>
            <li>Updates <strong>cache state</strong> - Changes query status</li>
            <li>Triggers <strong>re-renders</strong> - Components using invalidated queries update</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Invalidation"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleUpdate = async () => {
    await updateUser(userId, newData);
    
    // Invalidate and refetch
    await queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
  };
  
  return <button onClick={handleUpdate}>Update User</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">invalidateQueries - All Options</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">invalidateQueries</code> method provides
          multiple ways to target queries for invalidation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Exact Matching</h3>
        <CodeBlock
          title="Invalidate Exact Query Key"
          code={`// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: ['user', 123],
  // Only matches: ['user', 123]
  // Does NOT match: ['user', 124] or ['user']
});

// Example usage
function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['user', userId], // Exact match only
    });
  };
  
  return <button onClick={handleRefresh}>Refresh</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Partial Matching</h3>
        <CodeBlock
          title="Invalidate Multiple Queries with Partial Key"
          code={`// Invalidate all queries starting with ['user']
queryClient.invalidateQueries({
  queryKey: ['user'],
  // Matches:
  // - ['user']
  // - ['user', 123]
  // - ['user', 123, 'posts']
  // - ['user', 456]
  // Does NOT match: ['users'] (different key)
});

// Invalidate all user-related queries
function InvalidateAllUsers() {
  const queryClient = useQueryClient();
  
  const handleInvalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
      // Invalidates all queries with key starting with ['user']
    });
  };
  
  return <button onClick={handleInvalidate}>Invalidate All Users</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Predicate Functions</h3>
        <CodeBlock
          title="Custom Matching Logic"
          code={`// Invalidate with custom predicate
queryClient.invalidateQueries({
  predicate: (query) => {
    // Custom logic to determine if query should be invalidated
    const key = query.queryKey;
    
    // Example: Invalidate all queries for users with ID > 100
    return key[0] === 'user' && key[1] > 100;
  },
});

// Complex predicate example
queryClient.invalidateQueries({
  predicate: (query) => {
    const state = query.state;
    const key = query.queryKey;
    
    // Invalidate queries that:
    // 1. Start with 'user'
    // 2. Are older than 5 minutes
    // 3. Are currently inactive
    return (
      key[0] === 'user' &&
      state.dataUpdatedAt &&
      Date.now() - state.dataUpdatedAt > 5 * 60 * 1000 &&
      !query.getObserversCount()
    );
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">refetchType - Refetch Behavior</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">refetchType</code> option controls which
          queries are refetched after invalidation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchType: 'active' (Default)</h3>
        <CodeBlock
          title="Refetch Only Active Queries"
          code={`// Default behavior - only refetch queries that are currently being observed
await queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'active', // Default
  // Only refetches queries that have active observers (components using them)
  // Inactive queries are marked stale but not refetched
});

// Use case: After mutation, only refetch what's currently displayed
function UpdateUser({ userId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
        refetchType: 'active', // Only refetch if component is mounted
      });
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchType: 'inactive'</h3>
        <CodeBlock
          title="Refetch Only Inactive Queries"
          code={`// Refetch queries that are NOT currently being observed
await queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'inactive',
  // Only refetches queries without active observers
  // Useful for background updates
});

// Use case: Prefetch data for components that might mount soon
function PrefetchUserData() {
  const queryClient = useQueryClient();
  
  const prefetch = () => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
      refetchType: 'inactive', // Refetch even if not currently displayed
    });
  };
  
  return <button onClick={prefetch}>Prefetch User Data</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchType: 'all'</h3>
        <CodeBlock
          title="Refetch All Matching Queries"
          code={`// Refetch both active and inactive queries
await queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'all',
  // Refetches all matching queries regardless of observer status
});

// Use case: Force refresh all user data
function RefreshAllUsers() {
  const queryClient = useQueryClient();
  
  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['user'],
      refetchType: 'all', // Refetch everything
    });
  };
  
  return <button onClick={refresh}>Refresh All Users</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">refetchType: 'none'</h3>
        <CodeBlock
          title="Mark Stale Without Refetching"
          code={`// Mark queries as stale but don't refetch
queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'none',
  // Queries are marked stale but won't refetch until accessed
  // Useful for marking data as potentially outdated
});

// Use case: Mark data as stale without triggering refetch
function MarkStale() {
  const queryClient = useQueryClient();
  
  const markStale = () => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
      refetchType: 'none', // Just mark as stale
    });
    // Next time query is accessed, it will refetch
  };
  
  return <button onClick={markStale}>Mark as Stale</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Invalidation Strategies</h2>
        <p className="text-gray-700 mb-4">
          Different strategies for when and how to invalidate queries based on your application's needs.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 1: Invalidate After Mutations</h3>
        <CodeBlock
          title="Keep Cache in Sync with Server"
          code={`function UpdatePost({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      // Strategy: Invalidate related queries after mutation
      
      // 1. Invalidate specific post
      queryClient.invalidateQueries({
        queryKey: ['post', postId],
      });
      
      // 2. Invalidate posts list
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      
      // 3. Invalidate user's posts
      queryClient.invalidateQueries({
        queryKey: ['posts', 'user', data.userId],
      });
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 2: Optimistic Invalidation</h3>
        <CodeBlock
          title="Invalidate Before Mutation Completes"
          code={`function LikePost({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: likePost,
    onMutate: async () => {
      // Invalidate immediately for instant UI update
      await queryClient.invalidateQueries({
        queryKey: ['post', postId],
        refetchType: 'active',
      });
    },
    onError: () => {
      // Re-invalidate on error to get correct state
      queryClient.invalidateQueries({
        queryKey: ['post', postId],
      });
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 3: Batch Invalidation</h3>
        <CodeBlock
          title="Invalidate Multiple Query Types"
          code={`function BulkUpdate() {
  const queryClient = useQueryClient();
  
  const handleBulkUpdate = async () => {
    await performBulkUpdate();
    
    // Invalidate all affected query types
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['users'] }),
      queryClient.invalidateQueries({ queryKey: ['posts'] }),
      queryClient.invalidateQueries({ queryKey: ['comments'] }),
      queryClient.invalidateQueries({ queryKey: ['analytics'] }),
    ]);
  };
  
  return <button onClick={handleBulkUpdate}>Bulk Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 4: Selective Invalidation</h3>
        <CodeBlock
          title="Invalidate Based on Conditions"
          code={`function ConditionalInvalidation({ userId, updateType }) {
  const queryClient = useQueryClient();
  
  const handleUpdate = async () => {
    await updateUser(userId, data);
    
    // Invalidate based on update type
    if (updateType === 'profile') {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
    } else if (updateType === 'settings') {
      queryClient.invalidateQueries({
        queryKey: ['settings', userId],
      });
    } else {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({
        queryKey: ['user'],
        predicate: (query) => {
          return query.queryKey.includes(userId);
        },
      });
    }
  };
  
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Automatic Invalidation After Mutations</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query can automatically invalidate queries after mutations using the
          <code className="bg-gray-100 px-1 rounded">onSuccess</code> callback pattern.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Standard Pattern</h3>
        <CodeBlock
          title="Automatic Invalidation in onSuccess"
          code={`function CreatePost() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Automatically invalidate after successful mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Global Mutation Defaults</h3>
        <CodeBlock
          title="Set Default Invalidation for All Mutations"
          code={`const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onSuccess: (data, variables, context) => {
        // Global invalidation logic
        // This runs for all mutations unless overridden
        
        // Example: Invalidate based on mutation key
        const mutationKey = context?.mutationKey;
        if (mutationKey) {
          // Extract related query key from mutation key
          const relatedQueryKey = mutationKey[0]; // e.g., 'updateUser' -> 'user'
          queryClient.invalidateQueries({
            queryKey: [relatedQueryKey],
          });
        }
      },
    },
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation-Specific Defaults</h3>
        <CodeBlock
          title="Set Defaults for Specific Mutation Types"
          code={`// Set defaults for specific mutation key
queryClient.setMutationDefaults(['updateUser'], {
  onSuccess: (data, variables) => {
    // Automatically invalidate user queries
    queryClient.invalidateQueries({
      queryKey: ['user', variables.id],
    });
    queryClient.invalidateQueries({
      queryKey: ['users'],
    });
  },
});

// Now all mutations with key ['updateUser'] will automatically invalidate
const mutation = useMutation({
  mutationKey: ['updateUser'],
  mutationFn: updateUser,
  // onSuccess is automatically applied from defaults
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Invalidation Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Cascade Invalidation</h3>
        <CodeBlock
          title="Invalidate Related Queries in Sequence"
          code={`function CascadeInvalidation({ userId }) {
  const queryClient = useQueryClient();
  
  const handleUpdate = async () => {
    await updateUser(userId, data);
    
    // Cascade: Invalidate in order of dependency
    // 1. User data
    await queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
    
    // 2. User's posts (depends on user)
    await queryClient.invalidateQueries({
      queryKey: ['posts', userId],
    });
    
    // 3. User's followers (depends on user)
    await queryClient.invalidateQueries({
      queryKey: ['followers', userId],
    });
  };
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Smart Invalidation</h3>
        <CodeBlock
          title="Invalidate Based on Mutation Result"
          code={`function SmartInvalidation({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      // Invalidate based on what changed
      if (updatedPost.categoryChanged) {
        queryClient.invalidateQueries({
          queryKey: ['posts', 'category', updatedPost.category],
        });
      }
      
      if (updatedPost.authorChanged) {
        queryClient.invalidateQueries({
          queryKey: ['posts', 'author', updatedPost.authorId],
        });
      }
      
      // Always invalidate the specific post
      queryClient.invalidateQueries({
        queryKey: ['post', postId],
      });
    },
  });
  
  return <div>...</div>;
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">4.3 Prefetching</strong>
          to fetch data before it's needed and improve perceived performance.
        </p>
      </div>
    </LessonLayout>
  );
}

