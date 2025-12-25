import Navigation from './Navigation';

export default function LessonLayout({ children, title, description }) {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Navigation />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600">{description}</p>
            )}
          </div>
          <div className="prose max-w-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

