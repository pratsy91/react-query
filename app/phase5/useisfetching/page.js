import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseIsFetchingPage() {
  return (
    <LessonLayout
      title="5.2 useIsFetching Hook"
      description="Learn how to track global fetching state across all queries using useIsFetching"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useIsFetching?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useIsFetching</code> hook returns the number
          of queries currently fetching. It's useful for showing global loading indicators and tracking
          fetching state across your application.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Use Cases:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Global loading indicators</li>
            <li>Progress bars</li>
            <li>Network activity indicators</li>
            <li>Conditional UI based on fetching state</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useIsFetching Usage"
          code={`import { useIsFetching } from '@tanstack/react-query';

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  
  // Returns number of queries currently fetching
  // 0 means no queries are fetching
  
  return (
    <div>
      {isFetching > 0 && (
        <div>Loading... ({isFetching} queries)</div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Global Fetching State</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useIsFetching</code> tracks all queries in your
          application, giving you a global view of fetching activity.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Global Indicator</h3>
        <CodeBlock
          title="Show Loading When Any Query is Fetching"
          code={`import { useIsFetching } from '@tanstack/react-query';

function App() {
  const isFetching = useIsFetching();
  
  return (
    <div>
      {isFetching > 0 && (
        <div className="global-loader">
          Loading data...
        </div>
      )}
      <YourAppContent />
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Boolean Conversion</h3>
        <CodeBlock
          title="Convert to Boolean"
          code={`function LoadingIndicator() {
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0; // Convert to boolean
  
  return (
    <div>
      {isLoading && <div>Loading...</div>}
    </div>
  );
}

// Or use directly
function LoadingIndicator() {
  const isFetching = useIsFetching();
  
  return (
    <div>
      {!!isFetching && <div>Loading...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Filtering Options</h2>
        <p className="text-gray-700 mb-4">
          You can filter which queries are counted by providing filter options to
          <code className="bg-gray-100 px-1 rounded">useIsFetching</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Query Key</h3>
        <CodeBlock
          title="Count Specific Queries"
          code={`function UserLoadingIndicator() {
  // Count only user queries
  const isFetchingUsers = useIsFetching({
    queryKey: ['user'],
  });
  
  // Count specific user query
  const isFetchingUser = useIsFetching({
    queryKey: ['user', userId],
  });
  
  return (
    <div>
      {isFetchingUsers > 0 && <div>Loading users...</div>}
      {isFetchingUser > 0 && <div>Loading user {userId}...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Predicate</h3>
        <CodeBlock
          title="Custom Filtering Logic"
          code={`function CustomLoadingIndicator() {
  // Count queries matching custom condition
  const isFetchingImportant = useIsFetching({
    predicate: (query) => {
      // Only count queries with 'important' in key
      return query.queryKey.some(key => 
        typeof key === 'string' && key.includes('important')
      );
    },
  });
  
  // Count queries older than 1 minute
  const isFetchingStale = useIsFetching({
    predicate: (query) => {
      const state = query.state;
      if (!state.dataUpdatedAt) return false;
      
      const oneMinuteAgo = Date.now() - 60000;
      return state.dataUpdatedAt < oneMinuteAgo && 
             query.state.status === 'pending';
    },
  });
  
  return (
    <div>
      {isFetchingImportant > 0 && <div>Loading important data...</div>}
      {isFetchingStale > 0 && <div>Refreshing stale data...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Fetch Status</h3>
        <CodeBlock
          title="Filter by Fetch Type"
          code={`function FetchingIndicators() {
  // Count all fetching queries
  const allFetching = useIsFetching();
  
  // Count only background refetches
  const backgroundFetching = useIsFetching({
    predicate: (query) => {
      return query.state.isFetching && 
             query.state.dataUpdatedAt !== undefined;
    },
  });
  
  return (
    <div>
      <div>Total fetching: {allFetching}</div>
      <div>Background: {backgroundFetching}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Use Cases</h2>
        <p className="text-gray-700 mb-4">
          Common patterns and use cases for <code className="bg-gray-100 px-1 rounded">useIsFetching</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 1: Global Loading Bar</h3>
        <CodeBlock
          title="Top Loading Bar"
          code={`function TopLoadingBar() {
  const isFetching = useIsFetching();
  
  return (
    <div className="top-bar">
      {isFetching > 0 && (
        <div className="loading-bar" />
      )}
    </div>
  );
}

// With progress indicator
function ProgressBar() {
  const isFetching = useIsFetching();
  
  return (
    <div className="progress-container">
      {isFetching > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 2: Network Activity Indicator</h3>
        <CodeBlock
          title="Show Network Activity"
          code={`function NetworkIndicator() {
  const isFetching = useIsFetching();
  
  return (
    <div className="network-indicator">
      {isFetching > 0 ? (
        <div className="active">
          <span>🔄</span> Network activity
        </div>
      ) : (
        <div className="idle">
          <span>✓</span> All loaded
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 3: Disable Actions While Fetching</h3>
        <CodeBlock
          title="Conditional UI Based on Fetching"
          code={`function ActionButtons() {
  const isFetching = useIsFetching({
    queryKey: ['criticalData'],
  });
  
  return (
    <div>
      <button disabled={isFetching > 0}>
        {isFetching > 0 ? 'Loading...' : 'Submit'}
      </button>
      
      {isFetching > 0 && (
        <div className="warning">
          Please wait for data to load
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 4: Multiple Loading Indicators</h3>
        <CodeBlock
          title="Track Different Query Types"
          code={`function MultipleIndicators() {
  const allFetching = useIsFetching();
  const usersFetching = useIsFetching({ queryKey: ['user'] });
  const postsFetching = useIsFetching({ queryKey: ['post'] });
  const commentsFetching = useIsFetching({ queryKey: ['comment'] });
  
  return (
    <div>
      <div>Total: {allFetching}</div>
      <div>Users: {usersFetching}</div>
      <div>Posts: {postsFetching}</div>
      <div>Comments: {commentsFetching}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Debounced Indicator</h3>
        <CodeBlock
          title="Show Indicator Only After Delay"
          code={`import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';

function DebouncedIndicator() {
  const isFetching = useIsFetching();
  const [showIndicator, setShowIndicator] = useState(false);
  
  useEffect(() => {
    if (isFetching > 0) {
      // Show indicator after 500ms
      const timer = setTimeout(() => {
        setShowIndicator(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [isFetching]);
  
  return (
    <div>
      {showIndicator && <div>Loading...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Fetching Counter</h3>
        <CodeBlock
          title="Show Count of Fetching Queries"
          code={`function FetchingCounter() {
  const isFetching = useIsFetching();
  
  return (
    <div className="fetching-counter">
      {isFetching > 0 ? (
        <div>
          <span className="spinner">⏳</span>
          {isFetching} {isFetching === 1 ? 'query' : 'queries'} loading
        </div>
      ) : (
        <div>All data loaded ✓</div>
      )}
    </div>
  );
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.3 useIsMutating Hook</strong>
          to track global mutation state across all mutations.
        </p>
      </div>
    </LessonLayout>
  );
}

