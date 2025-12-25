import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseMutationStatePage() {
  return (
    <LessonLayout
      title="2.3 useMutationState Hook (v5+)"
      description="Learn how to access mutation state programmatically using useMutationState hook"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Introduction to useMutationState</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useMutationState</code> hook (v5+) allows you
          to access mutation state without directly using a mutation hook. This is useful for accessing
          mutation state from components that don't trigger the mutation.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This hook is only available in TanStack Query v5+. In v4, you would
            need to use the mutation hook directly or access the mutation cache.
          </p>
        </div>

        <CodeBlock
          title="Basic useMutationState Usage"
          code={`import { useMutationState } from '@tanstack/react-query';

function MutationStatusIndicator() {
  // Get state of all mutations with specific key
  const mutations = useMutationState({
    filters: { mutationKey: ['updateUser'] },
  });
  
  // Check if any mutation is pending
  const isPending = mutations.some(m => m.status === 'pending');
  
  return (
    <div>
      {isPending && <div>Saving...</div>}
      {mutations.map((mutation, index) => (
        <div key={index}>
          Status: {mutation.status}
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Accessing Mutation State</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useMutationState</code> returns an array of
          mutation state objects that match your filters.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation State Object</h3>
        <CodeBlock
          title="Mutation State Properties"
          code={`const mutations = useMutationState({
  filters: { mutationKey: ['updateUser'] },
});

// Each mutation object contains:
mutations.forEach((mutation) => {
  console.log({
    status: mutation.status,        // 'idle' | 'pending' | 'error' | 'success'
    data: mutation.data,            // Result data (if success)
    error: mutation.error,           // Error object (if error)
    variables: mutation.variables,   // Variables passed to mutate()
    submittedAt: mutation.submittedAt, // Timestamp when mutation was submitted
    reset: mutation.reset,           // Function to reset mutation
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic State Access</h3>
        <CodeBlock
          title="Simple State Access"
          code={`function SaveIndicator() {
  const mutations = useMutationState({
    filters: { mutationKey: ['saveDocument'] },
  });
  
  const pendingMutation = mutations.find(m => m.status === 'pending');
  const errorMutation = mutations.find(m => m.status === 'error');
  const successMutation = mutations.find(m => m.status === 'success');
  
  return (
    <div>
      {pendingMutation && <div>Saving document...</div>}
      {errorMutation && <div>Error: {errorMutation.error.message}</div>}
      {successMutation && <div>Document saved!</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Filtering Mutations</h2>
        <p className="text-gray-700 mb-4">
          You can filter mutations by various criteria to access only the mutations you need.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by mutationKey</h3>
        <CodeBlock
          title="Filtering by Key"
          code={`// Get all mutations with specific key
const updateMutations = useMutationState({
  filters: { mutationKey: ['updateUser'] },
});

// Get mutations with partial key match
const userMutations = useMutationState({
  filters: { mutationKey: ['user'] },
  // Matches: ['user', 'update'], ['user', 'delete'], etc.
});

// Get specific mutation with full key
const specificMutation = useMutationState({
  filters: { mutationKey: ['updateUser', userId] },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Status</h3>
        <CodeBlock
          title="Filtering by Status"
          code={`// Get only pending mutations
const pendingMutations = useMutationState({
  filters: { 
    mutationKey: ['updateUser'],
    status: 'pending',
  },
});

// Get only error mutations
const errorMutations = useMutationState({
  filters: { 
    mutationKey: ['updateUser'],
    status: 'error',
  },
});

// Get only successful mutations
const successMutations = useMutationState({
  filters: { 
    mutationKey: ['updateUser'],
    status: 'success',
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter with Predicate</h3>
        <CodeBlock
          title="Custom Filtering"
          code={`// Filter with custom predicate
const recentMutations = useMutationState({
  filters: {
    predicate: (mutation) => {
      // Only mutations from last 5 minutes
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      return mutation.submittedAt > fiveMinutesAgo;
    },
  },
});

// Complex filtering
const userUpdateMutations = useMutationState({
  filters: {
    predicate: (mutation) => {
      const key = mutation.options.mutationKey;
      return key?.[0] === 'updateUser' && 
             key?.[1] === currentUserId &&
             mutation.status === 'pending';
    },
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Use Cases</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useMutationState</code> is useful in various
          scenarios where you need to access mutation state without directly using the mutation hook.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 1: Global Loading Indicator</h3>
        <CodeBlock
          title="Show Loading State Anywhere"
          code={`function GlobalLoadingIndicator() {
  // Get all pending mutations
  const pendingMutations = useMutationState({
    filters: { status: 'pending' },
  });
  
  const isLoading = pendingMutations.length > 0;
  
  return (
    <div className={isLoading ? 'loading' : ''}>
      {isLoading && (
        <div>
          {pendingMutations.length} operation(s) in progress...
        </div>
      )}
    </div>
  );
}

// Can be used anywhere in the app, even if mutations
// are triggered from different components`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 2: Error Notification</h3>
        <CodeBlock
          title="Show Errors from Any Mutation"
          code={`function ErrorNotification() {
  const errorMutations = useMutationState({
    filters: { status: 'error' },
  });
  
  useEffect(() => {
    errorMutations.forEach((mutation) => {
      if (mutation.error) {
        toast.error(\`Error: \${mutation.error.message}\`);
        // Reset mutation after showing error
        mutation.reset();
      }
    });
  }, [errorMutations]);
  
  return null; // No UI, just side effects
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 3: Optimistic Update Status</h3>
        <CodeBlock
          title="Show Status of Optimistic Updates"
          code={`function OptimisticUpdateStatus({ postId }) {
  const mutations = useMutationState({
    filters: {
      predicate: (mutation) => {
        // Get mutations that affect this post
        const key = mutation.options.mutationKey;
        return key?.includes(postId);
      },
    },
  });
  
  const pendingMutation = mutations.find(m => m.status === 'pending');
  const errorMutation = mutations.find(m => m.status === 'error');
  
  return (
    <div>
      {pendingMutation && (
        <div className="optimistic-update">
          Updating... (optimistic)
        </div>
      )}
      {errorMutation && (
        <div className="error">
          Update failed, rolling back...
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 4: Form Submission Status</h3>
        <CodeBlock
          title="Track Form Submission State"
          code={`function FormSubmissionStatus({ formId }) {
  const mutations = useMutationState({
    filters: {
      mutationKey: ['submitForm', formId],
    },
  });
  
  const latestMutation = mutations[mutations.length - 1];
  
  if (!latestMutation) return null;
  
  return (
    <div>
      {latestMutation.status === 'pending' && (
        <div>Submitting form...</div>
      )}
      {latestMutation.status === 'success' && (
        <div>Form submitted successfully!</div>
      )}
      {latestMutation.status === 'error' && (
        <div>
          Submission failed: {latestMutation.error.message}
          <button onClick={() => latestMutation.reset()}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 5: Batch Operation Status</h3>
        <CodeBlock
          title="Track Multiple Related Mutations"
          code={`function BatchOperationStatus() {
  const mutations = useMutationState({
    filters: {
      predicate: (mutation) => {
        const key = mutation.options.mutationKey;
        return key?.[0] === 'batchUpdate';
      },
    },
  });
  
  const pending = mutations.filter(m => m.status === 'pending').length;
  const completed = mutations.filter(m => m.status === 'success').length;
  const failed = mutations.filter(m => m.status === 'error').length;
  const total = mutations.length;
  
  return (
    <div>
      <div>Total: {total}</div>
      <div>Pending: {pending}</div>
      <div>Completed: {completed}</div>
      <div>Failed: {failed}</div>
      
      {pending === 0 && total > 0 && (
        <div>
          Batch operation complete!
          {failed > 0 && <div>{failed} items failed</div>}
        </div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <p className="text-gray-700 mb-4">
          Here are some advanced patterns for using <code className="bg-gray-100 px-1 rounded">useMutationState</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selecting Specific Properties</h3>
        <CodeBlock
          title="Using select Option"
          code={`// Only get specific properties
const mutationStatuses = useMutationState({
  filters: { mutationKey: ['updateUser'] },
  select: (mutation) => ({
    status: mutation.status,
    submittedAt: mutation.submittedAt,
  }),
});

// Get only pending count
const pendingCount = useMutationState({
  filters: { status: 'pending' },
  select: (mutations) => mutations.length,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combining with useQuery</h3>
        <CodeBlock
          title="Mutation State with Query Data"
          code={`function UserProfileWithStatus({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  const mutations = useMutationState({
    filters: {
      mutationKey: ['updateUser', userId],
    },
  });
  
  const pendingMutation = mutations.find(m => m.status === 'pending');
  
  // Show optimistic data if mutation is pending
  const displayUser = pendingMutation?.variables || user;
  
  return (
    <div>
      <h1>{displayUser?.name}</h1>
      {pendingMutation && <div>Updating...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Comparison with useMutation</h2>
        <p className="text-gray-700 mb-4">
          Understanding when to use <code className="bg-gray-100 px-1 rounded">useMutationState</code>
          vs <code className="bg-gray-100 px-1 rounded">useMutation</code>.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-900">Use <code className="bg-white px-1 rounded">useMutation</code> when:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You need to trigger the mutation</li>
            <li>You're in the component that performs the action</li>
            <li>You need the mutate/mutateAsync functions</li>
            <li>You need mutation callbacks (onSuccess, onError, etc.)</li>
          </ul>

          <h4 className="text-lg font-semibold mb-3 text-gray-900 mt-4">Use <code className="bg-white px-1 rounded">useMutationState</code> when:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You only need to read mutation state</li>
            <li>Mutations are triggered elsewhere</li>
            <li>You need to show status in multiple components</li>
            <li>You need to filter or aggregate multiple mutations</li>
            <li>You're building global indicators or notifications</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 2: Mutations & Data Modification.
          You now understand how to use mutations, handle optimistic updates, and access mutation
          state programmatically. You're ready to move on to Phase 3: Advanced Query Patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

