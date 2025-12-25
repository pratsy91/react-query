import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function DevToolsPage() {
  return (
    <LessonLayout
      title="9.1 React Query DevTools"
      description="Learn how to install, configure, and use React Query DevTools: query inspection, mutation inspection, cache visualization, and more"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query DevTools</h2>
        <p className="text-gray-700 mb-4">
          React Query DevTools is a powerful browser extension and component that helps you debug,
          inspect, and understand your queries and mutations in real-time.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">DevTools Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Query inspection and state visualization</li>
            <li>Mutation inspection and tracking</li>
            <li>Cache visualization and management</li>
            <li>Query state inspection (loading, error, success)</li>
            <li>Manual query invalidation</li>
            <li>Query removal and cache clearing</li>
            <li>Data editing and manipulation</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Installation</h2>
        <p className="text-gray-700 mb-4">
          React Query DevTools can be installed as a package or used as a browser extension.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Package Installation</h3>
        <CodeBlock
          title="Install DevTools Package"
          code={`# Using npm
npm install @tanstack/react-query-devtools

# Using yarn
yarn add @tanstack/react-query-devtools

# Using pnpm
pnpm add @tanstack/react-query-devtools`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Setup</h3>
        <CodeBlock
          title="Add DevTools to Your App"
          code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <YourApp />
      
      {/* DevTools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Browser Extension</h3>
        <CodeBlock
          title="Using Browser Extension"
          code={`// No code changes needed!
// Just install the React Query DevTools extension from:
// Chrome: Chrome Web Store
// Firefox: Firefox Add-ons
// Edge: Edge Add-ons

// The extension automatically detects React Query
// and provides the same features as the component`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Configuration</h2>
        <p className="text-gray-700 mb-4">
          DevTools can be configured with various options to customize its behavior and appearance.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Configuration</h3>
        <CodeBlock
          title="DevTools Configuration Options"
          code={`import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      
      <ReactQueryDevtools
        initialIsOpen={false}        // Start closed
        position="bottom-left"        // Position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        panelProps={{                // Props passed to the panel
          style: { height: '400px' }
        }}
        closeButtonProps={{          // Props for close button
          style: { display: 'none' }
        }}
        toggleButtonProps={{         // Props for toggle button
          style: { 
            position: 'fixed',
            bottom: '10px',
            left: '10px',
          }
        }}
      />
    </QueryClientProvider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Production Configuration</h3>
        <CodeBlock
          title="Conditional DevTools Rendering"
          code={`import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      
      {/* Only show DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Configuration</h3>
        <CodeBlock
          title="Full Configuration Options"
          code={`import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
        errorTypes={[
          { name: 'Network Error', initialIsOpen: true },
          { name: 'Server Error', initialIsOpen: false },
        ]}
        styleNonce="your-nonce" // For CSP
        shadowDOMTarget={document.body} // For shadow DOM
      />
    </QueryClientProvider>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Inspection</h2>
        <p className="text-gray-700 mb-4">
          DevTools allows you to inspect all queries in your application, view their state, data,
          and configuration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Viewing Queries</h3>
        <CodeBlock
          title="Query List in DevTools"
          code={`// In DevTools, you'll see:
// - All active queries
// - Query keys
// - Query status (fresh, stale, fetching, etc.)
// - Data preview
// - Last updated time
// - Observer count

// Example queries visible:
// ['user', 1] - Status: fresh, Data: { id: 1, name: 'John' }
// ['posts'] - Status: stale, Data: [...]
// ['user', 2] - Status: fetching, Data: undefined`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Details</h3>
        <CodeBlock
          title="Inspecting Query Details"
          code={`// Click on a query to see:
// - Full query key
// - Query function
// - Query options (staleTime, cacheTime, etc.)
// - Query state (data, error, status)
// - Observers (components using this query)
// - Query timeline (when it was created, updated, etc.)

// Example query details:
// Query Key: ['user', 1]
// Status: success
// Data: { id: 1, name: 'John', email: 'john@example.com' }
// Error: null
// Stale Time: 5 minutes
// Cache Time: 30 minutes
// Observers: 2 (2 components using this query)`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filtering Queries</h3>
        <CodeBlock
          title="Search and Filter Queries"
          code={`// DevTools provides:
// - Search bar to filter queries by key
// - Status filters (fresh, stale, fetching, etc.)
// - Sort options (by key, status, updated time)

// Use cases:
// - Find specific query: Search for 'user'
// - Find stale queries: Filter by 'stale'
// - Find fetching queries: Filter by 'fetching'`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Mutation Inspection</h2>
        <p className="text-gray-700 mb-4">
          DevTools allows you to inspect mutations, view their state, variables, and results.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Viewing Mutations</h3>
        <CodeBlock
          title="Mutation List in DevTools"
          code={`// In DevTools mutations tab, you'll see:
// - All mutations (pending, success, error)
// - Mutation keys
// - Mutation variables
// - Mutation results
// - Mutation status
// - Timestamp

// Example mutations visible:
// ['updateUser'] - Status: success, Variables: { id: 1, name: 'John' }
// ['createPost'] - Status: pending, Variables: { title: 'New Post' }
// ['deletePost'] - Status: error, Variables: { id: 5 }`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation Details</h3>
        <CodeBlock
          title="Inspecting Mutation Details"
          code={`// Click on a mutation to see:
// - Full mutation key
// - Mutation function
// - Mutation variables
// - Mutation result (data or error)
// - Mutation status
// - Mutation timeline

// Example mutation details:
// Mutation Key: ['updateUser']
// Status: success
// Variables: { id: 1, name: 'John Updated' }
// Result: { id: 1, name: 'John Updated', email: 'john@example.com' }
// Error: null
// Started: 10:30:15
// Completed: 10:30:16`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Visualization</h2>
        <p className="text-gray-700 mb-4">
          DevTools provides a visual representation of your query cache, showing relationships
          and cache structure.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Tree View</h3>
        <CodeBlock
          title="Visualizing Cache Structure"
          code={`// DevTools shows cache as a tree:
// - Root level: Query keys
// - Nested levels: Query data
// - Color coding: Status (green=fresh, yellow=stale, red=error)

// Example cache structure:
// 📁 ['user']
//   └── 📁 ['user', 1]
//       └── ✅ { id: 1, name: 'John' }
//   └── 📁 ['user', 2]
//       └── ✅ { id: 2, name: 'Jane' }
// 📁 ['posts']
//   └── ✅ [{ id: 1, title: 'Post 1' }, ...]`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cache Statistics</h3>
        <CodeBlock
          title="Cache Metrics"
          code={`// DevTools displays:
// - Total queries in cache
// - Fresh queries count
// - Stale queries count
// - Fetching queries count
// - Error queries count
// - Cache size (approximate)

// Example statistics:
// Total Queries: 15
// Fresh: 8
// Stale: 5
// Fetching: 2
// Errors: 0`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query State Inspection</h2>
        <p className="text-gray-700 mb-4">
          DevTools provides detailed information about query states, including loading, error,
          and success states.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">State Information</h3>
        <CodeBlock
          title="Viewing Query States"
          code={`// For each query, DevTools shows:
// - Status: idle | loading | error | success
// - isLoading: boolean
// - isFetching: boolean
// - isError: boolean
// - isSuccess: boolean
// - data: any
// - error: Error | null
// - dataUpdatedAt: timestamp
// - errorUpdatedAt: timestamp

// Example state display:
// Status: success
// isLoading: false
// isFetching: false
// isError: false
// isSuccess: true
// dataUpdatedAt: 2024-01-15 10:30:00`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">State Timeline</h3>
        <CodeBlock
          title="Query State History"
          code={`// DevTools shows state transitions:
// - When query was created
// - When query started fetching
// - When query succeeded
// - When query failed
// - When query was updated
// - When query became stale

// Example timeline:
// 10:30:00 - Query created
// 10:30:01 - Fetching started
// 10:30:02 - Fetching succeeded
// 10:30:15 - Query became stale
// 10:30:20 - Background refetch started`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Manual Invalidation</h2>
        <p className="text-gray-700 mb-4">
          DevTools allows you to manually invalidate queries, triggering refetches and cache updates.
        </p>

        <CodeBlock
          title="Invalidating Queries from DevTools"
          code={`// In DevTools:
// 1. Select a query
// 2. Click "Invalidate" button
// 3. Query is marked as stale
// 4. Query refetches if it has observers

// You can invalidate:
// - Single query: ['user', 1]
// - All queries with prefix: ['user']
// - All queries matching pattern

// This is equivalent to:
queryClient.invalidateQueries({ queryKey: ['user', 1] });`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Removal</h2>
        <p className="text-gray-700 mb-4">
          DevTools allows you to remove queries from the cache, freeing up memory.
        </p>

        <CodeBlock
          title="Removing Queries from DevTools"
          code={`// In DevTools:
// 1. Select a query
// 2. Click "Remove" button
// 3. Query is removed from cache

// You can remove:
// - Single query
// - All queries with prefix
// - All queries matching pattern

// This is equivalent to:
queryClient.removeQueries({ queryKey: ['user', 1] });`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Editing</h2>
        <p className="text-gray-700 mb-4">
          DevTools allows you to edit query data directly, useful for testing and debugging.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Editing Query Data</h3>
        <CodeBlock
          title="Manually Editing Cache Data"
          code={`// In DevTools:
// 1. Select a query
// 2. Click "Edit" button
// 3. Modify the JSON data
// 4. Save changes
// 5. Query data is updated immediately

// Use cases:
// - Test UI with different data
// - Simulate API responses
// - Debug data transformations
// - Test error states

// This is equivalent to:
queryClient.setQueryData(['user', 1], { id: 1, name: 'Edited Name' });`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Scenarios</h3>
        <CodeBlock
          title="Using Data Editing for Testing"
          code={`// Example: Test error state
// 1. Edit query data to null
// 2. Set error in DevTools
// 3. Test error handling UI

// Example: Test loading state
// 1. Remove query data
// 2. Trigger refetch
// 3. Test loading UI

// Example: Test different data
// 1. Edit user data: { id: 1, name: 'Test User' }
// 2. Verify UI updates
// 3. Test edge cases`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use in development only</strong> - Don't include DevTools in production</li>
            <li><strong>Learn the interface</strong> - Familiarize yourself with all features</li>
            <li><strong>Use for debugging</strong> - Inspect queries and mutations when debugging</li>
            <li><strong>Test with DevTools</strong> - Use data editing to test different scenarios</li>
            <li><strong>Monitor cache</strong> - Keep an eye on cache size and stale queries</li>
            <li><strong>Use filters</strong> - Filter queries to find specific ones quickly</li>
            <li><strong>Check state transitions</strong> - Use timeline to understand query lifecycle</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">9.2 Debugging Techniques</strong>
          for console logging, network inspection, cache inspection, and performance debugging.
        </p>
      </div>
    </LessonLayout>
  );
}

