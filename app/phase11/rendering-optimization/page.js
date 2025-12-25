import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function RenderingOptimizationPage() {
  return (
    <LessonLayout
      title="11.2 Rendering Optimization"
      description="Learn rendering optimization techniques: component splitting, query result memoization, preventing unnecessary re-renders, and React.memo integration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Rendering Optimization</h2>
        <p className="text-gray-700 mb-4">
          Optimizing component rendering is crucial for performance. React Query works well with
          React's optimization techniques like memoization and component splitting.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Optimization Techniques:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Component splitting</li>
            <li>Query result memoization</li>
            <li>Preventing unnecessary re-renders</li>
            <li>React.memo integration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Component Splitting</h2>
        <p className="text-gray-700 mb-4">
          Splitting components allows you to isolate query subscriptions, preventing unnecessary
          re-renders of unrelated components.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Problem: Monolithic Component</h3>
        <CodeBlock
          title="Component with Multiple Queries"
          code={`// ❌ Problem: All components re-render when any query updates
function UserDashboard({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', userId],
    queryFn: () => fetchUserComments(userId),
  });

  // When user updates, all three sections re-render
  // When posts update, all three sections re-render
  // When comments update, all three sections re-render

  return (
    <div>
      <UserProfile user={user} />
      <PostsList posts={posts} />
      <CommentsList comments={comments} />
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Solution: Split Components</h3>
        <CodeBlock
          title="Split Components for Better Performance"
          code={`// ✅ Solution: Split into separate components
// Each component only re-renders when its query updates

function UserDashboard({ userId }) {
  return (
    <div>
      <UserProfile userId={userId} />
      <PostsList userId={userId} />
      <CommentsList userId={userId} />
    </div>
  );
}

// Component 1: Only subscribes to user query
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Only re-renders when user query updates
  return <div>{user?.name}</div>;
}

// Component 2: Only subscribes to posts query
function PostsList({ userId }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  // Only re-renders when posts query updates
  return <div>{posts?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}

// Component 3: Only subscribes to comments query
function CommentsList({ userId }) {
  const { data: comments } = useQuery({
    queryKey: ['comments', userId],
    queryFn: () => fetchUserComments(userId),
  });

  // Only re-renders when comments query updates
  return <div>{comments?.map(comment => <div key={comment.id}>{comment.text}</div>)}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Granular Component Splitting</h3>
        <CodeBlock
          title="Even More Granular Splitting"
          code={`// Split components even further for maximum optimization
function UserProfile({ userId }) {
  return (
    <div>
      <UserName userId={userId} />
      <UserEmail userId={userId} />
      <UserAvatar userId={userId} />
    </div>
  );
}

// Each component only subscribes to its specific data
function UserName({ userId }) {
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name,
  });
  return <div>{name}</div>;
}

function UserEmail({ userId }) {
  const { data: email } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.email,
  });
  return <div>{email}</div>;
}

function UserAvatar({ userId }) {
  const { data: avatar } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.avatar,
  });
  return <img src={avatar} />;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Query Result Memoization</h2>
        <p className="text-gray-700 mb-4">
          Memoize query results to prevent unnecessary recalculations and re-renders.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Using useMemo with Query Data</h3>
        <CodeBlock
          title="Memoizing Computed Values"
          code={`import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

function UserStats({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Memoize computed values
  const stats = useMemo(() => {
    if (!user) return null;

    return {
      fullName: \`\${user.firstName} \${user.lastName}\`,
      initials: \`\${user.firstName[0]}\${user.lastName[0]}\`,
      postCount: user.posts?.length || 0,
      commentCount: user.comments?.length || 0,
    };
  }, [user]); // Only recalculate when user changes

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <div>{stats.fullName}</div>
      <div>{stats.initials}</div>
      <div>Posts: {stats.postCount}</div>
      <div>Comments: {stats.commentCount}</div>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoizing Filtered Data</h3>
        <CodeBlock
          title="Memoizing Filtered/Sorted Data"
          code={`import { useMemo } from 'react';

function PostsList({ userId, filter }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
  });

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter(post => {
      if (filter === 'all') return true;
      if (filter === 'published') return post.published;
      if (filter === 'draft') return !post.published;
      return true;
    });
  }, [posts, filter]); // Only recalculate when posts or filter changes

  // Memoize sorted posts
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredPosts]);

  return (
    <div>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoizing with select</h3>
        <CodeBlock
          title="Using select for Built-in Memoization"
          code={`// select option provides built-in memoization
// No need for useMemo when using select

function UserName({ userId }) {
  // select automatically memoizes
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Memoized automatically
  });

  return <div>{name}</div>;
}

// For complex transformations, combine select with useMemo
function UserDisplayName({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
    }), // Memoized selection
  });

  // Further memoization if needed
  const displayName = useMemo(() => {
    if (!user) return '';
    return \`\${user.firstName} \${user.lastName}\`;
  }, [user]);

  return <div>{displayName}</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Preventing Unnecessary Re-renders</h2>
        <p className="text-gray-700 mb-4">
          Prevent unnecessary re-renders by using React Query's optimization features and
          React's memoization techniques.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Problem: Unnecessary Re-renders</h3>
        <CodeBlock
          title="Component Re-rendering Too Often"
          code={`// ❌ Problem: Component re-renders on every query state change
function UserProfile({ userId }) {
  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Re-renders when:
  // - data changes
  // - isLoading changes
  // - isFetching changes
  // - error changes
  // - Any other property changes

  console.log('Rendering UserProfile'); // Logs frequently

  return (
    <div>
      {query.isLoading && <div>Loading...</div>}
      {query.data && <div>{query.data.name}</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Solution: Selective Subscriptions</h3>
        <CodeBlock
          title="Prevent Unnecessary Re-renders"
          code={`// ✅ Solution: Only subscribe to needed data
function UserProfile({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user, // Only subscribe to data
    notifyOnChangeProps: ['data'], // Only notify on data changes
  });

  // Re-renders only when:
  // - data changes

  console.log('Rendering UserProfile'); // Logs less frequently

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}

// Separate loading state component
function UserProfileWithLoading({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    notifyOnChangeProps: ['data', 'isLoading'], // Only these changes
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.name}</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Stable References</h3>
        <CodeBlock
          title="Maintaining Stable References"
          code={`// Problem: Unstable references cause re-renders
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  // users array reference changes on every query update
  // Even if data is the same (due to structural sharing)

  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Solution: Use select to maintain stable references
function UserListOptimized() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
    select: (data) => data, // Structural sharing handles this
    // Or use a custom selector
    select: (data) => {
      // Return same reference if data hasn't changed
      return data;
    },
  });

  // users reference is stable when data hasn't changed
  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React.memo Integration</h2>
        <p className="text-gray-700 mb-4">
          React.memo prevents component re-renders when props haven't changed. Combine it with
          React Query for maximum optimization.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Basic React.memo Usage</h3>
        <CodeBlock
          title="Memoizing Components"
          code={`import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Memoize component to prevent unnecessary re-renders
const UserCard = memo(function UserCard({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user, // Only subscribe to data
  });

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>
    </div>
  );
});

// Component only re-renders when userId prop changes
// Not when parent re-renders`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">React.memo with Custom Comparison</h3>
        <CodeBlock
          title="Custom Comparison Function"
          code={`import { memo } from 'react';

// Custom comparison function
const areEqual = (prevProps, nextProps) => {
  // Only re-render if userId changes
  return prevProps.userId === nextProps.userId;
};

const UserCard = memo(function UserCard({ userId, className }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <div className={className}>
      {user?.name}
    </div>
  );
}, areEqual);

// Component re-renders only when userId changes
// Not when className changes (if you want this behavior)`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Combining with Query Optimization</h3>
        <CodeBlock
          title="React.memo + Query Optimization"
          code={`import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Memoized component with optimized query
const UserCard = memo(function UserCard({ userId }) {
  // Optimized query subscription
  const { data: name } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: (user) => user.name, // Only subscribe to name
    notifyOnChangeProps: ['data'], // Only notify on data changes
  });

  // Component re-renders only when:
  // 1. userId prop changes (React.memo)
  // 2. name data changes (query optimization)

  return <div>{name}</div>;
});

// Usage in list
function UserList({ userIds }) {
  return (
    <div>
      {userIds.map(id => (
        <UserCard key={id} userId={id} />
      ))}
    </div>
  );
}

// Each UserCard only re-renders when its specific user data changes`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Memoizing Child Components</h3>
        <CodeBlock
          title="Preventing Child Re-renders"
          code={`import { memo } from 'react';

// Memoize child component
const PostCard = memo(function PostCard({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
});

function PostsList({ userId }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    select: (posts) => posts, // Memoized selection
  });

  // PostCard components only re-render when their specific post changes
  // Not when other posts change
  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
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
            <li><strong>Split components</strong> - Isolate query subscriptions</li>
            <li><strong>Use select</strong> - Subscribe only to needed data</li>
            <li><strong>Memoize computations</strong> - Use useMemo for expensive calculations</li>
            <li><strong>Use React.memo</strong> - Prevent unnecessary component re-renders</li>
            <li><strong>Control notifications</strong> - Use notifyOnChangeProps</li>
            <li><strong>Profile first</strong> - Measure before optimizing</li>
            <li><strong>Don't over-optimize</strong> - Optimize only when needed</li>
            <li><strong>Test performance</strong> - Verify optimizations work</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">11.3 Network Optimization</strong>
          for request deduplication, cancellation, batching, and queuing.
        </p>
      </div>
    </LessonLayout>
  );
}

