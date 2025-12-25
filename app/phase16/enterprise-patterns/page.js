import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function EnterprisePatternsPage() {
  return (
    <LessonLayout
      title="16.3 Enterprise Patterns"
      description="Learn enterprise patterns: authentication flows, permission-based queries, multi-tenant data, data synchronization, and conflict resolution"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Enterprise Patterns</h2>
        <p className="text-gray-700 mb-4">
          Enterprise applications require sophisticated patterns for security, multi-tenancy,
          and data consistency. These patterns address complex real-world requirements.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Enterprise Patterns:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Authentication flows</li>
            <li>Permission-based queries</li>
            <li>Multi-tenant data</li>
            <li>Data synchronization</li>
            <li>Conflict resolution</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Authentication Flows</h2>
        <p className="text-gray-700 mb-4">
          Authentication flows require managing user state, tokens, and protected queries.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Auth with React Query</h3>
        <CodeBlock
          title="Authentication Flow Pattern"
          code={`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Get current user
function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => fetch('/api/auth/me').then(r => r.json()),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Login mutation
function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) =>
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }).then(r => r.json()),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.token);
      // Update user query
      queryClient.setQueryData(['auth', 'user'], data.user);
      // Invalidate protected queries
      queryClient.invalidateQueries();
    },
  });
}

// Logout mutation
function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetch('/api/auth/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      // Remove token
      localStorage.removeItem('token');
      // Clear user data
      queryClient.setQueryData(['auth', 'user'], null);
      // Clear all queries
      queryClient.clear();
    },
  });
}

// Usage
function AuthProvider({ children }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Permission-Based Queries</h2>
        <p className="text-gray-700 mb-4">
          Control query execution based on user permissions and roles.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Permission-Aware Queries</h3>
        <CodeBlock
          title="Permission-Based Query Pattern"
          code={`function usePermissionBasedQuery(queryKey, queryFn, requiredPermission) {
  const { data: user } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => fetch('/api/auth/me').then(r => r.json()),
  });

  const hasPermission = user?.permissions?.includes(requiredPermission);

  return useQuery({
    queryKey,
    queryFn,
    enabled: hasPermission, // Only fetch if user has permission
  });
}

// Usage
function AdminPanel() {
  const { data: adminData } = usePermissionBasedQuery(
    ['admin', 'data'],
    () => fetch('/api/admin/data').then(r => r.json()),
    'admin:read'
  );

  // Query won't execute if user doesn't have permission
  if (!adminData) {
    return <div>Access denied</div>;
  }

  return <div>{/* Admin content */}</div>;
}

// Alternative: Check permissions in query function
function useSecureQuery(queryKey, queryFn, requiredPermission) {
  const { data: user } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => fetch('/api/auth/me').then(r => r.json()),
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Check permission before fetching
      if (!user?.permissions?.includes(requiredPermission)) {
        throw new Error('Permission denied');
      }
      return queryFn();
    },
    enabled: !!user,
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Multi-Tenant Data</h2>
        <p className="text-gray-700 mb-4">
          Multi-tenant applications isolate data by tenant. Queries must include tenant context.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Tenant-Aware Queries</h3>
        <CodeBlock
          title="Multi-Tenant Pattern"
          code={`function useTenant() {
  return useQuery({
    queryKey: ['auth', 'tenant'],
    queryFn: () => fetch('/api/auth/tenant').then(r => r.json()),
    staleTime: Infinity, // Tenant doesn't change often
  });
}

function useTenantAwareQuery(queryKey, queryFn) {
  const { data: tenant } = useTenant();

  return useQuery({
    queryKey: [...queryKey, tenant?.id],
    queryFn: () => queryFn(tenant?.id),
    enabled: !!tenant,
  });
}

// Usage
function TenantPosts() {
  const { data: posts } = useTenantAwareQuery(
    ['posts'],
    (tenantId) => fetch(\`/api/tenants/\${tenantId}/posts\`).then(r => r.json())
  );

  return <div>{posts?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}

// Query key factory for tenant-aware queries
const tenantKeys = {
  all: (tenantId) => ['tenants', tenantId] as const,
  posts: (tenantId) => [...tenantKeys.all(tenantId), 'posts'] as const,
  post: (tenantId, postId) => [...tenantKeys.posts(tenantId), postId] as const,
};

// Usage with factory
function useTenantPost(tenantId, postId) {
  return useQuery({
    queryKey: tenantKeys.post(tenantId, postId),
    queryFn: () => fetch(\`/api/tenants/\${tenantId}/posts/\${postId}\`).then(r => r.json()),
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Synchronization</h2>
        <p className="text-gray-700 mb-4">
          Synchronize data across multiple clients, devices, or sessions while maintaining consistency.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Synchronization Pattern</h3>
        <CodeBlock
          title="Data Synchronization with React Query"
          code={`import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

function useDataSynchronization() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // WebSocket for real-time sync
    const ws = new WebSocket('ws://localhost:8080/sync');

    ws.onmessage = (event) => {
      const { type, data, queryKey } = JSON.parse(event.data);

      switch (type) {
        case 'UPDATE':
          // Update query cache
          queryClient.setQueryData(queryKey, data);
          break;
        case 'INVALIDATE':
          // Invalidate query
          queryClient.invalidateQueries({ queryKey });
          break;
        case 'REMOVE':
          // Remove query
          queryClient.removeQueries({ queryKey });
          break;
      }
    };

    return () => ws.close();
  }, [queryClient]);
}

// Sync with server timestamp
function useSyncedQuery(queryKey, queryFn) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    refetchInterval: 30000, // Sync every 30 seconds
  });

  // Check for updates
  useEffect(() => {
    const checkSync = async () => {
      const localData = queryClient.getQueryData(queryKey);
      const serverTimestamp = await fetch(\`/api/sync/timestamp?\${queryKey.join('=')}\`)
        .then(r => r.json());

      if (localData?.timestamp < serverTimestamp) {
        queryClient.invalidateQueries({ queryKey });
      }
    };

    const interval = setInterval(checkSync, 30000);
    return () => clearInterval(interval);
  }, [queryKey, queryClient]);

  return query;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Conflict Resolution</h2>
        <p className="text-gray-700 mb-4">
          Handle conflicts when multiple users edit the same data simultaneously.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Optimistic Updates with Conflict Handling</h3>
        <CodeBlock
          title="Conflict Resolution Pattern"
          code={`function useConflictAwareMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        return await updateData(data);
      } catch (error) {
        if (error.status === 409) { // Conflict
          // Get server version
          const serverVersion = await fetchLatest(data.id);
          throw { ...error, serverVersion, localVersion: data };
        }
        throw error;
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['data', newData.id]);
      const previousData = queryClient.getQueryData(['data', newData.id]);
      
      // Optimistically update
      queryClient.setQueryData(['data', newData.id], newData);
      
      return { previousData };
    },
    onError: (error, newData, context) => {
      if (error.status === 409) {
        // Conflict detected - show resolution UI
        queryClient.setQueryData(['data', 'conflict', newData.id], {
          local: newData,
          server: error.serverVersion,
        });
      } else {
        // Rollback on other errors
        if (context?.previousData) {
          queryClient.setQueryData(['data', newData.id], context.previousData);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
    },
  });
}

// Conflict resolution component
function ConflictResolver({ conflictId }) {
  const conflict = useQuery({
    queryKey: ['data', 'conflict', conflictId],
    queryFn: () => queryClient.getQueryData(['data', 'conflict', conflictId]),
  });

  const resolveMutation = useMutation({
    mutationFn: (resolvedData) => updateData(resolvedData),
    onSuccess: () => {
      queryClient.removeQueries(['data', 'conflict', conflictId]);
      queryClient.invalidateQueries(['data', conflictId]);
    },
  });

  if (!conflict.data) return null;

  return (
    <div>
      <h3>Conflict Detected</h3>
      <div>Local: {JSON.stringify(conflict.data.local)}</div>
      <div>Server: {JSON.stringify(conflict.data.server)}</div>
      <button onClick={() => resolveMutation.mutate(conflict.data.local)}>
        Use Local
      </button>
      <button onClick={() => resolveMutation.mutate(conflict.data.server)}>
        Use Server
      </button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Last Write Wins Strategy</h3>
        <CodeBlock
          title="Simple Conflict Resolution"
          code={`function useLastWriteWinsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        return await updateData(data);
      } catch (error) {
        if (error.status === 409) {
          // Conflict - get latest and overwrite
          const latest = await fetchLatest(data.id);
          return await updateData({ ...latest, ...data, version: latest.version + 1 });
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['data', data.id], data);
      queryClient.invalidateQueries(['data']);
    },
  });
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Secure authentication</strong> - Store tokens securely</li>
            <li><strong>Check permissions</strong> - Verify before querying</li>
            <li><strong>Isolate tenant data</strong> - Always include tenant in query keys</li>
            <li><strong>Handle conflicts gracefully</strong> - Provide resolution UI</li>
            <li><strong>Sync efficiently</strong> - Use timestamps or WebSocket</li>
            <li><strong>Invalidate appropriately</strong> - Update related queries</li>
            <li><strong>Handle errors</strong> - Provide fallbacks and retries</li>
            <li><strong>Monitor sync status</strong> - Show sync indicators</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 16: Real-World Scenarios and
          the entire React Query learning platform! You now understand common patterns, complex
          scenarios, and enterprise patterns. You've mastered React Query for real-world applications!
        </p>
      </div>
    </LessonLayout>
  );
}

