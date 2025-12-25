'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    title: 'Phase 1: Foundations & Core Concepts',
    lessons: [
      { id: '1.1', title: '1.1 Setup & Installation', href: '/phase1/setup' },
      { id: '1.2', title: '1.2 Basic Query Concepts', href: '/phase1/basic-concepts' },
      { id: '1.3', title: '1.3 useQuery Hook - Part 1', href: '/phase1/usequery-basics' },
      { id: '1.3b', title: '1.3 useQuery Hook - Part 2', href: '/phase1/usequery-options' },
      { id: '1.3c', title: '1.3 useQuery Hook - Part 3', href: '/phase1/usequery-advanced' },
      { id: '1.4', title: '1.4 Query Client Methods - Part 1', href: '/phase1/query-client-basics' },
      { id: '1.4b', title: '1.4 Query Client Methods - Part 2', href: '/phase1/query-client-advanced' },
    ],
  },
  {
    title: 'Phase 2: Mutations & Data Modification',
    lessons: [
      { id: '2.1', title: '2.1 useMutation Hook - Part 1', href: '/phase2/usemutation-basics' },
      { id: '2.1b', title: '2.1 useMutation Hook - Part 2', href: '/phase2/usemutation-options' },
      { id: '2.2', title: '2.2 Optimistic Updates', href: '/phase2/optimistic-updates' },
      { id: '2.3', title: '2.3 useMutationState Hook', href: '/phase2/usemutation-state' },
    ],
  },
  {
    title: 'Phase 3: Advanced Query Patterns',
    lessons: [
      { id: '3.1', title: '3.1 Dependent Queries', href: '/phase3/dependent-queries' },
      { id: '3.2', title: '3.2 Parallel Queries - Part 1', href: '/phase3/parallel-queries-basics' },
      { id: '3.2b', title: '3.2 Parallel Queries - Part 2', href: '/phase3/parallel-queries-advanced' },
      { id: '3.3', title: '3.3 Infinite Queries - Part 1', href: '/phase3/infinite-queries-basics' },
      { id: '3.3b', title: '3.3 Infinite Queries - Part 2', href: '/phase3/infinite-queries-advanced' },
      { id: '3.4', title: '3.4 Query Cancellation', href: '/phase3/query-cancellation' },
    ],
  },
  {
    title: 'Phase 4: Caching & State Management',
    lessons: [
      { id: '4.1', title: '4.1 Cache Configuration', href: '/phase4/cache-configuration' },
      { id: '4.2', title: '4.2 Query Invalidation', href: '/phase4/query-invalidation' },
      { id: '4.3', title: '4.3 Prefetching', href: '/phase4/prefetching' },
      { id: '4.4', title: '4.4 Background Refetching', href: '/phase4/background-refetching' },
      { id: '4.5', title: '4.5 Data Transformation', href: '/phase4/data-transformation' },
    ],
  },
  {
    title: 'Phase 5: Advanced Hooks & Utilities',
    lessons: [
      { id: '5.1', title: '5.1 useQueryClient Hook', href: '/phase5/usequeryclient' },
      { id: '5.2', title: '5.2 useIsFetching Hook', href: '/phase5/useisfetching' },
      { id: '5.3', title: '5.3 useIsMutating Hook', href: '/phase5/useismutating' },
      { id: '5.4', title: '5.4 useQueries Hook (Deep Dive)', href: '/phase5/usequeries-deep' },
      { id: '5.5', title: '5.5 useSuspenseQuery (v5+)', href: '/phase5/usesuspensequery' },
      { id: '5.6', title: '5.6 useSuspenseInfiniteQuery (v5+)', href: '/phase5/usesuspenseinfinitequery' },
      { id: '5.7', title: '5.7 useSuspenseQueries (v5+)', href: '/phase5/usesuspensequeries' },
    ],
  },
  {
    title: 'Phase 6: Error Handling & Loading States',
    lessons: [
      { id: '6.1', title: '6.1 Error Handling Patterns', href: '/phase6/error-handling' },
      { id: '6.2', title: '6.2 Loading States', href: '/phase6/loading-states' },
      { id: '6.3', title: '6.3 Error States', href: '/phase6/error-states' },
    ],
  },
  {
    title: 'Phase 7: TypeScript Integration',
    lessons: [
      { id: '7.1', title: '7.1 TypeScript Basics', href: '/phase7/typescript-basics' },
      { id: '7.2', title: '7.2 Advanced TypeScript', href: '/phase7/typescript-advanced' },
      { id: '7.3', title: '7.3 TypeScript Utilities', href: '/phase7/typescript-utilities' },
    ],
  },
  {
    title: 'Phase 8: Query Client Configuration',
    lessons: [
      { id: '8.1', title: '8.1 Default Options', href: '/phase8/default-options' },
      { id: '8.2', title: '8.2 Query Client Options', href: '/phase8/query-client-options' },
      { id: '8.3', title: '8.3 Cache Configuration', href: '/phase8/cache-configuration' },
    ],
  },
  {
    title: 'Phase 9: DevTools & Debugging',
    lessons: [
      { id: '9.1', title: '9.1 React Query DevTools', href: '/phase9/devtools' },
      { id: '9.2', title: '9.2 Debugging Techniques', href: '/phase9/debugging' },
    ],
  },
  {
    title: 'Phase 10: Server State vs Client State',
    lessons: [
      { id: '10.1', title: '10.1 Understanding State Types', href: '/phase10/state-types' },
      { id: '10.2', title: '10.2 Hybrid Approaches', href: '/phase10/hybrid-approaches' },
    ],
  },
  {
    title: 'Phase 11: Performance Optimization',
    lessons: [
      { id: '11.1', title: '11.1 Query Optimization', href: '/phase11/query-optimization' },
      { id: '11.2', title: '11.2 Rendering Optimization', href: '/phase11/rendering-optimization' },
      { id: '11.3', title: '11.3 Network Optimization', href: '/phase11/network-optimization' },
    ],
  },
  {
    title: 'Phase 12: Advanced Patterns & Best Practices',
    lessons: [
      { id: '12.1', title: '12.1 Custom Hooks', href: '/phase12/custom-hooks' },
      { id: '12.2', title: '12.2 Query Key Management', href: '/phase12/query-key-management' },
      { id: '12.3', title: '12.3 Mutation Patterns', href: '/phase12/mutation-patterns' },
      { id: '12.4', title: '12.4 Error Recovery', href: '/phase12/error-recovery' },
      { id: '12.5', title: '12.5 Offline Support', href: '/phase12/offline-support' },
    ],
  },
  {
    title: 'Phase 13: Testing',
    lessons: [
      { id: '13.1', title: '13.1 Testing Queries', href: '/phase13/testing-queries' },
      { id: '13.2', title: '13.2 Testing Mutations', href: '/phase13/testing-mutations' },
      { id: '13.3', title: '13.3 Testing Utilities', href: '/phase13/testing-utilities' },
      { id: '13.4', title: '13.4 Integration Testing', href: '/phase13/integration-testing' },
    ],
  },
  {
    title: 'Phase 14: SSR & Next.js Patterns (Understanding Only)',
    lessons: [
      { id: '14.1', title: '14.1 SSR Concepts', href: '/phase14/ssr-concepts' },
      { id: '14.2', title: '14.2 Next.js Integration Patterns', href: '/phase14/nextjs-patterns' },
    ],
  },
  {
    title: 'Phase 15: Migration & Version Updates',
    lessons: [
      { id: '15.1', title: '15.1 Version Differences', href: '/phase15/version-differences' },
      { id: '15.2', title: '15.2 Migration Strategies', href: '/phase15/migration-strategies' },
    ],
  },
  {
    title: 'Phase 16: Real-World Scenarios',
    lessons: [
      { id: '16.1', title: '16.1 Common Patterns', href: '/phase16/common-patterns' },
      { id: '16.2', title: '16.2 Complex Scenarios', href: '/phase16/complex-scenarios' },
      { id: '16.3', title: '16.3 Enterprise Patterns', href: '/phase16/enterprise-patterns' },
    ],
  },
  {
    title: 'Phase 17: Plugin Ecosystem & Extensions',
    lessons: [
      { id: '17.1', title: '17.1 Official Plugins', href: '/phase17/official-plugins' },
      { id: '17.2', title: '17.2 Community Patterns', href: '/phase17/community-patterns' },
    ],
  },
  {
    title: 'Phase 18: Advanced API Methods',
    lessons: [
      { id: '18.1', title: '18.1 Query Cache Methods', href: '/phase18/query-cache-methods' },
      { id: '18.2', title: '18.2 Mutation Cache Methods', href: '/phase18/mutation-cache-methods' },
      { id: '18.3', title: '18.3 Query Observer', href: '/phase18/query-observer' },
    ],
  },
  {
    title: 'Phase 19: Edge Cases & Gotchas',
    lessons: [
      { id: '19.1', title: '19.1 Common Pitfalls', href: '/phase19/common-pitfalls' },
      { id: '19.2', title: '19.2 Advanced Edge Cases', href: '/phase19/advanced-edge-cases' },
    ],
  },
  {
    title: 'Phase 20: Mastery & Optimization',
    lessons: [
      { id: '20.1', title: '20.1 Performance Tuning', href: '/phase20/performance-tuning' },
      { id: '20.2', title: '20.2 Architecture Patterns', href: '/phase20/architecture-patterns' },
      { id: '20.3', title: '20.3 Best Practices Summary', href: '/phase20/best-practices-summary' },
    ],
  },
  {
    title: 'Phase 21: Interview Cheatsheet',
    lessons: [
      { id: '21.1', title: '21.1 Hooks & API Cheatsheet', href: '/phase21/hooks-api-cheatsheet' },
      { id: '21.2', title: '21.2 Interview Questions & Answers', href: '/phase21/interview-questions' },
      { id: '21.3', title: '21.3 Common Patterns & Solutions', href: '/phase21/common-patterns' },
      { id: '21.4', title: '21.4 Quick Reference Guide', href: '/phase21/quick-reference' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-50 text-gray-900 h-screen overflow-y-auto fixed left-0 top-0 p-6 border-r border-gray-200">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          TanStack Query
        </Link>
        <p className="text-sm text-gray-600 mt-2">Learning Platform</p>
      </div>

      {navigation.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.lessons.map((lesson) => {
              const isActive = pathname === lesson.href;
              return (
                <li key={lesson.id}>
                  <Link
                    href={lesson.href}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

