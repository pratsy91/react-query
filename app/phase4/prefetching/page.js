import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function PrefetchingPage() {
  return (
    <LessonLayout
      title="4.3 Prefetching"
      description="Learn how to prefetch data before it's needed to improve perceived performance and user experience"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Prefetching?</h2>
        <p className="text-gray-700 mb-4">
          Prefetching is the practice of fetching data before it's actually needed. This improves
          perceived performance by having data ready when users navigate to a page or interact with
          an element.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Faster navigation</strong> - Data is ready when user arrives</li>
            <li><strong>Better UX</strong> - No loading spinners on navigation</li>
            <li><strong>Reduced perceived latency</strong> - App feels more responsive</li>
            <li><strong>Predictive loading</strong> - Load data user is likely to need</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Prefetching Example"
          code={`import { useQueryClient } from '@tanstack/react-query';

function UserLink({ userId }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // Prefetch user data on hover
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <a 
      href={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
    >
      User {userId}
    </a>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">prefetchQuery</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">prefetchQuery</code> method fetches and
          caches data without subscribing to it. The data is available immediately when a component
          uses the query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic prefetchQuery Usage</h3>
        <CodeBlock
          title="Simple Prefetching"
          code={`import { useQueryClient } from '@tanstack/react-query';

function PrefetchButton({ userId }) {
  const queryClient = useQueryClient();
  
  const handlePrefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
    
    // Data is now in cache and ready to use
    console.log('User prefetched!');
  };
  
  return <button onClick={handlePrefetch}>Prefetch User</button>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Prefetch with Options</h3>
        <CodeBlock
          title="Prefetch Configuration"
          code={`queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  
  // All standard query options are available
  staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  retry: 2,
  retryDelay: 1000,
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Conditional Prefetching</h3>
        <CodeBlock
          title="Only Prefetch if Not in Cache"
          code={`function SmartPrefetch({ userId }) {
  const queryClient = useQueryClient();
  
  const handlePrefetch = async () => {
    // Check if data already exists
    const cachedData = queryClient.getQueryData(['user', userId]);
    
    if (!cachedData) {
      // Only prefetch if not already cached
      await queryClient.prefetchQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      });
    }
  };
  
  return <button onClick={handlePrefetch}>Prefetch</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">prefetchInfiniteQuery</h2>
        <p className="text-gray-700 mb-4">
          Similar to <code className="bg-gray-100 px-1 rounded">prefetchQuery</code>, but for
          infinite queries. Prefetches the first page of paginated data.
        </p>

        <CodeBlock
          title="Prefetching Infinite Queries"
          code={`import { useQueryClient } from '@tanstack/react-query';

function PrefetchPosts({ userId }) {
  const queryClient = useQueryClient();
  
  const handlePrefetch = async () => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['posts', userId],
      queryFn: ({ pageParam = 0 }) => fetchUserPosts(userId, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasMore ? allPages.length : undefined;
      },
    });
    
    // First page of posts is now cached
  };
  
  return <button onClick={handlePrefetch}>Prefetch Posts</button>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">ensureQueryData</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">ensureQueryData</code> method ensures data
          exists in cache, fetching it if it doesn't exist or is stale. It's similar to prefetchQuery
          but guarantees data availability.
        </p>

        <CodeBlock
          title="Ensuring Data Exists"
          code={`import { useQueryClient } from '@tanstack/react-query';

async function loadUserData(userId) {
  const queryClient = useQueryClient();
  
  // Ensure data exists - fetch if needed
  const userData = await queryClient.ensureQueryData({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  // userData is guaranteed to exist (not undefined)
  return userData;
}

// Use in route loaders (React Router)
async function userLoader({ params }) {
  const queryClient = new QueryClient();
  
  const user = await queryClient.ensureQueryData({
    queryKey: ['user', params.userId],
    queryFn: () => fetchUser(params.userId),
  });
  
  return { user };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prefetching on Hover</h2>
        <p className="text-gray-700 mb-4">
          Prefetching on hover is a common pattern for links and interactive elements. Data is fetched
          when the user hovers, so it's ready when they click.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Link Prefetching</h3>
        <CodeBlock
          title="Prefetch on Link Hover"
          code={`import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function UserLink({ userId, userName }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // Prefetch when user hovers over link
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <Link
      to={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
    >
      {userName}
    </Link>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Debounced Hover Prefetching</h3>
        <CodeBlock
          title="Prevent Excessive Prefetching"
          code={`import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

function UserLink({ userId }) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef();
  
  const handleMouseEnter = () => {
    // Debounce prefetch - only after 200ms of hover
    timeoutRef.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
      });
    }, 200);
  };
  
  const handleMouseLeave = () => {
    // Cancel prefetch if user moves mouse away
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  return (
    <a
      href={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      User {userId}
    </a>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prefetching on Route Change</h2>
        <p className="text-gray-700 mb-4">
          Prefetch data when navigation is about to happen, making the next page load instantly.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">React Router Integration</h3>
        <CodeBlock
          title="Prefetch Before Navigation"
          code={`import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function UserCard({ userId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const handleClick = async () => {
    // Prefetch before navigation
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
    
    // Navigate after prefetch completes
    navigate(\`/users/\${userId}\`);
  };
  
  return (
    <div onClick={handleClick}>
      User {userId}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Next.js Integration</h3>
        <CodeBlock
          title="Prefetch in Next.js"
          code={`import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

function UserLink({ userId }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const handleMouseEnter = () => {
    // Prefetch both Next.js route and query data
    router.prefetch(\`/users/\${userId}\`);
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <Link
      href={\`/users/\${userId}\`}
      onMouseEnter={handleMouseEnter}
    >
      User {userId}
    </Link>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prefetching Strategies</h2>
        <p className="text-gray-700 mb-4">
          Different strategies for when and how to prefetch data based on user behavior and application needs.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 1: Predictive Prefetching</h3>
        <CodeBlock
          title="Prefetch Based on User Patterns"
          code={`function PredictivePrefetch({ userId }) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch likely next pages based on user behavior
    const likelyNextPages = [userId + 1, userId + 2];
    
    likelyNextPages.forEach(nextUserId => {
      queryClient.prefetchQuery({
        queryKey: ['user', nextUserId],
        queryFn: () => fetchUser(nextUserId),
      });
    });
  }, [userId, queryClient]);
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 2: Prefetch Next Page</h3>
        <CodeBlock
          title="Prefetch Next Page in Pagination"
          code={`function PostList({ currentPage }) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch next page
    queryClient.prefetchQuery({
      queryKey: ['posts', currentPage + 1],
      queryFn: () => fetchPosts(currentPage + 1),
    });
  }, [currentPage, queryClient]);
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 3: Prefetch Related Data</h3>
        <CodeBlock
          title="Prefetch Related Queries"
          code={`function UserProfile({ userId }) {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  useEffect(() => {
    if (user) {
      // Prefetch related data when user loads
      queryClient.prefetchQuery({
        queryKey: ['posts', userId],
        queryFn: () => fetchUserPosts(userId),
      });
      
      queryClient.prefetchQuery({
        queryKey: ['followers', userId],
        queryFn: () => fetchFollowers(userId),
      });
    }
  }, [user, userId, queryClient]);
  
  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Strategy 4: Prefetch on Visibility</h3>
        <CodeBlock
          title="Prefetch When Element Becomes Visible"
          code={`import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function PrefetchOnVisible({ userId }) {
  const queryClient = useQueryClient();
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Prefetch when element becomes visible
          queryClient.prefetchQuery({
            queryKey: ['user', userId],
            queryFn: () => fetchUser(userId),
          });
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [userId, queryClient]);
  
  return <div ref={ref}>User {userId}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Prefetch on user intent</strong> - Hover, click, navigation signals</li>
            <li><strong>Debounce hover events</strong> - Prevent excessive prefetching</li>
            <li><strong>Check cache first</strong> - Don't prefetch if data already exists</li>
            <li><strong>Limit concurrent prefetches</strong> - Don't overwhelm the server</li>
            <li><strong>Prefetch strategically</strong> - Only prefetch likely-needed data</li>
            <li><strong>Use appropriate staleTime</strong> - Keep prefetched data fresh</li>
            <li><strong>Cancel on unmount</strong> - Clean up prefetch requests</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">4.4 Background Refetching</strong>
          to keep data fresh automatically with background updates.
        </p>
      </div>
    </LessonLayout>
  );
}

