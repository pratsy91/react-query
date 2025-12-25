import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TypeScriptAdvancedPage() {
  return (
    <LessonLayout
      title="7.2 Advanced TypeScript"
      description="Master advanced TypeScript patterns: query key factories, type-safe keys, generic options, and discriminated unions"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced TypeScript Patterns</h2>
        <p className="text-gray-700 mb-4">
          Advanced TypeScript patterns help you build type-safe, maintainable applications with
          TanStack Query. These patterns provide compile-time safety and better developer experience.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Advanced Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Custom query key factories</li>
            <li>Type-safe query keys</li>
            <li>Type-safe mutations</li>
            <li>Generic query options</li>
            <li>Type narrowing</li>
            <li>Discriminated unions</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Query Key Factories</h2>
        <p className="text-gray-700 mb-4">
          Query key factories provide a type-safe way to create and manage query keys consistently
          across your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Query Key Factory</h3>
        <CodeBlock
          title="Simple Factory Pattern"
          code={`// Define query key factory
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Usage
function UserProfile({ userId }: { userId: number }) {
  const { data } = useQuery({
    queryKey: userKeys.detail(userId), // Type-safe key
    queryFn: () => fetchUser(userId),
  });

  return <div>{data?.name}</div>;
}

// Easy invalidation
queryClient.invalidateQueries({ queryKey: userKeys.all });`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Factory Pattern</h3>
        <CodeBlock
          title="Complex Query Key Factory"
          code={`// Comprehensive query key factory
const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => 
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => 
      [...queryKeys.users.details(), id] as const,
    posts: (id: number) => 
      [...queryKeys.users.detail(id), 'posts'] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: PostFilters) => 
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => 
      [...queryKeys.posts.details(), id] as const,
  },
} as const;

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
});

useQuery({
  queryKey: queryKeys.users.posts(userId),
  queryFn: () => fetchUserPosts(userId),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Type-Safe Query Keys</h2>
        <p className="text-gray-700 mb-4">
          Type-safe query keys ensure that query keys are consistent and type-checked throughout
          your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Typed Query Key Factory</h3>
        <CodeBlock
          title="Type-Safe Key Generation"
          code={`// Type-safe query key factory
type UserQueryKey = 
  | ['users']
  | ['users', 'list']
  | ['users', 'list', { filters: string }]
  | ['users', 'detail']
  | ['users', 'detail', number];

const userKeys = {
  all: ['users'] as const,
  lists: () => ['users', 'list'] as const,
  list: (filters: string) => 
    ['users', 'list', { filters }] as const,
  details: () => ['users', 'detail'] as const,
  detail: (id: number) => 
    ['users', 'detail', id] as const,
} satisfies Record<string, (...args: any[]) => UserQueryKey>;

// TypeScript ensures all keys match UserQueryKey type
function UserProfile({ userId }: { userId: number }) {
  const { data } = useQuery({
    queryKey: userKeys.detail(userId), // Type-checked
    queryFn: () => fetchUser(userId),
  });

  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Extract Query Key Type</h3>
        <CodeBlock
          title="Type Extraction from Factory"
          code={`const userKeys = {
  all: ['users'] as const,
  detail: (id: number) => ['users', id] as const,
} as const;

// Extract type from factory
type UserQueryKey = ReturnType<typeof userKeys.detail>;

// Use in type annotations
function useUserQuery(userId: number) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });
}

// Type-safe invalidation
function invalidateUser(userId: number) {
  queryClient.invalidateQueries({
    queryKey: userKeys.detail(userId), // Type-checked
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Type-Safe Mutations</h2>
        <p className="text-gray-700 mb-4">
          Create type-safe mutations with proper typing for variables, return values, and context.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Typed Mutation Factory</h3>
        <CodeBlock
          title="Type-Safe Mutation Pattern"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserData {
  name: string;
  email: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

// Type-safe mutation factory
function useCreateUser() {
  return useMutation<User, Error, CreateUserData>({
    mutationKey: ['createUser'],
    mutationFn: async (data: CreateUserData): Promise<User> => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
}

function useUpdateUser(userId: number) {
  return useMutation<User, Error, UpdateUserData>({
    mutationKey: ['updateUser', userId],
    mutationFn: async (data: UpdateUserData): Promise<User> => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
}

// Usage - fully type-safe
function UserForm({ userId }: { userId: number }) {
  const updateMutation = useUpdateUser(userId);
  
  const handleSubmit = (data: UpdateUserData) => {
    updateMutation.mutate(data); // ✅ Type-safe
    // updateMutation.mutate({ invalid: 'field' }); // ❌ Type error
  };

  return <form>...</form>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Generic Query Options</h2>
        <p className="text-gray-700 mb-4">
          Create reusable, type-safe query configurations using generics.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Generic Query Hook</h3>
        <CodeBlock
          title="Reusable Typed Query Hook"
          code={`import { UseQueryOptions, useQuery } from '@tanstack/react-query';

// Generic query hook
function useTypedQuery<TData, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> & {
    queryKey: readonly unknown[];
    queryFn: () => Promise<TData>;
  }
) {
  return useQuery<TData, TError>(options);
}

// Usage
interface User {
  id: number;
  name: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data } = useTypedQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // data is typed as User | undefined
  return <div>{data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Generic Query with Defaults</h3>
        <CodeBlock
          title="Typed Query with Default Options"
          code={`import { UseQueryOptions, useQuery } from '@tanstack/react-query';

interface QueryDefaults<TData, TError> {
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
}

function useTypedQueryWithDefaults<TData, TError = Error>(
  options: UseQueryOptions<TData, TError>,
  defaults?: QueryDefaults<TData, TError>
) {
  return useQuery<TData, TError>({
    ...defaults,
    ...options,
  });
}

// Usage with defaults
function UserProfile({ userId }: { userId: number }) {
  const { data } = useTypedQueryWithDefaults<User>(
    {
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: 3,
    }
  );

  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Type Narrowing</h2>
        <p className="text-gray-700 mb-4">
          Advanced type narrowing patterns for better type safety with TanStack Query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Discriminated Unions</h3>
        <CodeBlock
          title="Type Narrowing with Discriminated Unions"
          code={`type QueryState<T> =
  | { status: 'pending'; data: undefined; error: null }
  | { status: 'error'; data: undefined; error: Error }
  | { status: 'success'; data: T; error: null };

function useQueryState<T>(query: UseQueryResult<T>) {
  if (query.isPending) {
    return { status: 'pending' as const, data: undefined, error: null };
  }
  
  if (query.isError) {
    return { status: 'error' as const, data: undefined, error: query.error };
  }
  
  return { status: 'success' as const, data: query.data, error: null };
}

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  const state = useQueryState(query);

  // TypeScript narrows based on status
  if (state.status === 'success') {
    // TypeScript knows data is User
    console.log(state.data.name); // ✅ Type-safe
  } else if (state.status === 'error') {
    // TypeScript knows error is Error
    console.log(state.error.message); // ✅ Type-safe
  }

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Type Guards</h3>
        <CodeBlock
          title="Custom Type Guards"
          code={`interface User {
  id: number;
  name: string;
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as User).id === 'number' &&
    typeof (data as User).name === 'string'
  );
}

function UserProfile({ userId }: { userId: number }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<unknown> => fetchUser(userId),
  });

  // Use type guard
  if (data && isUser(data)) {
    // TypeScript knows data is User
    console.log(data.name); // ✅ Type-safe
  }

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Discriminated Unions</h2>
        <p className="text-gray-700 mb-4">
          Use discriminated unions for type-safe handling of different query states.
        </p>

        <CodeBlock
          title="Query State Discriminated Union"
          code={`type QueryResult<T> =
  | { type: 'loading'; data: undefined }
  | { type: 'error'; error: Error; data: undefined }
  | { type: 'success'; data: T; error: undefined };

function useQueryResult<T>(query: UseQueryResult<T>): QueryResult<T> {
  if (query.isLoading) {
    return { type: 'loading', data: undefined };
  }
  
  if (query.isError) {
    return { type: 'error', error: query.error, data: undefined };
  }
  
  return { type: 'success', data: query.data as T, error: undefined };
}

function UserProfile({ userId }: { userId: number }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  const result = useQueryResult(query);

  // TypeScript narrows based on type
  switch (result.type) {
    case 'loading':
      return <div>Loading...</div>;
    
    case 'error':
      return <div>Error: {result.error.message}</div>;
    
    case 'success':
      // TypeScript knows data is User
      return <div>{result.data.name}</div>;
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Type-Safe Query Builder</h3>
        <CodeBlock
          title="Builder Pattern with Types"
          code={`class QueryBuilder<TData, TError = Error> {
  private options: Partial<UseQueryOptions<TData, TError>> = {};

  queryKey(key: readonly unknown[]) {
    this.options.queryKey = key;
    return this;
  }

  queryFn(fn: () => Promise<TData>) {
    this.options.queryFn = fn;
    return this;
  }

  staleTime(time: number) {
    this.options.staleTime = time;
    return this;
  }

  build(): UseQueryOptions<TData, TError> {
    return this.options as UseQueryOptions<TData, TError>;
  }
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const query = useQuery(
    new QueryBuilder<User>()
      .queryKey(['user', userId])
      .queryFn(() => fetchUser(userId))
      .staleTime(1000 * 60 * 5)
      .build()
  );

  return <div>{query.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Conditional Types</h3>
        <CodeBlock
          title="Conditional Type Patterns"
          code={`type QueryData<T> = T extends UseQueryResult<infer D> ? D : never;

function extractData<T extends UseQueryResult<any>>(
  query: T
): QueryData<T> | undefined {
  return query.data;
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  // TypeScript infers the data type
  const userData = extractData(userQuery); // User | undefined
  return <div>{userData?.name}</div>;
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">7.3 TypeScript Utilities</strong>
          to understand utility types and custom type definitions.
        </p>
      </div>
    </LessonLayout>
  );
}

