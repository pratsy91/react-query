import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryClientBasicsPage() {
  return (
    <LessonLayout
      title="1.4 Query Client Methods - Part 1: Data Access & Manipulation"
      description="Learn how to access and manipulate query data using QueryClient methods"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Introduction to QueryClient</h2>
        <p className="text-gray-700 mb-4">
          The QueryClient provides methods to interact with the query cache programmatically.
          You can access it using the <code className="bg-gray-100 px-1 rounded">useQueryClient</code> hook
          or by using the instance directly.
        </p>

        <CodeBlock
          title="Getting QueryClient Instance"
          code={`import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();
  
  // Now you can use queryClient methods
  const userData = queryClient.getQueryData(['user', 123]);
  
  return <div>...</div>;
}

// Or use the instance directly (if you have access)
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">getQueryData - Reading Cached Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">getQueryData</code> allows you to synchronously
          read data from the query cache without triggering a fetch.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Reading Cached Data"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleClick = () => {
    // Get cached user data
    const userData = queryClient.getQueryData(['user', userId]);
    
    if (userData) {
      console.log('Cached user:', userData);
      // Use cached data without triggering a fetch
    } else {
      console.log('No cached data available');
    }
  };
  
  return <button onClick={handleClick}>Get User</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">TypeScript Support</h3>
        <CodeBlock
          title="Typed getQueryData"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

function MyComponent() {
  const queryClient = useQueryClient();
  
  // Type the return value
  const userData = queryClient.getQueryData<User>(['user', userId]);
  // userData is User | undefined
  
  if (userData) {
    // TypeScript knows userData is User here
    console.log(userData.name);
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Common Patterns"
          code={`// Check if data exists before fetching
function OptimisticUpdate({ userId }) {
  const queryClient = useQueryClient();
  
  const updateUser = async (newData) => {
    // Get current data
    const currentData = queryClient.getQueryData(['user', userId]);
    
    // Optimistically update
    queryClient.setQueryData(['user', userId], {
      ...currentData,
      ...newData,
    });
    
    // Then perform actual update
    await updateUserOnServer(userId, newData);
  };
}

// Pre-populate forms
function EditUserForm({ userId }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(() => {
    // Initialize form with cached data if available
    return queryClient.getQueryData(['user', userId]) || {};
  });
  
  return <form>...</form>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">setQueryData - Updating Cached Data</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">setQueryData</code> allows you to synchronously
          update data in the query cache. This is useful for optimistic updates and cache manipulation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Setting Query Data"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleUpdate = () => {
    // Update cache directly
    queryClient.setQueryData(['user', userId], {
      id: userId,
      name: 'Updated Name',
      email: 'updated@example.com',
    });
    
    // All components using this query will re-render with new data
  };
  
  return <button onClick={handleUpdate}>Update Cache</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Updater Function</h3>
        <CodeBlock
          title="Using Updater Function"
          code={`function IncrementLikes({ postId }) {
  const queryClient = useQueryClient();
  
  const handleLike = () => {
    // Update based on previous value
    queryClient.setQueryData(['post', postId], (oldData) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        likes: oldData.likes + 1,
      };
    });
  };
  
  return <button onClick={handleLike}>Like</button>;
}

// Update nested data
function UpdateUserEmail({ userId }) {
  const queryClient = useQueryClient();
  
  const handleEmailUpdate = (newEmail) => {
    queryClient.setQueryData(['user', userId], (oldData) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        profile: {
          ...oldData.profile,
          email: newEmail,
        },
      };
    });
  };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Optimistic Updates</h3>
        <CodeBlock
          title="Optimistic Update Pattern"
          code={`function OptimisticLike({ postId }) {
  const queryClient = useQueryClient();
  
  const handleLike = async () => {
    // 1. Get current data
    const previousData = queryClient.getQueryData(['post', postId]);
    
    // 2. Optimistically update
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      likes: old.likes + 1,
      liked: true,
    }));
    
    try {
      // 3. Perform actual update
      await likePost(postId);
      
      // 4. Optionally refetch to ensure consistency
      await queryClient.invalidateQueries(['post', postId]);
    } catch (error) {
      // 5. Rollback on error
      queryClient.setQueryData(['post', postId], previousData);
      alert('Failed to like post');
    }
  };
  
  return <button onClick={handleLike}>Like</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">getQueryState - Query State Information</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">getQueryState</code> returns the current state
          of a query, including status, error, dataUpdatedAt, and other metadata.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Getting Query State"
          code={`import { useQueryClient } from '@tanstack/react-query';

function QueryStatus({ userId }) {
  const queryClient = useQueryClient();
  
  const queryState = queryClient.getQueryState(['user', userId]);
  
  if (!queryState) {
    return <div>Query not found in cache</div>;
  }
  
  return (
    <div>
      <p>Status: {queryState.status}</p>
      <p>Data Updated: {new Date(queryState.dataUpdatedAt).toLocaleString()}</p>
      <p>Error Updated: {queryState.errorUpdatedAt ? new Date(queryState.errorUpdatedAt).toLocaleString() : 'N/A'}</p>
      <p>Fetch Failure Count: {queryState.fetchFailureCount}</p>
      <p>Fetch Failure Reason: {queryState.fetchFailureReason}</p>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query State Properties</h3>
        <CodeBlock
          title="All Query State Properties"
          code={`const queryState = queryClient.getQueryState(['user', userId]);

// QueryState object contains:
{
  status: 'pending' | 'error' | 'success',
  data: any,                    // Cached data
  dataUpdatedAt: number,        // Timestamp
  error: Error | null,          // Error object
  errorUpdatedAt: number,       // Error timestamp
  fetchFailureCount: number,    // Number of failed fetches
  fetchFailureReason: Error | null, // Last failure reason
  fetchMeta: any,               // Metadata from last fetch
  isInvalidated: boolean,       // Whether query is invalidated
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Cases</h3>
        <CodeBlock
          title="Checking Query Status"
          code={`function SmartRefetch({ userId }) {
  const queryClient = useQueryClient();
  
  const handleRefetch = () => {
    const state = queryClient.getQueryState(['user', userId]);
    
    // Only refetch if query exists and is not currently fetching
    if (state && state.status !== 'pending') {
      queryClient.refetchQueries(['user', userId]);
    }
  };
  
  return <button onClick={handleRefetch}>Refetch</button>;
}

// Check if data is stale
function CheckStaleness({ userId }) {
  const queryClient = useQueryClient();
  
  const isStale = () => {
    const state = queryClient.getQueryState(['user', userId]);
    if (!state) return true;
    
    const staleTime = 1000 * 60 * 5; // 5 minutes
    const now = Date.now();
    return (now - state.dataUpdatedAt) > staleTime;
  };
  
  return <div>Data is {isStale() ? 'stale' : 'fresh'}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">invalidateQueries - Cache Invalidation</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">invalidateQueries</code> marks queries as stale
          and optionally refetches them. This is the primary way to refresh data after mutations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Invalidation</h3>
        <CodeBlock
          title="Invalidating Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handleUpdate = async () => {
    await updateUser(userId, newData);
    
    // Invalidate and refetch
    await queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
    
    // All components using this query will refetch
  };
  
  return <button onClick={handleUpdate}>Update User</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Partial Key Matching</h3>
        <CodeBlock
          title="Invalidating Multiple Queries"
          code={`// Invalidate all user queries
queryClient.invalidateQueries({
  queryKey: ['user'],
  // Matches: ['user'], ['user', 1], ['user', 2], etc.
});

// Invalidate specific user
queryClient.invalidateQueries({
  queryKey: ['user', userId],
  // Matches only: ['user', userId]
});

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) => {
    return query.queryKey[0] === 'user' && query.queryKey[1] > 100;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Refetch Options</h3>
        <CodeBlock
          title="Controlling Refetch Behavior"
          code={`// Invalidate and refetch active queries (default)
await queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'active', // 'active' | 'inactive' | 'all' | 'none'
});

// Invalidate but don't refetch
queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'none',
  // Queries marked as stale but won't refetch until accessed
});

// Invalidate all (active and inactive)
await queryClient.invalidateQueries({
  queryKey: ['user'],
  refetchType: 'all',
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Common Patterns</h3>
        <CodeBlock
          title="Invalidation Patterns"
          code={`// After mutation - invalidate related queries
async function updatePost(postId, data) {
  await updatePostOnServer(postId, data);
  
  // Invalidate this post
  queryClient.invalidateQueries(['post', postId]);
  
  // Invalidate user's posts list
  queryClient.invalidateQueries(['posts', 'user', userId]);
  
  // Invalidate all posts
  queryClient.invalidateQueries(['posts']);
}

// Batch invalidation
function handleBulkUpdate() {
  // Invalidate multiple query types
  queryClient.invalidateQueries(['users']);
  queryClient.invalidateQueries(['posts']);
  queryClient.invalidateQueries(['comments']);
}`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover refetchQueries, removeQueries,
          resetQueries, cancelQueries, and other advanced QueryClient methods.
        </p>
      </div>
    </LessonLayout>
  );
}

