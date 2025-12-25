export default function CodeBlock({ title, code, language = 'javascript' }) {
  return (
    <div className="my-6">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      )}
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700">
        <code className={`text-sm text-gray-100 font-mono`}>{code}</code>
      </pre>
    </div>
  );
}

