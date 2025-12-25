import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseMutationOptionsPage() {
  return (
    <LessonLayout
      title="2.1 useMutation Hook - Part 2: All Options"
      description="Learn all mutation options including callbacks, retry logic, network modes, and metadata"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">onMutate - Optimistic Updates Setup</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">onMutate</code> callback is called before
          the mutation function executes. It's perfect for optimistic updates and preparing context
          for rollback.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic onMutate Usage</h3>
        <CodeBlock
          title="Optimistic Update Setup"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdatePost({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updatePost,
    
    onMutate: async (newData) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['post', postId]);
      
      // Optimistically update
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        ...newData,
      }));
      
      // Return context for rollback
      return { previousPost };
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">onMutate Context</h3>
        <CodeBlock
          title="Using Context for Rollback"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onMutate: async (variables) => {
    // Save current data for potential rollback
    const previousData = queryClient.getQueryData(['user', variables.id]);
    
    // Cancel any in-flight queries
    await queryClient.cancelQueries(['user', variables.id]);
    
    // Optimistically update
    queryClient.setQueryData(['user', variables.id], variables);
    
    // Return context (available in onError)
    return { previousData, variables };
  },
  
  // Context is available in onError and onSettled
  onError: (error, variables, context) => {
    // Rollback using context
    if (context?.previousData) {
      queryClient.setQueryData(['user', context.variables.id], context.previousData);
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">onSuccess - Success Callback</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">onSuccess</code> callback is called when
          the mutation succeeds. It receives the mutation result, variables, and context.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic onSuccess Usage</h3>
        <CodeBlock
          title="Success Handler"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePost() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createPost,
    
    onSuccess: (data, variables, context) => {
      // data: result from mutationFn
      // variables: data passed to mutate()
      // context: return value from onMutate
      
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Show success notification
      toast.success('Post created successfully!');
      
      // Navigate to new post
      navigate(\`/posts/\${data.id}\`);
    },
  });
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Updating Cache in onSuccess</h3>
        <CodeBlock
          title="Cache Updates on Success"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onSuccess: (updatedUser, variables) => {
    // Update specific query
    queryClient.setQueryData(['user', updatedUser.id], updatedUser);
    
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['users'] });
    
    // Update list queries
    queryClient.setQueryData(['users'], (old) => {
      if (!old) return old;
      return old.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
    });
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">onError - Error Callback</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">onError</code> callback is called when
          the mutation fails. It's perfect for error handling and rollback operations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic onError Usage</h3>
        <CodeBlock
          title="Error Handler"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onError: (error, variables, context) => {
    // error: error thrown by mutationFn
    // variables: data passed to mutate()
    // context: return value from onMutate
    
    // Log error
    console.error('Mutation failed:', error);
    
    // Show error notification
    toast.error(\`Failed to update: \${error.message}\`);
    
    // Rollback optimistic update
    if (context?.previousData) {
      queryClient.setQueryData(['user', variables.id], context.previousData);
    }
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Recovery</h3>
        <CodeBlock
          title="Error Recovery Patterns"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onError: (error, variables, context) => {
    // Rollback optimistic update
    if (context?.previousData) {
      queryClient.setQueryData(['user', variables.id], context.previousData);
    }
    
    // Handle specific error types
    if (error.status === 401) {
      // Unauthorized - redirect to login
      navigate('/login');
    } else if (error.status === 403) {
      // Forbidden - show permission error
      toast.error('You do not have permission to perform this action');
    } else if (error.status === 429) {
      // Rate limited - retry after delay
      setTimeout(() => {
        mutation.mutate(variables);
      }, 5000);
    } else {
      // Generic error
      toast.error('An error occurred. Please try again.');
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">onSettled - Settled Callback</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">onSettled</code> callback is called after
          the mutation completes, regardless of success or failure. Useful for cleanup operations.
        </p>

        <CodeBlock
          title="Settled Handler"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onSettled: (data, error, variables, context) => {
    // Called after onSuccess or onError
    // data: result (if success) or undefined (if error)
    // error: error object (if error) or undefined (if success)
    // variables: data passed to mutate()
    // context: return value from onMutate
    
    // Always refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    
    // Cleanup operations
    setIsSubmitting(false);
    
    // Analytics tracking
    trackEvent('mutation_settled', {
      success: !error,
      mutation: 'updateUser',
    });
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">retry - Retry Logic</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">retry</code> option controls how many times
          a failed mutation will retry before giving up.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Retry Options</h3>
        <CodeBlock
          title="Retry Configuration"
          code={`// No retries
const mutation = useMutation({
  mutationFn: updateUser,
  retry: false,
});

// Retry 3 times (default)
const mutation = useMutation({
  mutationFn: updateUser,
  retry: 3,
});

// Conditional retry function
const mutation = useMutation({
  mutationFn: updateUser,
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">retryDelay - Retry Delay</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">retryDelay</code> option controls the delay
          between retry attempts.
        </p>

        <CodeBlock
          title="Retry Delay Configuration"
          code={`// Fixed delay
const mutation = useMutation({
  mutationFn: updateUser,
  retry: 3,
  retryDelay: 1000, // Always wait 1 second
});

// Exponential backoff
const mutation = useMutation({
  mutationFn: updateUser,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  // Attempt 1: 1s delay
  // Attempt 2: 2s delay
  // Attempt 3: 4s delay
  // Max: 30s delay
});

// Custom delay function
const mutation = useMutation({
  mutationFn: updateUser,
  retry: 3,
  retryDelay: (attemptIndex, error) => {
    // Longer delay for rate limit errors
    if (error.status === 429) {
      return 5000; // 5 seconds
    }
    return 1000 * attemptIndex; // Linear backoff
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">networkMode - Network Mode</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">networkMode</code> option controls when
          mutations should execute based on network connectivity.
        </p>

        <CodeBlock
          title="Network Mode Options"
          code={`// online (default) - Only execute when online
const mutation = useMutation({
  mutationFn: updateUser,
  networkMode: 'online',
});

// always - Execute even when offline (queue for when online)
const mutation = useMutation({
  mutationFn: updateUser,
  networkMode: 'always',
  // Mutation will be queued if offline and executed when online
});

// offlineFirst - Use cache when offline, execute when online
const mutation = useMutation({
  mutationFn: updateUser,
  networkMode: 'offlineFirst',
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">gcTime - Garbage Collection Time</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">gcTime</code> (v5+) or <code className="bg-gray-100 px-1 rounded">cacheTime</code> (v4)
          option determines how long mutation results stay in cache before being garbage collected.
        </p>

        <CodeBlock
          title="Garbage Collection Configuration"
          code={`// Default: 5 minutes
const mutation = useMutation({
  mutationFn: updateUser,
  gcTime: 1000 * 60 * 5, // v5+
  // cacheTime: 1000 * 60 * 5, // v4
});

// Keep in cache for 1 hour
const mutation = useMutation({
  mutationFn: updateUser,
  gcTime: 1000 * 60 * 60, // 1 hour
});

// Never garbage collect
const mutation = useMutation({
  mutationFn: updateUser,
  gcTime: Infinity,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">meta - Metadata</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">meta</code> option allows you to attach
          custom metadata to mutations for logging, analytics, or custom logic.
        </p>

        <CodeBlock
          title="Mutation Metadata"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  meta: {
    errorMessage: 'Failed to update user',
    logLevel: 'error',
    analytics: {
      event: 'user_update',
      userId: userId,
    },
  },
});

// Access meta in mutation function context
async function updateUser(variables, { meta }) {
  console.log('Meta:', meta);
  
  // Use meta for logging
  logMutation('updateUser', { variables, meta });
  
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  
  return response.json();
}

// Access meta in error handlers
const mutation = useMutation({
  mutationFn: updateUser,
  meta: {
    errorMessage: 'Failed to update user',
  },
  onError: (error, variables, context) => {
    const errorMessage = mutation.options.meta?.errorMessage || 'Unknown error';
    toast.error(errorMessage);
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationKey - Mutation Key</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">mutationKey</code> allows you to identify
          mutations for filtering and tracking. Similar to query keys but for mutations.
        </p>

        <CodeBlock
          title="Mutation Key Usage"
          code={`// Basic mutation key
const mutation = useMutation({
  mutationKey: ['updateUser'],
  mutationFn: updateUser,
});

// Mutation key with parameters
const mutation = useMutation({
  mutationKey: ['updateUser', userId],
  mutationFn: (data) => updateUser(userId, data),
});

// Access mutation by key
const queryClient = useQueryClient();
const mutationCache = queryClient.getMutationCache();
const updateMutation = mutationCache.find({
  mutationKey: ['updateUser', userId],
});

// Filter mutations by key
const allUserMutations = mutationCache.findAll({
  predicate: (mutation) => {
    return mutation.options.mutationKey?.[0] === 'updateUser';
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete Mutation Example</h2>
        <p className="text-gray-700 mb-4">
          Here's a complete example using all the mutation options:
        </p>

        <CodeBlock
          title="Full-Featured Mutation"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateUserForm({ userId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationKey: ['updateUser', userId],
    mutationFn: async (userData) => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      return response.json();
    },
    
    // Optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });
      const previousUser = queryClient.getQueryData(['user', userId]);
      
      queryClient.setQueryData(['user', userId], (old) => ({
        ...old,
        ...newData,
      }));
      
      return { previousUser };
    },
    
    // Success handler
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['user', userId], data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
    },
    
    // Error handler
    onError: (error, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser);
      }
      toast.error(\`Failed to update: \${error.message}\`);
    },
    
    // Settled handler
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
    
    // Retry configuration
    retry: (failureCount, error) => {
      if (error.status >= 400 && error.status < 500) {
        return false; // Don't retry client errors
      }
      return failureCount < 3; // Retry up to 3 times
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Network mode
    networkMode: 'online',
    
    // Garbage collection
    gcTime: 1000 * 60 * 5, // 5 minutes
    
    // Metadata
    meta: {
      errorMessage: 'Failed to update user',
      analytics: { event: 'user_update', userId },
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation.mutate({
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Updating...' : 'Update User'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>User updated!</div>}
    </form>
  );
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Now that you understand all mutation options, proceed to
          <strong className="ml-1">2.2 Optimistic Updates</strong> to learn advanced patterns for
          optimistic UI updates.
        </p>
      </div>
    </LessonLayout>
  );
}

