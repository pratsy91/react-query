import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function UseIsMutatingPage() {
  return (
    <LessonLayout
      title="5.3 useIsMutating Hook"
      description="Learn how to track global mutation state across all mutations using useIsMutating"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">What is useIsMutating?</h2>
        <p className="text-gray-700 mb-4">
          The <code className="bg-gray-100 px-1 rounded">useIsMutating</code> hook returns the number
          of mutations currently in progress. It's useful for showing global saving indicators and
          tracking mutation state across your application.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Use Cases:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Global saving indicators</li>
            <li>Disable actions during mutations</li>
            <li>Show unsaved changes warnings</li>
            <li>Track mutation progress</li>
          </ul>
        </div>

        <CodeBlock
          title="Basic useIsMutating Usage"
          code={`import { useIsMutating } from '@tanstack/react-query';

function GlobalSavingIndicator() {
  const isMutating = useIsMutating();
  
  // Returns number of mutations currently in progress
  // 0 means no mutations are running
  
  return (
    <div>
      {isMutating > 0 && (
        <div>Saving... ({isMutating} operations)</div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Global Mutation State</h2>
        <p className="text-gray-700 mb-4">
          <code className="bg-gray-100 px-1 rounded">useIsMutating</code> tracks all mutations in your
          application, giving you a global view of mutation activity.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Simple Global Indicator</h3>
        <CodeBlock
          title="Show Saving When Any Mutation is Running"
          code={`import { useIsMutating } from '@tanstack/react-query';

function App() {
  const isMutating = useIsMutating();
  
  return (
    <div>
      {isMutating > 0 && (
        <div className="global-saver">
          Saving changes...
        </div>
      )}
      <YourAppContent />
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Boolean Conversion</h3>
        <CodeBlock
          title="Convert to Boolean"
          code={`function SavingIndicator() {
  const isMutating = useIsMutating();
  const isSaving = isMutating > 0; // Convert to boolean
  
  return (
    <div>
      {isSaving && <div>Saving...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Filtering Options</h2>
        <p className="text-gray-700 mb-4">
          You can filter which mutations are counted by providing filter options to
          <code className="bg-gray-100 px-1 rounded">useIsMutating</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Mutation Key</h3>
        <CodeBlock
          title="Count Specific Mutations"
          code={`function MutationIndicators() {
  // Count all mutations
  const allMutating = useIsMutating();
  
  // Count only update mutations
  const isUpdating = useIsMutating({
    mutationKey: ['updateUser'],
  });
  
  // Count only delete mutations
  const isDeleting = useIsMutating({
    mutationKey: ['deleteUser'],
  });
  
  return (
    <div>
      {allMutating > 0 && <div>Processing {allMutating} operations...</div>}
      {isUpdating > 0 && <div>Updating user...</div>}
      {isDeleting > 0 && <div>Deleting user...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Predicate</h3>
        <CodeBlock
          title="Custom Filtering Logic"
          code={`function CustomMutationIndicator() {
  // Count mutations matching custom condition
  const isMutatingCritical = useIsMutating({
    predicate: (mutation) => {
      // Only count mutations with 'critical' in key
      const key = mutation.options.mutationKey;
      return key?.some(k => 
        typeof k === 'string' && k.includes('critical')
      );
    },
  });
  
  // Count mutations for specific user
  const isMutatingUser = useIsMutating({
    predicate: (mutation) => {
      const key = mutation.options.mutationKey;
      return key?.includes(userId);
    },
  });
  
  return (
    <div>
      {isMutatingCritical > 0 && <div>Critical operation in progress...</div>}
      {isMutatingUser > 0 && <div>Updating user data...</div>}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Filter by Status</h3>
        <CodeBlock
          title="Filter by Mutation Status"
          code={`function StatusIndicators() {
  // Count all pending mutations
  const allPending = useIsMutating();
  
  // Count mutations with specific status
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      return mutation.state.status === 'pending';
    },
  });
  
  return (
    <div>
      <div>Pending: {allPending}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Use Cases</h2>
        <p className="text-gray-700 mb-4">
          Common patterns and use cases for <code className="bg-gray-100 px-1 rounded">useIsMutating</code>.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 1: Global Saving Indicator</h3>
        <CodeBlock
          title="Show Saving State Globally"
          code={`function GlobalSavingIndicator() {
  const isMutating = useIsMutating();
  
  return (
    <div className="saving-indicator">
      {isMutating > 0 && (
        <div className="saving">
          <span>💾</span> Saving changes...
        </div>
      )}
    </div>
  );
}

// With count
function SavingIndicator() {
  const isMutating = useIsMutating();
  
  return (
    <div>
      {isMutating > 0 && (
        <div>
          Saving {isMutating} {isMutating === 1 ? 'change' : 'changes'}...
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 2: Disable Navigation During Save</h3>
        <CodeBlock
          title="Prevent Navigation While Saving"
          code={`import { useIsMutating } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function NavigationGuard() {
  const isMutating = useIsMutating();
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    if (isMutating > 0) {
      if (!confirm('You have unsaved changes. Leave anyway?')) {
        return;
      }
    }
    navigate('/dashboard');
  };
  
  return (
    <button onClick={handleNavigation}>
      Go to Dashboard
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 3: Form Save State</h3>
        <CodeBlock
          title="Track Form Saving"
          code={`function FormSaveIndicator() {
  const isSaving = useIsMutating({
    mutationKey: ['saveForm'],
  });
  
  return (
    <form>
      <input name="name" />
      <button type="submit" disabled={isSaving > 0}>
        {isSaving > 0 ? 'Saving...' : 'Save'}
      </button>
      {isSaving > 0 && (
        <div className="saving-indicator">Saving form...</div>
      )}
    </form>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Case 4: Multiple Mutation Types</h3>
        <CodeBlock
          title="Track Different Mutation Types"
          code={`function MultipleIndicators() {
  const allMutating = useIsMutating();
  const isCreating = useIsMutating({ mutationKey: ['create'] });
  const isUpdating = useIsMutating({ mutationKey: ['update'] });
  const isDeleting = useIsMutating({ mutationKey: ['delete'] });
  
  return (
    <div>
      <div>Total: {allMutating}</div>
      <div>Creating: {isCreating}</div>
      <div>Updating: {isUpdating}</div>
      <div>Deleting: {isDeleting}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Advanced Patterns</h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Unsaved Changes Warning</h3>
        <CodeBlock
          title="Warn About Unsaved Changes"
          code={`import { useEffect } from 'react';
import { useIsMutating } from '@tanstack/react-query';

function UnsavedChangesWarning() {
  const isMutating = useIsMutating();
  
  useEffect(() => {
    if (isMutating > 0) {
      // Warn before leaving page
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isMutating]);
  
  return (
    <div>
      {isMutating > 0 && (
        <div className="warning">
          You have unsaved changes
        </div>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Mutation Progress</h3>
        <CodeBlock
          title="Show Mutation Progress"
          code={`function MutationProgress() {
  const isMutating = useIsMutating();
  const totalMutations = 5; // Example: batch operation
  
  const progress = totalMutations > 0 
    ? ((totalMutations - isMutating) / totalMutations) * 100 
    : 0;
  
  return (
    <div>
      {isMutating > 0 && (
        <div>
          <div>Progress: {progress.toFixed(0)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: \`\${progress}%\` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}`}
        />
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">5.4 useQueries Hook (Deep Dive)</strong>
          for advanced patterns with dynamic parallel queries.
        </p>
      </div>
    </LessonLayout>
  );
}

