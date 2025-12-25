import Link from 'next/link';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Navigation />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              TanStack Query Learning Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Master React Query (TanStack Query) from fundamentals to advanced patterns
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Welcome!</h2>
            <p className="text-gray-700 mb-4">
              This comprehensive learning platform covers every aspect of TanStack Query,
              from basic setup to advanced patterns and real-world scenarios.
            </p>
            <p className="text-gray-700">
              Use the navigation sidebar to explore different lessons. Each lesson includes
              detailed explanations, code examples, and practical demonstrations.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              Start with <Link href="/phase1/setup" className="text-blue-600 hover:text-blue-700 underline">Phase 1.1: Setup & Installation</Link> to learn how to install and configure TanStack Query.
            </p>
            <p className="text-gray-700">
              Follow the lessons in order for the best learning experience, or jump to specific topics that interest you.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
