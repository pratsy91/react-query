import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function MigrationStrategiesPage() {
  return (
    <LessonLayout
      title="15.2 Migration Strategies"
      description="Learn migration strategies: gradual migration, code patterns updates, and testing after migration"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Migration Strategies</h2>
        <p className="text-gray-700 mb-4">
          Successful migration requires a strategy. This lesson covers approaches to migrate
          React Query versions safely and efficiently.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Migration Topics:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Gradual migration</li>
            <li>Code patterns updates</li>
            <li>Testing after migration</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Gradual Migration</h2>
        <p className="text-gray-700 mb-4">
          Gradual migration allows you to update incrementally, reducing risk and making it
          easier to identify and fix issues.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Migration Phases</h3>
        <CodeBlock
          title="Phased Migration Approach"
          code={`// Phase 1: Preparation
// - Read migration guide
// - Identify all React Query usage
// - Create backup
// - Set up test environment

// Phase 2: Update Package
// - Update package.json
// - Install new version
// - Update imports (if needed)
// - Fix immediate breaking changes

// Phase 3: Update Core Patterns
// - Update QueryClient setup
// - Update default options
// - Update query hooks
// - Update mutation hooks

// Phase 4: Update Advanced Patterns
// - Update custom hooks
// - Update query key factories
// - Update cache configuration
// - Update error handling

// Phase 5: Cleanup
// - Remove deprecated APIs
// - Update tests
// - Update documentation
// - Final testing`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Feature-by-Feature Migration</h3>
        <CodeBlock
          title="Migrating One Feature at a Time"
          code={`// Strategy: Migrate one feature/component at a time

// Step 1: Identify feature to migrate
// Example: User profile feature

// Step 2: Create feature branch
git checkout -b migrate/user-profile-v5

// Step 3: Update feature code
// - Update imports
// - Update options (cacheTime → gcTime)
// - Update hooks
// - Update tests

// Step 4: Test feature thoroughly
// - Manual testing
// - Automated tests
// - Integration tests

// Step 5: Merge when ready
git merge migrate/user-profile-v5

// Step 6: Repeat for next feature

// Benefits:
// - Lower risk
// - Easier debugging
// - Can rollback individual features
// - Team can review incrementally`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dual Version Strategy</h3>
        <CodeBlock
          title="Running Both Versions Temporarily"
          code={`// Strategy: Run both versions during migration
// (Advanced, not always recommended)

// Install both versions
npm install @tanstack/react-query@4
npm install @tanstack/react-query-v5@npm:@tanstack/react-query@5

// Use aliases
import { useQuery as useQueryV4 } from '@tanstack/react-query';
import { useQuery as useQueryV5 } from '@tanstack/react-query-v5';

// Migrate gradually
// Old code uses v4
function OldComponent() {
  const { data } = useQueryV4({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1),
    cacheTime: 1000 * 60 * 5, // v4 syntax
  });
}

// New code uses v5
function NewComponent() {
  const { data } = useQueryV5({
    queryKey: ['user', 1],
    queryFn: () => fetchUser(1),
    gcTime: 1000 * 60 * 5, // v5 syntax
  });
}

// Note: This is complex and not recommended for most cases
// Better to migrate all at once or feature-by-feature`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Code Patterns Updates</h2>
        <p className="text-gray-700 mb-4">
          Updating code patterns systematically ensures consistency and reduces errors during migration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Option Renaming</h3>
        <CodeBlock
          title="Systematic Option Updates"
          code={`// Find and replace pattern for cacheTime → gcTime

// Step 1: Find all occurrences
// Search: cacheTime
// Files: *.ts, *.tsx, *.js, *.jsx

// Step 2: Verify each occurrence
// - Is it a query option?
// - Is it a mutation option?
// - Is it a default option?

// Step 3: Replace systematically
// OLD:
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5,
    },
  },
});

// NEW:
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5,
    },
  },
});

// Step 4: Test each change
// - Verify behavior is the same
// - Check tests pass
// - Manual verification`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Hook Updates</h3>
        <CodeBlock
          title="Updating Hook Usage"
          code={`// Pattern: Update hook usage systematically

// Example: useInfiniteQuery
// v4: initialPageParam optional
// v5: initialPageParam required

// Find all useInfiniteQuery
// Search: useInfiniteQuery

// Update each:
// OLD (v4):
const { data } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// NEW (v5):
const { data } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0, // Required
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Pattern for mutations:
// OLD: mutation.isLoading
// NEW: mutation.isPending

// Find: mutation.isLoading
// Replace: mutation.isPending`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Deprecated API Removal</h3>
        <CodeBlock
          title="Removing Deprecated APIs"
          code={`// Pattern: Replace deprecated APIs

// Step 1: Find deprecated usage
// Search: onSuccess
// Search: onError
// Search: onSettled
// Search: keepPreviousData

// Step 2: Replace with recommended patterns

// Example: onSuccess → useEffect
// OLD:
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onSuccess: (data) => {
    console.log('User loaded:', data);
  },
});

// NEW:
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

useEffect(() => {
  if (data) {
    console.log('User loaded:', data);
  }
}, [data]);

// Example: keepPreviousData → placeholderData
// OLD:
const { data } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  keepPreviousData: true,
});

// NEW:
const { data } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  placeholderData: (previousData) => previousData,
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Testing After Migration</h2>
        <p className="text-gray-700 mb-4">
          Comprehensive testing ensures the migration was successful and nothing broke.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Checklist</h3>
        <CodeBlock
          title="Migration Testing Checklist"
          code={`// Testing checklist:

// 1. Unit Tests
// - Run all unit tests
// - Fix failing tests
// - Update test mocks if needed
// - Verify test coverage

// 2. Integration Tests
// - Test query flows
// - Test mutation flows
// - Test error handling
// - Test loading states

// 3. Component Tests
// - Test component rendering
// - Test user interactions
// - Test data display
// - Test error states

// 4. E2E Tests
// - Test complete user flows
// - Test navigation
// - Test data persistence
// - Test offline behavior

// 5. Manual Testing
// - Test all features
// - Test edge cases
// - Test error scenarios
// - Test performance`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Testing Specific Changes</h3>
        <CodeBlock
          title="Testing Version-Specific Changes"
          code={`// Test cacheTime → gcTime migration
test('gcTime works correctly', async () => {
  const queryClient = createTestQueryClient();
  
  const { result } = renderHook(
    () => useQuery({
      queryKey: ['user', 1],
      queryFn: () => fetchUser(1),
      gcTime: 1000, // Short time for testing
    }),
    { wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )}
  );

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  // Verify data is cached
  expect(queryClient.getQueryData(['user', 1])).toBeDefined();

  // Wait for gcTime to pass
  await new Promise(resolve => setTimeout(resolve, 1100));

  // Verify data is still available (if query is active)
  // Behavior should match old cacheTime
});

// Test isPending migration
test('mutation isPending works', async () => {
  const mutation = useMutation({
    mutationFn: updateUser,
  });

  expect(mutation.isPending).toBe(false);

  mutation.mutate({ id: 1, name: 'New' });

  expect(mutation.isPending).toBe(true);

  await waitFor(() => {
    expect(mutation.isPending).toBe(false);
  });
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Regression Testing</h3>
        <CodeBlock
          title="Ensuring No Regressions"
          code={`// Regression testing strategy:

// 1. Test all existing functionality
// - All queries work
// - All mutations work
// - All error handling works
// - All loading states work

// 2. Test edge cases
// - Empty data
// - Null values
// - Network errors
// - Timeout errors

// 3. Test performance
// - Query performance
// - Cache performance
// - Memory usage
// - Bundle size

// 4. Test browser compatibility
// - Modern browsers
// - Older browsers (if supported)
// - Mobile browsers

// 5. Test with real data
// - Production-like data
// - Large datasets
// - Complex queries
// - Multiple concurrent queries`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Migration Tools</h2>
        <p className="text-gray-700 mb-4">
          Tools and techniques that help with migration.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Code Search and Replace</h3>
        <CodeBlock
          title="Using Search and Replace"
          code={`// Tools for finding and replacing:

// 1. IDE Search and Replace
// - Find: cacheTime
// - Replace: gcTime
// - Scope: Project files
// - Preview before replacing

// 2. Command line tools
// grep -r "cacheTime" .
// sed -i 's/cacheTime/gcTime/g' *.ts

// 3. Regex patterns
// Find: cacheTime:\s*(\d+)
// Replace: gcTime: $1

// 4. TypeScript/ESLint
// - Use linter to find deprecated APIs
// - Configure rules to warn about deprecated usage
// - Fix automatically where possible`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Automated Migration Scripts</h3>
        <CodeBlock
          title="Creating Migration Scripts"
          code={`// Example migration script (Node.js)

const fs = require('fs');
const path = require('path');

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace cacheTime with gcTime
  content = content.replace(/cacheTime:/g, 'gcTime:');
  
  // Replace mutation.isLoading with mutation.isPending
  content = content.replace(/mutation\.isLoading/g, 'mutation.isPending');
  
  // Add initialPageParam to useInfiniteQuery
  // (More complex, requires AST parsing)
  
  fs.writeFileSync(filePath, content);
}

// Run on all files
function migrateDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      migrateDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      migrateFile(filePath);
    }
  });
}

// Note: Use with caution, always review changes`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Plan the migration</strong> - Create a migration plan before starting</li>
            <li><strong>Backup your code</strong> - Use version control, create branches</li>
            <li><strong>Migrate incrementally</strong> - Don't change everything at once</li>
            <li><strong>Test frequently</strong> - Test after each major change</li>
            <li><strong>Use TypeScript</strong> - Catches many migration issues</li>
            <li><strong>Read migration guides</strong> - Official guides are comprehensive</li>
            <li><strong>Update dependencies</strong> - Ensure all packages are compatible</li>
            <li><strong>Document changes</strong> - Keep track of what was changed</li>
            <li><strong>Get team review</strong> - Have others review migration changes</li>
            <li><strong>Monitor after deployment</strong> - Watch for issues in production</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 15: Migration & Version Updates
          and the entire React Query learning platform! You now understand version differences,
          migration strategies, and how to safely update React Query versions. You've mastered
          React Query from basics to advanced migration!
        </p>
      </div>
    </LessonLayout>
  );
}

