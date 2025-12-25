import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CommonPitfallsPage() {
  return (
    <LessonLayout
      title="19.1 Common Pitfalls"
      description="Learn common pitfalls: stale closures, infinite loops, memory leaks, race conditions, and cache pollution"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Pitfalls</h2>
        <p className="text-gray-700 mb-4">
          Understanding common pitfalls helps you avoid bugs and write more robust React Query
          code. These issues are easy to miss but can cause significant problems.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Common Pitfalls:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Stale closures</li>
            <li>Infinite loops</li>
            <li>Memory leaks</li>
            <li>Race conditions</li>
            <li>Cache pollution</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Stale Closures</h2>
        <p className="text-gray-700 mb-4">
          Stale closures occur when callbacks capture old values. This is a common issue with
          React Query callbacks and effects.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Stale Closure Example"
          code={`// ❌ PROBLEM: Stale closure
function UserProfile({ userId }) {
  const [count, setCount] = useState(0);

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    onSuccess: (data) => {
      // This captures the initial count value (0)
      // It will always use 0, even if count changes
      console.log('Count:', count); // Always 0!
    },
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <div>{data?.name}</div>
    </div>
  );
}

// The onSuccess callback captures count at mount time
// It never sees updated count values`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Fixing Stale Closures"
          code={`// ✅ SOLUTION: Use useEffect instead
function UserProfile({ userId }) {
  const [count, setCount] = useState(0);

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Don't use onSuccess - it's deprecated anyway
  });

  // Use useEffect to react to data changes
  useEffect(() => {
    if (data) {
      // This always has the latest count value
      console.log('Count:', count);
    }
  }, [data, count]); // Include dependencies

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <div>{data?.name}</div>
    </div>
  );
}

// ✅ ALTERNATIVE: Use ref for latest value
function UserProfile({ userId }) {
  const countRef = useRef(0);
  const [count, setCount] = useState(0);

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    onSuccess: (data) => {
      // Use ref to get latest value
      console.log('Count:', countRef.current);
    },
  });

  const increment = () => {
    countRef.current = countRef.current + 1;
    setCount(countRef.current);
  };

  return (
    <div>
      <button onClick={increment}>Count: {count}</button>
      <div>{data?.name}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Infinite Loops</h2>
        <p className="text-gray-700 mb-4">
          Infinite loops can occur when queries trigger invalidations that trigger more queries.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Infinite Loop Example"
          code={`// ❌ PROBLEM: Infinite loop
function UserList() {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    onSuccess: (data) => {
      // This invalidates the query
      // Which triggers onSuccess again
      // Which invalidates again...
      queryClient.invalidateQueries(['users']);
    },
  });

  return <div>{users?.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}

// The loop:
// 1. Query succeeds
// 2. onSuccess runs
// 3. invalidateQueries triggers refetch
// 4. Query succeeds again
// 5. Back to step 2 - INFINITE LOOP!`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Fixing Infinite Loops"
          code={`// ✅ SOLUTION: Don't invalidate in onSuccess
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    // Don't invalidate here
  });

  return <div>{users?.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}

// ✅ SOLUTION: Use conditional invalidation
function UserList() {
  const queryClient = useQueryClient();
  const [shouldInvalidate, setShouldInvalidate] = useState(false);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  useEffect(() => {
    if (shouldInvalidate) {
      queryClient.invalidateQueries(['users']);
      setShouldInvalidate(false);
    }
  }, [shouldInvalidate, queryClient]);

  return <div>{users?.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}

// ✅ SOLUTION: Use refetchInterval carefully
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    refetchInterval: 5000, // OK - controlled interval
    // Don't combine with invalidateQueries in callbacks
  });

  return <div>{users?.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Memory Leaks</h2>
        <p className="text-gray-700 mb-4">
          Memory leaks occur when subscriptions, timers, or event listeners aren't cleaned up.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Memory Leak Example"
          code={`// ❌ PROBLEM: Memory leak
function QueryMonitor() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    // Subscribe to cache events
    const unsubscribe = queryCache.subscribe((event) => {
      console.log('Cache event:', event);
    });

    // ❌ Missing cleanup - subscription never unsubscribes!
    // This causes memory leak
  }, [queryCache]);

  return null;
}

// ❌ PROBLEM: Timer not cleared
function PollingComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Do something
    }, 1000);

    // ❌ Missing cleanup - interval never cleared!
  }, []);

  return null;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Fixing Memory Leaks"
          code={`// ✅ SOLUTION: Always cleanup subscriptions
function QueryMonitor() {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      console.log('Cache event:', event);
    });

    // ✅ Always return cleanup function
    return () => {
      unsubscribe();
    };
  }, [queryCache]);

  return null;
}

// ✅ SOLUTION: Clear timers
function PollingComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Do something
    }, 1000);

    // ✅ Always return cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}

// ✅ SOLUTION: Cleanup in custom hooks
function useQuerySubscription(queryKey) {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();

  useEffect(() => {
    const unsubscribe = queryCache.subscribe((event) => {
      if (event.query.queryKey[0] === queryKey[0]) {
        console.log('Query event:', event);
      }
    });

    return () => unsubscribe();
  }, [queryCache, queryKey]);
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Race Conditions</h2>
        <p className="text-gray-700 mb-4">
          Race conditions occur when multiple requests complete out of order, causing stale
          data to overwrite fresh data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Race Condition Example"
          code={`// ❌ PROBLEM: Race condition
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Request 1: userId = 1
    fetchUser(1).then(data => {
      setUser(data); // Sets user 1
    });

    // Request 2: userId = 2 (happens quickly)
    fetchUser(2).then(data => {
      setUser(data); // Sets user 2
    });

    // If request 2 completes before request 1:
    // - Request 2 sets user 2
    // - Request 1 completes later and sets user 1
    // - Now showing user 1 when userId is 2!
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ❌ PROBLEM: Multiple mutations
function UpdateUser() {
  const mutation = useMutation({
    mutationFn: updateUser,
  });

  const handleClick = () => {
    // Click 1: Updates user to "A"
    mutation.mutate({ name: 'A' });
    
    // Click 2: Updates user to "B" (completes first)
    mutation.mutate({ name: 'B' });
    
    // Click 1 completes after Click 2
    // Result: User is "A" instead of "B"!
  };

  return <button onClick={handleClick}>Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Fixing Race Conditions"
          code={`// ✅ SOLUTION: Use React Query (handles race conditions)
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // React Query automatically:
  // - Cancels previous requests
  // - Only uses latest request result
  // - Prevents race conditions

  return <div>{user?.name}</div>;
}

// ✅ SOLUTION: Use AbortController
function UserProfile({ userId }) {
  useEffect(() => {
    const controller = new AbortController();

    fetchUser(userId, { signal: controller.signal })
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    // Cancel previous request when userId changes
    return () => {
      controller.abort();
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ✅ SOLUTION: Track request order
function UpdateUser() {
  const mutation = useMutation({
    mutationFn: updateUser,
  });

  const requestIdRef = useRef(0);

  const handleClick = () => {
    const requestId = ++requestIdRef.current;

    mutation.mutate(
      { name: 'A' },
      {
        onSuccess: (data) => {
          // Only update if this is the latest request
          if (requestId === requestIdRef.current) {
            console.log('Latest update:', data);
          }
        },
      }
    );
  };

  return <button onClick={handleClick}>Update</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Pollution</h2>
        <p className="text-gray-700 mb-4">
          Cache pollution occurs when unrelated data is stored in the cache or when cache
          keys collide.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Cache Pollution Example"
          code={`// ❌ PROBLEM: Cache key collision
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user'], // ❌ Missing userId!
    queryFn: () => fetchUser(userId),
  });

  // When userId changes:
  // - Query key stays ['user']
  // - New data overwrites old data
  // - Cache shows wrong user!

  return <div>{user?.name}</div>;
}

// ❌ PROBLEM: Storing too much data
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    select: (data) => {
      // ❌ Storing all user data including sensitive info
      return data; // Contains passwords, tokens, etc.
    },
  });

  return <div>{users?.map(u => <div>{u.name}</div>)}</div>;
}

// ❌ PROBLEM: Unrelated data in cache
function SearchResults({ query }) {
  const { data } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
  });

  // If query is empty, might cache empty results
  // Pollutes cache with useless data
  return <div>{data?.results}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Fixing Cache Pollution"
          code={`// ✅ SOLUTION: Include all dependencies in query key
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId], // ✅ Include userId
    queryFn: () => fetchUser(userId),
  });

  return <div>{user?.name}</div>;
}

// ✅ SOLUTION: Transform data to only store needed fields
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    select: (data) => {
      // ✅ Only store safe, needed data
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        // Don't store passwords, tokens, etc.
      }));
    },
  });

  return <div>{users?.map(u => <div>{u.name}</div>)}</div>;
}

// ✅ SOLUTION: Don't cache empty/invalid queries
function SearchResults({ query }) {
  const { data } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.length > 0, // ✅ Don't fetch if empty
    gcTime: 0, // ✅ Don't keep in cache long
  });

  return <div>{data?.results}</div>;
}

// ✅ SOLUTION: Use stable query keys
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userPosts: (id: number) => ['users', id, 'posts'] as const,
};

// ✅ Prevents typos and ensures consistency`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Avoid onSuccess/onError</strong> - Use useEffect instead</li>
            <li><strong>Always cleanup</strong> - Return cleanup functions</li>
            <li><strong>Include dependencies</strong> - Add all deps to query keys</li>
            <li><strong>Use React Query features</strong> - Let it handle race conditions</li>
            <li><strong>Transform data carefully</strong> - Only store what you need</li>
            <li><strong>Don't invalidate in callbacks</strong> - Causes infinite loops</li>
            <li><strong>Use stable query keys</strong> - Prevent cache collisions</li>
            <li><strong>Monitor memory usage</strong> - Check for leaks in DevTools</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">19.2 Advanced Edge Cases</strong>
          for concurrent updates, optimistic update conflicts, cache invalidation timing, and query key stability.
        </p>
      </div>
    </LessonLayout>
  );
}

