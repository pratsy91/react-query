import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseMutationBasicsPage() {
  return (
    <LessonLayout
      title="2.1 useMutation Hook - Part 1: Basic Usage & Core Options"
      description="Learn the fundamentals of useMutation hook for data modification operations"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Introduction to useMutation</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useMutation</code> hook is used for
          creating, updating, or deleting data on the server. Unlike queries, mutations are
          typically triggered by user actions and are not automatically executed.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Differences from Queries:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Mutations are <strong>imperative</strong> - you call them manually</li>
            <li>Mutations are <strong>not cached</strong> - they execute immediately</li>
            <li>Mutations are <strong>optimistic</strong> - can update UI before server responds</li>
            <li>Mutations handle <strong>side effects</strong> - like invalidating queries</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useMutation Example"
          code={`import { useMutation } from '@tanstack/react-query';

function CreatePost() {
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).then(res => res.json());
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      title: 'New Post',
      content: 'Post content',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>Post created!</div>}
    </form>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutationFn - The Mutation Function</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">mutationFn</code> is an async function
          that performs the actual mutation operation. It receives the variables passed to
          <code className="bg-gray-100 px-1 rounded">mutate</code> or <code className="bg-gray-100 px-1 rounded">mutateAsync</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Mutation Function</h3>
        <CodeBlock
          title="Simple Mutation Function"
          code={`const mutation = useMutation({
  mutationFn: async (newUser) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation Function with Context</h3>
        <CodeBlock
          title="Accessing Mutation Context"
          code={`const mutation = useMutation({
  mutationFn: async (variables, context) => {
    // variables: data passed to mutate()
    // context: object with mutationKey, meta, etc.
    
    const { mutationKey, meta } = context;
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Mutation-Key': mutationKey?.[0],
      },
      body: JSON.stringify(variables),
    });
    
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Handling</h3>
        <CodeBlock
          title="Proper Error Handling in mutationFn"
          code={`const mutation = useMutation({
  mutationFn: async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        // Extract error message from response
        const error = await response.json();
        throw new Error(error.message || \`HTTP error! status: \${response.status}\`);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw or transform error
      throw new Error(\`Failed to create user: \${error.message}\`);
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation States</h2>
        <p className="text-gray-700 mb-4">
          Mutations go through several states during their lifecycle. Understanding these states
          is crucial for building responsive UIs.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">All Mutation State Properties</h3>
        <CodeBlock
          title="Mutation State Properties"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
});

// Access all state properties
const {
  // Status flags
  status,           // 'idle' | 'pending' | 'error' | 'success'
  isIdle,           // true when status is 'idle'
  isPending,        // true when status is 'pending' (v5+)
  isLoading,        // true when status is 'pending' (v4, deprecated in v5)
  isError,          // true when status is 'error'
  isSuccess,        // true when status is 'success'
  
  // Data
  data,             // Data returned from mutationFn (undefined until success)
  error,            // Error object if mutation failed
  
  // Reset function
  reset,            // Function to reset mutation to idle state
  
  // Mutation functions
  mutate,           // Function to trigger mutation
  mutateAsync,      // Async function to trigger mutation (returns Promise)
  
  // Context
  context,          // Context returned from onMutate
  failureCount,     // Number of failed attempts
  failureReason,    // Last failure reason
} = mutation;`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">State Flow</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <pre className="text-gray-700 font-mono text-sm">
{`Mutation Lifecycle:

1. Initial State (idle)
   status: 'idle'
   isIdle: true
   data: undefined
   error: null

2. Mutation Triggered (pending)
   status: 'pending'
   isPending: true
   data: undefined
   error: null

3. Success State
   status: 'success'
   isSuccess: true
   data: <mutation result>
   error: null

4. Error State
   status: 'error'
   isError: true
   data: undefined
   error: <error object>

5. Reset (back to idle)
   mutation.reset()
   status: 'idle'`}
          </pre>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Practical State Usage</h3>
        <CodeBlock
          title="Handling All States"
          code={`function UpdateUserForm({ userId }) {
  const mutation = useMutation({
    mutationFn: (userData) => updateUser(userId, userData),
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
      
      <button 
        type="submit" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Updating...' : 'Update User'}
      </button>
      
      {mutation.isError && (
        <div className="error">
          Error: {mutation.error.message}
          <button onClick={() => mutation.reset()}>Dismiss</button>
        </div>
      )}
      
      {mutation.isSuccess && (
        <div className="success">
          User updated successfully!
          <button onClick={() => mutation.reset()}>Close</button>
        </div>
      )}
    </form>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">mutate vs mutateAsync</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query provides two ways to trigger mutations: <code className="bg-gray-100 px-1 rounded">mutate</code>
          (fire-and-forget) and <code className="bg-gray-100 px-1 rounded">mutateAsync</code> (returns a Promise).
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">mutate - Fire and Forget</h3>
        <CodeBlock
          title="Using mutate"
          code={`function CreatePost() {
  const mutation = useMutation({
    mutationFn: createPost,
  });

  const handleClick = () => {
    // Fire and forget - don't wait for result
    mutation.mutate({
      title: 'New Post',
      content: 'Content',
    });
    
    // This executes immediately, doesn't wait for mutation
    console.log('Mutation triggered');
  };

  return (
    <button onClick={handleClick}>
      Create Post
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">mutateAsync - Promise-Based</h3>
        <CodeBlock
          title="Using mutateAsync"
          code={`function CreatePost() {
  const mutation = useMutation({
    mutationFn: createPost,
  });

  const handleClick = async () => {
    try {
      // Wait for mutation to complete
      const result = await mutation.mutateAsync({
        title: 'New Post',
        content: 'Content',
      });
      
      // This executes after mutation succeeds
      console.log('Post created:', result);
      
      // Navigate or perform other actions
      navigate(\`/posts/\${result.id}\`);
    } catch (error) {
      // Handle error
      console.error('Failed to create post:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      Create Post
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">When to Use Each</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-900">Use <code className="bg-white px-1 rounded">mutate</code> when:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You don't need to wait for the result</li>
            <li>You handle success/error via callbacks (onSuccess, onError)</li>
            <li>You want fire-and-forget behavior</li>
            <li>You're using optimistic updates</li>
          </ul>

          <h4 className="text-lg font-semibold mb-3 text-gray-900 mt-4">Use <code className="bg-white px-1 rounded">mutateAsync</code> when:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You need to wait for the result</li>
            <li>You want to chain operations (await, then, catch)</li>
            <li>You need the result for navigation or other actions</li>
            <li>You're in async functions and need sequential logic</li>
          </ul>
        </div>

        <CodeBlock
          title="Comparison Example"
          code={`// Using mutate (with callbacks)
mutation.mutate(data, {
  onSuccess: (result) => {
    console.log('Success:', result);
    navigate('/success');
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

// Using mutateAsync (with async/await)
try {
  const result = await mutation.mutateAsync(data);
  console.log('Success:', result);
  navigate('/success');
} catch (error) {
  console.error('Error:', error);
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Error Handling in Mutations</h2>
        <p className="text-gray-700 mb-4">
          Proper error handling is crucial for mutations. TanStack Query provides multiple ways
          to handle errors.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Handling Strategies</h3>
        <CodeBlock
          title="Multiple Error Handling Approaches"
          code={`function UpdateUser({ userId }) {
  const mutation = useMutation({
    mutationFn: updateUser,
    
    // Global error handler (for this mutation)
    onError: (error, variables, context) => {
      console.error('Mutation failed:', error);
      // Show toast notification
      toast.error(\`Failed to update user: \${error.message}\`);
    },
  });

  const handleUpdate = async (userData) => {
    try {
      // Per-mutation error handling
      await mutation.mutateAsync(userData, {
        onError: (error) => {
          // This overrides the global onError for this call
          if (error.status === 404) {
            alert('User not found');
          } else {
            alert('Update failed');
          }
        },
      });
    } catch (error) {
      // Catch from mutateAsync
      if (error.status === 403) {
        alert('Permission denied');
      }
    }
  };

  return (
    <button onClick={() => handleUpdate({ name: 'New Name' })}>
      Update
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Recovery</h3>
        <CodeBlock
          title="Retry and Recovery Patterns"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  retry: 3, // Retry failed mutations 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  onError: (error, variables, context) => {
    // Log error for monitoring
    logError(error, variables);
    
    // Attempt recovery
    if (error.status === 429) {
      // Rate limited - retry after delay
      setTimeout(() => {
        mutation.mutate(variables);
      }, 5000);
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Reset Mutations</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">reset</code> function allows you to
          reset a mutation back to its initial idle state, clearing data and error states.
        </p>

        <CodeBlock
          title="Resetting Mutations"
          code={`function CreatePost() {
  const mutation = useMutation({
    mutationFn: createPost,
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleReset = () => {
    // Reset mutation to idle state
    mutation.reset();
    // status: 'idle'
    // data: undefined
    // error: null
  };

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ title: 'New Post' });
      }}>
        <button type="submit">Create</button>
      </form>
      
      {mutation.isSuccess && (
        <div>
          <p>Post created!</p>
          <button onClick={handleReset}>Create Another</button>
        </div>
      )}
      
      {mutation.isError && (
        <div>
          <p>Error: {mutation.error.message}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}
    </div>
  );
}`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover all mutation options including
          onMutate, onSuccess, onError, onSettled, retry, retryDelay, networkMode, gcTime, meta, and mutationKey.
        </p>
      </div>
    </LessonLayout>
  );
}

