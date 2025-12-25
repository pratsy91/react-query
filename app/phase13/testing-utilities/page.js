import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TestingUtilitiesPage() {
  return (
    <LessonLayout
      title="13.3 Testing Utilities"
      description="Learn testing utilities: renderHook, waitFor, queryClient setup, and mock implementations"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing Utilities</h2>
        <p className="text-gray-700 mb-4">
          React Testing Library and React Query provide utilities that make testing easier and
          more reliable. Understanding these utilities is essential for effective testing.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Testing Utilities:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>renderHook</li>
            <li>waitFor</li>
            <li>queryClient setup</li>
            <li>Mock implementations</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">renderHook</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">renderHook</code> utility from React
          Testing Library allows you to test hooks in isolation.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic renderHook Usage</h3>
        <CodeBlock
          title="Using renderHook"
          code={`import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

test('uses user hook', () => {
  const { result } = renderHook(() => useUser(1));

  // Access hook result
  expect(result.current.isLoading).toBe(true);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">renderHook with Wrapper</h3>
        <CodeBlock
          title="renderHook with QueryClientProvider"
          code={`import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

test('uses user hook with provider', () => {
  const queryClient = createTestQueryClient();
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useUser(1), { wrapper });

  expect(result.current.isLoading).toBe(true);
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">renderHook with Initial Props</h3>
        <CodeBlock
          title="renderHook with Changing Props"
          code={`test('updates when props change', () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result, rerender } = renderHook(
    ({ userId }) => useUser(userId),
    {
      wrapper,
      initialProps: { userId: 1 },
    }
  );

  expect(result.current.isLoading).toBe(true);

  // Change props
  rerender({ userId: 2 });

  // Hook should re-execute with new userId
  expect(result.current.isLoading).toBe(true);
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">waitFor</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">waitFor</code> utility waits for
          asynchronous operations to complete before making assertions.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic waitFor Usage</h3>
        <CodeBlock
          title="Using waitFor"
          code={`import { waitFor } from '@testing-library/react';

test('waits for query to succeed', async () => {
  const queryClient = createTestQueryClient();
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ id: 1, name: 'John' }),
  });

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

  // Wait for success
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual({ id: 1, name: 'John' });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">waitFor with Timeout</h3>
        <CodeBlock
          title="Custom Timeout for waitFor"
          code={`test('waits with custom timeout', async () => {
  const queryClient = createTestQueryClient();
  
  // Slow response
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    new Promise(resolve =>
      setTimeout(() => resolve({ json: async () => ({ id: 1 }) }), 2000)
    )
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

  // Wait with longer timeout
  await waitFor(
    () => {
      expect(result.current.isSuccess).toBe(true);
    },
    { timeout: 3000 }
  );
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">waitFor with Custom Matcher</h3>
        <CodeBlock
          title="waitFor with Conditions"
          code={`test('waits for specific condition', async () => {
  const queryClient = createTestQueryClient();
  
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

  // Wait for data to exist
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });

  // Wait for specific data value
  await waitFor(() => {
    expect(result.current.data?.name).toBe('John');
  });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryClient Setup</h2>
        <p className="text-gray-700 mb-4">
          Proper QueryClient setup is crucial for testing. Create test-specific QueryClient
          instances with appropriate configuration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Reusable QueryClient Factory</h3>
        <CodeBlock
          title="QueryClient Factory Function"
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
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
    ...options,
  });
}

// Usage
test('test with default config', () => {
  const queryClient = createTestQueryClient();
  // Use queryClient
});

test('test with custom config', () => {
  const queryClient = createTestQueryClient({
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  });
  // Use queryClient
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">QueryClient Cleanup</h3>
        <CodeBlock
          title="Cleaning Up QueryClient"
          code={`// Cleanup helper
function cleanupQueryClient(queryClient) {
  queryClient.clear();
  queryClient.removeQueries();
}

// Use in tests
test('test with cleanup', () => {
  const queryClient = createTestQueryClient();

  // Use queryClient

  // Cleanup after test
  cleanupQueryClient(queryClient);
});

// Or use beforeEach/afterEach
beforeEach(() => {
  queryClient = createTestQueryClient();
});

afterEach(() => {
  queryClient.clear();
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mock Implementations</h2>
        <p className="text-gray-700 mb-4">
          Mock implementations allow you to control API responses and test different scenarios
          without making real network requests.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mocking Fetch</h3>
        <CodeBlock
          title="Mocking Fetch Function"
          code={`// Mock fetch globally
global.fetch = jest.fn();

test('mocks fetch response', async () => {
  const mockData = { id: 1, name: 'John' };
  
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  });

  const { result } = renderHook(
    () => useQuery({
      queryKey: ['user', 1],
      queryFn: () => fetch('/api/user/1').then(r => r.json()),
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={createTestQueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockData);
  expect(global.fetch).toHaveBeenCalledWith('/api/user/1');
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mocking Query Functions</h3>
        <CodeBlock
          title="Mocking Query Functions Directly"
          code={`// Mock query function
const mockFetchUser = jest.fn();

test('mocks query function', async () => {
  mockFetchUser.mockResolvedValue({ id: 1, name: 'John' });

  const { result } = renderHook(
    () => useQuery({
      queryKey: ['user', 1],
      queryFn: () => mockFetchUser(1),
    }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={createTestQueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(mockFetchUser).toHaveBeenCalledWith(1);
  expect(result.current.data).toEqual({ id: 1, name: 'John' });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mocking Multiple Responses</h3>
        <CodeBlock
          title="Mocking Different Responses"
          code={`test('mocks different responses', async () => {
  const mockFetch = jest.fn();
  
  // First call returns user 1
  mockFetch.mockResolvedValueOnce({ id: 1, name: 'John' });
  // Second call returns user 2
  mockFetch.mockResolvedValueOnce({ id: 2, name: 'Jane' });

  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result, rerender } = renderHook(
    ({ userId }) => useQuery({
      queryKey: ['user', userId],
      queryFn: () => mockFetch(userId),
    }),
    {
      wrapper,
      initialProps: { userId: 1 },
    }
  );

  await waitFor(() => {
    expect(result.current.data?.name).toBe('John');
  });

  // Change to user 2
  rerender({ userId: 2 });

  await waitFor(() => {
    expect(result.current.data?.name).toBe('Jane');
  });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use renderHook</strong> - Test hooks in isolation</li>
            <li><strong>Always use waitFor</strong> - Wait for async operations</li>
            <li><strong>Create test QueryClient</strong> - Use factory function</li>
            <li><strong>Mock fetch functions</strong> - Control API responses</li>
            <li><strong>Clean up between tests</strong> - Reset QueryClient</li>
            <li><strong>Use beforeEach/afterEach</strong> - Setup and cleanup</li>
            <li><strong>Isolate tests</strong> - Each test should be independent</li>
            <li><strong>Test realistic scenarios</strong> - Use realistic mock data</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">13.4 Integration Testing</strong>
          for full component testing, E2E scenarios, mock servers, and test data management.
        </p>
      </div>
    </LessonLayout>
  );
}

