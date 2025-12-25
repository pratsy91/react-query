import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function MutationPatternsPage() {
  return (
    <LessonLayout
      title="12.3 Mutation Patterns"
      description="Learn advanced mutation patterns: optimistic updates, undo/redo patterns, batch mutations, and transaction-like mutations"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Mutation Patterns</h2>
        <p className="text-gray-700 mb-4">
          Advanced mutation patterns provide better user experience and handle complex scenarios
          like optimistic updates, undo/redo, batching, and transactions.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Mutation Patterns:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Optimistic updates</li>
            <li>Undo/redo patterns</li>
            <li>Batch mutations</li>
            <li>Transaction-like mutations</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Optimistic Updates</h2>
        <p className="text-gray-700 mb-4">
          Optimistic updates provide instant feedback by updating the UI before the server
          confirms the change. If the mutation fails, rollback to the previous state.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Optimistic Update</h3>
        <CodeBlock
          title="Simple Optimistic Update"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', newData.id] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', newData.id]);

      // Optimistically update
      queryClient.setQueryData(['user', newData.id], (old: User) => ({
        ...old,
        ...newData,
      }));

      return { previousUser };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['user', newData.id], context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const updateMutation = useUpdateUser();

  const handleUpdate = () => {
    updateMutation.mutate({ id: userId, name: 'New Name' });
  };

  return <button onClick={handleUpdate}>Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Optimistic List Updates</h3>
        <CodeBlock
          title="Optimistic Updates for Lists"
          code={`function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: CreatePostData) => createPost(post),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically add to list
      queryClient.setQueryData(['posts'], (old: Post[]) => [
        { ...newPost, id: Date.now() }, // Temporary ID
        ...old,
      ]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace temporary post with real one
      queryClient.setQueryData(['posts'], (old: Post[]) => 
        old.map(post => 
          post.id === variables.tempId ? data : post
        )
      );
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Undo/Redo Patterns</h2>
        <p className="text-gray-700 mb-4">
          Implement undo/redo functionality by maintaining a history of mutations and allowing
          users to revert changes.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Undo Pattern</h3>
        <CodeBlock
          title="Undo Mutation Pattern"
          code={`import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUndoableMutation() {
  const queryClient = useQueryClient();
  const [history, setHistory] = useState<Array<{ data: any; timestamp: number }>>([]);

  const mutation = useMutation({
    mutationFn: (data: UpdateData) => updateData(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['data'] });

      const previousData = queryClient.getQueryData(['data']);

      // Save to history
      setHistory(prev => [...prev, { data: previousData, timestamp: Date.now() }]);

      // Optimistically update
      queryClient.setQueryData(['data'], newData);

      return { previousData };
    },
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['data'], context.previousData);
      }
    },
  });

  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      queryClient.setQueryData(['data'], lastState.data);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return { ...mutation, undo, canUndo: history.length > 0 };
}

// Usage
function DataEditor() {
  const { mutate, undo, canUndo } = useUndoableMutation();

  return (
    <div>
      <button onClick={() => mutate({ value: 'New Value' })}>Update</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Undo/Redo with History</h3>
        <CodeBlock
          title="Full Undo/Redo Implementation"
          code={`function useUndoRedoMutation() {
  const queryClient = useQueryClient();
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const mutation = useMutation({
    mutationFn: (data: UpdateData) => updateData(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['data'] });
      const previousData = queryClient.getQueryData(['data']);

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(previousData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Update data
      queryClient.setQueryData(['data'], newData);

      return { previousData };
    },
  });

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      queryClient.setQueryData(['data'], previousState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      queryClient.setQueryData(['data'], nextState);
      setHistoryIndex(historyIndex + 1);
    }
  };

  return {
    ...mutation,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Batch Mutations</h2>
        <p className="text-gray-700 mb-4">
          Batch multiple mutations together to execute them as a group, with shared error
          handling and rollback capabilities.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Sequential Batch Mutations</h3>
        <CodeBlock
          title="Batching Multiple Mutations"
          code={`function useBatchMutations() {
  const queryClient = useQueryClient();
  const [batch, setBatch] = useState<Array<{ type: string; data: any }>>([]);

  const addToBatch = (mutation: { type: string; data: any }) => {
    setBatch(prev => [...prev, mutation]);
  };

  const executeBatch = useMutation({
    mutationFn: async (mutations: Array<{ type: string; data: any }>) => {
      // Execute mutations sequentially
      const results = [];
      for (const mutation of mutations) {
        const result = await executeMutation(mutation.type, mutation.data);
        results.push(result);
      }
      return results;
    },
    onMutate: async (mutations) => {
      // Optimistically update all
      await queryClient.cancelQueries();
      
      const snapshots = mutations.map(mutation => {
        const key = getQueryKey(mutation.type);
        return {
          key,
          data: queryClient.getQueryData(key),
        };
      });

      mutations.forEach(mutation => {
        const key = getQueryKey(mutation.type);
        queryClient.setQueryData(key, mutation.data);
      });

      return { snapshots };
    },
    onError: (err, mutations, context) => {
      // Rollback all on error
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setBatch([]);
    },
  });

  return { addToBatch, executeBatch: () => executeBatch.mutate(batch), batch };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Parallel Batch Mutations</h3>
        <CodeBlock
          title="Parallel Batch Execution"
          code={`function useParallelBatchMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mutations: Array<{ type: string; data: any }>) => {
      // Execute all mutations in parallel
      return Promise.all(
        mutations.map(mutation => 
          executeMutation(mutation.type, mutation.data)
        )
      );
    },
    onMutate: async (mutations) => {
      await queryClient.cancelQueries();

      const snapshots = mutations.map(mutation => ({
        key: getQueryKey(mutation.type),
        data: queryClient.getQueryData(getQueryKey(mutation.type)),
      }));

      // Optimistically update all
      mutations.forEach(mutation => {
        queryClient.setQueryData(getQueryKey(mutation.type), mutation.data);
      });

      return { snapshots };
    },
    onError: (err, mutations, context) => {
      // Rollback all
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Transaction-Like Mutations</h2>
        <p className="text-gray-700 mb-4">
          Implement transaction-like behavior where multiple mutations succeed or fail together,
          ensuring data consistency.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Transaction Pattern</h3>
        <CodeBlock
          title="Transaction-Like Mutations"
          code={`function useTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operations: Array<{ type: string; data: any }>) => {
      // Execute all operations
      const results = [];
      
      try {
        for (const operation of operations) {
          const result = await executeOperation(operation.type, operation.data);
          results.push(result);
        }
        return results;
      } catch (error) {
        // Rollback completed operations
        for (let i = results.length - 1; i >= 0; i--) {
          await rollbackOperation(operations[i].type, results[i]);
        }
        throw error;
      }
    },
    onMutate: async (operations) => {
      await queryClient.cancelQueries();

      // Snapshot all affected queries
      const snapshots = operations.map(op => ({
        key: getQueryKey(op.type),
        data: queryClient.getQueryData(getQueryKey(op.type)),
      }));

      // Optimistically apply all
      operations.forEach(op => {
        queryClient.setQueryData(getQueryKey(op.type), op.data);
      });

      return { snapshots };
    },
    onError: (err, operations, context) => {
      // Rollback all optimistic updates
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Usage
function TransactionExample() {
  const transaction = useTransaction();

  const handleTransaction = () => {
    transaction.mutate([
      { type: 'updateUser', data: { id: 1, name: 'New' } },
      { type: 'updatePost', data: { id: 1, title: 'New Title' } },
    ]);
  };

  return <button onClick={handleTransaction}>Execute Transaction</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always rollback on error</strong> - Restore previous state</li>
            <li><strong>Snapshot before updates</strong> - Save state for rollback</li>
            <li><strong>Cancel outgoing queries</strong> - Prevent race conditions</li>
            <li><strong>Invalidate after success</strong> - Ensure data consistency</li>
            <li><strong>Handle edge cases</strong> - Network errors, timeouts</li>
            <li><strong>Provide user feedback</strong> - Show loading/error states</li>
            <li><strong>Test rollback scenarios</strong> - Verify error handling</li>
            <li><strong>Limit history size</strong> - Prevent memory issues</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">12.4 Error Recovery</strong>
          for retry strategies, exponential backoff, circuit breakers, and fallback data.
        </p>
      </div>
    </LessonLayout>
  );
}

