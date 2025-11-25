'use client'

import { useState } from 'react'
import { queryDiscoveryEngine } from '@/lib/discovery-engine-api'

export default function TestDiscoveryPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Querying Discovery Engine with:', query)
      const response = await queryDiscoveryEngine(query, 10)
      console.log('Discovery Engine response:', response)
      setResult(response)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = [
    "What are the education policies in Andhra Pradesh?",
    "Tell me about teacher transfer policies",
    "What are the scholarship schemes available?",
    "Explain the Right to Education Act",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🧪 Discovery Engine Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your Google Discovery Engine connection directly from the frontend
          </p>
        </div>

        {/* Configuration Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 Configuration
          </h2>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>Project ID:</strong> 922876587313</p>
            <p><strong>Engine ID:</strong> ai-policy-assistant_1763955939617</p>
            <p><strong>Location:</strong> global</p>
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? '✅ Configured' : '❌ Missing'}</p>
            <p><strong>Direct Mode:</strong> {process.env.NEXT_PUBLIC_USE_DISCOVERY_ENGINE_DIRECT === 'true' ? '✅ Enabled' : '❌ Disabled'}</p>
          </div>
        </div>

        {/* Query Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ask a question about education policies:
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are the education policies in Andhra Pradesh?"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching...
                  </span>
                ) : (
                  '🔍 Search & Get Answer'
                )}
              </button>
              <button
                type="button"
                onClick={() => { setQuery(''); setResult(null); setError(null); }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Sample Queries */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these sample queries:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(sample)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              ❌ Error
            </h2>
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Answer */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Answer
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {result.answer || 'No answer generated'}
                </p>
              </div>
            </div>

            {/* Citations */}
            {result.citations && result.citations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Citations ({result.citations.length})
                </h2>
                <div className="space-y-3">
                  {result.citations.map((cite: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {cite.span || cite.docId}
                          </p>
                          {cite.source_url && (
                            <a
                              href={cite.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                            >
                              {cite.source_url}
                            </a>
                          )}
                        </div>
                        {cite.score && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                            {(cite.score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {result.searchResults && result.searchResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  Search Results ({result.searchResults.length})
                </h2>
                <div className="space-y-4">
                  {result.searchResults.map((searchResult: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {searchResult.title || 'Untitled'}
                        </h3>
                        {searchResult.relevanceScore && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded whitespace-nowrap">
                            Score: {searchResult.relevanceScore.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {searchResult.snippet}
                      </p>
                      {searchResult.link && (
                        <a
                          href={searchResult.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {searchResult.link}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Metadata
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Query ID</p>
                  <p className="font-mono text-gray-900 dark:text-white break-all">
                    {result.metadata?.queryId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Processing Time</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    {result.metadata?.processingTimeMs}ms
                  </p>
                </div>
              </div>
            </div>

            {/* Raw JSON */}
            <details className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <summary className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                🔧 Raw JSON Response (Click to expand)
              </summary>
              <pre className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-auto max-h-96 border border-gray-200 dark:border-gray-700">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Back to Chat */}
        <div className="mt-8 text-center">
          <a
            href="/chat"
            className="inline-block px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            ← Back to Chat
          </a>
        </div>
      </div>
    </div>
  )
}
