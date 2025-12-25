import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function BestPracticesSummaryPage() {
  return (
    <LessonLayout
      title="20.3 Best Practices Summary"
      description="Best practices summary: code organization, naming conventions, documentation, and team collaboration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices Summary</h2>
        <p className="text-gray-700 mb-4">
          This comprehensive summary covers all best practices for working with React Query.
          Following these practices ensures maintainable, performant, and scalable code.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Practices Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Code organization</li>
            <li>Naming conventions</li>
            <li>Documentation</li>
            <li>Team collaboration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Code Organization</h2>
        <p className="text-gray-700 mb-4">
          Well-organized code is easier to understand, maintain, and extend.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">File Structure</h3>
        <CodeBlock
          title="Recommended File Structure"
          code={`// Recommended project structure:

// src/
//   api/
//     users.ts
//     posts.ts
//     index.ts
//   hooks/
//     queries/
//       useUsers.ts
//       useUser.ts
//       usePosts.ts
//     mutations/
//       useCreateUser.ts
//       useUpdateUser.ts
//     index.ts
//   components/
//     users/
//       UserList.tsx
//       UserForm.tsx
//     posts/
//       PostList.tsx
//   types/
//     user.ts
//     post.ts
//   utils/
//     queryKeys.ts
//   lib/
//     queryClient.ts

// OR feature-based:

// src/
//   features/
//     users/
//       api/
//       hooks/
//       components/
//       types/
//       index.ts
//     posts/
//       api/
//       hooks/
//       components/
//       types/
//       index.ts

// Key principles:
// - Group related code together
// - Separate queries and mutations
// - Keep API functions separate
// - Use index files for exports
// - Organize by feature or type`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Organization</h3>
        <CodeBlock
          title="Organizing Queries and Mutations"
          code={`// Separate query and mutation hooks
// hooks/queries.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

// hooks/mutations.ts
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

// Group related queries
// hooks/userQueries.ts
export const userQueries = {
  list: () => useQuery({ queryKey: ['users'], queryFn: usersApi.getAll }),
  detail: (id: number) => useQuery({ queryKey: ['user', id], queryFn: () => usersApi.getById(id) }),
};

// Use custom hooks for complex logic
function useUserWithPosts(userId: number) {
  const user = useUser(userId);
  const posts = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => postsApi.getByUserId(userId),
    enabled: !!user.data,
  });

  return { user, posts };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Naming Conventions</h2>
        <p className="text-gray-700 mb-4">
          Consistent naming conventions make code easier to read and understand.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Hook Naming</h3>
        <CodeBlock
          title="Naming Conventions for Hooks"
          code={`// ✅ Query hooks: use + Resource (plural for lists)
function useUsers() { }           // List query
function useUser(id) { }          // Single resource query
function useUserPosts(userId) { }  // Related resource query

// ✅ Mutation hooks: use + Action + Resource
function useCreateUser() { }
function useUpdateUser() { }
function useDeleteUser() { }
function useToggleTodo() { }

// ✅ Custom hooks: use + Descriptive name
function useUserProfile() { }
function useDashboardData() { }
function useSearchResults() { }

// ❌ Avoid:
function getUsers() { }           // Not a hook
function fetchUser() { }          // Not a hook
function userQuery() { }          // Not descriptive
function useData() { }             // Too generic`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Key Naming</h3>
        <CodeBlock
          title="Naming Query Keys"
          code={`// ✅ Use query key factories
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userPosts: (id: number) => ['users', id, 'posts'] as const,
  posts: ['posts'] as const,
  post: (id: number) => ['posts', id] as const,
  search: (query: string) => ['search', query] as const,
};

// ✅ Use descriptive, hierarchical keys
['users']                           // List
['users', 1]                        // Single item
['users', 1, 'posts']               // Related data
['users', 1, 'posts', { status: 'published' }] // With filters

// ❌ Avoid:
['data']                            // Too generic
['user', '1']                       // String instead of number
['users', userId, Date.now()]      // Unstable key
['users', { id: 1 }]                // Object in key (unstable)`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Variable Naming</h3>
        <CodeBlock
          title="Naming Variables in Components"
          code={`// ✅ Descriptive variable names
function UserProfile({ userId }) {
  const { data: user, isLoading: isUserLoading } = useUser(userId);
  const { data: posts, isLoading: isPostsLoading } = useUserPosts(userId);
  const createPost = useCreatePost();
  const updateUser = useUpdateUser();

  if (isUserLoading) return <div>Loading user...</div>;
  if (isPostsLoading) return <div>Loading posts...</div>;

  return (
    <div>
      <div>{user.name}</div>
      <button onClick={() => updateUser.mutate({ name: 'New' })}>
        Update
      </button>
    </div>
  );
}

// ✅ Use destructuring with renaming
const { data: userData, error: userError } = useUser(userId);

// ❌ Avoid:
const { data, isLoading } = useUser(userId); // Too generic
const userQuery = useUser(userId);            // Not descriptive`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Documentation</h2>
        <p className="text-gray-700 mb-4">
          Good documentation helps team members understand and use code effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Code Comments</h3>
        <CodeBlock
          title="Documenting Queries and Mutations"
          code={`/**
 * Fetches a list of all users
 * 
 * @returns Query result with users array
 * 
 * @example
 * const { data: users, isLoading } = useUsers();
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetches a single user by ID
 * 
 * @param id - User ID
 * @returns Query result with user data
 * 
 * @example
 * const { data: user } = useUser(1);
 */
export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

/**
 * Creates a new user
 * 
 * Automatically invalidates the users list query on success
 * 
 * @returns Mutation object with mutate function
 * 
 * @example
 * const createUser = useCreateUser();
 * createUser.mutate({ name: 'John', email: 'john@example.com' });
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">README Documentation</h3>
        <CodeBlock
          title="Project Documentation"
          code={`// README.md example

# React Query Setup

## Query Client Configuration

\`\`\`typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 3,
    },
  },
});
\`\`\`

## Query Key Conventions

- Lists: \`['users']\`
- Single item: \`['users', id]\`
- Related data: \`['users', id, 'posts']\`
- With filters: \`['users', { status: 'active' }]\`

## Custom Hooks

### useUsers()
Fetches all users.

### useUser(id)
Fetches a single user by ID.

### useCreateUser()
Creates a new user and invalidates the users list.

## Best Practices

1. Always use query key factories
2. Invalidate related queries after mutations
3. Use select for data transformations
4. Set appropriate staleTime for your use case`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Team Collaboration</h2>
        <p className="text-gray-700 mb-4">
          Effective team collaboration requires shared patterns, code reviews, and knowledge sharing.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Shared Patterns</h3>
        <CodeBlock
          title="Establishing Team Patterns"
          code={`// shared/patterns/queryPattern.ts
// Standard query pattern for the team

export function createQueryHook<TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  options?: UseQueryOptions<TData, TError>
) {
  return () => useQuery<TData, TError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // Default staleTime
    ...options,
  });
}

// shared/patterns/mutationPattern.ts
// Standard mutation pattern

export function createMutationHook<TData, TVariables, TError = Error>(
  mutationFn: MutationFunction<TData, TVariables>,
  invalidateQueries?: QueryKey[],
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<TData, TError, TVariables>({
      mutationFn,
      onSuccess: () => {
        invalidateQueries?.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      },
      ...options,
    });
  };
}

// Usage across team
const useUsers = createQueryHook(['users'], usersApi.getAll);
const useCreateUser = createMutationHook(
  usersApi.create,
  [['users']]
);`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Code Review Guidelines</h3>
        <CodeBlock
          title="Code Review Checklist"
          code={`// Code review checklist for React Query:

// ✅ Query Keys
// - [ ] Query keys are stable and don't change unnecessarily
// - [ ] Query keys include all dependencies
// - [ ] Query keys use factories for consistency

// ✅ Query Options
// - [ ] staleTime is set appropriately
// - [ ] gcTime is set appropriately
// - [ ] enabled is used for conditional queries
// - [ ] select is used for data transformations

// ✅ Mutations
// - [ ] Mutations invalidate related queries
// - [ ] Optimistic updates are used when appropriate
// - [ ] Error handling is implemented

// ✅ Performance
// - [ ] No unnecessary refetches
// - [ ] Queries are not fetched in loops
// - [ ] Large datasets use pagination

// ✅ Code Quality
// - [ ] Custom hooks are used for complex logic
// - [ ] Code is properly documented
// - [ ] Types are defined correctly`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Knowledge Sharing</h3>
        <CodeBlock
          title="Sharing Knowledge"
          code={`// Ways to share React Query knowledge:

// 1. Team Wiki/Documentation
// - Document patterns and conventions
// - Share examples and use cases
// - Keep best practices updated

// 2. Code Examples
// - Create example components
// - Document common patterns
// - Share solutions to problems

// 3. Pair Programming
// - Work together on complex queries
// - Share knowledge during development
// - Learn from each other

// 4. Code Reviews
// - Review React Query usage
// - Suggest improvements
// - Share knowledge through comments

// 5. Team Meetings
// - Discuss React Query patterns
// - Share new features and updates
// - Address common issues

// 6. Training Sessions
// - Organize React Query workshops
// - Share advanced patterns
// - Practice together`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete Best Practices Checklist</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Query Best Practices:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Use stable query keys with all dependencies</li>
            <li>✅ Set appropriate staleTime and gcTime</li>
            <li>✅ Use select for data transformations</li>
            <li>✅ Use enabled for conditional queries</li>
            <li>✅ Handle loading and error states</li>
            <li>✅ Use query key factories</li>
            <li>✅ Prefetch related data</li>
            <li>✅ Debounce search queries</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-900 mt-4">Mutation Best Practices:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Invalidate related queries after mutations</li>
            <li>✅ Use optimistic updates when appropriate</li>
            <li>✅ Handle errors gracefully</li>
            <li>✅ Update cache directly when possible</li>
            <li>✅ Use onSettled for cleanup</li>
            <li>✅ Provide user feedback</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-900 mt-4">Code Organization:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Organize by feature or type</li>
            <li>✅ Separate queries and mutations</li>
            <li>✅ Create custom hooks for complex logic</li>
            <li>✅ Use consistent naming conventions</li>
            <li>✅ Document code and patterns</li>
            <li>✅ Export through index files</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-900 mt-4">Performance:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Profile before optimizing</li>
            <li>✅ Use pagination for large datasets</li>
            <li>✅ Limit cache size appropriately</li>
            <li>✅ Avoid unnecessary refetches</li>
            <li>✅ Use code splitting for routes</li>
            <li>✅ Monitor performance metrics</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>🎉 Congratulations! 🎉</strong> You've completed the entire React Query learning
          platform! You've mastered React Query from basics to advanced patterns, edge cases,
          and best practices. You're now ready to build amazing applications with React Query!
        </p>
      </div>
    </LessonLayout>
  );
}

