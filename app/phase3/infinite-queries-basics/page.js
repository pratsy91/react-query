import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function InfiniteQueriesBasicsPage() {
  return (
    <LessonLayout
      title="3.3 Infinite Queries & Pagination - Part 1: Basics"
      description="Learn how to use useInfiniteQuery for paginated data and infinite scrolling"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What are Infinite Queries?</h2>
        <p className="text-gray-700 mb-4">
          Infinite queries are used for paginated data that can be loaded incrementally. They're perfect
          for infinite scroll implementations, "load more" buttons, and any scenario where you need to
          fetch data in pages.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Automatic pagination</strong> - Manages page parameters automatically</li>
            <li><strong>Incremental loading</strong> - Loads pages one at a time</li>
            <li><strong>Data accumulation</strong> - Keeps all loaded pages in cache</li>
            <li><strong>Bidirectional</strong> - Supports both forward and backward pagination</li>
            <li><strong>Infinite scroll ready</strong> - Perfect for infinite scroll UIs</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useInfiniteQuery Example"
          code={`import { useInfiniteQuery } from '@tanstack/react-query';

function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Return next page param, or undefined if no more pages
      return lastPage.hasMore ? allPages.length : undefined;
    },
  });

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error loading posts</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">useInfiniteQuery Hook</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code> hook works similarly
          to <code className="bg-gray-100 px-1 rounded">useQuery</code>, but is designed for paginated data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Structure</h3>
        <CodeBlock
          title="Infinite Query Result Structure"
          code={`const {
  // Data structure
  data,                    // { pages: [...], pageParams: [...] }
  data.pages,              // Array of all loaded pages
  data.pageParams,         // Array of page parameters used
  
  // Status flags (same as useQuery)
  status,
  isPending,
  isError,
  isSuccess,
  isLoading,
  isFetching,
  
  // Pagination functions
  fetchNextPage,           // Load next page
  fetchPreviousPage,        // Load previous page (if enabled)
  
  // Pagination state
  hasNextPage,              // Boolean - more pages available?
  hasPreviousPage,          // Boolean - previous pages available?
  isFetchingNextPage,       // Boolean - currently fetching next?
  isFetchingPreviousPage,   // Boolean - currently fetching previous?
  
  // Standard query properties
  error,
  refetch,
  remove,
} = useInfiniteQuery({...});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryKey - Query Key</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryKey</code> works the same as in regular
          queries, but it identifies the entire infinite query, not individual pages.
        </p>

        <CodeBlock
          title="Query Key Examples"
          code={`// Simple key
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

// Key with parameters
useInfiniteQuery({
  queryKey: ['posts', userId],
  queryFn: ({ pageParam }) => fetchUserPosts(userId, pageParam),
});

// Key with filters
useInfiniteQuery({
  queryKey: ['posts', { status: 'published', category: 'tech' }],
  queryFn: ({ pageParam }) => fetchFilteredPosts({ status: 'published', category: 'tech' }, pageParam),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryFn - Query Function with pageParam</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">queryFn</code> receives a context object
          that includes <code className="bg-gray-100 px-1 rounded">pageParam</code>, which is the
          parameter for the current page.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic pageParam Usage</h3>
        <CodeBlock
          title="Using pageParam in Query Function"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => {
    // pageParam is the value returned by getNextPageParam
    // For first page, it's initialPageParam
    return fetch(\`/api/posts?page=\${pageParam}&limit=10\`)
      .then(res => res.json());
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.nextPage ?? undefined;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function Context</h3>
        <CodeBlock
          title="Full Query Function Context"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam, queryKey, signal, meta }) => {
    // pageParam - current page parameter
    // queryKey - the query key array
    // signal - AbortSignal for cancellation
    // meta - metadata
    
    return fetch(\`/api/posts?page=\${pageParam}\`, {
      signal, // Use for cancellation
    }).then(res => res.json());
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">getNextPageParam - Next Page Logic</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">getNextPageParam</code> function determines
          what parameter to use for the next page. Return <code className="bg-gray-100 px-1 rounded">undefined</code>
          when there are no more pages.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Offset-Based Pagination</h3>
        <CodeBlock
          title="Offset Pagination Example"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    // lastPage: the last page's data
    // allPages: array of all pages loaded so far
    
    // If last page has items, there might be more
    if (lastPage.posts.length === 0) {
      return undefined; // No more pages
    }
    
    // Return next offset (current offset + page size)
    return allPages.length * 10; // 10 items per page
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cursor-Based Pagination</h3>
        <CodeBlock
          title="Cursor Pagination Example"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: null, // Start with null cursor
  getNextPageParam: (lastPage) => {
    // Return next cursor from last page
    return lastPage.nextCursor ?? undefined;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Page Number Pagination</h3>
        <CodeBlock
          title="Page Number Example"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 1, // Start at page 1
  getNextPageParam: (lastPage, allPages) => {
    // Check if there are more pages
    if (lastPage.totalPages > allPages.length) {
      return allPages.length + 1; // Next page number
    }
    return undefined; // No more pages
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">getPreviousPageParam - Previous Page Logic</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">getPreviousPageParam</code> function enables
          backward pagination. It works similarly to <code className="bg-gray-100 px-1 rounded">getNextPageParam</code>.
        </p>

        <CodeBlock
          title="Bidirectional Pagination"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.nextPage ?? undefined;
  },
  getPreviousPageParam: (firstPage, allPages) => {
    // Enable loading previous pages
    return firstPage.previousPage ?? undefined;
  },
});

// Use fetchPreviousPage to load previous pages
const { fetchPreviousPage, hasPreviousPage } = useInfiniteQuery({...});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">initialPageParam - Initial Page Parameter</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">initialPageParam</code> is the value used
          for the first page. It's required and should match the type expected by your API.
        </p>

        <CodeBlock
          title="Initial Page Param Examples"
          code={`// Number (page number or offset)
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0, // or 1 for page numbers
  getNextPageParam: (lastPage, allPages) => allPages.length,
});

// String (cursor)
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: '', // Empty string cursor
  getNextPageParam: (lastPage) => lastPage.cursor,
});

// Null (for APIs that use null for first page)
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Object (complex pagination)
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: { page: 1, limit: 10 },
  getNextPageParam: (lastPage, allPages) => ({
    page: allPages.length + 1,
    limit: 10,
  }),
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">maxPages - Maximum Pages</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">maxPages</code> option limits the number
          of pages kept in memory. Older pages are removed when the limit is exceeded.
        </p>

        <CodeBlock
          title="Limiting Pages in Memory"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => allPages.length,
  maxPages: 5, // Keep only last 5 pages in memory
  
  // When 6th page is loaded, 1st page is removed
  // This helps with memory management for large datasets
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Standard Query Options</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code> supports all the same
          options as <code className="bg-gray-100 px-1 rounded">useQuery</code>.
        </p>

        <CodeBlock
          title="All Standard Options Available"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
  
  // All standard useQuery options work here
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
  retry: 3,
  retryDelay: 1000,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  enabled: true,
  select: (data) => {
    // Transform the data structure
    return {
      ...data,
      pages: data.pages.map(page => page.posts),
    };
  },
  placeholderData: (previousData) => previousData,
  initialData: {
    pages: [initialPage],
    pageParams: [0],
  },
  // ... all other useQuery options
});`}
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Continue:</strong> In the next lesson, we'll cover <code className="bg-white px-1 rounded">fetchNextPage</code>,
          <code className="bg-white px-1 rounded">fetchPreviousPage</code>, pagination state properties, and
          implementation patterns for infinite scroll.
        </p>
      </div>
    </LessonLayout>
  );
}

