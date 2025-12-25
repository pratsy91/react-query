import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function AdvancedEdgeCasesPage() {
  return (
    <LessonLayout
      title="19.2 Advanced Edge Cases"
      description="Learn advanced edge cases: concurrent updates, optimistic update conflicts, cache invalidation timing, and query key stability"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Edge Cases</h2>
        <p className="text-gray-700 mb-4">
          Advanced edge cases require deeper understanding of React Query's internals. These
          scenarios are less common but critical for robust applications.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Advanced Edge Cases:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Concurrent updates</li>
            <li>Optimistic update conflicts</li>
            <li>Cache invalidation timing</li>
            <li>Query key stability</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Concurrent Updates</h2>
        <p className="text-gray-700 mb-4">
          Concurrent updates occur when multiple components or processes update the same data
          simultaneously. Handling this correctly is crucial.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Concurrent Update Issue"
          code={`// ❌ PROBLEM: Concurrent updates overwrite each other
function UserEditor({ userId }) {
  const queryClient = useQueryClient();

  const updateName = useMutation({
    mutationFn: (name) => updateUser(userId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  const updateEmail = useMutation({
    mutationFn: (email) => updateUser(userId, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  // If both mutations run simultaneously:
  // 1. updateName starts
  // 2. updateEmail starts
  // 3. updateName completes, invalidates cache
  // 4. updateEmail completes, invalidates cache
  // 5. Refetch might get stale data
  // 6. One update might be lost!

  return (
    <div>
      <button onClick={() => updateName.mutate('New Name')}>Update Name</button>
      <button onClick={() => updateEmail.mutate('new@email.com')}>Update Email</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Handling Concurrent Updates"
          code={`// ✅ SOLUTION: Use optimistic updates with rollback
function UserEditor({ userId }) {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: (updates) => updateUser(userId, updates),
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['user', userId]);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', userId]);

      // Optimistically update
      queryClient.setQueryData(['user', userId], (old) => ({
        ...old,
        ...updates,
      }));

      return { previousUser };
    },
    onError: (err, updates, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  return (
    <div>
      <button onClick={() => updateUser.mutate({ name: 'New Name' })}>
        Update Name
      </button>
      <button onClick={() => updateUser.mutate({ email: 'new@email.com' })}>
        Update Email
      </button>
    </div>
  );
}

// ✅ SOLUTION: Batch updates
function UserEditor({ userId }) {
  const [pendingUpdates, setPendingUpdates] = useState({});

  const updateUser = useMutation({
    mutationFn: (updates) => updateUser(userId, updates),
  });

  const handleUpdate = (field, value) => {
    const newUpdates = { ...pendingUpdates, [field]: value };
    setPendingUpdates(newUpdates);

    // Debounce to batch updates
    clearTimeout(updateUser.timeoutId);
    updateUser.timeoutId = setTimeout(() => {
      updateUser.mutate(newUpdates);
      setPendingUpdates({});
    }, 500);
  };

  return (
    <div>
      <input onChange={(e) => handleUpdate('name', e.target.value)} />
      <input onChange={(e) => handleUpdate('email', e.target.value)} />
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Optimistic Update Conflicts</h2>
        <p className="text-gray-700 mb-4">
          Optimistic updates can conflict when multiple optimistic updates happen before server
          responses arrive.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Optimistic Update Conflict"
          code={`// ❌ PROBLEM: Optimistic updates conflict
function TodoList() {
  const queryClient = useQueryClient();

  const toggleTodo = useMutation({
    mutationFn: (id) => toggleTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['todos']);

      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });

  // If user clicks multiple todos quickly:
  // 1. Click todo 1 - optimistic update
  // 2. Click todo 2 - optimistic update
  // 3. Server response 1 arrives - might conflict with optimistic update 2
  // 4. Server response 2 arrives - might overwrite response 1
  // 5. Final state might be incorrect!

  return <div>{/* Todo list */}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Resolving Optimistic Conflicts"
          code={`// ✅ SOLUTION: Use version numbers
function TodoList() {
  const queryClient = useQueryClient();
  const versionRef = useRef(0);

  const toggleTodo = useMutation({
    mutationFn: (id) => toggleTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['todos']);

      const version = ++versionRef.current;
      const previousTodos = queryClient.getQueryData(['todos']);

      queryClient.setQueryData(['todos'], (old) => ({
        ...old,
        data: old.data.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed, _version: version } : todo
        ),
        _version: version,
      }));

      return { previousTodos, version };
    },
    onSuccess: (data, id, context) => {
      // Only update if this is the latest version
      const currentVersion = queryClient.getQueryData(['todos'])?._version || 0;
      if (context.version >= currentVersion) {
        queryClient.setQueryData(['todos'], (old) => ({
          ...old,
          data: old.data.map(todo =>
            todo.id === id ? { ...data, _version: context.version } : todo
          ),
        }));
      }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });

  return <div>{/* Todo list */}</div>;
}

// ✅ SOLUTION: Queue mutations
function TodoList() {
  const mutationQueue = useRef([]);
  const isProcessing = useRef(false);

  const processQueue = async () => {
    if (isProcessing.current || mutationQueue.current.length === 0) return;

    isProcessing.current = true;
    const mutation = mutationQueue.current.shift();

    try {
      await mutation.fn();
    } finally {
      isProcessing.current = false;
      processQueue();
    }
  };

  const toggleTodo = (id) => {
    mutationQueue.current.push({
      fn: () => toggleTodoMutation.mutate(id),
    });
    processQueue();
  };

  return <div>{/* Todo list */}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cache Invalidation Timing</h2>
        <p className="text-gray-700 mb-4">
          Cache invalidation timing is crucial. Invalidating too early or too late can cause
          stale data or unnecessary refetches.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Cache Invalidation Timing Issues"
          code={`// ❌ PROBLEM: Invalidating too early
function CreatePost() {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // ❌ Invalidates immediately
      // But mutation might not be fully processed on server
      queryClient.invalidateQueries(['posts']);
    },
  });

  return <button onClick={() => createPost.mutate({ title: 'New' })}>Create</button>;
}

// ❌ PROBLEM: Invalidating too late
function UpdatePost() {
  const queryClient = useQueryClient();

  const updatePost = useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      // ✅ Updates specific post
      queryClient.setQueryData(['post', data.id], data);
      
      // ❌ But invalidates list too late
      // User might see stale list
    },
  });

  // Later, somewhere else...
  setTimeout(() => {
    queryClient.invalidateQueries(['posts']); // Too late!
  }, 1000);

  return <button onClick={() => updatePost.mutate({ id: 1, title: 'Updated' })}>Update</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Proper Cache Invalidation Timing"
          code={`// ✅ SOLUTION: Invalidate at the right time
function CreatePost() {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // ✅ Update cache immediately with new data
      queryClient.setQueryData(['post', data.id], data);
      
      // ✅ Invalidate list to refetch
      queryClient.invalidateQueries(['posts']);
      
      // ✅ Or add to list optimistically
      queryClient.setQueryData(['posts'], (old) => ({
        ...old,
        data: [data, ...old.data],
      }));
    },
  });

  return <button onClick={() => createPost.mutate({ title: 'New' })}>Create</button>;
}

// ✅ SOLUTION: Use onSettled for guaranteed timing
function UpdatePost() {
  const queryClient = useQueryClient();

  const updatePost = useMutation({
    mutationFn: updatePost,
    onMutate: async (variables) => {
      await queryClient.cancelQueries(['post', variables.id]);
      
      const previousPost = queryClient.getQueryData(['post', variables.id]);
      
      // Optimistic update
      queryClient.setQueryData(['post', variables.id], (old) => ({
        ...old,
        ...variables,
      }));
      
      return { previousPost };
    },
    onSuccess: (data) => {
      // ✅ Update with server data
      queryClient.setQueryData(['post', data.id], data);
    },
    onSettled: (data, error, variables) => {
      // ✅ Always invalidate after mutation settles
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['post', variables.id]);
    },
  });

  return <button onClick={() => updatePost.mutate({ id: 1, title: 'Updated' })}>Update</button>;
}

// ✅ SOLUTION: Use refetchType for control
function DeletePost() {
  const queryClient = useQueryClient();

  const deletePost = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // ✅ Only refetch active queries
      queryClient.invalidateQueries(['posts'], {
        refetchType: 'active', // 'active' | 'inactive' | 'all' | 'none'
      });
    },
  });

  return <button onClick={() => deletePost.mutate(1)}>Delete</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Key Stability</h2>
        <p className="text-gray-700 mb-4">
          Query key stability is essential. Unstable keys cause unnecessary refetches and
          cache misses.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Problem</h3>
        <CodeBlock
          title="Unstable Query Keys"
          code={`// ❌ PROBLEM: Unstable query key
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId, { timestamp: Date.now() }],
    // ❌ timestamp changes every render
    // Query key is never the same
    // Causes unnecessary refetches
    queryFn: () => fetchUser(userId),
  });

  return <div>{data?.name}</div>;
}

// ❌ PROBLEM: Object in query key
function FilteredPosts({ filters }) {
  const { data } = useQuery({
    queryKey: ['posts', filters],
    // ❌ Objects are compared by reference
    // New object every render = new query key
    queryFn: () => fetchPosts(filters),
  });

  return <div>{data?.map(p => <div>{p.title}</div>)}</div>;
}

// ❌ PROBLEM: Function in query key
function SearchResults({ query }) {
  const { data } = useQuery({
    queryKey: ['search', query, () => Math.random()],
    // ❌ Function reference changes
    // Causes cache misses
    queryFn: () => search(query),
  });

  return <div>{data?.results}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">The Solution</h3>
        <CodeBlock
          title="Stable Query Keys"
          code={`// ✅ SOLUTION: Stable query key
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    // ✅ Stable key - only changes when userId changes
    queryFn: () => fetchUser(userId),
  });

  return <div>{data?.name}</div>;
}

// ✅ SOLUTION: Serialize objects
function FilteredPosts({ filters }) {
  const { data } = useQuery({
    queryKey: ['posts', filters.status, filters.category, filters.sort],
    // ✅ Use primitive values
    queryFn: () => fetchPosts(filters),
  });

  return <div>{data?.map(p => <div>{p.title}</div>)}</div>;
}

// ✅ SOLUTION: Use query key factory
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userPosts: (id: number, filters?: { status?: string }) => 
    ['users', id, 'posts', filters?.status].filter(Boolean) as const,
};

function UserPosts({ userId, filters }) {
  const { data } = useQuery({
    queryKey: queryKeys.userPosts(userId, filters),
    // ✅ Stable, type-safe keys
    queryFn: () => fetchUserPosts(userId, filters),
  });

  return <div>{data?.map(p => <div>{p.title}</div>)}</div>;
}

// ✅ SOLUTION: Use useMemo for complex keys
function ComplexQuery({ params }) {
  const queryKey = useMemo(() => {
    return ['complex', params.id, params.filters?.status, params.filters?.category];
  }, [params.id, params.filters?.status, params.filters?.category]);

  const { data } = useQuery({
    queryKey,
    queryFn: () => fetchComplex(params),
  });

  return <div>{data?.result}</div>;
}

// ✅ SOLUTION: Normalize query keys
function normalizeQueryKey(key: unknown[]): unknown[] {
  return key.map(item => {
    if (typeof item === 'object' && item !== null) {
      // Sort object keys for stability
      return Object.keys(item)
        .sort()
        .reduce((acc, k) => {
          acc[k] = item[k];
          return acc;
        }, {} as Record<string, unknown>);
    }
    return item;
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use version numbers</strong> - Track update order for concurrent updates</li>
            <li><strong>Queue mutations</strong> - Process mutations sequentially when needed</li>
            <li><strong>Invalidate at right time</strong> - Use onSettled for guaranteed timing</li>
            <li><strong>Use stable query keys</strong> - Prevent unnecessary refetches</li>
            <li><strong>Serialize complex keys</strong> - Use primitives in query keys</li>
            <li><strong>Use query key factories</strong> - Ensure consistency and type safety</li>
            <li><strong>Handle conflicts gracefully</strong> - Provide rollback mechanisms</li>
            <li><strong>Test edge cases</strong> - Verify behavior under concurrent updates</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 19: Edge Cases & Gotchas
          and the entire React Query learning platform! You now understand common pitfalls,
          advanced edge cases, and how to handle them. You've mastered React Query completely!
        </p>
      </div>
    </LessonLayout>
  );
}

