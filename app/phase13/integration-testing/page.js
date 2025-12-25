import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function IntegrationTestingPage() {
  return (
    <LessonLayout
      title="13.4 Integration Testing"
      description="Learn integration testing: full component testing, E2E scenarios, mock servers, and test data management"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Integration Testing</h2>
        <p className="text-gray-700 mb-4">
          Integration testing verifies that components work together correctly with React Query,
          ensuring the entire data flow works as expected.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Integration Testing Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Full component testing</li>
            <li>E2E scenarios</li>
            <li>Mock servers</li>
            <li>Test data management</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Full Component Testing</h2>
        <p className="text-gray-700 mb-4">
          Test complete components with React Query to verify the entire user interaction flow.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Component with Query</h3>
        <CodeBlock
          title="Full Component Test"
          code={`import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No user found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}

test('renders user profile', async () => {
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

  // Should show loading initially
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Component with Mutation</h3>
        <CodeBlock
          title="Component with Mutation Test"
          code={`function UserEditor({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      name: formData.get('name'),
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue={user.name} />
      <button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

test('updates user on form submit', async () => {
  const queryClient = createTestQueryClient();
  const user = { id: 1, name: 'John' };
  const updatedUser = { id: 1, name: 'Jane' };

  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ json: async () => user })
    .mockResolvedValueOnce({ json: async () => updatedUser });

  render(
    <QueryClientProvider client={queryClient}>
      <UserEditor userId={1} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  // Update input
  const input = screen.getByDisplayValue('John');
  fireEvent.change(input, { target: { value: 'Jane' } });

  // Submit form
  fireEvent.click(screen.getByText('Save'));

  // Should show saving state
  expect(screen.getByText('Saving...')).toBeInTheDocument();

  // Wait for update
  await waitFor(() => {
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
  });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">E2E Scenarios</h2>
        <p className="text-gray-700 mb-4">
          Test end-to-end scenarios that simulate real user interactions with multiple queries
          and mutations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete User Flow Test</h3>
        <CodeBlock
          title="E2E User Flow"
          code={`test('complete user profile flow', async () => {
  const queryClient = createTestQueryClient();
  
  // Mock API responses
  const user = { id: 1, name: 'John', email: 'john@example.com' };
  const posts = [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 1 },
  ];

  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ json: async () => user })
    .mockResolvedValueOnce({ json: async () => posts });

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfilePage userId={1} />
    </QueryClientProvider>
  );

  // Wait for user data
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  // Wait for posts
  await waitFor(() => {
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });

  // Verify all data is displayed
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
  expect(screen.getByText('Post 2')).toBeInTheDocument();
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Error Recovery Flow</h3>
        <CodeBlock
          title="Testing Error Recovery"
          code={`test('handles error and retry flow', async () => {
  const queryClient = createTestQueryClient({
    queries: {
      retry: 1,
      retryDelay: 100,
    },
  });

  let callCount = 0;
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      return Promise.reject(new Error('Network error'));
    }
    return Promise.resolve({
      json: async () => ({ id: 1, name: 'John' }),
    });
  });

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  // Should show error initially
  await waitFor(() => {
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  // Should retry and succeed
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  }, { timeout: 2000 });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mock Servers</h2>
        <p className="text-gray-700 mb-4">
          Use mock servers to simulate API behavior more realistically, handling multiple
          endpoints and complex scenarios.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">MSW Setup</h3>
        <CodeBlock
          title="Mock Service Worker Setup"
          code={`import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Create mock server
const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(
      ctx.json({ id: 1, name: 'John', email: 'john@example.com' })
    );
  }),
  rest.post('/api/user/:id', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'Updated' }));
  }),
);

// Setup before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Cleanup after all tests
afterAll(() => server.close());

// Usage in tests
test('uses mock server', async () => {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dynamic Mock Responses</h3>
        <CodeBlock
          title="Mock Server with Dynamic Responses"
          code={`test('handles different responses', async () => {
  const queryClient = createTestQueryClient();

  // Override handler for this test
  server.use(
    rest.get('/api/user/:id', (req, res, ctx) => {
      const { id } = req.params;
      return res(
        ctx.json({ id: Number(id), name: \`User \${id}\` })
      );
    })
  );

  render(
    <QueryClientProvider client={queryClient}>
      <UserProfile userId={2} />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Test Data Management</h2>
        <p className="text-gray-700 mb-4">
          Organize and manage test data to make tests more maintainable and realistic.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Test Data Factories</h3>
        <CodeBlock
          title="Test Data Factory"
          code={`// Test data factory
function createUser(overrides = {}) {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  };
}

function createPost(overrides = {}) {
  return {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    userId: 1,
    ...overrides,
  };
}

// Usage in tests
test('uses test data factory', async () => {
  const user = createUser({ name: 'Jane' });
  const post = createPost({ title: 'My Post', userId: user.id });

  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ json: async () => user })
    .mockResolvedValueOnce({ json: async () => [post] });

  // Test implementation
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Test Data Fixtures</h3>
        <CodeBlock
          title="Test Data Fixtures"
          code={`// test/fixtures/users.js
export const users = {
  john: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  },
  jane: {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
};

export const posts = {
  post1: {
    id: 1,
    title: 'First Post',
    userId: 1,
  },
  post2: {
    id: 2,
    title: 'Second Post',
    userId: 1,
  },
};

// Usage in tests
import { users, posts } from './fixtures/users';

test('uses fixtures', async () => {
  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ json: async () => users.john })
    .mockResolvedValueOnce({ json: async () => [posts.post1, posts.post2] });

  // Test implementation
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Test complete flows</strong> - Test entire user interactions</li>
            <li><strong>Use mock servers</strong> - More realistic API simulation</li>
            <li><strong>Organize test data</strong> - Use factories and fixtures</li>
            <li><strong>Test error scenarios</strong> - Verify error handling</li>
            <li><strong>Isolate tests</strong> - Each test should be independent</li>
            <li><strong>Clean up between tests</strong> - Reset state and mocks</li>
            <li><strong>Use realistic data</strong> - Test data should match production</li>
            <li><strong>Test edge cases</strong> - Empty states, null values, errors</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 13: Testing and the entire
          React Query learning platform! You now understand how to test queries, mutations,
          use testing utilities, and perform integration testing. You've mastered React Query!
        </p>
      </div>
    </LessonLayout>
  );
}

