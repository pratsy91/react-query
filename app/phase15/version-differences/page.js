import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function VersionDifferencesPage() {
  return (
    <LessonLayout
      title="15.1 Version Differences"
      description="Understand version differences: v3 to v4 migration, v4 to v5 migration, breaking changes, and deprecated APIs"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">React Query Version Differences</h2>
        <p className="text-gray-700 mb-4">
          Understanding version differences helps you migrate between React Query versions and
          understand what changed and why. This lesson covers major version migrations.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Version Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>v3 to v4 migration</li>
            <li>v4 to v5 migration</li>
            <li>Breaking changes</li>
            <li>Deprecated APIs</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">v3 to v4 Migration</h2>
        <p className="text-gray-700 mb-4">
          React Query v4 introduced significant changes including package rename, new defaults,
          and improved TypeScript support.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Package Rename</h3>
        <CodeBlock
          title="Package Name Change"
          code={`// v3: react-query
import { useQuery } from 'react-query';

// v4: @tanstack/react-query
import { useQuery } from '@tanstack/react-query';

// Migration:
// 1. Uninstall old package
npm uninstall react-query

// 2. Install new package
npm install @tanstack/react-query

// 3. Update all imports
// Find: from 'react-query'
// Replace: from '@tanstack/react-query'`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">QueryClient Changes</h3>
        <CodeBlock
          title="QueryClient API Changes"
          code={`// v3: QueryClient methods
const queryClient = new QueryClient();

// v4: Same API, but some method signatures changed
// Most methods remain the same

// Example: invalidateQueries
// v3 and v4: Same signature
queryClient.invalidateQueries({ queryKey: ['posts'] });

// Example: setQueryData
// v3 and v4: Same signature
queryClient.setQueryData(['user', 1], { id: 1, name: 'John' });`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Default Options Changes</h3>
        <CodeBlock
          title="Default Behavior Changes"
          code={`// v3: Default staleTime was 0
// v4: Default staleTime is still 0 (no change)

// v3: Default cacheTime was 5 minutes
// v4: Default cacheTime is still 5 minutes (no change)

// v3: Default refetchOnWindowFocus was true
// v4: Default refetchOnWindowFocus is still true (no change)

// Main changes in v4:
// - Better TypeScript support
// - Improved error handling
// - Better DevTools integration`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">v4 to v5 Migration</h2>
        <p className="text-gray-700 mb-4">
          React Query v5 introduced major changes including new Suspense hooks, renamed options,
          and improved defaults.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Option Renaming</h3>
        <CodeBlock
          title="cacheTime to gcTime"
          code={`// v4: cacheTime
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  cacheTime: 1000 * 60 * 5, // 5 minutes
});

// v5: gcTime (garbage collection time)
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  gcTime: 1000 * 60 * 5, // 5 minutes
});

// Migration:
// Find: cacheTime
// Replace: gcTime
// Same behavior, better naming`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">New Suspense Hooks</h3>
        <CodeBlock
          title="Suspense Hooks in v5"
          code={`// v4: No built-in Suspense hooks
// Had to use suspense option

// v5: New Suspense hooks
import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQueries,
} from '@tanstack/react-query';

// v5: useSuspenseQuery
const { data } = useSuspenseQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// v5: useSuspenseInfiniteQuery
const { data } = useSuspenseInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Migration:
// If using suspense option, consider migrating to new hooks
// Better TypeScript support and clearer intent`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Loading State Changes</h3>
        <CodeBlock
          title="isLoading vs isPending"
          code={`// v4: isLoading
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

if (isLoading) return <div>Loading...</div>;

// v5: isPending (for mutations)
// v5: isLoading still exists for queries
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// For mutations in v5:
const mutation = useMutation({
  mutationFn: updateUser,
});

// v4: mutation.isLoading
// v5: mutation.isPending
if (mutation.isPending) return <div>Saving...</div>;

// Migration:
// Queries: isLoading (no change)
// Mutations: isLoading → isPending`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Breaking Changes</h2>
        <p className="text-gray-700 mb-4">
          Breaking changes require code updates. Understanding these helps you migrate successfully.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">v3 to v4 Breaking Changes</h3>
        <CodeBlock
          title="Major Breaking Changes v3→v4"
          code={`// 1. Package name change
// OLD: react-query
// NEW: @tanstack/react-query
// Impact: All imports must be updated

// 2. QueryClientProvider prop change
// v3: client prop
<QueryClientProvider client={queryClient}>

// v4: client prop (same, but context changed)
<QueryClientProvider client={queryClient}>

// 3. TypeScript improvements
// v4: Better type inference
// May require type updates in some cases

// 4. DevTools changes
// v4: Improved DevTools
// May require DevTools setup updates`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">v4 to v5 Breaking Changes</h3>
        <CodeBlock
          title="Major Breaking Changes v4→v5"
          code={`// 1. cacheTime → gcTime
// OLD: cacheTime: 1000 * 60 * 5
// NEW: gcTime: 1000 * 60 * 5
// Impact: All cacheTime references must be updated

// 2. Mutation isLoading → isPending
// OLD: mutation.isLoading
// NEW: mutation.isPending
// Impact: All mutation loading checks must be updated

// 3. useInfiniteQuery requires initialPageParam
// v4: Optional
// v5: Required
const { data } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0, // Required in v5
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// 4. onSuccess/onError/onSettled deprecated
// v4: Available
// v5: Deprecated (still works but not recommended)
// Use callbacks in mutationFn or useEffect instead`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Deprecated APIs</h2>
        <p className="text-gray-700 mb-4">
          Deprecated APIs still work but are not recommended. Understanding deprecations helps you
          write future-proof code.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Deprecated in v5</h3>
        <CodeBlock
          title="Deprecated Options and Methods"
          code={`// 1. onSuccess, onError, onSettled (v5)
// Deprecated: Still works but not recommended
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

// Recommended: Use useEffect
const { data, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

useEffect(() => {
  if (data) {
    console.log('Success:', data);
  }
}, [data]);

useEffect(() => {
  if (error) {
    console.error('Error:', error);
  }
}, [error]);

// 2. cacheTime (v5)
// Deprecated: Use gcTime instead
// Still works but will be removed in future

// 3. keepPreviousData (v5)
// Deprecated: Use placeholderData instead
// Still works but will be removed`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Migration from Deprecated APIs</h3>
        <CodeBlock
          title="Replacing Deprecated APIs"
          code={`// Example: Migrating from onSuccess
// OLD (deprecated):
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (data) => {
    queryClient.invalidateQueries(['user']);
    toast.success('User updated');
  },
});

// NEW (recommended):
const mutation = useMutation({
  mutationFn: updateUser,
});

useEffect(() => {
  if (mutation.isSuccess && mutation.data) {
    queryClient.invalidateQueries(['user']);
    toast.success('User updated');
  }
}, [mutation.isSuccess, mutation.data, queryClient]);

// Example: Migrating from keepPreviousData
// OLD (deprecated):
const { data } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  keepPreviousData: true,
});

// NEW (recommended):
const { data } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  placeholderData: (previousData) => previousData,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Version Comparison Summary</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Differences:</h3>
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Feature</th>
                <th className="text-left p-2">v3</th>
                <th className="text-left p-2">v4</th>
                <th className="text-left p-2">v5</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Package</td>
                <td className="p-2">react-query</td>
                <td className="p-2">@tanstack/react-query</td>
                <td className="p-2">@tanstack/react-query</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Cache option</td>
                <td className="p-2">cacheTime</td>
                <td className="p-2">cacheTime</td>
                <td className="p-2">gcTime</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Suspense hooks</td>
                <td className="p-2">No</td>
                <td className="p-2">No</td>
                <td className="p-2">Yes</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Mutation loading</td>
                <td className="p-2">isLoading</td>
                <td className="p-2">isLoading</td>
                <td className="p-2">isPending</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">onSuccess/onError</td>
                <td className="p-2">Available</td>
                <td className="p-2">Available</td>
                <td className="p-2">Deprecated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Read migration guides</strong> - Official guides are comprehensive</li>
            <li><strong>Update gradually</strong> - Don't update everything at once</li>
            <li><strong>Test thoroughly</strong> - Verify all functionality after migration</li>
            <li><strong>Use TypeScript</strong> - Catches many migration issues</li>
            <li><strong>Avoid deprecated APIs</strong> - Use recommended alternatives</li>
            <li><strong>Check changelog</strong> - Understand what changed and why</li>
            <li><strong>Update dependencies</strong> - Ensure compatibility</li>
            <li><strong>Backup before migrating</strong> - Safety first</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">15.2 Migration Strategies</strong>
          for gradual migration, code pattern updates, and testing after migration.
        </p>
      </div>
    </LessonLayout>
  );
}

