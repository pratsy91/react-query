import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function QueryObserverPage() {
  return (
    <LessonLayout
      title="18.3 Query Observer"
      description="Learn Query Observer patterns: useQueryObserver, useInfiniteQueryObserver, observer patterns, and subscriptions"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Observer</h2>
        <p className="text-gray-700 mb-4">
          Query Observers provide a lower-level API for observing queries. They give you
          more control than hooks and are useful for advanced patterns.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Observer Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>useQueryObserver</li>
            <li>useInfiniteQueryObserver</li>
            <li>Observer patterns</li>
            <li>Subscriptions</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">useQueryObserver</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useQueryObserver</code> hook provides
          direct access to a query observer, giving you more control than useQuery.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic useQueryObserver</h3>
        <CodeBlock
          title="Using useQueryObserver"
          code={`import { useQueryObserver } from '@tanstack/react-query';

function UserObserver({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Access observer properties
  const { data, status, error } = observer;

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}

// useQueryObserver provides:
// - Direct observer access
// - More control over subscriptions
// - Ability to customize observer behavior
// - Access to observer methods`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Observer vs Hook</h3>
        <CodeBlock
          title="When to Use Observer"
          code={`// useQuery: Higher-level, easier to use
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Simple and straightforward
  return <div>{data?.name}</div>;
}

// useQueryObserver: Lower-level, more control
function UserObserver({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // More control over observer behavior
  // Can access observer methods
  // Can customize subscription

  return <div>{observer.data?.name}</div>;
}

// Use observer when you need:
// - Custom subscription logic
// - Observer methods
// - More fine-grained control
// - Integration with external systems`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">useInfiniteQueryObserver</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useInfiniteQueryObserver</code> hook
          provides observer access for infinite queries.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Infinite Query Observer</h3>
        <CodeBlock
          title="Using useInfiniteQueryObserver"
          code={`import { useInfiniteQueryObserver } from '@tanstack/react-query';

function PostsObserver() {
  const observer = useInfiniteQueryObserver({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { data, status, fetchNextPage, hasNextPage } = observer;

  if (status === 'pending') return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map((page, index) => (
        <div key={index}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}

// Observer provides same API as useInfiniteQuery
// but with direct observer access`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Observer Patterns</h2>
        <p className="text-gray-700 mb-4">
          Observer patterns allow you to create custom subscription logic and integrate with
          external systems.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Custom Subscription Pattern</h3>
        <CodeBlock
          title="Custom Observer Subscription"
          code={`import { useQueryObserver } from '@tanstack/react-query';
import { useEffect } from 'react';

function CustomObserver({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Custom subscription logic
  useEffect(() => {
    // Subscribe to observer changes
    const unsubscribe = observer.subscribe((result) => {
      // Custom handling
      console.log('Observer update:', result);
      
      // Sync with external system
      if (result.data) {
        syncWithExternalSystem(result.data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [observer]);

  return <div>{observer.data?.name}</div>;
}

// Observer subscription provides:
// - Fine-grained control
// - Custom update handling
// - Integration with external systems
// - Custom side effects`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multiple Observers Pattern</h3>
        <CodeBlock
          title="Observing Multiple Queries"
          code={`function MultiObserver() {
  const userObserver = useQueryObserver({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1),
  });

  const postsObserver = useQueryObserver({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });

  // Combine observer results
  const allLoading = userObserver.status === 'pending' || 
                     postsObserver.status === 'pending';
  const allError = userObserver.status === 'error' || 
                   postsObserver.status === 'error';

  if (allLoading) return <div>Loading...</div>;
  if (allError) return <div>Error occurred</div>;

  return (
    <div>
      <div>User: {userObserver.data?.name}</div>
      <div>Posts: {postsObserver.data?.length}</div>
    </div>
  );
}

// Observers are independent
// Each manages its own subscription
// Can be combined for complex logic`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Subscriptions</h2>
        <p className="text-gray-700 mb-4">
          Observer subscriptions allow you to react to query changes with custom logic.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Observer Subscription</h3>
        <CodeBlock
          title="Subscribing to Observer"
          code={`import { useQueryObserver } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function SubscribedObserver({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const [observerState, setObserverState] = useState(observer);

  useEffect(() => {
    // Subscribe to observer updates
    const unsubscribe = observer.subscribe((result) => {
      setObserverState(result);
      
      // Custom side effects
      if (result.data) {
        console.log('User data updated:', result.data);
      }
      
      if (result.error) {
        console.error('Query error:', result.error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [observer]);

  // Use observerState instead of observer directly
  return <div>{observerState.data?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Selective Subscription</h3>
        <CodeBlock
          title="Subscribing to Specific Properties"
          code={`function SelectiveSubscription({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  useEffect(() => {
    // Subscribe only to data changes
    const unsubscribe = observer.subscribe((result) => {
      // Only react to data changes
      if (result.data) {
        console.log('Data changed:', result.data);
        // Custom logic for data changes
      }
    });

    return () => unsubscribe();
  }, [observer]);

  return <div>{observer.data?.name}</div>;
}

// Selective subscription allows:
// - Reacting to specific changes
// - Custom update logic
// - Performance optimization
// - Integration with external systems`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Observer Methods</h2>
        <p className="text-gray-700 mb-4">
          Observers provide methods to control query behavior programmatically.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Observer API</h3>
        <CodeBlock
          title="Observer Methods"
          code={`function ObserverMethods({ userId }) {
  const observer = useQueryObserver({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Observer provides methods:
  // observer.refetch() - Refetch query
  // observer.setOptions() - Update observer options
  // observer.getResult() - Get current result
  // observer.subscribe() - Subscribe to updates

  const handleRefetch = () => {
    observer.refetch();
  };

  const handleUpdateOptions = () => {
    observer.setOptions({
      enabled: false, // Disable query
    });
  };

  return (
    <div>
      <div>{observer.data?.name}</div>
      <button onClick={handleRefetch}>Refetch</button>
      <button onClick={handleUpdateOptions}>Disable</button>
    </div>
  );
}

// Observer methods provide:
// - Programmatic control
// - Dynamic option updates
// - Manual refetching
// - Custom query management`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use hooks when possible</strong> - useQuery is simpler for most cases</li>
            <li><strong>Use observer for control</strong> - When you need fine-grained control</li>
            <li><strong>Clean up subscriptions</strong> - Always unsubscribe</li>
            <li><strong>Handle observer state</strong> - Manage observer state properly</li>
            <li><strong>Use for integration</strong> - Great for external system integration</li>
            <li><strong>Optimize subscriptions</strong> - Subscribe only to needed changes</li>
            <li><strong>Document observer usage</strong> - Observers are lower-level</li>
            <li><strong>Test observer behavior</strong> - Verify subscriptions work correctly</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 18: Advanced API Methods
          and the entire React Query learning platform! You now understand Query Cache methods,
          Mutation Cache methods, and Query Observer patterns. You've mastered all aspects
          of React Query!
        </p>
      </div>
    </LessonLayout>
  );
}

