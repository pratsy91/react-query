import LessonLayout from '../../components/LessonLayout';
import CodeBlock from '../../components/CodeBlock';

export default function CommunityPatternsPage() {
  return (
    <LessonLayout
      title="17.2 Community Patterns"
      description="Understand community patterns: custom plugins, middleware patterns, and interceptors"
    >
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Community Patterns</h2>
        <p className="text-gray-700 mb-4">
          Community patterns extend React Query beyond official plugins. Understanding these
          patterns helps you build custom solutions.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Patterns:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Custom plugins</li>
            <li>Middleware patterns</li>
            <li>Interceptors</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Custom Plugins</h2>
        <p className="text-gray-700 mb-4">
          Create custom plugins to extend React Query with application-specific functionality.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Plugin Structure</h3>
        <CodeBlock
          title="Custom Plugin Pattern"
          code={`// Custom plugin structure:

function createCustomPlugin(options = {}) {
  return {
    // Plugin name
    name: 'customPlugin',
    
    // Initialize plugin
    onInit: (queryClient) => {
      // Setup logic
      console.log('Plugin initialized');
    },
    
    // Cleanup plugin
    onDestroy: (queryClient) => {
      // Cleanup logic
      console.log('Plugin destroyed');
    },
    
    // Hook into query lifecycle
    onQueryAdded: (query) => {
      // Called when query is added
    },
    
    onQueryUpdated: (query) => {
      // Called when query is updated
    },
    
    onQueryRemoved: (query) => {
      // Called when query is removed
    },
  };
}

// Usage
const queryClient = new QueryClient({
  plugins: [createCustomPlugin()],
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Example: Logging Plugin</h3>
        <CodeBlock
          title="Custom Logging Plugin"
          code={`// Custom plugin: Log all query operations
function createLoggingPlugin() {
  return {
    name: 'loggingPlugin',
    
    onQueryAdded: (query) => {
      console.log('Query added:', query.queryKey);
    },
    
    onQueryUpdated: (query) => {
      console.log('Query updated:', query.queryKey, query.state.status);
    },
    
    onQueryRemoved: (query) => {
      console.log('Query removed:', query.queryKey);
    },
    
    onMutationAdded: (mutation) => {
      console.log('Mutation added:', mutation.mutationKey);
    },
    
    onMutationUpdated: (mutation) => {
      console.log('Mutation updated:', mutation.mutationKey, mutation.state.status);
    },
  };
}

// Usage
const queryClient = new QueryClient({
  plugins: [createLoggingPlugin()],
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Example: Analytics Plugin</h3>
        <CodeBlock
          title="Custom Analytics Plugin"
          code={`// Custom plugin: Track query performance
function createAnalyticsPlugin(analyticsService) {
  return {
    name: 'analyticsPlugin',
    
    onQueryUpdated: (query) => {
      if (query.state.status === 'success') {
        const duration = query.state.dataUpdatedAt - query.state.dataUpdatedAt;
        analyticsService.track('query_success', {
          queryKey: query.queryKey,
          duration,
        });
      } else if (query.state.status === 'error') {
        analyticsService.track('query_error', {
          queryKey: query.queryKey,
          error: query.state.error,
        });
      }
    },
    
    onMutationUpdated: (mutation) => {
      if (mutation.state.status === 'success') {
        analyticsService.track('mutation_success', {
          mutationKey: mutation.mutationKey,
        });
      }
    },
  };
}

// Usage
const queryClient = new QueryClient({
  plugins: [createAnalyticsPlugin(analyticsService)],
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Middleware Patterns</h2>
        <p className="text-gray-700 mb-4">
          Middleware patterns intercept and modify query/mutation behavior before execution.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Middleware</h3>
        <CodeBlock
          title="Query Middleware Pattern"
          code={`// Middleware wraps query functions
function createQueryMiddleware(middlewareFn) {
  return (queryFn) => {
    return async (context) => {
      // Pre-processing
      const modifiedContext = await middlewareFn.before?.(context);
      
      // Execute query
      const result = await queryFn(modifiedContext || context);
      
      // Post-processing
      const modifiedResult = await middlewareFn.after?.(result, context);
      
      return modifiedResult || result;
    };
  };
}

// Usage: Auth middleware
const authMiddleware = createQueryMiddleware({
  before: async (context) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    return {
      ...context,
      signal: context.signal,
      // Add token to context
      token,
    };
  },
});

// Wrap query function
const queryFn = authMiddleware(async (context) => {
  const response = await fetch('/api/data', {
    headers: {
      Authorization: \`Bearer \${context.token}\`,
    },
    signal: context.signal,
  });
  return response.json();
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Mutation Middleware</h3>
        <CodeBlock
          title="Mutation Middleware Pattern"
          code={`// Middleware for mutations
function createMutationMiddleware(middlewareFn) {
  return (mutationFn) => {
    return async (variables, context) => {
      // Pre-processing
      const modifiedVariables = await middlewareFn.before?.(variables);
      
      // Execute mutation
      const result = await mutationFn(modifiedVariables || variables, context);
      
      // Post-processing
      const modifiedResult = await middlewareFn.after?.(result, variables);
      
      return modifiedResult || result;
    };
  };
}

// Usage: Logging middleware
const loggingMiddleware = createMutationMiddleware({
  before: (variables) => {
    console.log('Mutation starting:', variables);
    return variables;
  },
  after: (result, variables) => {
    console.log('Mutation completed:', result);
    return result;
  },
});

// Wrap mutation function
const mutationFn = loggingMiddleware(async (variables) => {
  return fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify(variables),
  }).then(r => r.json());
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Interceptors</h2>
        <p className="text-gray-700 mb-4">
          Interceptors intercept requests and responses, allowing you to modify behavior,
          add headers, handle errors, and more.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Request Interceptor</h3>
        <CodeBlock
          title="Request Interception Pattern"
          code={`// Intercept requests before they're sent
function createRequestInterceptor(interceptorFn) {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    // Intercept request
    const modifiedArgs = await interceptorFn.before?.(args) || args;
    
    // Execute request
    const response = await originalFetch(...modifiedArgs);
    
    // Intercept response
    const modifiedResponse = await interceptorFn.after?.(response, args) || response;
    
    return modifiedResponse;
  };
  
  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
  };
}

// Usage: Add auth token
const cleanup = createRequestInterceptor({
  before: (args) => {
    const [url, options = {}] = args;
    const token = localStorage.getItem('token');
    
    return [
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: \`Bearer \${token}\`,
        },
      },
    ];
  },
});

// Cleanup when done
// cleanup();`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Response Interceptor</h3>
        <CodeBlock
          title="Response Interception Pattern"
          code={`// Intercept responses
function createResponseInterceptor(interceptorFn) {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Intercept response
    if (interceptorFn.onResponse) {
      return await interceptorFn.onResponse(response, args);
    }
    
    return response;
  };
  
  return () => {
    window.fetch = originalFetch;
  };
}

// Usage: Handle errors globally
const cleanup = createResponseInterceptor({
  onResponse: async (response, args) => {
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (response.status === 403) {
        // Handle forbidden
        console.error('Access denied');
      }
    }
    
    return response;
  },
});`}
        />

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Query Function Interceptor</h3>
        <CodeBlock
          title="Query Function Interception"
          code={`// Intercept query functions
function createQueryFunctionInterceptor(interceptorFn) {
  return (queryFn) => {
    return async (context) => {
      try {
        // Pre-execution
        const modifiedContext = await interceptorFn.before?.(context) || context;
        
        // Execute query
        const result = await queryFn(modifiedContext);
        
        // Post-execution
        const modifiedResult = await interceptorFn.after?.(result, context) || result;
        
        return modifiedResult;
      } catch (error) {
        // Error handling
        if (interceptorFn.onError) {
          return await interceptorFn.onError(error, context);
        }
        throw error;
      }
    };
  };
}

// Usage: Retry interceptor
const retryInterceptor = createQueryFunctionInterceptor({
  onError: async (error, context, retryCount = 0) => {
    if (retryCount < 3 && error.status >= 500) {
      // Retry on server errors
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return context.queryFn(context); // Retry
    }
    throw error;
  },
});

// Wrap query function
const queryFn = retryInterceptor(async () => {
  return fetch('/api/data').then(r => r.json());
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Combining Patterns</h2>
        <p className="text-gray-700 mb-4">
          Combine multiple patterns to create powerful custom solutions.
        </p>

        <h3 className="text-2xl font-semibold mb-3 text-gray-900 mt-6">Composed Middleware</h3>
        <CodeBlock
          title="Composing Multiple Middlewares"
          code={`// Compose multiple middlewares
function composeMiddlewares(...middlewares) {
  return (queryFn) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      queryFn
    );
  };
}

// Individual middlewares
const authMiddleware = createQueryMiddleware({
  before: async (context) => {
    const token = localStorage.getItem('token');
    return { ...context, token };
  },
});

const loggingMiddleware = createQueryMiddleware({
  before: (context) => {
    console.log('Query:', context.queryKey);
    return context;
  },
  after: (result) => {
    console.log('Result:', result);
    return result;
  },
});

const errorMiddleware = createQueryMiddleware({
  onError: (error) => {
    console.error('Query error:', error);
    // Handle error globally
    return error;
  },
});

// Compose all middlewares
const composedMiddleware = composeMiddlewares(
  authMiddleware,
  loggingMiddleware,
  errorMiddleware
);

// Use composed middleware
const queryFn = composedMiddleware(async (context) => {
  return fetch('/api/data', {
    headers: {
      Authorization: \`Bearer \${context.token}\`,
    },
  }).then(r => r.json());
});`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Best Practices</h2>
        <div className="bg-gray-100 rounded-lg p-6 my-6">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Use official plugins when possible</strong> - More reliable and maintained</li>
            <li><strong>Keep custom plugins simple</strong> - Don't over-engineer</li>
            <li><strong>Document custom patterns</strong> - Make them understandable</li>
            <li><strong>Test thoroughly</strong> - Verify plugins work correctly</li>
            <li><strong>Handle errors gracefully</strong> - Don't break React Query</li>
            <li><strong>Clean up resources</strong> - Remove listeners, close connections</li>
            <li><strong>Consider performance</strong> - Plugins add overhead</li>
            <li><strong>Share with community</strong> - Contribute useful patterns</li>
          </ul>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800">
          <strong>Congratulations!</strong> You've completed Phase 17: Plugin Ecosystem & Extensions
          and the entire React Query learning platform! You now understand official plugins,
          community patterns, custom plugins, middleware, and interceptors. You've mastered
          React Query completely!
        </p>
      </div>
    </LessonLayout>
  );
}

