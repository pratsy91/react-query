import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function DataTransformationPage() {
  return (
    <LessonLayout
      title="4.5 Data Transformation"
      description="Learn how to transform, normalize, and memoize data using the select option for optimal performance"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Data Transformation?</h2>
        <p className="text-gray-700 mb-4">
          Data transformation allows you to modify, filter, or compute values from query data before
          it's used in components. The <code className="bg-gray-100 px-1 rounded">select</code> option
          provides a powerful way to transform data while maintaining referential equality for performance.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Data normalization</strong> - Transform API responses to app format</li>
            <li><strong>Computed values</strong> - Derive values from raw data</li>
            <li><strong>Performance optimization</strong> - Prevent unnecessary re-renders</li>
            <li><strong>Data filtering</strong> - Select only needed fields</li>
            <li><strong>Memoization</strong> - Automatic memoization with select</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic select Usage"
          code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  // Without select - get full user object
  const { data: fullUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // data: { id: 1, name: 'John', email: 'john@example.com', posts: [...] }
  });

  // With select - transform data
  const { data: userName } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only get name
    // data: 'John'
    // Component only re-renders if user.name changes
  });

  return <div>{userName}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">select Option</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">select</code> option is a function that
          receives the query data and returns the transformed value. TanStack Query automatically
          memoizes the result.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic Selection</h3>
        <CodeBlock
          title="Selecting Specific Fields"
          code={`function UserCard({ userId }) {
  // Select single field
  const { data: userName } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });

  // Select multiple fields
  const { data: userInfo } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => ({
      name: user.name,
      email: user.email,
    }),
  });

  // Select nested field
  const { data: userEmail } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.profile?.email,
  });

  return <div>{userName}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Complex Transformations</h3>
        <CodeBlock
          title="Advanced Data Transformation"
          code={`function UserStats({ userId }) {
  const { data: stats } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => {
      // Complex transformation
      return {
        fullName: \`\${user.firstName} \${user.lastName}\`,
        postCount: user.posts?.length ?? 0,
        hasPosts: (user.posts?.length ?? 0) > 0,
        averageLikes: user.posts?.reduce((sum, p) => sum + p.likes, 0) / (user.posts?.length || 1),
        recentPosts: user.posts?.slice(0, 5) ?? [],
        isActive: user.lastActiveAt > Date.now() - 7 * 24 * 60 * 60 * 1000,
      };
    },
  });

  return (
    <div>
      <div>Name: {stats?.fullName}</div>
      <div>Posts: {stats?.postCount}</div>
      <div>Avg Likes: {stats?.averageLikes}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Computed Values</h2>
        <p className="text-gray-700 mb-4">
          Use <code className="bg-gray-100 px-1 rounded">select</code> to compute derived values
          from query data. These computed values are automatically memoized.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Aggregations</h3>
        <CodeBlock
          title="Compute Aggregated Values"
          code={`function PostStats({ userId }) {
  const { data: stats } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    select: (posts) => {
      return {
        total: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
        totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
        averageLikes: posts.length > 0 
          ? posts.reduce((sum, post) => sum + post.likes, 0) / posts.length 
          : 0,
        mostLiked: posts.reduce((max, post) => 
          post.likes > max.likes ? post : max, posts[0]
        ),
      };
    },
  });

  return (
    <div>
      <div>Total Posts: {stats?.total}</div>
      <div>Total Likes: {stats?.totalLikes}</div>
      <div>Average Likes: {stats?.averageLikes}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filtering and Sorting</h3>
        <CodeBlock
          title="Filter and Sort Data"
          code={`function FilteredPosts({ userId }) {
  const { data: recentPosts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    select: (posts) => {
      // Filter and sort
      return posts
        .filter(post => post.published)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10); // Top 10
    },
  });

  return (
    <div>
      {recentPosts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Data Normalization</h2>
        <p className="text-gray-700 mb-4">
          Normalize data from API responses to match your application's data structure. This makes
          data consistent and easier to work with.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">API Response Normalization</h3>
        <CodeBlock
          title="Normalize API Data Structure"
          code={`function NormalizedUser({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (apiResponse) => {
      // Transform API response to app format
      return {
        id: apiResponse.user_id, // snake_case to camelCase
        name: apiResponse.full_name,
        email: apiResponse.email_address,
        profile: {
          avatar: apiResponse.avatar_url,
          bio: apiResponse.biography,
        },
        // Normalize nested data
        posts: apiResponse.posts?.map(post => ({
          id: post.post_id,
          title: post.post_title,
          content: post.post_content,
          createdAt: new Date(post.created_at),
        })) ?? [],
      };
    },
  });

  return <div>{user?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Array Normalization</h3>
        <CodeBlock
          title="Normalize Arrays to Objects"
          code={`function NormalizedPosts() {
  const { data: postsMap } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    select: (posts) => {
      // Convert array to map for O(1) lookup
      return posts.reduce((map, post) => {
        map[post.id] = post;
        return map;
      }, {});
    },
  });

  // Now can access posts by ID: postsMap[postId]
  return <div>...</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Memoization with select</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">select</code> option automatically memoizes
          results. If the selected data hasn't changed, the same reference is returned, preventing
          unnecessary re-renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">How Memoization Works</h3>
        <CodeBlock
          title="Automatic Memoization"
          code={`function OptimizedComponent({ userId }) {
  // Without select - re-renders when ANY field changes
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  // Component re-renders if user.name, user.email, user.posts, etc. change

  // With select - only re-renders when selected field changes
  const { data: userName } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });
  // Component ONLY re-renders if user.name changes
  // If user.email changes but name doesn't, no re-render!

  return <div>{userName}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Preventing Unnecessary Re-renders</h3>
        <CodeBlock
          title="Optimize with select"
          code={`import { memo } from 'react';

// Component that only needs post count
const PostCount = memo(function PostCount({ userId }) {
  const { data: count } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    select: (posts) => posts.length, // Only re-render if count changes
  });

  console.log('PostCount rendered'); // Only logs when count changes
  return <div>Posts: {count}</div>;
});

// Component that needs post titles
const PostTitles = memo(function PostTitles({ userId }) {
  const { data: titles } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    select: (posts) => posts.map(p => p.title), // Only re-render if titles change
  });

  console.log('PostTitles rendered'); // Only logs when titles change
  return (
    <div>
      {titles?.map((title, i) => <div key={i}>{title}</div>)}
    </div>
  );
});

// Both components use same query but only re-render when their selected data changes
function UserPosts({ userId }) {
  return (
    <div>
      <PostCount userId={userId} />
      <PostTitles userId={userId} />
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Structural Sharing</h3>
        <CodeBlock
          title="Reference Equality with select"
          code={`function ReferenceEquality({ userId }) {
  const { data: userNames } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
    }),
  });

  useEffect(() => {
    // This effect only runs if userNames object reference changes
    // If firstName and lastName are the same, reference stays the same
    console.log('User names changed');
  }, [userNames]);

  return <div>{userNames?.firstName} {userNames?.lastName}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Multiple Selects</h3>
        <CodeBlock
          title="Multiple Transformations from Same Query"
          code={`function MultipleSelects({ userId }) {
  // Get different transformations from same query
  const { data: userName } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });

  const { data: postCount } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.posts?.length ?? 0,
  });

  const { data: isActive } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.lastActiveAt > Date.now() - 24 * 60 * 60 * 1000,
  });

  // Each select is memoized independently
  // Component only re-renders when specific selected value changes

  return (
    <div>
      <div>Name: {userName}</div>
      <div>Posts: {postCount}</div>
      <div>Active: {isActive ? 'Yes' : 'No'}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Conditional Transformation</h3>
        <CodeBlock
          title="Transform Based on Data State"
          code={`function ConditionalTransform({ userId }) {
  const { data: displayData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => {
      if (!user) return null;
      
      // Transform based on user role
      if (user.role === 'admin') {
        return {
          name: user.name,
          email: user.email,
          permissions: user.permissions,
          adminData: user.adminData,
        };
      }
      
      return {
        name: user.name,
        email: user.email,
      };
    },
  });

  return <div>{displayData?.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Chained Transformations</h3>
        <CodeBlock
          title="Complex Transformation Pipeline"
          code={`function ChainedTransform({ userId }) {
  const { data: processedData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => {
      // Chain multiple transformations
      return user.posts
        ?.filter(post => post.published) // Step 1: Filter
        .sort((a, b) => b.likes - a.likes) // Step 2: Sort
        .slice(0, 5) // Step 3: Limit
        .map(post => ({ // Step 4: Transform
          id: post.id,
          title: post.title,
          likeCount: post.likes,
          isPopular: post.likes > 100,
        })) ?? [];
    },
  });

  return (
    <div>
      {processedData?.map(post => (
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
            <li><strong>Use select for performance</strong> - Prevent unnecessary re-renders</li>
            <li><strong>Keep transformations pure</strong> - No side effects in select functions</li>
            <li><strong>Return stable references</strong> - Use same structure for same data</li>
            <li><strong>Don't mutate data</strong> - Always return new objects/arrays</li>
            <li><strong>Keep transformations simple</strong> - Complex logic should be in separate functions</li>
            <li><strong>Use for computed values</strong> - Derive values rather than computing in components</li>
            <li><strong>Normalize early</strong> - Transform API data as soon as possible</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 4: Caching & State Management.
          You now understand cache configuration, query invalidation, prefetching, background refetching,
          and data transformation. You're ready to move on to Phase 5: Advanced Hooks & Utilities.
        </p>
      </div>
    </LessonLayout>
  );
}

