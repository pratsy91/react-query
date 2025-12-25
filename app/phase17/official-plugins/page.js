import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function OfficialPluginsPage() {
  return (
    <LessonLayout
      title="17.1 Official Plugins"
      description="Understand official React Query plugins: persist plugins, offline plugins, and DevTools plugins"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Official React Query Plugins</h2>
        <p className="text-gray-700 mb-4">
          React Query has an official plugin ecosystem that extends functionality. Understanding
          these plugins helps you leverage additional features.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Official Plugins:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Persist plugins</li>
            <li>Offline plugins</li>
            <li>DevTools plugins</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Persist Plugins</h2>
        <p className="text-gray-700 mb-4">
          Persist plugins save query cache to storage (localStorage, sessionStorage, IndexedDB)
          and restore it on page load.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Understanding Persist Plugins</h3>
        <CodeBlock
          title="Persist Plugin Concept"
          code={`// Persist plugins save query cache to storage
// and restore it when the app loads

// Benefits:
// - Cache survives page reloads
// - Faster initial load
// - Better offline experience
// - Reduced API calls

// How it works:
// 1. Query cache is serialized
// 2. Saved to storage (localStorage, etc.)
// 3. On app load, cache is restored
// 4. Queries use cached data immediately
// 5. Background refetch updates data

// Conceptual usage:
import { persistQueryClient } from '@tanstack/query-persist-client-core';

// Create persist plugin
const persistPlugin = persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
  }),
});

// Plugin automatically:
// - Saves cache on updates
// - Restores cache on load
// - Handles serialization
// - Manages storage`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Storage Persisters</h3>
        <CodeBlock
          title="Different Storage Options"
          code={`// Persist plugins support different storage backends:

// 1. localStorage
// - Persists across browser sessions
// - Limited size (~5-10MB)
// - Synchronous API
// - Good for small to medium caches

// 2. sessionStorage
// - Persists only for tab session
// - Cleared when tab closes
// - Similar size limits
// - Good for temporary persistence

// 3. IndexedDB
// - Large storage capacity
// - Asynchronous API
// - Good for large caches
// - More complex setup

// 4. Custom storage
// - Implement your own persister
// - Use any storage backend
// - Full control over serialization

// Conceptual example:
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  // Or: window.sessionStorage
  // Or: custom storage implementation
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Offline Plugins</h2>
        <p className="text-gray-700 mb-4">
          Offline plugins handle network status, queue mutations when offline, and sync when
          connection is restored.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Understanding Offline Plugins</h3>
        <CodeBlock
          title="Offline Plugin Concept"
          code={`// Offline plugins provide:
// - Network status detection
// - Mutation queuing
// - Automatic sync when online
// - Conflict resolution

// How it works:
// 1. Detects network status
// 2. Queues mutations when offline
// 3. Stores queue in persistent storage
// 4. Executes queue when online
// 5. Handles sync conflicts

// Conceptual usage:
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/query-persist-client-core';

// Offline plugin typically includes:
// - Network status monitoring
// - Mutation queue management
// - Storage persistence
// - Sync coordination

// Benefits:
// - Works offline
// - Queues mutations
// - Syncs automatically
// - Handles conflicts`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Offline Features</h3>
        <CodeBlock
          title="Offline Plugin Capabilities"
          code={`// Offline plugins typically provide:

// 1. Network Detection
// - Monitor online/offline status
// - React to status changes
// - Provide status to components

// 2. Mutation Queuing
// - Queue mutations when offline
// - Store queue persistently
// - Execute when online

// 3. Query Handling
// - Use cached data when offline
// - Show stale data indicators
// - Refetch when online

// 4. Sync Management
// - Coordinate sync operations
// - Handle sync conflicts
// - Retry failed syncs

// 5. Storage Integration
// - Persist queue to storage
// - Restore queue on load
// - Manage storage size`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">DevTools Plugins</h2>
        <p className="text-gray-700 mb-4">
          DevTools plugins extend the React Query DevTools with additional features and
          customizations.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Understanding DevTools Plugins</h3>
        <CodeBlock
          title="DevTools Plugin Concept"
          code={`// DevTools plugins extend DevTools functionality:

// Features:
// - Custom panels
// - Additional filters
// - Export/import functionality
// - Custom visualizations
// - Performance metrics

// How it works:
// 1. DevTools provides plugin API
// 2. Plugins register with DevTools
// 3. Plugins add custom features
// 4. Users interact with plugins
// 5. Plugins access query cache

// Conceptual usage:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { customPlugin } from './devtools-plugin';

<ReactQueryDevtools
  plugins={[customPlugin]}
/>

// Plugin capabilities:
// - Access query cache
// - Display custom data
// - Interact with queries
// - Export/import cache
// - Custom visualizations`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">DevTools Plugin Types</h3>
        <CodeBlock
          title="Types of DevTools Plugins"
          code={`// DevTools plugins can provide:

// 1. Custom Panels
// - Additional tabs in DevTools
// - Custom UI components
// - Query-specific views

// 2. Filters
// - Custom filter options
// - Advanced search
// - Query key patterns

// 3. Export/Import
// - Export cache state
// - Import cache state
// - Share cache between environments

// 4. Visualizations
// - Query dependency graphs
// - Cache size visualization
// - Performance charts

// 5. Utilities
// - Bulk operations
// - Cache cleanup tools
// - Query analysis`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Plugin Integration</h2>
        <p className="text-gray-700 mb-4">
          Understanding how to integrate plugins with React Query helps you extend functionality.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Plugin Setup Pattern</h3>
        <CodeBlock
          title="Integrating Plugins"
          code={`// General plugin integration pattern:

// 1. Install plugin package
// npm install @tanstack/query-persist-client-core

// 2. Import plugin
// import { persistQueryClient } from '@tanstack/query-persist-client-core';

// 3. Create persister (for persist plugins)
// import { createSyncStoragePersister } from '@tanstack/query-persist-client-core';
// const persister = createSyncStoragePersister({
//   storage: window.localStorage,
// });

// 4. Initialize plugin
// persistQueryClient({
//   queryClient,
//   persister,
//   maxAge: 1000 * 60 * 60 * 24, // 24 hours
// });

// 5. Plugin automatically works
// - No additional code needed
// - Handles setup/teardown
// - Integrates with QueryClient

// Note: Actual implementation depends on plugin
// Check plugin documentation for specifics`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Plugin Configuration</h3>
        <CodeBlock
          title="Configuring Plugins"
          code={`// Plugins typically accept configuration:

// Example: Persist plugin configuration
persistQueryClient({
  queryClient,
  persister,
  
  // Configuration options:
  maxAge: 1000 * 60 * 60 * 24, // Max cache age
  buster: '', // Cache buster string
  dehydrateOptions: {
    // What to persist
    shouldDehydrateQuery: (query) => {
      // Custom logic for what to persist
      return true;
    },
  },
  serialize: (data) => {
    // Custom serialization
    return JSON.stringify(data);
  },
  deserialize: (data) => {
    // Custom deserialization
    return JSON.parse(data);
  },
});

// Plugin-specific options vary
// Always check plugin documentation`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Check official plugins first</strong> - Use official plugins when available</li>
            <li><strong>Read plugin documentation</strong> - Understand plugin capabilities</li>
            <li><strong>Configure appropriately</strong> - Set options for your use case</li>
            <li><strong>Handle storage limits</strong> - Be aware of storage constraints</li>
            <li><strong>Test plugin behavior</strong> - Verify plugins work correctly</li>
            <li><strong>Monitor performance</strong> - Plugins may impact performance</li>
            <li><strong>Update plugins</strong> - Keep plugins up to date</li>
            <li><strong>Understand trade-offs</strong> - Plugins add complexity</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">17.2 Community Patterns</strong>
          for custom plugins, middleware patterns, and interceptors.
        </p>
      </div>
    </LessonLayout>
  );
}

