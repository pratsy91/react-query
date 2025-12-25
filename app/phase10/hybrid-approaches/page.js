import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function HybridApproachesPage() {
  return (
    <LessonLayout
      title="10.2 Hybrid Approaches"
      description="Learn how to combine React Query with Context, Zustand, Redux, and implement state synchronization"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Hybrid State Management</h2>
        <p className="text-gray-700 mb-4">
          In real applications, you often need to combine React Query with other state management
          solutions. Each tool handles its own domain: React Query for server state, others for
          client state.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Hybrid Approaches:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>React Query + Context</li>
            <li>React Query + Zustand</li>
            <li>React Query + Redux</li>
            <li>State synchronization patterns</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Combining React Query with Context</h2>
        <p className="text-gray-700 mb-4">
          Use React Query for server state and Context for shared client state. They work
          together seamlessly.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Theme Example</h3>
        <CodeBlock
          title="React Query + Context for Theme"
          code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';

// Context for client state (theme)
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// React Query for server state (user preferences)
function UserPreferences() {
  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: () => fetchUserPreferences(),
  });

  // Sync server preferences with client state
  const { setTheme } = useContext(ThemeContext);
  
  useEffect(() => {
    if (preferences?.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences, setTheme]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserPreferences />
        {/* Your app */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Auth Example</h3>
        <CodeBlock
          title="React Query + Context for Auth"
          code={`import { useQuery, useMutation } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

// Context for client-side auth state
const AuthContext = createContext();

function AuthProvider({ children }) {
  // Server state: User data from API
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchCurrentUser(),
    retry: false,
  });

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
    },
  });

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    },
  });

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Usage
function Profile() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Combining with Zustand</h2>
        <p className="text-gray-700 mb-4">
          Zustand is great for global client state. Combine it with React Query for a powerful
          state management solution.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Shopping Cart Example</h3>
        <CodeBlock
          title="React Query + Zustand for Shopping Cart"
          code={`import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';

// Zustand store for client state (cart UI)
const useCartStore = create((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  selectedItems: [],
  toggleItem: (itemId) => set((state) => ({
    selectedItems: state.selectedItems.includes(itemId)
      ? state.selectedItems.filter(id => id !== itemId)
      : [...state.selectedItems, itemId],
  })),
}));

// React Query for server state (products, cart data)
function ProductsList() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const { selectedItems, toggleItem } = useCartStore();

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => toggleItem(product.id)}>
            {selectedItems.includes(product.id) ? 'Remove' : 'Add'}
          </button>
        </div>
      ))}
    </div>
  );
}

// React Query for server state (cart from API)
function Cart() {
  const { isOpen, closeCart, selectedItems } = useCartStore();
  
  // Fetch cart data from server
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => fetchCart(),
  });

  // Sync selected items with server cart
  const syncMutation = useMutation({
    mutationFn: (items) => updateCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  const handleCheckout = () => {
    syncMutation.mutate(selectedItems);
  };

  if (!isOpen) return null;

  return (
    <div>
      <h2>Cart</h2>
      {cart?.items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={closeCart}>Close</button>
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">UI Preferences Example</h3>
        <CodeBlock
          title="React Query + Zustand for UI Preferences"
          code={`import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';

// Zustand for client-side UI state
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

// React Query for server-side preferences
function UserSettings() {
  const { data: preferences } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: () => fetchUserPreferences(),
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (prefs) => updateUserPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries(['userPreferences']);
    },
  });

  const { sidebarOpen, toggleSidebar, viewMode, setViewMode } = useUIStore();

  // Sync server preferences with client state
  useEffect(() => {
    if (preferences) {
      setViewMode(preferences.viewMode);
    }
  }, [preferences, setViewMode]);

  // Save preferences to server
  const handleSave = () => {
    updatePreferencesMutation.mutate({
      viewMode,
      sidebarOpen,
    });
  };

  return (
    <div>
      <button onClick={toggleSidebar}>
        {sidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
      <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
        <option value="grid">Grid</option>
        <option value="list">List</option>
      </select>
      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Combining with Redux</h2>
        <p className="text-gray-700 mb-4">
          Redux can handle complex global state, while React Query handles server state.
          They complement each other well.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Redux + React Query Example</h3>
        <CodeBlock
          title="React Query + Redux Integration"
          code={`import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

// Redux store for client state
const store = createStore((state = { notifications: [] }, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          n => n.id !== action.payload
        ),
      };
    default:
      return state;
  }
});

// React Query for server state
function NotificationsList() {
  // Server state: Fetch notifications from API
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(),
  });

  // Client state: Local notifications from Redux
  const localNotifications = useSelector(
    state => state.notifications
  );

  const dispatch = useDispatch();

  // Sync server notifications with Redux
  useEffect(() => {
    if (notifications) {
      notifications.forEach(notification => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification,
        });
      });
    }
  }, [notifications, dispatch]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      dispatch({
        type: 'REMOVE_NOTIFICATION',
        payload: id,
      });
    },
  });

  return (
    <div>
      {localNotifications.map(notification => (
        <div key={notification.id}>
          {notification.message}
          <button onClick={() => markAsReadMutation.mutate(notification.id)}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">State Synchronization</h2>
        <p className="text-gray-700 mb-4">
          When combining React Query with other state management, you need to synchronize
          state between them. Here are common patterns.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 1: Server to Client Sync</h3>
        <CodeBlock
          title="Sync Server State to Client State"
          code={`import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';

function SyncServerToClient() {
  // Server state from React Query
  const { data: serverData } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
  });

  // Client state from Zustand
  const { setUser, user } = useStore();

  // Sync server data to client state
  useEffect(() => {
    if (serverData && serverData !== user) {
      setUser(serverData);
    }
  }, [serverData, user, setUser]);

  return null;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 2: Client to Server Sync</h3>
        <CodeBlock
          title="Sync Client State to Server"
          code={`import { useMutation } from '@tanstack/react-query';
import { useStore } from 'zustand';

function SyncClientToServer() {
  // Client state from Zustand
  const { preferences, updatePreferences } = useStore();

  // Mutation to sync to server
  const syncMutation = useMutation({
    mutationFn: (prefs) => updateServerPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries(['userPreferences']);
    },
  });

  // Debounced sync to server
  useEffect(() => {
    const timer = setTimeout(() => {
      syncMutation.mutate(preferences);
    }, 1000); // Sync after 1 second of no changes

    return () => clearTimeout(timer);
  }, [preferences, syncMutation]);

  return null;
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 3: Bidirectional Sync</h3>
        <CodeBlock
          title="Bidirectional State Synchronization"
          code={`import { useQuery, useMutation } from '@tanstack/react-query';
import { useStore } from 'zustand';

function BidirectionalSync() {
  // Server state
  const { data: serverData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchSettings(),
  });

  // Client state
  const { settings, setSettings } = useStore();

  // Sync server to client
  useEffect(() => {
    if (serverData) {
      setSettings(serverData);
    }
  }, [serverData, setSettings]);

  // Mutation for client to server
  const updateMutation = useMutation({
    mutationFn: (newSettings) => updateSettings(newSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });

  // Sync client changes to server
  const handleChange = (newSettings) => {
    setSettings(newSettings); // Update client state immediately
    updateMutation.mutate(newSettings); // Sync to server
  };

  return (
    <div>
      <input
        value={settings?.theme || ''}
        onChange={(e) => handleChange({ ...settings, theme: e.target.value })}
      />
    </div>
  );
}`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Pattern 4: Optimistic Sync</h3>
        <CodeBlock
          title="Optimistic State Synchronization"
          code={`import { useMutation } from '@tanstack/react-query';
import { useStore } from 'zustand';

function OptimisticSync() {
  const { items, addItem, removeItem } = useStore();

  // Optimistic mutation
  const addItemMutation = useMutation({
    mutationFn: (item) => addItemToServer(item),
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['items']);

      // Snapshot previous value
      const previousItems = queryClient.getQueryData(['items']);

      // Optimistically update client state
      addItem(newItem);

      // Optimistically update server cache
      queryClient.setQueryData(['items'], (old) => [...old, newItem]);

      return { previousItems };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      queryClient.setQueryData(['items'], context.previousItems);
      removeItem(newItem.id);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['items']);
    },
  });

  return (
    <button onClick={() => addItemMutation.mutate({ id: 1, name: 'New Item' })}>
      Add Item
    </button>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Separate concerns</strong> - React Query for server, others for client</li>
            <li><strong>Minimize sync</strong> - Only sync when necessary</li>
            <li><strong>Use debouncing</strong> - Debounce client-to-server sync</li>
            <li><strong>Handle conflicts</strong> - Decide which state wins in conflicts</li>
            <li><strong>Optimistic updates</strong> - Update UI immediately, sync later</li>
            <li><strong>Error handling</strong> - Rollback on sync errors</li>
            <li><strong>Keep it simple</strong> - Don't over-engineer state management</li>
            <li><strong>Document sync logic</strong> - Make sync patterns clear</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 10: Server State vs Client State.
          You now understand when to use React Query, when to use other state management, and how
          to combine them effectively. You're ready to move on to Phase 11: Real-World Patterns.
        </p>
      </div>
    </LessonLayout>
  );
}

