import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function SetupPage() {
  return (
    <LessonLayout
      title="1.1 Setup & Installation"
      description="Learn how to install and configure TanStack Query in your React application"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Installation</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query can be installed using npm, yarn, or pnpm. Choose the package manager
          that fits your project.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using npm</h3>
        <CodeBlock
          code={`npm install @tanstack/react-query`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using yarn</h3>
        <CodeBlock
          code={`yarn add @tanstack/react-query`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using pnpm</h3>
        <CodeBlock
          code={`pnpm add @tanstack/react-query`}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> TanStack Query requires React 16.8+ (hooks support) and works
            with React 18+ concurrent features.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">QueryClient Setup</h2>
        <p className="text-gray-700 mb-4">
          The QueryClient is the core of TanStack Query. It manages all queries, mutations, and
          caching. You need to create a QueryClient instance before using any hooks.
        </p>

        <CodeBlock
          title="Creating a QueryClient"
          code={`import { QueryClient } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes (v4)
      // gcTime: 1000 * 60 * 30, // 30 minutes (v5+)
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});`}
        />

        <p className="text-gray-700 mb-4 mt-4">
          The QueryClient constructor accepts an optional configuration object where you can set
          default options for all queries and mutations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">QueryClientProvider Configuration</h2>
        <p className="text-gray-700 mb-4">
          To use TanStack Query in your React app, you must wrap your application (or the part
          that needs query functionality) with the QueryClientProvider component.
        </p>

        <CodeBlock
          title="Basic Setup in App.js or main entry point"
          code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <YourApp />
      
      {/* Optional: DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple QueryClients</h3>
        <p className="text-gray-700 mb-4">
          You can use multiple QueryClient instances for different parts of your app, though
          this is rarely needed.
        </p>

        <CodeBlock
          code={`// Different clients for different contexts
const mainQueryClient = new QueryClient();
const adminQueryClient = new QueryClient();

// Use in different parts of your app
<QueryClientProvider client={mainQueryClient}>
  <MainApp />
</QueryClientProvider>

<QueryClientProvider client={adminQueryClient}>
  <AdminApp />
</QueryClientProvider>`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">DevTools Setup and Usage</h2>
        <p className="text-gray-700 mb-4">
          React Query DevTools provide a visual interface to inspect queries, mutations, and
          cache state. They're invaluable for debugging and understanding query behavior.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Installation</h3>
        <CodeBlock
          code={`npm install @tanstack/react-query-devtools`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Usage</h3>
        <CodeBlock
          title="Adding DevTools to your app"
          code={`import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">DevTools Options</h3>
        <CodeBlock
          title="DevTools Configuration"
          code={`<ReactQueryDevtools
  initialIsOpen={false}        // Start closed
  position="bottom-left"        // Position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  buttonPosition="bottom-left"  // Button position
  errorTypes={[]}              // Filter error types
  styleNonce=""                // CSP nonce
/>`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Tip:</strong> DevTools should only be included in development. Use environment
            checks to exclude them in production builds.
          </p>
        </div>

        <CodeBlock
          title="Conditional DevTools (Production-safe)"
          code={`import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">TypeScript Setup</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query has excellent TypeScript support out of the box. TypeScript types are
          included in the package, so no additional type definitions are needed.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic TypeScript Usage</h3>
        <CodeBlock
          title="Typed QueryClient"
          code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

// QueryClient is already typed
const queryClient = new QueryClient();

// Type your query function
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// useQuery will infer types from the query function
function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // data is typed as User | undefined
  // error is typed as Error | null
  // isLoading is boolean

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Generic Types</h3>
        <CodeBlock
          title="Explicit Type Parameters"
          code={`import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  price: number;
}

// Explicitly type the query result
const { data }: UseQueryResult<Product, Error> = useQuery<Product, Error>({
  queryKey: ['product', productId],
  queryFn: async (): Promise<Product> => {
    const response = await fetch(\`/api/products/\${productId}\`);
    return response.json();
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">TypeScript Configuration</h3>
        <p className="text-gray-700 mb-4">
          Ensure your tsconfig.json includes proper settings for React and modern JavaScript:
        </p>

        <CodeBlock
          title="tsconfig.json recommendations"
          code={`{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete Setup Example</h2>
        <p className="text-gray-700 mb-4">
          Here's a complete example showing all the setup steps together:
        </p>

        <CodeBlock
          title="Complete App Setup"
          code={`// src/index.tsx or src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Once you have TanStack Query installed and configured, proceed to
          <strong className="ml-1">1.2 Basic Query Concepts</strong> to understand the fundamentals.
        </p>
      </div>
    </LessonLayout>
  );
}

