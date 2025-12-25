import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function TypeScriptBasicsPage() {
  return (
    <LessonLayout
      title="7.1 TypeScript Basics"
      description="Learn TypeScript fundamentals with TanStack Query: generic types, function typing, and type inference"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript with TanStack Query</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query has excellent TypeScript support out of the box. TypeScript types are
          included in the package, providing type safety and better developer experience.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Type safety</strong> - Catch errors at compile time</li>
            <li><strong>Autocomplete</strong> - Better IDE support</li>
            <li><strong>Refactoring</strong> - Safe code changes</li>
            <li><strong>Documentation</strong> - Types serve as documentation</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic TypeScript Setup"
          code={`// TypeScript types are included in @tanstack/react-query
import { useQuery } from '@tanstack/react-query';

// No additional type definitions needed
// Types are automatically available`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Generic Types in Hooks</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query hooks use TypeScript generics to provide type safety. You can specify
          types for data and error.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">useQuery with Generics</h3>
        <CodeBlock
          title="Typed useQuery"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiError {
  message: string;
  status: number;
}

function UserProfile({ userId }: { userId: number }) {
  // Explicitly type the query
  const { data, error } = useQuery<User, ApiError>({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  // TypeScript knows:
  // - data: User | undefined
  // - error: ApiError | null

  if (error) {
    // error is typed as ApiError
    console.log(error.status);
  }

  if (data) {
    // data is typed as User
    console.log(data.name);
  }

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Type Inference</h3>
        <CodeBlock
          title="Automatic Type Inference"
          code={`interface User {
  id: number;
  name: string;
}

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}

function UserProfile({ userId }: { userId: number }) {
  // Types are inferred from queryFn return type
  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // TypeScript infers:
    // - data: User | undefined
    // - error: Error | null
  });

  // No need to explicitly type - inference works!
  return <div>{data?.name}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Function Typing</h2>
        <p className="text-gray-700 mb-4">
          Properly typing query functions ensures type safety throughout your application.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Query Function Types</h3>
        <CodeBlock
          title="Typed Query Functions"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

// Option 1: Type the function directly
async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}

// Option 2: Type inline
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: async (): Promise<User> => {
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json();
  },
});

// Option 3: Using QueryFunctionContext
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ queryKey }): Promise<User> => {
    const [, id] = queryKey;
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function with Context</h3>
        <CodeBlock
          title="Typed Query Function Context"
          code={`import { QueryFunctionContext } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

// Type the context parameter
async function fetchUser(
  context: QueryFunctionContext<['user', number]>
): Promise<User> {
  const [, userId] = context.queryKey;
  const { signal } = context;
  
  const response = await fetch(\`/api/users/\${userId}\`, {
    signal, // AbortSignal is typed
  });
  
  return response.json();
}

// Use in query
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  // TypeScript knows the context structure
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation Function Typing</h2>
        <p className="text-gray-700 mb-4">
          Type mutation functions to ensure type safety for variables and return values.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Mutation Typing</h3>
        <CodeBlock
          title="Typed useMutation"
          code={`interface User {
  id: number;
  name: string;
  email: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

// Type mutation variables and return value
const mutation = useMutation<User, Error, UpdateUserData>({
  mutationFn: async (variables: UpdateUserData): Promise<User> => {
    const response = await fetch(\`/api/users/\${userId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });
    return response.json();
  },
});

// TypeScript knows:
// - mutation.mutate expects UpdateUserData
// - mutation.data is User | undefined
// - mutation.error is Error | null

mutation.mutate({ name: 'New Name' }); // ✅ Type-safe
// mutation.mutate({ invalid: 'field' }); // ❌ Type error`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation with Context</h3>
        <CodeBlock
          title="Typed Mutation Context"
          code={`import { MutationFunctionContext } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

interface UpdateUserData {
  name: string;
}

async function updateUser(
  variables: UpdateUserData,
  context: MutationFunctionContext<User, Error, UpdateUserData>
): Promise<User> {
  // context contains mutationKey, meta, etc.
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  return response.json();
}

const mutation = useMutation({
  mutationFn: updateUser,
  // Types are inferred from function signature
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Type Inference</h2>
        <p className="text-gray-700 mb-4">
          TypeScript can infer types from your query functions, reducing the need for explicit
          type annotations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automatic Inference</h3>
        <CodeBlock
          title="Type Inference from Query Functions"
          code={`interface User {
  id: number;
  name: string;
}

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}

function UserProfile({ userId }: { userId: number }) {
  // No explicit types needed - TypeScript infers from fetchUser
  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // TypeScript knows:
  // - data: User | undefined (inferred from Promise<User>)
  // - error: Error | null (default error type)

  // Type narrowing works automatically
  if (data) {
    // TypeScript knows data is User here
    console.log(data.name); // ✅ Type-safe
  }
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Inference with select</h3>
        <CodeBlock
          title="Type Inference with select"
          code={`interface User {
  id: number;
  name: string;
  email: string;
  posts: Post[];
}

function UserProfile({ userId }: { userId: number }) {
  // Infer type from select return
  const { data: userName } = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
    select: (user) => user.name, // TypeScript infers: string
  });

  // userName is typed as string | undefined
  // TypeScript knows the selected type

  const { data: postCount } = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
    select: (user) => user.posts.length, // TypeScript infers: number
  });

  // postCount is typed as number | undefined

  return <div>{userName}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Inference with Transformations</h3>
        <CodeBlock
          title="Complex Type Inference"
          code={`interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data: userInfo } = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
    select: (user) => ({
      fullName: \`\${user.firstName} \${user.lastName}\`,
      email: user.email,
    }),
    // TypeScript infers:
    // userInfo: { fullName: string; email: string } | undefined
  });

  // Type-safe access
  if (userInfo) {
    console.log(userInfo.fullName); // ✅ Type-safe
    console.log(userInfo.email); // ✅ Type-safe
  }

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Type Narrowing</h2>
        <p className="text-gray-700 mb-4">
          TypeScript's type narrowing works automatically with TanStack Query's state properties.
        </p>

        <CodeBlock
          title="Automatic Type Narrowing"
          code={`interface User {
  id: number;
  name: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: (): Promise<User> => fetchUser(userId),
  });

  // Type narrowing with isSuccess
  if (isSuccess) {
    // TypeScript knows data is User (not undefined)
    console.log(data.name); // ✅ Type-safe
  }

  // Type narrowing with isError
  if (isError) {
    // TypeScript knows error is Error (not null)
    console.log(error.message); // ✅ Type-safe
  }

  // Type narrowing with truthy check
  if (data) {
    // TypeScript knows data is User
    console.log(data.name); // ✅ Type-safe
  }

  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Let TypeScript infer when possible</strong> - Less verbose, same safety</li>
            <li><strong>Type query functions</strong> - Return types are inferred</li>
            <li><strong>Use interfaces for data</strong> - Clear, reusable types</li>
            <li><strong>Type error objects</strong> - Custom error types for better handling</li>
            <li><strong>Use type narrowing</strong> - Leverage TypeScript's narrowing</li>
            <li><strong>Explicit types when needed</strong> - Use generics for complex cases</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">7.2 Advanced TypeScript</strong>
          for custom query key factories, type-safe keys, and advanced type patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

