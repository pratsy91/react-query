import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function StateTypesPage() {
  return (
    <LessonLayout
      title="10.1 Understanding State Types"
      description="Learn the difference between server state and client state, when to use React Query, and when to use other state management solutions"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">State Types in React Applications</h2>
        <p className="text-gray-700 mb-4">
          Understanding the difference between server state and client state is crucial for
          choosing the right state management solution. React Query is designed specifically
          for server state, not client state.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Two Main State Types:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Server State</strong> - Data from backend/API</li>
            <li><strong>Client State</strong> - UI state, form state, local preferences</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Server State Characteristics</h2>
        <p className="text-gray-700 mb-4">
          Server state has unique characteristics that make it different from client state.
          Understanding these helps you recognize when to use React Query.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Key Characteristics</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Asynchronous</strong> - Requires network requests</li>
            <li><strong>Shared ownership</strong> - Multiple components may need the same data</li>
            <li><strong>Stale over time</strong> - Data becomes outdated</li>
            <li><strong>Requires synchronization</strong> - Needs to stay in sync with server</li>
            <li><strong>Pagination/caching</strong> - Often needs pagination and caching</li>
            <li><strong>Error handling</strong> - Network errors need special handling</li>
            <li><strong>Background updates</strong> - May need to update in background</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Server State Examples</h3>
        <CodeBlock
          title="Examples of Server State"
          code={`// ✅ Server State - Use React Query

// User data from API
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// List of posts
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
});

// Product catalog
const { data: products } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => fetchProducts(filters),
});

// Comments for a post
const { data: comments } = useQuery({
  queryKey: ['comments', postId],
  queryFn: () => fetchComments(postId),
});

// All of these are:
// - Fetched from server
// - Shared across components
// - Become stale over time
// - Need caching and synchronization`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Client State Characteristics</h2>
        <p className="text-gray-700 mb-4">
          Client state is local to your application and doesn't require server synchronization.
          It's typically synchronous and component-specific.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Key Characteristics</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Synchronous</strong> - No network requests needed</li>
            <li><strong>Component-specific</strong> - Often scoped to a component</li>
            <li><strong>Always fresh</strong> - Doesn't become stale</li>
            <li><strong>No synchronization</strong> - Doesn't need server sync</li>
            <li><strong>Simple updates</strong> - Direct state updates</li>
            <li><strong>UI state</strong> - Controls UI behavior</li>
            <li><strong>Form state</strong> - Input values, validation</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Client State Examples</h3>
        <CodeBlock
          title="Examples of Client State"
          code={`// ✅ Client State - Use useState, useReducer, or Context

// Modal open/closed state
const [isModalOpen, setIsModalOpen] = useState(false);

// Form input values
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

// UI theme preference
const [theme, setTheme] = useState('light');

// Sidebar collapsed state
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// Selected items in a list
const [selectedItems, setSelectedItems] = useState([]);

// All of these are:
// - Local to component/application
// - Don't require server requests
// - Don't become stale
// - Simple state updates`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">When to Use React Query</h2>
        <p className="text-gray-700 mb-4">
          React Query is perfect for server state management. Use it when you need to fetch,
          cache, and synchronize data from a server.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use React Query For:</h3>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>API data fetching</strong> - GET requests to fetch data</li>
            <li><strong>Data mutations</strong> - POST, PUT, DELETE requests</li>
            <li><strong>Caching server data</strong> - Cache API responses</li>
            <li><strong>Background refetching</strong> - Keep data fresh</li>
            <li><strong>Optimistic updates</strong> - Update UI before server confirms</li>
            <li><strong>Pagination</strong> - Infinite queries and pagination</li>
            <li><strong>Dependent queries</strong> - Queries that depend on other queries</li>
            <li><strong>Shared server state</strong> - Data used across multiple components</li>
          </ul>
        </div>

        <CodeBlock
          title="React Query Use Cases"
          code={`// ✅ Perfect for React Query

// Fetching user data
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Fetching paginated data
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// Mutating data
const mutation = useMutation({
  mutationFn: (data) => updateUser(userId, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['user', userId]);
  },
});

// Dependent queries
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId,
});

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: () => fetchUserPosts(user.id),
  enabled: !!user, // Depends on user query
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">When to Use Other State Management</h2>
        <p className="text-gray-700 mb-4">
          For client state, use React's built-in state management or other libraries designed
          for client state. React Query is not designed for client state.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use useState For:</h3>
        <CodeBlock
          title="Simple Client State with useState"
          code={`// ✅ Use useState for simple client state

// Modal state
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Modal content</div>}
    </>
  );
}

// Form state
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return <form>...</form>;
}

// Toggle state
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use useReducer For:</h3>
        <CodeBlock
          title="Complex Client State with useReducer"
          code={`// ✅ Use useReducer for complex client state

// Complex form with validation
function ComplexForm() {
  const [state, dispatch] = useReducer(formReducer, {
    values: {},
    errors: {},
    touched: {},
    isValid: false,
  });

  return <form>...</form>;
}

// Shopping cart
function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    discount: 0,
  });

  return <div>...</div>;
}

// Multi-step wizard
function Wizard() {
  const [state, dispatch] = useReducer(wizardReducer, {
    currentStep: 1,
    steps: [],
    data: {},
  });

  return <div>...</div>;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Context For:</h3>
        <CodeBlock
          title="Shared Client State with Context"
          code={`// ✅ Use Context for shared client state

// Theme context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Auth context (client-side auth state)
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// UI preferences
const PreferencesContext = createContext();

function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    language: 'en',
    notifications: true,
    sidebarCollapsed: false,
  });
  
  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Use Zustand/Redux For:</h3>
        <CodeBlock
          title="Global Client State with Zustand/Redux"
          code={`// ✅ Use Zustand/Redux for global client state

// Zustand example
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Redux example
import { createStore } from 'redux';

const store = createStore((state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
});

// Use for:
// - Global UI state
// - Complex state logic
// - State that needs middleware
// - Time-travel debugging`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Decision Matrix</h2>
        <p className="text-gray-700 mb-4">
          Use this decision matrix to choose the right state management solution.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Choose React Query if:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Data comes from a server/API</li>
            <li>Data needs caching</li>
            <li>Data becomes stale over time</li>
            <li>Data needs background updates</li>
            <li>Data is shared across components</li>
            <li>You need loading/error states</li>
            <li>You need pagination/infinite scroll</li>
          </ul>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Choose useState/useReducer if:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>State is local to a component</li>
            <li>State doesn't need server sync</li>
            <li>State is simple (useState) or complex (useReducer)</li>
            <li>State is UI-specific (modals, forms, toggles)</li>
          </ul>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Choose Context if:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>State needs to be shared across components</li>
            <li>State is client-side only</li>
            <li>State doesn't change frequently</li>
            <li>State is theme, preferences, or UI settings</li>
          </ul>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Choose Zustand/Redux if:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>State is global and complex</li>
            <li>State needs middleware</li>
            <li>State needs time-travel debugging</li>
            <li>State has complex update logic</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Common Mistakes</h2>
        <p className="text-gray-700 mb-4">
          Avoid these common mistakes when choosing state management solutions.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mistake 1: Using React Query for Client State</h3>
        <CodeBlock
          title="❌ Don't Use React Query for Client State"
          code={`// ❌ WRONG - Don't use React Query for client state

// Modal state - this is client state!
const { data: isOpen, mutate: setIsOpen } = useMutation({
  mutationFn: (value) => Promise.resolve(value),
});

// Form state - this is client state!
const { data: formData } = useQuery({
  queryKey: ['form'],
  queryFn: () => Promise.resolve({ name: '', email: '' }),
});

// ✅ CORRECT - Use useState
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mistake 2: Using useState for Server State</h3>
        <CodeBlock
          title="❌ Don't Use useState for Server State"
          code={`// ❌ WRONG - Don't use useState for server state

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchUser(userId)
    .then(setUser)
    .catch(setError)
    .finally(() => setLoading(false));
}, [userId]);

// Problems:
// - No caching
// - No background refetching
// - Manual loading/error handling
// - No deduplication
// - No invalidation

// ✅ CORRECT - Use React Query
const { data: user, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mistake 3: Mixing State Types</h3>
        <CodeBlock
          title="❌ Don't Mix State Types Incorrectly"
          code={`// ❌ WRONG - Mixing server and client state

const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Storing server data in client state
const [localUser, setLocalUser] = useState(user);

// This creates sync issues and duplicates state

// ✅ CORRECT - Use React Query for server state
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Use user directly from query
// If you need to modify, use mutations`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use React Query for server state</strong> - API data, mutations, caching</li>
            <li><strong>Use useState for simple client state</strong> - Modals, forms, toggles</li>
            <li><strong>Use useReducer for complex client state</strong> - Complex forms, wizards</li>
            <li><strong>Use Context for shared client state</strong> - Theme, preferences</li>
            <li><strong>Use Zustand/Redux for global state</strong> - Complex global state</li>
            <li><strong>Don't duplicate state</strong> - Don't store server state in client state</li>
            <li><strong>Keep state close to usage</strong> - Use local state when possible</li>
            <li><strong>Choose the right tool</strong> - Match the tool to the problem</li>
          </ul>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">10.2 Hybrid Approaches</strong>
          to combine React Query with Context, Zustand, Redux, and state synchronization.
        </p>
      </div>
    </LessonLayout>
  );
}

