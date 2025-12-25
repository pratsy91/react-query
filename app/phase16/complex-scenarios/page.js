import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function ComplexScenariosPage() {
  return (
    <LessonLayout
      title="16.2 Complex Scenarios"
      description="Learn complex real-world scenarios: multi-step forms, wizard patterns, dependent dropdowns, master-detail views, dashboard data aggregation, and report generation"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Complex Real-World Scenarios</h2>
        <p className="text-gray-700 mb-4">
          Complex scenarios require combining multiple React Query patterns. These examples
          show how to handle sophisticated use cases.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Complex Scenarios:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Multi-step forms</li>
            <li>Wizard patterns</li>
            <li>Dependent dropdowns</li>
            <li>Master-detail views</li>
            <li>Dashboard data aggregation</li>
            <li>Report generation</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Multi-Step Forms</h2>
        <p className="text-gray-700 mb-4">
          Multi-step forms require managing form state across steps and validating/saving
          data at each stage.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Multi-Step Form Pattern</h3>
        <CodeBlock
          title="Multi-Step Form with React Query"
          code={`import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useMultiStepForm() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const saveStepMutation = useMutation({
    mutationFn: (stepData) => 
      fetch('/api/form/save-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, data: stepData }),
      }).then(r => r.json()),
    onSuccess: (data) => {
      // Cache form data
      queryClient.setQueryData(['form', 'step', step], data);
      setFormData({ ...formData, ...data });
    },
  });

  const submitFormMutation = useMutation({
    mutationFn: (finalData) =>
      fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['forms']);
    },
  });

  const nextStep = (stepData) => {
    saveStepMutation.mutate(stepData);
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submit = (finalData) => {
    submitFormMutation.mutate(finalData);
  };

  return {
    step,
    formData,
    nextStep,
    prevStep,
    submit,
    isSaving: saveStepMutation.isPending,
    isSubmitting: submitFormMutation.isPending,
  };
}

// Usage
function MultiStepForm() {
  const { step, nextStep, prevStep, submit, isSaving } = useMultiStepForm();

  return (
    <div>
      {step === 1 && <Step1 onNext={nextStep} />}
      {step === 2 && <Step2 onNext={nextStep} onPrev={prevStep} />}
      {step === 3 && <Step3 onSubmit={submit} onPrev={prevStep} />}
      {isSaving && <div>Saving...</div>}
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Wizard Patterns</h2>
        <p className="text-gray-700 mb-4">
          Wizards guide users through complex processes with validation and progress tracking.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Wizard with Validation</h3>
        <CodeBlock
          title="Wizard Pattern Implementation"
          code={`function useWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({});
  const queryClient = useQueryClient();

  const validateStep = useMutation({
    mutationFn: ({ step, data }) =>
      fetch(\`/api/wizard/validate/\${step}\`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(r => r.json()),
  });

  const saveProgress = useMutation({
    mutationFn: (data) =>
      fetch('/api/wizard/save', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: (data) => {
      queryClient.setQueryData(['wizard', 'progress'], data);
    },
  });

  const nextStep = async (stepData) => {
    const validation = await validateStep.mutateAsync({
      step: currentStep,
      data: stepData,
    });

    if (validation.valid) {
      const updatedData = { ...wizardData, ...stepData };
      setWizardData(updatedData);
      saveProgress.mutate(updatedData);
      setCurrentStep(currentStep + 1);
    } else {
      // Handle validation errors
      console.error(validation.errors);
    }
  };

  return {
    currentStep,
    wizardData,
    nextStep,
    setCurrentStep,
    isValidationPending: validateStep.isPending,
  };
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dependent Dropdowns</h2>
        <p className="text-gray-700 mb-4">
          Dependent dropdowns where one dropdown's options depend on another's selection.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Cascading Dropdowns</h3>
        <CodeBlock
          title="Dependent Dropdown Pattern"
          code={`function useDependentDropdowns() {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  // First dropdown: Countries
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => fetch('/api/countries').then(r => r.json()),
  });

  // Second dropdown: States (depends on country)
  const { data: states } = useQuery({
    queryKey: ['states', country],
    queryFn: () => fetch(\`/api/states?country=\${country}\`).then(r => r.json()),
    enabled: !!country,
  });

  // Third dropdown: Cities (depends on state)
  const { data: cities } = useQuery({
    queryKey: ['cities', state],
    queryFn: () => fetch(\`/api/cities?state=\${state}\`).then(r => r.json()),
    enabled: !!state,
  });

  // Reset dependent dropdowns when parent changes
  useEffect(() => {
    if (country) setState(null);
  }, [country]);

  useEffect(() => {
    if (state) setCity(null);
  }, [state]);

  return {
    countries,
    states,
    cities,
    country,
    state,
    city,
    setCountry,
    setState,
    setCity,
  };
}

// Usage
function LocationSelector() {
  const {
    countries,
    states,
    cities,
    country,
    state,
    city,
    setCountry,
    setState,
    setCity,
  } = useDependentDropdowns();

  return (
    <div>
      <select value={country || ''} onChange={(e) => setCountry(e.target.value)}>
        <option value="">Select Country</option>
        {countries?.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select 
        value={state || ''} 
        onChange={(e) => setState(e.target.value)}
        disabled={!country}
      >
        <option value="">Select State</option>
        {states?.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select 
        value={city || ''} 
        onChange={(e) => setCity(e.target.value)}
        disabled={!state}
      >
        <option value="">Select City</option>
        {cities?.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Master-Detail Views</h2>
        <p className="text-gray-700 mb-4">
          Master-detail views show a list (master) and details of selected item (detail).
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Master-Detail Pattern</h3>
        <CodeBlock
          title="Master-Detail Implementation"
          code={`function MasterDetailView() {
  const [selectedId, setSelectedId] = useState(null);

  // Master: List of items
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: () => fetch('/api/items').then(r => r.json()),
  });

  // Detail: Selected item
  const { data: item } = useQuery({
    queryKey: ['item', selectedId],
    queryFn: () => fetch(\`/api/items/\${selectedId}\`).then(r => r.json()),
    enabled: !!selectedId,
  });

  // Prefetch on hover
  const queryClient = useQueryClient();
  const handleItemHover = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['item', id],
      queryFn: () => fetch(\`/api/items/\${id}\`).then(r => r.json()),
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px' }}>
        <h2>Items</h2>
        {items?.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            onMouseEnter={() => handleItemHover(item.id)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: selectedId === item.id ? '#e0e0e0' : 'white',
            }}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {selectedId ? (
          item ? (
            <div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <div>Select an item</div>
        )}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Dashboard Data Aggregation</h2>
        <p className="text-gray-700 mb-4">
          Dashboards aggregate data from multiple sources and display summaries and metrics.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Dashboard with Multiple Queries</h3>
        <CodeBlock
          title="Dashboard Aggregation Pattern"
          code={`import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

function useDashboardData() {
  // Fetch multiple data sources in parallel
  const results = useQueries({
    queries: [
      {
        queryKey: ['stats', 'users'],
        queryFn: () => fetch('/api/stats/users').then(r => r.json()),
      },
      {
        queryKey: ['stats', 'orders'],
        queryFn: () => fetch('/api/stats/orders').then(r => r.json()),
      },
      {
        queryKey: ['stats', 'revenue'],
        queryFn: () => fetch('/api/stats/revenue').then(r => r.json()),
      },
      {
        queryKey: ['stats', 'products'],
        queryFn: () => fetch('/api/stats/products').then(r => r.json()),
      },
    ],
  });

  // Aggregate data
  const dashboardData = useMemo(() => {
    const [users, orders, revenue, products] = results.map(r => r.data);

    return {
      users: users || 0,
      orders: orders || 0,
      revenue: revenue || 0,
      products: products || 0,
      isLoading: results.some(r => r.isLoading),
      isError: results.some(r => r.isError),
    };
  }, [results]);

  return dashboardData;
}

// Usage
function Dashboard() {
  const { users, orders, revenue, products, isLoading } = useDashboardData();

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div>Users: {users}</div>
      <div>Orders: {orders}</div>
      <div>Revenue: {revenue}</div>
      <div>Products: {products}</div>
    </div>
  );
}`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Report Generation</h2>
        <p className="text-gray-700 mb-4">
          Reports often require complex data fetching, filtering, and aggregation before display.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Report Generation Pattern</h3>
        <CodeBlock
          title="Report with Filters and Aggregation"
          code={`function useReport(filters) {
  // Fetch raw data
  const { data: rawData } = useQuery({
    queryKey: ['report', 'data', filters],
    queryFn: () => 
      fetch(\`/api/report/data?\${new URLSearchParams(filters)}\`).then(r => r.json()),
  });

  // Process and aggregate data
  const reportData = useQuery({
    queryKey: ['report', 'processed', filters],
    queryFn: () => rawData,
    enabled: !!rawData,
    select: (data) => {
      // Aggregate by category
      const byCategory = data.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = { count: 0, total: 0, items: [] };
        }
        acc[category].count++;
        acc[category].total += item.amount;
        acc[category].items.push(item);
        return acc;
      }, {});

      // Calculate totals
      const totals = {
        totalItems: data.length,
        totalAmount: data.reduce((sum, item) => sum + item.amount, 0),
        categories: Object.keys(byCategory).length,
      };

      return {
        byCategory,
        totals,
        rawData: data,
      };
    },
  });

  return reportData;
}

// Usage
function ReportView({ filters }) {
  const { data: report, isLoading } = useReport(filters);

  if (isLoading) return <div>Generating report...</div>;

  return (
    <div>
      <h2>Report Summary</h2>
      <div>Total Items: {report.totals.totalItems}</div>
      <div>Total Amount: {report.totals.totalAmount}</div>
      
      <h3>By Category</h3>
      {Object.entries(report.byCategory).map(([category, data]) => (
        <div key={category}>
          <h4>{category}</h4>
          <div>Count: {data.count}</div>
          <div>Total: {data.total}</div>
        </div>
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
            <li><strong>Manage form state</strong> - Use React state for form data</li>
            <li><strong>Validate before proceeding</strong> - Check data at each step</li>
            <li><strong>Use enabled for dependencies</strong> - Control query execution</li>
            <li><strong>Prefetch related data</strong> - Improve perceived performance</li>
            <li><strong>Aggregate efficiently</strong> - Use select for transformations</li>
            <li><strong>Cache intermediate results</strong> - Avoid redundant calculations</li>
            <li><strong>Handle loading states</strong> - Show progress appropriately</li>
            <li><strong>Reset dependent state</strong> - Clear child selections when parent changes</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Next:</strong> Learn about <strong className="ml-1">16.3 Enterprise Patterns</strong>
          for authentication flows, permission-based queries, multi-tenant data, data synchronization, and conflict resolution.
        </p>
      </div>
    </LessonLayout>
  );
}

