import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function InfiniteQueriesAdvancedPage() {
  return (
    <LessonLayout
      title="3.3 Infinite Queries & Pagination - Part 2: Advanced Usage & Implementation"
      description="Learn advanced infinite query patterns, pagination types, and infinite scroll implementation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">fetchNextPage & fetchPreviousPage</h2>
        <p className="text-gray-700 mb-4">
          These functions allow you to programmatically load the next or previous page of data.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">fetchNextPage</h3>
        <CodeBlock
          title="Loading Next Page"
          code={`function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      
      <button onClick={handleLoadMore} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">fetchPreviousPage</h3>
        <CodeBlock
          title="Loading Previous Page"
          code={`function PostList() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
    getPreviousPageParam: (firstPage, allPages) => allPages.length > 1 ? allPages.length - 2 : undefined,
  });

  return (
    <div>
      <button
        onClick={() => fetchPreviousPage()}
        disabled={!hasPreviousPage || isFetchingPreviousPage}
      >
        {isFetchingPreviousPage ? 'Loading...' : 'Load Previous'}
      </button>
      
      {/* Render pages */}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Pagination State Properties</h2>
        <p className="text-gray-700 mb-4">
          These properties help you understand the current state of pagination and control UI accordingly.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">hasNextPage & hasPreviousPage</h3>
        <CodeBlock
          title="Checking Page Availability"
          code={`const {
  hasNextPage,      // Boolean - more pages available?
  hasPreviousPage,  // Boolean - previous pages available?
} = useInfiniteQuery({...});

// Use to enable/disable buttons
<button disabled={!hasNextPage}>Load More</button>
<button disabled={!hasPreviousPage}>Load Previous</button>

// Use to show/hide UI elements
{hasNextPage && <div>More content available</div>}
{!hasNextPage && <div>No more content</div>}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">isFetchingNextPage & isFetchingPreviousPage</h3>
        <CodeBlock
          title="Loading State Indicators"
          code={`const {
  isFetchingNextPage,      // Boolean - currently loading next?
  isFetchingPreviousPage,  // Boolean - currently loading previous?
} = useInfiniteQuery({...});

// Show loading indicators
{isFetchingNextPage && <div>Loading more...</div>}
{isFetchingPreviousPage && <div>Loading previous...</div>}

// Disable buttons while loading
<button disabled={isFetchingNextPage}>
  {isFetchingNextPage ? 'Loading...' : 'Load More'}
</button>`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Cursor-Based Pagination</h2>
        <p className="text-gray-700 mb-4">
          Cursor-based pagination uses a cursor (usually an ID or timestamp) to fetch the next page.
          It's more efficient than offset-based pagination for large datasets.
        </p>

        <CodeBlock
          title="Cursor Pagination Implementation"
          code={`function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => {
      // pageParam is the cursor (ID of last item)
      return fetch(\`/api/posts?cursor=\${pageParam || ''}\`)
        .then(res => res.json());
    },
    initialPageParam: null, // Start with null (no cursor)
    getNextPageParam: (lastPage) => {
      // Return cursor of last item, or undefined if no more
      return lastPage.nextCursor ?? undefined;
    },
  });

  // Flatten all pages into single array
  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load More
      </button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cursor with Timestamp</h3>
        <CodeBlock
          title="Timestamp-Based Cursor"
          code={`useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => {
    // pageParam is timestamp
    return fetch(\`/api/posts?before=\${pageParam || Date.now()}\`)
      .then(res => res.json());
  },
  initialPageParam: Date.now(),
  getNextPageParam: (lastPage) => {
    // Use timestamp of last post
    const lastPost = lastPage.posts[lastPage.posts.length - 1];
    return lastPost ? lastPost.createdAt : undefined;
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Offset-Based Pagination</h2>
        <p className="text-gray-700 mb-4">
          Offset-based pagination uses a numeric offset to skip a certain number of items. Simpler
          but less efficient for large datasets.
        </p>

        <CodeBlock
          title="Offset Pagination Implementation"
          code={`function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => {
      // pageParam is the offset
      return fetch(\`/api/posts?offset=\${pageParam}&limit=20\`)
        .then(res => res.json());
    },
    initialPageParam: 0, // Start at offset 0
    getNextPageParam: (lastPage, allPages) => {
      // If last page has items, calculate next offset
      if (lastPage.posts.length === 0) {
        return undefined; // No more pages
      }
      
      // Next offset = number of pages * items per page
      return allPages.length * 20;
    },
  });

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load More
      </button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Infinite Scroll Implementation</h2>
        <p className="text-gray-700 mb-4">
          Infinite scroll automatically loads more content when the user scrolls near the bottom
          of the page.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Infinite Scroll</h3>
        <CodeBlock
          title="Scroll Detection"
          code={`import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  // Intersection Observer for scroll detection
  const loadMoreRef = useRef();

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {/* Invisible element to trigger load */}
      <div ref={loadMoreRef} style={{ height: '20px' }} />
      
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && <div>No more posts</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Scroll Event-Based</h3>
        <CodeBlock
          title="Window Scroll Detection"
          code={`function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled near bottom (within 200px)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      {isFetchingNextPage && <div>Loading...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Transformation</h2>
        <p className="text-gray-700 mb-4">
          You can transform the infinite query data structure using the <code className="bg-gray-100 px-1 rounded">select</code>
          option or by processing the data after fetching.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Flattening Pages</h3>
        <CodeBlock
          title="Convert Pages to Flat Array"
          code={`function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
    select: (data) => {
      // Transform pages array to flat array
      return data.pages.flatMap(page => page.posts);
    },
  });

  // Now data is a flat array instead of { pages: [...] }
  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Manual Flattening</h3>
        <CodeBlock
          title="Flatten in Component"
          code={`function PostList() {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  // Flatten manually
  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];
  const totalCount = data?.pages.reduce((sum, page) => sum + page.posts.length, 0) ?? 0;

  return (
    <div>
      <div>Total posts: {totalCount}</div>
      {allPosts.map(post => (
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
            <li><strong>Use maxPages</strong> - Limit memory usage for large datasets</li>
            <li><strong>Debounce scroll events</strong> - Prevent excessive API calls</li>
            <li><strong>Show loading indicators</strong> - Let users know more content is loading</li>
            <li><strong>Handle edge cases</strong> - Empty pages, no more data, errors</li>
            <li><strong>Use cursor pagination</strong> - More efficient for large datasets</li>
            <li><strong>Optimize query keys</strong> - Include filters in keys for proper caching</li>
            <li><strong>Consider prefetching</strong> - Load next page before user reaches bottom</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">3.4 Query Cancellation</strong>
          to cancel in-flight requests and handle cleanup properly.
        </p>
      </div>
    </LessonLayout>
  );
}

