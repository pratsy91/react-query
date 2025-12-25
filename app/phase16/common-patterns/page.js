import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CommonPatternsPage() {
  return (
    <LessonLayout
      title="16.1 Common Patterns"
      description="Learn common real-world patterns: CRUD operations, search with debouncing, filtering and sorting, real-time updates, polling, and WebSocket integration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Real-World Patterns</h2>
        <p className="text-gray-700 mb-4">
          These patterns appear frequently in real applications. Understanding them helps you
          build robust, user-friendly features with React Query.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Common Patterns:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>CRUD operations</li>
            <li>Search with debouncing</li>
            <li>Filtering and sorting</li>
            <li>Real-time updates</li>
            <li>Polling</li>
            <li>WebSocket integration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">CRUD Operations</h2>
        <p className="text-gray-700 mb-4">
          CRUD (Create, Read, Update, Delete) operations are fundamental. Here's how to implement
          them with React Query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complete CRUD Example</h3>
        <CodeBlock
          title="Full CRUD Implementation"
          code={`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Read: Fetch list
function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });
}

// Create: Add new post
function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => 
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Update: Edit post
function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetch(\`/api/posts/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: (data) => {
      queryClient.setQueryData(['post', data.id], data);
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Delete: Remove post
function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) =>
      fetch(\`/api/posts/\${id}\`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.removeQueries(['post', id]);
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Usage
function PostsList() {
  const { data: posts } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  return (
    <div>
      <button onClick={() => createPost.mutate({ title: 'New Post' })}>
        Create
      </button>
      {posts?.map(post => (
        <div key={post.id}>
          <span>{post.title}</span>
          <button onClick={() => updatePost.mutate({ id: post.id, title: 'Updated' })}>
            Update
          </button>
          <button onClick={() => deletePost.mutate(post.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Search with Debouncing</h2>
        <p className="text-gray-700 mb-4">
          Debouncing search queries prevents excessive API calls while users type.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Debounced Search Hook</h3>
        <CodeBlock
          title="Search with Debouncing"
          code={`import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useSearch(query) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => 
      fetch(\`/api/search?q=\${debouncedQuery}\`).then(r => r.json()),
    enabled: debouncedQuery.length > 0,
  });
}

// Usage
function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results, isLoading } = useSearch(searchQuery);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <div>Searching...</div>}
      {results?.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Filtering and Sorting</h2>
        <p className="text-gray-700 mb-4">
          Implement filtering and sorting with React Query, handling both client-side and
          server-side approaches.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Server-Side Filtering</h3>
        <CodeBlock
          title="Filtering with Query Keys"
          code={`function useFilteredPosts(filters) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => 
      fetch(\`/api/posts?\${new URLSearchParams(filters)}\`).then(r => r.json()),
  });
}

// Usage
function PostsList() {
  const [filters, setFilters] = useState({
    status: 'published',
    category: 'tech',
    sort: 'date',
  });

  const { data: posts } = useFilteredPosts(filters);

  return (
    <div>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Client-Side Filtering</h3>
        <CodeBlock
          title="Filtering with select"
          code={`function useFilteredPosts(filters) {
  const { data: allPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  const filteredPosts = useQuery({
    queryKey: ['posts', 'filtered', filters],
    queryFn: () => allPosts,
    enabled: !!allPosts,
    select: (data) => {
      return data
        .filter(post => {
          if (filters.status && post.status !== filters.status) return false;
          if (filters.category && post.category !== filters.category) return false;
          return true;
        })
        .sort((a, b) => {
          if (filters.sort === 'date') {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.title.localeCompare(b.title);
        });
    },
  });

  return filteredPosts;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Real-Time Updates</h2>
        <p className="text-gray-700 mb-4">
          Keep data fresh with real-time updates using polling or WebSocket integration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Polling Pattern</h3>
        <CodeBlock
          title="Real-Time Updates with Polling"
          code={`function useRealtimePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true, // Continue polling in background
  });
}

// Conditional polling
function useRealtimePosts(enabled) {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    refetchInterval: enabled ? 5000 : false,
  });
}

// Usage
function PostsList() {
  const [isRealtime, setIsRealtime] = useState(true);
  const { data: posts } = useRealtimePosts(isRealtime);

  return (
    <div>
      <button onClick={() => setIsRealtime(!isRealtime)}>
        {isRealtime ? 'Stop' : 'Start'} Real-time
      </button>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">WebSocket Integration</h2>
        <p className="text-gray-700 mb-4">
          Integrate WebSocket connections with React Query for true real-time updates.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">WebSocket Hook</h3>
        <CodeBlock
          title="WebSocket with React Query"
          code={`import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function useWebSocket(url) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update query cache when message received
      if (data.type === 'post_created') {
        queryClient.setQueryData(['posts'], (old) => [data.post, ...old]);
      } else if (data.type === 'post_updated') {
        queryClient.setQueryData(['post', data.post.id], data.post);
        queryClient.invalidateQueries(['posts']);
      } else if (data.type === 'post_deleted') {
        queryClient.removeQueries(['post', data.postId]);
        queryClient.invalidateQueries(['posts']);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url, queryClient]);
}

// Usage
function PostsList() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  useWebSocket('ws://localhost:8080/posts');

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use optimistic updates</strong> - Better UX for CRUD operations</li>
            <li><strong>Debounce search</strong> - Reduce API calls</li>
            <li><strong>Cache filtered results</strong> - Use query keys for filters</li>
            <li><strong>Poll wisely</strong> - Don't poll too frequently</li>
            <li><strong>Handle WebSocket errors</strong> - Reconnect on failure</li>
            <li><strong>Invalidate appropriately</strong> - Update related queries</li>
            <li><strong>Use select for filtering</strong> - When data is small</li>
            <li><strong>Server-side filtering</strong> - For large datasets</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">16.2 Complex Scenarios</strong>
          for multi-step forms, wizard patterns, dependent dropdowns, master-detail views, dashboard aggregation, and report generation.
        </p>
      </div>
    </LessonLayout>
  );
}

