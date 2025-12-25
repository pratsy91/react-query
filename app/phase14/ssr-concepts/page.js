import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function SSRConceptsPage() {
  return (
    <LessonLayout
      title="14.1 SSR Concepts"
      description="Understand SSR concepts with React Query: hydration, prefetching in SSR, query state serialization, and dehydration/rehydration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Server-Side Rendering with React Query</h2>
        <p className="text-gray-700 mb-4">
          Understanding how React Query works with Server-Side Rendering (SSR) is important for
          building performant applications. This lesson covers the key concepts.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> This phase is for <strong>understanding only</strong>. The concepts
            are explained to help you understand how React Query works with SSR, but implementation
            details are framework-specific.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">SSR Concepts:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Hydration</li>
            <li>Prefetching in SSR</li>
            <li>Query state serialization</li>
            <li>Dehydration/rehydration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Hydration</h2>
        <p className="text-gray-700 mb-4">
          Hydration is the process of attaching event listeners and making the server-rendered HTML
          interactive on the client. React Query needs to hydrate its cache state from the server.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">What is Hydration?</h3>
        <CodeBlock
          title="Understanding Hydration"
          code={`// Server-side rendering flow:
// 1. Server renders HTML with initial data
// 2. HTML is sent to client
// 3. Client receives HTML
// 4. React "hydrates" the HTML (makes it interactive)
// 5. React Query hydrates its cache from server state

// Without proper hydration:
// - Client would refetch all data (wasteful)
// - Flash of loading states
// - Poor user experience

// With proper hydration:
// - Client uses server-fetched data immediately
// - No unnecessary refetches
// - Smooth user experience`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Hydration Process</h3>
        <CodeBlock
          title="How Hydration Works"
          code={`// Conceptual flow:

// 1. Server-side
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ['user', 1],
  queryFn: () => fetchUser(1),
});

// 2. Serialize query state
const dehydratedState = dehydrate(queryClient);

// 3. Send to client (in HTML)
// window.__REACT_QUERY_STATE__ = JSON.stringify(dehydratedState);

// 4. Client-side hydration
const queryClient = new QueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__;
hydrate(queryClient, dehydratedState);

// 5. Client can now use cached data
// No refetch needed!`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prefetching in SSR</h2>
        <p className="text-gray-700 mb-4">
          Prefetching data on the server ensures that the initial HTML includes all necessary data,
          eliminating loading states on first render.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Why Prefetch in SSR?</h3>
        <CodeBlock
          title="Benefits of SSR Prefetching"
          code={`// Benefits of prefetching in SSR:

// 1. Faster initial render
// - Data is already available
// - No loading spinners on first paint
// - Better perceived performance

// 2. SEO benefits
// - Search engines see complete content
// - Better indexing
// - Improved rankings

// 3. Better user experience
// - Content appears immediately
// - No flash of empty states
// - Smoother transitions

// 4. Reduced client-side requests
// - Less bandwidth usage
// - Faster page loads
// - Better mobile experience`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Prefetching Strategy</h3>
        <CodeBlock
          title="What to Prefetch"
          code={`// Prefetch strategy:

// 1. Critical data (above the fold)
// - User profile
// - Navigation data
// - Hero content

// 2. Likely-to-be-needed data
// - Related content
// - Next page data
// - Common queries

// 3. Don't prefetch everything
// - Only prefetch what's needed
// - Balance between performance and bandwidth
// - Consider user's connection speed

// Example prefetch flow:
// Server: Prefetch user data
// Server: Prefetch posts list
// Server: Render HTML with data
// Client: Hydrate with prefetched data
// Client: Background refetch for freshness`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query State Serialization</h2>
        <p className="text-gray-700 mb-4">
          Serialization converts the QueryClient's cache state into a format that can be sent from
          server to client. This is essential for hydration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">What is Serialization?</h3>
        <CodeBlock
          title="Understanding Serialization"
          code={`// Serialization converts complex objects to strings
// that can be sent over the network

// QueryClient cache contains:
// - Query data
// - Query metadata
// - Query state (loading, error, etc.)
// - Timestamps
// - Observers

// Serialization process:
// 1. Extract query cache state
// 2. Convert to plain JavaScript objects
// 3. Stringify to JSON
// 4. Embed in HTML
// 5. Parse on client
// 6. Reconstruct QueryClient state

// Key considerations:
// - Only serialize what's needed
// - Handle circular references
// - Preserve data types
// - Minimize payload size`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Serialization Format</h3>
        <CodeBlock
          title="Serialized State Structure"
          code={`// Conceptual serialized state structure:
{
  queries: [
    {
      queryKey: ['user', 1],
      queryHash: '["user",1]',
      state: {
        data: { id: 1, name: 'John' },
        dataUpdatedAt: 1234567890,
        error: null,
        errorUpdatedAt: 0,
        status: 'success',
        fetchStatus: 'idle',
      },
      queryMeta: {},
    },
    // ... more queries
  ],
  mutations: [],
  timestamp: 1234567890,
}

// This structure is:
// - Serializable to JSON
// - Reconstructable on client
// - Minimal in size
// - Complete in information`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dehydration/Rehydration</h2>
        <p className="text-gray-700 mb-4">
          Dehydration extracts query state from the server QueryClient, and rehydration restores
          it in the client QueryClient. This is the core mechanism for SSR with React Query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dehydration Process</h3>
        <CodeBlock
          title="Server-Side Dehydration"
          code={`// Dehydration: Extract state from QueryClient

// 1. Create QueryClient on server
const queryClient = new QueryClient();

// 2. Prefetch queries
await queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// 3. Dehydrate (extract state)
const dehydratedState = dehydrate(queryClient);

// dehydratedState contains:
// - All query data
// - Query metadata
// - Query states
// - Timestamps

// 4. Serialize for transmission
const serializedState = JSON.stringify(dehydratedState);

// 5. Embed in HTML response
// <script>window.__REACT_QUERY_STATE__ = serializedState;</script>`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Rehydration Process</h3>
        <CodeBlock
          title="Client-Side Rehydration"
          code={`// Rehydration: Restore state in QueryClient

// 1. Create QueryClient on client
const queryClient = new QueryClient();

// 2. Get serialized state from window
const serializedState = window.__REACT_QUERY_STATE__;

// 3. Parse serialized state
const dehydratedState = JSON.parse(serializedState);

// 4. Rehydrate (restore state)
hydrate(queryClient, dehydratedState);

// 5. QueryClient now has:
// - All prefetched data
// - Query states
// - Metadata
// - Ready to use immediately

// 6. Components can use queries
// - No refetch needed
// - Data is already available
// - Smooth user experience`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete Flow</h3>
        <CodeBlock
          title="Dehydration/Rehydration Flow"
          code={`// Complete SSR flow with React Query:

// SERVER SIDE:
// 1. Create QueryClient
const serverQueryClient = new QueryClient();

// 2. Prefetch data
await serverQueryClient.prefetchQuery({
  queryKey: ['user', 1],
  queryFn: () => fetchUser(1),
});

// 3. Dehydrate
const dehydratedState = dehydrate(serverQueryClient);

// 4. Render HTML with state
const html = renderToString(
  <QueryClientProvider client={serverQueryClient}>
    <App />
  </QueryClientProvider>
);

// 5. Inject state into HTML
const fullHtml = html + \`
  <script>
    window.__REACT_QUERY_STATE__ = JSON.stringify(dehydratedState);
  </script>
\`;

// CLIENT SIDE:
// 1. Create QueryClient
const clientQueryClient = new QueryClient();

// 2. Get state from window
const dehydratedState = window.__REACT_QUERY_STATE__;

// 3. Rehydrate
hydrate(clientQueryClient, dehydratedState);

// 4. Render with hydrated client
render(
  <QueryClientProvider client={clientQueryClient}>
    <App />
  </QueryClientProvider>
);

// Result: No refetch, instant data!`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Key Considerations</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Separate QueryClients</strong> - Server and client need separate instances</li>
            <li><strong>State size</strong> - Keep serialized state small</li>
            <li><strong>Security</strong> - Don't expose sensitive data</li>
            <li><strong>Stale data</strong> - Server data may be stale on arrival</li>
            <li><strong>Error handling</strong> - Handle serialization errors</li>
            <li><strong>Type safety</strong> - Ensure data types are preserved</li>
            <li><strong>Performance</strong> - Balance prefetching with server load</li>
            <li><strong>Cache invalidation</strong> - Consider when to refetch</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">14.2 Next.js Integration Patterns</strong>
          to understand how React Query integrates with Next.js App Router, Pages Router, Server Components, and Client Components.
        </p>
      </div>
    </LessonLayout>
  );
}

