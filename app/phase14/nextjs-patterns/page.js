import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function NextJSPatternsPage() {
  return (
    <LessonLayout
      title="14.2 Next.js Integration Patterns"
      description="Understand Next.js integration patterns: App Router patterns, Pages Router patterns, Server Components, and Client Components"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query with Next.js</h2>
        <p className="text-gray-700 mb-4">
          Understanding how React Query integrates with Next.js helps you build performant
          applications. This lesson covers the key integration patterns.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> This phase is for <strong>understanding only</strong>. The patterns
            are explained conceptually to help you understand how React Query works with Next.js,
            but specific implementation details may vary by Next.js version.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Next.js Patterns:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>App Router patterns</li>
            <li>Pages Router patterns</li>
            <li>Server components</li>
            <li>Client components</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">App Router Patterns</h2>
        <p className="text-gray-700 mb-4">
          Next.js App Router (Next.js 13+) uses React Server Components and a different approach
          to data fetching. Understanding how React Query fits is important.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">App Router Overview</h3>
        <CodeBlock
          title="Understanding App Router"
          code={`// App Router key concepts:

// 1. Server Components (default)
// - Run on server only
// - Can fetch data directly
// - No client-side JavaScript
// - Cannot use React Query hooks

// 2. Client Components ('use client')
// - Run on client
// - Can use React Query hooks
// - Interactive components
// - Need QueryClientProvider

// 3. Layouts and Pages
// - Layouts wrap pages
// - Pages are routes
// - Both can be server or client components

// 4. Data Fetching
// - Server Components: Direct fetch
// - Client Components: React Query hooks
// - Hybrid approach is common`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">QueryClientProvider Setup</h3>
        <CodeBlock
          title="Provider in App Router"
          code={`// App Router pattern:

// app/providers.tsx (Client Component)
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }) {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// app/layout.tsx (Server Component)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// Now all Client Components can use React Query hooks`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Hybrid Data Fetching</h3>
        <CodeBlock
          title="Server + Client Data Fetching"
          code={`// Hybrid approach:

// Server Component: Initial data
// app/page.tsx (Server Component)
async function Page() {
  // Direct fetch on server
  const initialData = await fetch('/api/posts').then(r => r.json());
  
  return (
    <div>
      <PostsList initialData={initialData} />
    </div>
  );
}

// Client Component: React Query
// app/components/PostsList.tsx (Client Component)
'use client';

function PostsList({ initialData }) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    initialData, // Use server-fetched data
  });
  
  return <div>{data.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}

// Benefits:
// - Fast initial render (server data)
// - Client-side updates (React Query)
// - Best of both worlds`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Pages Router Patterns</h2>
        <p className="text-gray-700 mb-4">
          Next.js Pages Router uses a different approach with getServerSideProps and getStaticProps.
          React Query integrates differently here.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pages Router Overview</h3>
        <CodeBlock
          title="Understanding Pages Router"
          code={`// Pages Router key concepts:

// 1. Pages are files in pages/ directory
// - Each file is a route
// - Can use getServerSideProps
// - Can use getStaticProps
// - All components are client components

// 2. Data Fetching Methods
// - getServerSideProps: Server-side per request
// - getStaticProps: Build-time static
// - getStaticPaths: Dynamic routes

// 3. React Query Integration
// - Use QueryClientProvider in _app.tsx
// - Prefetch in getServerSideProps
// - Dehydrate/hydrate state
// - Use hooks in components`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Provider Setup</h3>
        <CodeBlock
          title="Provider in Pages Router"
          code={`// Pages Router pattern:

// pages/_app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

// Now all pages can use React Query hooks`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Prefetching Pattern</h3>
        <CodeBlock
          title="Prefetching in getServerSideProps"
          code={`// Prefetching pattern:

// pages/user/[id].tsx
export async function getServerSideProps(context) {
  const queryClient = new QueryClient();
  const userId = context.params.id;

  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dehydrate state
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function UserPage({ dehydratedState }) {
  // Rehydrate on client
  const queryClient = useQueryClient();
  hydrate(queryClient, dehydratedState);

  // Use query (data already available)
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{user.name}</div>;
}

// Benefits:
// - Data available immediately
// - No loading state
// - SEO friendly`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Server Components</h2>
        <p className="text-gray-700 mb-4">
          Server Components are a Next.js App Router feature. Understanding how they interact with
          React Query is important.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Server Component Characteristics</h3>
        <CodeBlock
          title="Understanding Server Components"
          code={`// Server Components:

// 1. Run only on server
// - No client-side JavaScript
// - Cannot use hooks
// - Cannot use React Query hooks
// - Can fetch data directly

// 2. Benefits
// - Reduced bundle size
// - Direct database access
// - Better security
// - Faster initial load

// 3. Limitations
// - No interactivity
// - No event handlers
// - No useState, useEffect
// - No React Query hooks

// Example:
// app/page.tsx (Server Component - default)
async function Page() {
  // Direct fetch (no React Query)
  const data = await fetch('/api/posts').then(r => r.json());
  
  return <div>{data.map(post => <div>{post.title}</div>)}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Server Component Data Fetching</h3>
        <CodeBlock
          title="Data Fetching in Server Components"
          code={`// Server Components fetch data directly:

// app/posts/page.tsx (Server Component)
async function PostsPage() {
  // Direct fetch (no React Query)
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // Always fresh
  }).then(r => r.json());

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Or with caching:
async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  }).then(r => r.json());

  return <div>{/* ... */}</div>;
}

// Note: React Query is not used here
// Server Components use Next.js built-in fetching`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Client Components</h2>
        <p className="text-gray-700 mb-4">
          Client Components can use React Query hooks and provide interactivity. Understanding
          when to use them is key.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Client Component Characteristics</h3>
        <CodeBlock
          title="Understanding Client Components"
          code={`// Client Components:

// 1. Run on client
// - 'use client' directive required
// - Can use hooks
// - Can use React Query hooks
// - Interactive components

// 2. Use cases
// - Interactive UI
// - Real-time updates
// - Client-side state
// - React Query hooks

// 3. Trade-offs
// - Larger bundle size
// - Client-side execution
// - Network requests from client

// Example:
// app/components/PostsList.tsx (Client Component)
'use client';

import { useQuery } from '@tanstack/react-query';

function PostsList() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  return <div>{posts?.map(post => <div>{post.title}</div>)}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Hybrid Pattern</h3>
        <CodeBlock
          title="Server + Client Component Pattern"
          code={`// Best practice: Hybrid approach

// Server Component: Initial data
// app/posts/page.tsx
async function PostsPage() {
  // Fetch on server
  const initialPosts = await fetch('/api/posts').then(r => r.json());

  return (
    <div>
      <h1>Posts</h1>
      <PostsList initialPosts={initialPosts} />
    </div>
  );
}

// Client Component: React Query
// app/components/PostsList.tsx
'use client';

function PostsList({ initialPosts }) {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    initialData: initialPosts, // Use server data
  });

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Benefits:
// - Fast initial render (server)
// - Client-side updates (React Query)
// - Optimal performance`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Key Considerations</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Choose the right pattern</strong> - Server vs Client Components</li>
            <li><strong>Use Server Components when possible</strong> - Better performance</li>
            <li><strong>Use Client Components for interactivity</strong> - React Query hooks</li>
            <li><strong>Hybrid approach is often best</strong> - Server data + Client updates</li>
            <li><strong>Understand hydration</strong> - How state transfers from server to client</li>
            <li><strong>Consider bundle size</strong> - Client Components add to bundle</li>
            <li><strong>Security matters</strong> - Server Components can access secrets</li>
            <li><strong>Performance optimization</strong> - Balance server and client fetching</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 14: SSR & Next.js Patterns and
          the entire React Query learning platform! You now understand how React Query works with
          SSR, hydration, and Next.js integration patterns. You've mastered React Query!
        </p>
      </div>
    </LessonLayout>
  );
}

