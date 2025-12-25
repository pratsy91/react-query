import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TypeScriptUtilitiesPage() {
  return (
    <LessonLayout
      title="7.3 TypeScript Utilities"
      description="Learn TypeScript utility types: UseQueryResult, UseMutationResult, UseInfiniteQueryResult, and custom type definitions"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript Utility Types</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query provides utility types that represent the return types of hooks. These
          are useful for type annotations, function parameters, and custom type definitions.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Utility Types:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>UseQueryResult</strong> - Return type of useQuery</li>
            <li><strong>UseMutationResult</strong> - Return type of useMutation</li>
            <li><strong>UseInfiniteQueryResult</strong> - Return type of useInfiniteQuery</li>
            <li><strong>Custom types</strong> - Create your own type definitions</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">UseQueryResult</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">UseQueryResult</code> type represents the
          return type of the <code className="bg-gray-100 px-1 rounded">useQuery</code> hook.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Using UseQueryResult Type"
          code={`import { UseQueryResult, useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

// UseQueryResult<TData, TError>
function UserProfile({ userId }: { userId: number }) {
  const query: UseQueryResult<User, Error> = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  // query has all UseQueryResult properties
  // data: User | undefined
  // error: Error | null
  // isLoading: boolean
  // isError: boolean
  // etc.

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Function Return Types</h3>
        <CodeBlock
          title="Type Function Returns"
          code={`import { UseQueryResult, useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

// Function that returns UseQueryResult
function useUserQuery(userId: number): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { data, error } = useUserQuery(userId);
  // TypeScript knows the types from UseQueryResult
  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Type Parameters</h3>
        <CodeBlock
          title="Generic UseQueryResult"
          code={`import { UseQueryResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface ApiError {
  message: string;
  status: number;
}

// UseQueryResult<TData, TError>
type UserQueryResult = UseQueryResult<User, ApiError>;

function UserProfile({ userId }: { userId: number }) {
  const query: UserQueryResult = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  // TypeScript knows:
  // query.data: User | undefined
  // query.error: ApiError | null

  return <div>{query.data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">UseMutationResult</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">UseMutationResult</code> type represents
          the return type of the <code className="bg-gray-100 px-1 rounded">useMutation</code> hook.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Using UseMutationResult Type"
          code={`import { UseMutationResult, useMutation } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

// UseMutationResult<TData, TError, TVariables, TContext>
function UpdateUserForm({ userId }: { userId: number }) {
  const mutation: UseMutationResult<
    User,
    Error,
    UpdateUserData,
    unknown
  > = useMutation({
    mutationFn: async (data: UpdateUserData): Promise<User> => {
      return updateUser(userId, data);
    },
  });

  // mutation has all UseMutationResult properties
  // mutate: (variables: UpdateUserData) => void
  // mutateAsync: (variables: UpdateUserData) => Promise<User>
  // data: User | undefined
  // error: Error | null
  // isPending: boolean
  // etc.

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate({ name: 'New Name' });
    }}>
      ...
    </form>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Function Return Types</h3>
        <CodeBlock
          title="Type Mutation Functions"
          code={`import { UseMutationResult, useMutation } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface CreateUserData {
  name: string;
  email: string;
}

// Function that returns UseMutationResult
function useCreateUser(): UseMutationResult<
  User,
  Error,
  CreateUserData,
  unknown
> {
  return useMutation({
    mutationFn: async (data: CreateUserData): Promise<User> => {
      return createUser(data);
    },
  });
}

// Usage
function CreateUserForm() {
  const mutation = useCreateUser();
  // TypeScript knows all types from UseMutationResult
  
  const handleSubmit = (data: CreateUserData) => {
    mutation.mutate(data); // ✅ Type-safe
  };

  return <form>...</form>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">UseInfiniteQueryResult</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">UseInfiniteQueryResult</code> type represents
          the return type of the <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code> hook.
        </p>

        <CodeBlock
          title="Using UseInfiniteQueryResult"
          code={`import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsPage {
  posts: Post[];
  nextCursor?: number;
}

function PostList(): UseInfiniteQueryResult<PostsPage, Error> {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }): Promise<PostsPage> => 
      fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

// Usage
function PostsComponent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
  }: UseInfiniteQueryResult<PostsPage, Error> = PostList();

  // TypeScript knows:
  // data: { pages: PostsPage[]; pageParams: number[] } | undefined
  // fetchNextPage: () => void
  // hasNextPage: boolean

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Type Definitions</h2>
        <p className="text-gray-700 mb-4">
          Create custom type definitions to extend TanStack Query's types for your specific needs.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Query Result Type</h3>
        <CodeBlock
          title="Extend UseQueryResult"
          code={`import { UseQueryResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface CustomError {
  message: string;
  code: string;
  status: number;
}

// Custom query result type
type UserQueryResult = UseQueryResult<User, CustomError>;

// Add custom properties
interface ExtendedUserQueryResult extends UserQueryResult {
  userName: string | undefined;
}

function useUserQuery(userId: number): ExtendedUserQueryResult {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  return {
    ...query,
    userName: query.data?.name,
  };
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Hook Types</h3>
        <CodeBlock
          title="Type Custom Hooks"
          code={`import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface UpdateUserData {
  name?: string;
}

// Type for custom query hook
type UseUserQuery = (userId: number) => UseQueryResult<User, Error>;

// Type for custom mutation hook
type UseUpdateUser = (
  userId: number
) => UseMutationResult<User, Error, UpdateUserData, unknown>;

// Implementation
const useUserQuery: UseUserQuery = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });
};

const useUpdateUser: UseUpdateUser = (userId) => {
  return useMutation({
    mutationFn: async (data: UpdateUserData): Promise<User> => {
      return updateUser(userId, data);
    },
  });
};`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Type Utilities</h3>
        <CodeBlock
          title="Helper Type Utilities"
          code={`import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// Extract data type from query result
type QueryData<T> = T extends UseQueryResult<infer D, any> ? D : never;

// Extract error type from query result
type QueryError<T> = T extends UseQueryResult<any, infer E> ? E : never;

// Extract variables type from mutation result
type MutationVariables<T> = T extends UseMutationResult<
  any,
  any,
  infer V,
  any
>
  ? V
  : never;

// Usage
function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  type UserData = QueryData<typeof query>; // User
  type UserError = QueryError<typeof query>; // Error

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Type Utilities</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Type-Safe Query Options</h3>
        <CodeBlock
          title="Typed Query Options Builder"
          code={`import { UseQueryOptions } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

// Type-safe query options
type UserQueryOptions = Omit<
  UseQueryOptions<User, Error>,
  'queryKey' | 'queryFn'
> & {
  queryKey: readonly ['user', number];
  queryFn: () => Promise<User>;
};

function createUserQueryOptions(
  userId: number,
  overrides?: Partial<UserQueryOptions>
): UseQueryOptions<User, Error> {
  return {
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    ...overrides,
  };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { data } = useQuery(
    createUserQueryOptions(userId, {
      staleTime: 1000 * 60 * 5,
    })
  );

  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Type-Safe Cache Operations</h3>
        <CodeBlock
          title="Typed Cache Helpers"
          code={`import { QueryClient, UseQueryResult } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

// Type-safe cache operations
class TypedQueryClient {
  constructor(private client: QueryClient) {}

  getUser(userId: number): User | undefined {
    return this.client.getQueryData<User>(['user', userId]);
  }

  setUser(userId: number, user: User): void {
    this.client.setQueryData<User>(['user', userId], user);
  }

  invalidateUser(userId: number): Promise<void> {
    return this.client.invalidateQueries({
      queryKey: ['user', userId],
    });
  }
}

// Usage
function useTypedQueryClient() {
  const queryClient = useQueryClient();
  return new TypedQueryClient(queryClient);
}

function UserProfile({ userId }: { userId: number }) {
  const typedClient = useTypedQueryClient();
  const user = typedClient.getUser(userId); // Typed as User | undefined

  return <div>{user?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use utility types</strong> - For function parameters and return types</li>
            <li><strong>Extract types when needed</strong> - Create type aliases for complex types</li>
            <li><strong>Leverage type inference</strong> - Let TypeScript infer when possible</li>
            <li><strong>Create custom utilities</strong> - Build type-safe helpers for your app</li>
            <li><strong>Document complex types</strong> - Add comments for complex type definitions</li>
            <li><strong>Use type guards</strong> - For runtime type checking</li>
            <li><strong>Keep types close to data</strong> - Define types near where they're used</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 7: TypeScript Integration.
          You now understand TypeScript basics, advanced patterns, and utility types with TanStack Query.
          You're ready to move on to Phase 8: Query Client Configuration.
        </p>
      </div>
    </LessonLayout>
  );
}

