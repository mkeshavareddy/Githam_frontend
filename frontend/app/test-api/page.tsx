'use client'

import { useState } from 'react'

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDirectAPI = async () => {
    setLoading(true)
    setResult(null)

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    const url = `https://discoveryengine.googleapis.com/v1alpha/projects/922876587313/locations/global/collections/default_collection/engines/ai-policy-assistant_1763955939617/servingConfigs/default_search:search?key=${apiKey}`

    try {
      console.log('Testing API with URL:', url.replace(apiKey || '', 'API_KEY_HIDDEN'))

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'test query',
          pageSize: 1,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()
      console.log('Response data:', data)

      setResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
      })
    } catch (error) {
      console.error('Error:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorObject: error,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 API Diagnostics</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Configuration</h2>
        <div className="text-sm space-y-1">
          <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY.substring(0, 20)}...` : '❌ NOT SET'}</p>
          <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_DISCOVERY_ENGINE_PROJECT_ID || '❌ NOT SET'}</p>
          <p><strong>Engine ID:</strong> {process.env.NEXT_PUBLIC_DISCOVERY_ENGINE_ENGINE_ID ? `${process.env.NEXT_PUBLIC_DISCOVERY_ENGINE_ENGINE_ID.substring(0, 30)}...` : '❌ NOT SET'}</p>
        </div>
      </div>

      <button
        onClick={testDirectAPI}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Testing...' : 'Test Discovery Engine API'}
      </button>

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="font-bold mb-2">
              {result.success ? '✅ Success' : '❌ Failed'}
            </h2>
            {result.status && (
              <p className="text-sm">
                <strong>Status:</strong> {result.status} {result.statusText}
              </p>
            )}
            {result.error && (
              <p className="text-sm text-red-600">
                <strong>Error:</strong> {result.error}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">Raw Response:</h2>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          {!result.success && (
            <div className="bg-yellow-50 p-4 rounded">
              <h2 className="font-bold mb-2">💡 Troubleshooting Steps:</h2>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>
                  <strong>Check if Discovery Engine API is enabled:</strong>
                  <br />
                  <a
                    href="https://console.cloud.google.com/apis/library/discoveryengine.googleapis.com?project=922876587313"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Enable Discovery Engine API
                  </a>
                </li>
                <li>
                  <strong>Check API Key restrictions:</strong>
                  <br />
                  <a
                    href="https://console.cloud.google.com/apis/credentials?project=922876587313"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View API Keys
                  </a>
                  <br />
                  <span className="text-gray-600">Make sure the key allows Discovery Engine API and your domain (localhost:3000)</span>
                </li>
                <li>
                  <strong>Try using gcloud auth instead:</strong>
                  <br />
                  <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                    gcloud auth application-default login --project=922876587313
                  </code>
                </li>
                <li>
                  <strong>Use backend proxy instead:</strong>
                  <br />
                  <span className="text-gray-600">Set NEXT_PUBLIC_USE_DISCOVERY_ENGINE_DIRECT=false in .env.local</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
