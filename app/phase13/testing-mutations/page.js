import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TestingMutationsPage() {
  return (
    <LessonLayout
      title="13.2 Testing Mutations"
      description="Learn to test mutations: testing mutations, optimistic updates, error handling, and side effects"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Mutations</h2>
        <p className="text-gray-700 mb-4">
          Testing mutations requires verifying that mutations execute correctly, handle errors,
          and trigger the expected side effects like cache updates.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Mutation Testing Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Testing mutations</li>
            <li>Testing optimistic updates</li>
            <li>Testing error handling</li>
            <li>Testing side effects</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Mutations</h2>
        <p className="text-gray-700 mb-4">
          Test basic mutation functionality including execution, success, and state changes.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Mutation Test</h3>
        <CodeBlock
          title="Testing useMutation Hook"
          code={`import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

function useUpdateUser() {
  return useMutation({
    mutationFn: (data) => updateUser(data),
  });
}

test('executes mutation successfully', async () => {
  const queryClient = createTestQueryClient();
  const mockUpdateUser = jest.fn().mockResolvedValue({ id: 1, name: 'Updated' });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useUpdateUser(), { wrapper });

  // Initially idle
  expect(result.current.isIdle).toBe(true);

  // Execute mutation
  result.current.mutate({ id: 1, name: 'Updated' });

  // Should be pending
  expect(result.current.isPending).toBe(true);

  // Wait for success
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify mutation was called
  expect(mockUpdateUser).toHaveBeenCalledWith({ id: 1, name: 'Updated' });
  expect(result.current.data).toEqual({ id: 1, name: 'Updated' });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Mutation States</h3>
        <CodeBlock
          title="Testing Mutation State Transitions"
          code={`test('mutation state transitions', async () => {
  const queryClient = createTestQueryClient();
  const mockUpdate = jest.fn().mockResolvedValue({ success: true });

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  // Initial state
  expect(result.current.isIdle).toBe(true);
  expect(result.current.isPending).toBe(false);
  expect(result.current.isSuccess).toBe(false);
  expect(result.current.isError).toBe(false);

  // Start mutation
  result.current.mutate({ id: 1 });

  // Pending state
  expect(result.current.isPending).toBe(true);
  expect(result.current.isIdle).toBe(false);

  // Wait for success
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Success state
  expect(result.current.isPending).toBe(false);
  expect(result.current.isError).toBe(false);
  expect(result.current.data).toEqual({ success: true });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Optimistic Updates</h2>
        <p className="text-gray-700 mb-4">
          Test optimistic updates to verify that UI updates immediately and rolls back on error.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Optimistic Update</h3>
        <CodeBlock
          title="Testing Optimistic Updates"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function useOptimisticUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateUser(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user', newData.id] });
      const previousUser = queryClient.getQueryData(['user', newData.id]);
      
      queryClient.setQueryData(['user', newData.id], (old) => ({
        ...old,
        ...newData,
      }));

      return { previousUser };
    },
    onError: (err, newData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', newData.id], context.previousUser);
      }
    },
  });
}

test('optimistically updates cache', async () => {
  const queryClient = createTestQueryClient();
  
  // Set initial data
  queryClient.setQueryData(['user', 1], { id: 1, name: 'John' });

  const { result } = renderHook(
    () => useOptimisticUpdateUser(),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  // Verify initial data
  expect(queryClient.getQueryData(['user', 1])).toEqual({ id: 1, name: 'John' });

  // Execute mutation
  result.current.mutate({ id: 1, name: 'Jane' });

  // Cache should be updated optimistically
  await waitFor(() => {
    expect(queryClient.getQueryData(['user', 1])).toEqual({ id: 1, name: 'Jane' });
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Rollback on Error</h3>
        <CodeBlock
          title="Testing Optimistic Rollback"
          code={`test('rolls back optimistic update on error', async () => {
  const queryClient = createTestQueryClient();
  
  const initialUser = { id: 1, name: 'John' };
  queryClient.setQueryData(['user', 1], initialUser);

  const mockUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ['user', newData.id] });
        const previous = queryClient.getQueryData(['user', newData.id]);
        
        queryClient.setQueryData(['user', newData.id], newData);
        return { previous };
      },
      onError: (err, newData, context) => {
        if (context?.previous) {
          queryClient.setQueryData(['user', newData.id], context.previous);
        }
      },
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  // Execute mutation
  result.current.mutate({ id: 1, name: 'Jane' });

  // Should update optimistically
  await waitFor(() => {
    expect(queryClient.getQueryData(['user', 1])).toEqual({ id: 1, name: 'Jane' });
  });

  // Wait for error
  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });

  // Should rollback to original
  expect(queryClient.getQueryData(['user', 1])).toEqual(initialUser);
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Error Handling</h2>
        <p className="text-gray-700 mb-4">
          Verify that mutations handle errors correctly and provide appropriate error information.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Mutation Errors</h3>
        <CodeBlock
          title="Testing Error State"
          code={`test('handles mutation error', async () => {
  const queryClient = createTestQueryClient();
  const errorMessage = 'Update failed';

  const mockUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  // Execute mutation
  result.current.mutate({ id: 1 });

  // Wait for error
  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });

  // Verify error
  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.error.message).toBe(errorMessage);
  expect(result.current.isPending).toBe(false);
  expect(result.current.isSuccess).toBe(false);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Error Callbacks</h3>
        <CodeBlock
          title="Testing onError Callback"
          code={`test('calls onError callback', async () => {
  const queryClient = createTestQueryClient();
  const onError = jest.fn();
  const error = new Error('Update failed');

  const mockUpdate = jest.fn().mockRejectedValue(error);

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
      onError,
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  result.current.mutate({ id: 1 });

  await waitFor(() => {
    expect(result.current.isError).toBe(true);
  });

  // Verify onError was called
  expect(onError).toHaveBeenCalledWith(error, { id: 1 }, undefined);
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Side Effects</h2>
        <p className="text-gray-700 mb-4">
          Test side effects like cache invalidation, query updates, and other actions triggered
          by mutations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Cache Invalidation</h3>
        <CodeBlock
          title="Testing Query Invalidation"
          code={`test('invalidates queries on success', async () => {
  const queryClient = createTestQueryClient();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  const mockUpdate = jest.fn().mockResolvedValue({ id: 1, name: 'Updated' });

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  result.current.mutate({ id: 1, name: 'Updated' });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify invalidation was called
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Query Updates</h3>
        <CodeBlock
          title="Testing setQueryData"
          code={`test('updates query data on success', async () => {
  const queryClient = createTestQueryClient();
  
  // Set initial data
  queryClient.setQueryData(['user', 1], { id: 1, name: 'John' });

  const updatedUser = { id: 1, name: 'Jane' };
  const mockUpdate = jest.fn().mockResolvedValue(updatedUser);

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
      onSuccess: (data) => {
        queryClient.setQueryData(['user', data.id], data);
      },
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  result.current.mutate({ id: 1, name: 'Jane' });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify query data was updated
  expect(queryClient.getQueryData(['user', 1])).toEqual(updatedUser);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Multiple Side Effects</h3>
        <CodeBlock
          title="Testing Complex Side Effects"
          code={`test('handles multiple side effects', async () => {
  const queryClient = createTestQueryClient();
  const onSuccess = jest.fn();
  const onSettled = jest.fn();

  const mockUpdate = jest.fn().mockResolvedValue({ id: 1, name: 'Updated' });

  const { result } = renderHook(
    () => useMutation({
      mutationFn: mockUpdate,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.setQueryData(['user', data.id], data);
        onSuccess(data);
      },
      onSettled: (data, error) => {
        onSettled(data, error);
      },
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  result.current.mutate({ id: 1, name: 'Updated' });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify all side effects
  expect(onSuccess).toHaveBeenCalledWith({ id: 1, name: 'Updated' });
  expect(onSettled).toHaveBeenCalled();
  expect(queryClient.getQueryData(['user', 1])).toEqual({ id: 1, name: 'Updated' });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Test all states</strong> - Idle, pending, success, error</li>
            <li><strong>Mock mutation functions</strong> - Control success/failure</li>
            <li><strong>Test side effects</strong> - Cache updates, invalidations</li>
            <li><strong>Test optimistic updates</strong> - Verify rollback on error</li>
            <li><strong>Test error handling</strong> - Verify error states and callbacks</li>
            <li><strong>Isolate tests</strong> - Each test should be independent</li>
            <li><strong>Clean up between tests</strong> - Reset query client</li>
            <li><strong>Test edge cases</strong> - Network errors, timeouts</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">13.3 Testing Utilities</strong>
          for renderHook, waitFor, queryClient setup, and mock implementations.
        </p>
      </div>
    </LessonLayout>
  );
}

