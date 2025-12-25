import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function OptimisticUpdatesPage() {
  return (
    <LessonLayout
      title="2.2 Optimistic Updates"
      description="Master the art of optimistic updates for instant UI feedback and better user experience"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What are Optimistic Updates?</h2>
        <p className="text-gray-700 mb-4">
          Optimistic updates allow you to update the UI immediately before the server responds,
          making your application feel faster and more responsive. If the mutation fails, you
          can rollback to the previous state.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Instant feedback</strong> - UI updates immediately</li>
            <li><strong>Better UX</strong> - No waiting for server response</li>
            <li><strong>Perceived performance</strong> - App feels faster</li>
            <li><strong>Rollback capability</strong> - Can revert on error</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic Optimistic Update Pattern"
          code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function LikeButton({ postId }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: () => likePost(postId),
    
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['post', postId]);
      
      // Optimistically update
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        likes: old.likes + 1,
        liked: true,
      }));
      
      // Return context for potential rollback
      return { previousPost };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost);
      }
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
  
  return (
    <button onClick={() => mutation.mutate()}>
      Like ({queryClient.getQueryData(['post', postId])?.likes || 0})
    </button>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Optimistic Updates Pattern</h2>
        <p className="text-gray-700 mb-4">
          The standard pattern for optimistic updates involves three steps:
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>onMutate</strong> - Cancel queries, snapshot data, update optimistically</li>
            <li><strong>onError</strong> - Rollback to snapshot if mutation fails</li>
            <li><strong>onSettled</strong> - Refetch to ensure consistency</li>
          </ol>
        </div>

        <CodeBlock
          title="Complete Optimistic Update Pattern"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  // Step 1: Setup optimistic update
  onMutate: async (newData) => {
    // 1. Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['user', userId] });
    
    // 2. Snapshot the previous value
    const previousUser = queryClient.getQueryData(['user', userId]);
    
    // 3. Optimistically update to the new value
    queryClient.setQueryData(['user', userId], (old) => ({
      ...old,
      ...newData,
    }));
    
    // 4. Return context object for rollback
    return { previousUser };
  },
  
  // Step 2: Handle errors (rollback)
  onError: (error, variables, context) => {
    // If mutation fails, rollback to previous value
    if (context?.previousUser) {
      queryClient.setQueryData(['user', userId], context.previousUser);
    }
  },
  
  // Step 3: Ensure consistency
  onSettled: () => {
    // Always refetch after error or success to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Rollback on Error</h2>
        <p className="text-gray-700 mb-4">
          When a mutation fails, you need to rollback the optimistic update to restore the previous state.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Rollback</h3>
        <CodeBlock
          title="Basic Rollback Pattern"
          code={`const mutation = useMutation({
  mutationFn: updatePost,
  
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['post', postId] });
    
    const previousPost = queryClient.getQueryData(['post', postId]);
    
    // Optimistic update
    queryClient.setQueryData(['post', postId], newData);
    
    return { previousPost };
  },
  
  onError: (error, variables, context) => {
    // Simple rollback
    if (context?.previousPost) {
      queryClient.setQueryData(['post', postId], context.previousPost);
    }
    
    // Show error message
    toast.error('Failed to update post');
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Advanced Rollback</h3>
        <CodeBlock
          title="Complex Rollback with Multiple Queries"
          code={`const mutation = useMutation({
  mutationFn: deletePost,
  
  onMutate: async (postId) => {
    // Cancel all related queries
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    await queryClient.cancelQueries({ queryKey: ['post', postId] });
    await queryClient.cancelQueries({ queryKey: ['user', userId, 'posts'] });
    
    // Snapshot all affected data
    const previousPosts = queryClient.getQueryData(['posts']);
    const previousPost = queryClient.getQueryData(['post', postId]);
    const previousUserPosts = queryClient.getQueryData(['user', userId, 'posts']);
    
    // Optimistically remove from all lists
    queryClient.setQueryData(['posts'], (old) => 
      old?.filter(post => post.id !== postId)
    );
    queryClient.setQueryData(['user', userId, 'posts'], (old) => 
      old?.filter(post => post.id !== postId)
    );
    queryClient.removeQueries({ queryKey: ['post', postId] });
    
    return { previousPosts, previousPost, previousUserPosts };
  },
  
  onError: (error, variables, context) => {
    // Rollback all affected queries
    if (context?.previousPosts) {
      queryClient.setQueryData(['posts'], context.previousPosts);
    }
    if (context?.previousPost) {
      queryClient.setQueryData(['post', variables], context.previousPost);
    }
    if (context?.previousUserPosts) {
      queryClient.setQueryData(['user', userId, 'posts'], context.previousUserPosts);
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">onMutate Implementation</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">onMutate</code> function is where you set up
          your optimistic updates. It should be async and return context for rollback.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">onMutate Best Practices</h3>
        <CodeBlock
          title="Proper onMutate Implementation"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onMutate: async (newData) => {
    // 1. Always cancel queries first to prevent race conditions
    await queryClient.cancelQueries({ queryKey: ['user', userId] });
    
    // 2. Get snapshot BEFORE updating
    const previousUser = queryClient.getQueryData(['user', userId]);
    
    // 3. Perform optimistic update
    queryClient.setQueryData(['user', userId], (old) => {
      if (!old) return newData; // Handle case where data doesn't exist
      return { ...old, ...newData };
    });
    
    // 4. Return context with all necessary data for rollback
    return { 
      previousUser,
      timestamp: Date.now(), // Useful for debugging
    };
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Handling Edge Cases</h3>
        <CodeBlock
          title="Robust onMutate with Error Handling"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onMutate: async (newData) => {
    try {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ['user', userId] });
      
      // Get snapshot
      const previousUser = queryClient.getQueryData(['user', userId]);
      
      // Handle case where data might not exist
      if (!previousUser) {
        // If no previous data, we can't do optimistic update
        // Just return context for potential error handling
        return { previousUser: null };
      }
      
      // Optimistic update
      queryClient.setQueryData(['user', userId], {
        ...previousUser,
        ...newData,
      });
      
      return { previousUser };
    } catch (error) {
      // If onMutate fails, mutation won't proceed
      console.error('onMutate error:', error);
      throw error;
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryClient.setQueryData in Mutations</h2>
        <p className="text-gray-700 mb-4">
          Using <code className="bg-gray-100 px-1 rounded">queryClient.setQueryData</code> in mutations
          allows you to update cached query data optimistically.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Updating Single Query</h3>
        <CodeBlock
          title="Simple Query Data Update"
          code={`const mutation = useMutation({
  mutationFn: updatePost,
  
  onMutate: async (newData) => {
    // Update single query
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      ...newData,
    }));
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Updating List Queries</h3>
        <CodeBlock
          title="Updating Items in Lists"
          code={`const mutation = useMutation({
  mutationFn: updatePost,
  
  onMutate: async (updatedPost) => {
    // Update the specific post
    queryClient.setQueryData(['post', updatedPost.id], updatedPost);
    
    // Update in posts list
    queryClient.setQueryData(['posts'], (old) => {
      if (!old) return old;
      return old.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
    });
    
    // Update in user's posts list
    queryClient.setQueryData(['user', userId, 'posts'], (old) => {
      if (!old) return old;
      return old.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
    });
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Adding/Removing from Lists</h3>
        <CodeBlock
          title="List Manipulation"
          code={`// Adding to list
const createMutation = useMutation({
  mutationFn: createPost,
  
  onMutate: async (newPost) => {
    // Add to posts list
    queryClient.setQueryData(['posts'], (old) => {
      return old ? [newPost, ...old] : [newPost];
    });
  },
});

// Removing from list
const deleteMutation = useMutation({
  mutationFn: deletePost,
  
  onMutate: async (postId) => {
    // Remove from posts list
    queryClient.setQueryData(['posts'], (old) => {
      return old?.filter(post => post.id !== postId);
    });
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">queryClient.cancelQueries for Rollback</h2>
        <p className="text-gray-700 mb-4">
          Canceling queries in <code className="bg-gray-100 px-1 rounded">onMutate</code> prevents
          race conditions where a refetch might overwrite your optimistic update.
        </p>

        <CodeBlock
          title="Canceling Queries Pattern"
          code={`const mutation = useMutation({
  mutationFn: updateUser,
  
  onMutate: async (newData) => {
    // Cancel all queries that might conflict
    await queryClient.cancelQueries({ queryKey: ['user', userId] });
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    // Now safe to do optimistic update
    const previousUser = queryClient.getQueryData(['user', userId]);
    
    queryClient.setQueryData(['user', userId], newData);
    
    return { previousUser };
  },
});`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800">
            <strong>Important:</strong> Always cancel queries before optimistic updates to prevent
            race conditions where a background refetch might overwrite your optimistic update.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complex Optimistic Scenarios</h2>
        <p className="text-gray-700 mb-4">
          Real-world applications often require complex optimistic updates across multiple queries.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Scenario 1: Nested Updates</h3>
        <CodeBlock
          title="Updating Nested Data"
          code={`const mutation = useMutation({
  mutationFn: updateComment,
  
  onMutate: async (updatedComment) => {
    await queryClient.cancelQueries({ queryKey: ['post', postId] });
    
    const previousPost = queryClient.getQueryData(['post', postId]);
    
    // Update nested comment in post
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      comments: old.comments.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment
      ),
    }));
    
    return { previousPost };
  },
  
  onError: (error, variables, context) => {
    if (context?.previousPost) {
      queryClient.setQueryData(['post', postId], context.previousPost);
    }
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Scenario 2: Paginated Lists</h3>
        <CodeBlock
          title="Optimistic Updates in Pagination"
          code={`const mutation = useMutation({
  mutationFn: deletePost,
  
  onMutate: async (postId) => {
    // Cancel all pages
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    
    // Snapshot all pages
    const pages = [];
    let page = 0;
    let hasMore = true;
    
    while (hasMore) {
      const data = queryClient.getQueryData(['posts', { page }]);
      if (data) {
        pages.push({ page, data });
        hasMore = data.hasMore;
        page++;
      } else {
        hasMore = false;
      }
    }
    
    // Remove from all pages
    pages.forEach(({ page, data }) => {
      queryClient.setQueryData(['posts', { page }], {
        ...data,
        posts: data.posts.filter(post => post.id !== postId),
      });
    });
    
    return { pages };
  },
  
  onError: (error, variables, context) => {
    // Rollback all pages
    context?.pages.forEach(({ page, data }) => {
      queryClient.setQueryData(['posts', { page }], data);
    });
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Scenario 3: Related Queries</h3>
        <CodeBlock
          title="Updating Multiple Related Queries"
          code={`const mutation = useMutation({
  mutationFn: followUser,
  
  onMutate: async (targetUserId) => {
    // Cancel all related queries
    await queryClient.cancelQueries({ queryKey: ['user', currentUserId] });
    await queryClient.cancelQueries({ queryKey: ['user', targetUserId] });
    await queryClient.cancelQueries({ queryKey: ['followers', targetUserId] });
    await queryClient.cancelQueries({ queryKey: ['following', currentUserId] });
    
    // Snapshot all
    const previousCurrentUser = queryClient.getQueryData(['user', currentUserId]);
    const previousTargetUser = queryClient.getQueryData(['user', targetUserId]);
    const previousFollowers = queryClient.getQueryData(['followers', targetUserId]);
    const previousFollowing = queryClient.getQueryData(['following', currentUserId]);
    
    // Optimistically update all
    queryClient.setQueryData(['user', currentUserId], (old) => ({
      ...old,
      followingCount: old.followingCount + 1,
    }));
    
    queryClient.setQueryData(['user', targetUserId], (old) => ({
      ...old,
      followersCount: old.followersCount + 1,
    }));
    
    queryClient.setQueryData(['followers', targetUserId], (old) => ({
      ...old,
      followers: [...old.followers, currentUserId],
    }));
    
    queryClient.setQueryData(['following', currentUserId], (old) => ({
      ...old,
      following: [...old.following, targetUserId],
    }));
    
    return {
      previousCurrentUser,
      previousTargetUser,
      previousFollowers,
      previousFollowing,
    };
  },
  
  onError: (error, variables, context) => {
    // Rollback all
    if (context?.previousCurrentUser) {
      queryClient.setQueryData(['user', currentUserId], context.previousCurrentUser);
    }
    if (context?.previousTargetUser) {
      queryClient.setQueryData(['user', targetUserId], context.previousTargetUser);
    }
    if (context?.previousFollowers) {
      queryClient.setQueryData(['followers', targetUserId], context.previousFollowers);
    }
    if (context?.previousFollowing) {
      queryClient.setQueryData(['following', currentUserId], context.previousFollowing);
    }
  },
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Always cancel queries first</strong> - Prevents race conditions</li>
            <li><strong>Snapshot before updating</strong> - Save previous state for rollback</li>
            <li><strong>Return context</strong> - Include all data needed for rollback</li>
            <li><strong>Handle edge cases</strong> - Check if data exists before updating</li>
            <li><strong>Rollback on error</strong> - Always restore previous state on failure</li>
            <li><strong>Refetch on settled</strong> - Ensure consistency with server</li>
            <li><strong>Update all affected queries</strong> - Keep all caches in sync</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">2.3 useMutationState Hook</strong>
          to access mutation state programmatically in v5+.
        </p>
      </div>
    </LessonLayout>
  );
}

