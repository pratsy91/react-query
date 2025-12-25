import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TestingQueriesPage() {
  return (
    <LessonLayout
      title="13.1 Testing Queries"
      description="Learn to test React Query hooks: mocking QueryClient, testing query hooks, loading states, error states, and success states"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing React Query</h2>
        <p className="text-gray-700 mb-4">
          Testing React Query requires proper setup with QueryClient and QueryClientProvider.
          Understanding how to test queries ensures your data fetching logic works correctly.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Testing Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Mocking QueryClient</li>
            <li>Testing query hooks</li>
            <li>Testing loading states</li>
            <li>Testing error states</li>
            <li>Testing success states</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mocking QueryClient</h2>
        <p className="text-gray-700 mb-4">
          Create a test QueryClient with custom configuration for testing. This allows you to
          control query behavior in tests.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic QueryClient Setup</h3>
        <CodeBlock
          title="Creating Test QueryClient"
          code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

// Create a test QueryClient
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        cacheTime: Infinity, // Prevent cache cleanup
      },
    },
  });
}

// Test wrapper component
function TestWrapper({ children }) {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Usage in tests
test('renders user data', () => {
  render(
    <TestWrapper>
      <UserProfile userId={1} />
    </TestWrapper>
  );
  
  // Test assertions
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom QueryClient Configuration</h3>
        <CodeBlock
          title="Configurable Test QueryClient"
          code={`// Reusable test QueryClient factory
function createTestQueryClient(options = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
        staleTime: 0,
        ...options.queries,
      },
      mutations: {
        retry: false,
        ...options.mutations,
      },
    },
    ...options,
  });
}

// Usage with custom options
test('test with custom config', () => {
  const queryClient = createTestQueryClient({
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Query Hooks</h2>
        <p className="text-gray-700 mb-4">
          Test query hooks using React Testing Library's renderHook utility to verify
          query behavior and data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Hook Testing</h3>
        <CodeBlock
          title="Testing useQuery Hook"
          code={`import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

// Mock fetch function
const mockFetchUser = jest.fn();

function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => mockFetchUser(userId),
  });
}

test('fetches user data', async () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  mockFetchUser.mockResolvedValue({ id: 1, name: 'John' });

  const { result } = renderHook(() => useUser(1), { wrapper });

  // Initially loading
  expect(result.current.isLoading).toBe(true);

  // Wait for data
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify data
  expect(result.current.data).toEqual({ id: 1, name: 'John' });
  expect(mockFetchUser).toHaveBeenCalledWith(1);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Custom Query Hooks</h3>
        <CodeBlock
          title="Testing Custom Hooks"
          code={`// Custom hook
function useUserPosts(userId) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  });
}

test('fetches user posts', async () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const mockPosts = [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
  ];

  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => mockPosts,
  });

  const { result } = renderHook(() => useUserPosts(1), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockPosts);
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Loading States</h2>
        <p className="text-gray-700 mb-4">
          Verify that components show loading states correctly while queries are fetching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing isLoading</h3>
        <CodeBlock
          title="Testing Loading State"
          code={`function UserProfile({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}

test('shows loading state', async () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // Delay the response
  const mockFetch = jest.fn(() => 
    new Promise(resolve => 
      setTimeout(() => resolve({ id: 1, name: 'John' }), 100)
    )
  );

  jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  // Should show loading initially
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing isFetching</h3>
        <CodeBlock
          title="Testing Fetching State"
          code={`function UserProfile({ userId }) {
  const { data, isFetching } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <div>
      {isFetching && <div>Refreshing...</div>}
      {data && <div>{data.name}</div>}
    </div>
  );
}

test('shows fetching state during refetch', async () => {
  const queryClient = createTestQueryClient();
  const mockFetch = jest.fn(() => Promise.resolve({ id: 1, name: 'John' }));
  jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  // Trigger refetch
  await queryClient.refetchQueries({ queryKey: ['user', 1] });

  // Should show fetching state
  expect(screen.getByText('Refreshing...')).toBeInTheDocument();
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Error States</h2>
        <p className="text-gray-700 mb-4">
          Test error handling to ensure components display errors correctly when queries fail.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Query Errors</h3>
        <CodeBlock
          title="Testing Error State"
          code={`function UserProfile({ userId }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (data) return <div>{data.name}</div>;
  return <div>Loading...</div>;
}

test('handles query error', async () => {
  const queryClient = createTestQueryClient();
  const errorMessage = 'Failed to fetch user';

  jest.spyOn(global, 'fetch').mockRejectedValue(new Error(errorMessage));

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Error Retry</h3>
        <CodeBlock
          title="Testing Retry Behavior"
          code={`test('retries on error', async () => {
  const queryClient = createTestQueryClient({
    queries: {
      retry: 2,
      retryDelay: 100,
    },
  });

  let callCount = 0;
  const mockFetch = jest.fn(() => {
    callCount++;
    if (callCount < 3) {
      return Promise.reject(new Error('Network error'));
    }
    return Promise.resolve({ id: 1, name: 'John' });
  });

  jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

  const { result } = renderHook(
    () => useQuery({
      queryKey: ['user', 1],
      queryFn: () => mockFetch(),
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  // Should eventually succeed after retries
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Success States</h2>
        <p className="text-gray-700 mb-4">
          Verify that components render data correctly when queries succeed.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Successful Queries</h3>
        <CodeBlock
          title="Testing Success State"
          code={`test('renders user data on success', async () => {
  const queryClient = createTestQueryClient();
  const userData = { id: 1, name: 'John', email: 'john@example.com' };

  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => userData,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Data Updates</h3>
        <CodeBlock
          title="Testing Query Updates"
          code={`test('updates data on refetch', async () => {
  const queryClient = createTestQueryClient();
  let userData = { id: 1, name: 'John' };

  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      json: async () => userData,
    })
  );

  const { result } = renderHook(
    () => useQuery({
      queryKey: ['user', 1],
      queryFn: () => fetchUser(1),
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  await waitFor(() => {
    expect(result.current.data.name).toBe('John');
  });

  // Update data
  userData = { id: 1, name: 'Jane' };

  // Refetch
  await queryClient.refetchQueries({ queryKey: ['user', 1] });

  await waitFor(() => {
    expect(result.current.data.name).toBe('Jane');
  });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Disable retries</strong> - Set retry: false in test QueryClient</li>
            <li><strong>Mock fetch functions</strong> - Control API responses</li>
            <li><strong>Use waitFor</strong> - Wait for async operations</li>
            <li><strong>Clean up queries</strong> - Clear cache between tests</li>
            <li><strong>Test all states</strong> - Loading, error, success</li>
            <li><strong>Isolate tests</strong> - Each test should be independent</li>
            <li><strong>Use realistic data</strong> - Mock data should match API</li>
            <li><strong>Test edge cases</strong> - Empty data, null values</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">13.2 Testing Mutations</strong>
          for testing mutations, optimistic updates, error handling, and side effects.
        </p>
      </div>
    </LessonLayout>
  );
}

