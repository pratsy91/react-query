import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseSuspenseInfiniteQueryPage() {
  return (
    <LessonLayout
      title="5.6 useSuspenseInfiniteQuery (v5+)"
      description="Learn how to use useSuspenseInfiniteQuery for Suspense integration with infinite queries and pagination"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useSuspenseInfiniteQuery?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useSuspenseInfiniteQuery</code> hook (v5+)
          is a Suspense-enabled version of <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code>.
          It suspends the component while loading the first page, then allows incremental loading of
          additional pages.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This hook is only available in TanStack Query v5+.
          </p>
        </div>

        <CodeBlock
          title="Basic useSuspenseInfiniteQuery Usage"
          code={`import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
  });
  
  // First page data is guaranteed to be available
  const allPosts = data.pages.flatMap(page => page.posts);
  
  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <PostList />
    </Suspense>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Suspense with Infinite Queries</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseInfiniteQuery</code> suspends on
          initial load, but subsequent pages load without suspending.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Initial Load Suspension</h3>
        <CodeBlock
          title="First Page Suspends"
          code={`function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  
  // Component suspends until first page loads
  // After that, data.pages is guaranteed to have at least one page
  
  const firstPage = data.pages[0];
  
  return (
    <div>
      {firstPage.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Subsequent Pages Don't Suspend</h3>
        <CodeBlock
          title="Incremental Loading"
          code={`function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  
  // First page suspends, subsequent pages use isFetchingNextPage
  const allPosts = data.pages.flatMap(page => page.posts);
  
  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Implementation Patterns</h2>
        <p className="text-gray-700 mb-4">
          Common patterns for using <code className="bg-gray-100 px-1 rounded">useSuspenseInfiniteQuery</code>
          in real applications.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Infinite Scroll</h3>
        <CodeBlock
          title="Infinite Scroll with Suspense"
          code={`import { useEffect, useRef } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

function InfiniteScrollList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  
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
  
  const allPosts = data.pages.flatMap(page => page.posts);
  
  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <div ref={loadMoreRef} style={{ height: '20px' }} />
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <InfiniteScrollList />
    </Suspense>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Load More Button</h3>
        <CodeBlock
          title="Manual Load More"
          code={`function LoadMoreList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  
  const allPosts = data.pages.flatMap(page => page.posts);
  
  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
        </button>
      )}
      
      {!hasNextPage && <div>No more posts</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Error Boundaries</h3>
        <CodeBlock
          title="Error Handling with Suspense"
          code={`import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Failed to load posts</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function PostList() {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });
  
  const allPosts = data.pages.flatMap(page => page.posts);
  
  return (
    <div>
      {allPosts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <PostList />
      </Suspense>
    </ErrorBoundary>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">All Infinite Query Options</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useSuspenseInfiniteQuery</code> supports all
          the same options as <code className="bg-gray-100 px-1 rounded">useInfiniteQuery</code>.
        </p>

        <CodeBlock
          title="Available Options"
          code={`const {
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
} = useSuspenseInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => allPages.length,
  getPreviousPageParam: (firstPage, allPages) => allPages.length > 1 ? allPages.length - 2 : undefined,
  maxPages: 5,
  
  // All standard query options
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
  retry: 3,
  refetchOnWindowFocus: true,
  // ... all other options
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Wrap with Suspense</strong> - Required for initial load</li>
            <li><strong>Use Error Boundaries</strong> - Catch errors from queries</li>
            <li><strong>Handle subsequent pages</strong> - Use isFetchingNextPage for loading states</li>
            <li><strong>Flatten pages</strong> - Use flatMap to combine all pages</li>
            <li><strong>Check hasNextPage</strong> - Before calling fetchNextPage</li>
            <li><strong>Provide good fallbacks</strong> - Meaningful loading UI</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.7 useSuspenseQueries (v5+)</strong>
          for Suspense integration with multiple parallel queries.
        </p>
      </div>
    </LessonLayout>
  );
}

