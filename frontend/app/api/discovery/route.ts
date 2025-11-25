// Next.js API Route for Discovery Engine
// This acts as a secure server-side proxy to Google Discovery Engine
// Handles OAuth2 authentication so credentials don't get exposed to the browser

import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

const DISCOVERY_ENGINE_CONFIG = {
  projectId: process.env.DISCOVERY_ENGINE_PROJECT_ID || '922876587313',
  location: process.env.DISCOVERY_ENGINE_LOCATION || 'global',
  collection: process.env.DISCOVERY_ENGINE_COLLECTION || 'default_collection',
  engineId: process.env.DISCOVERY_ENGINE_ENGINE_ID || 'ai-policy-assistant_1763955939617',
}

const BASE_URL = `https://discoveryengine.googleapis.com/v1alpha/projects/${DISCOVERY_ENGINE_CONFIG.projectId}/locations/${DISCOVERY_ENGINE_CONFIG.location}/collections/${DISCOVERY_ENGINE_CONFIG.collection}/engines/${DISCOVERY_ENGINE_CONFIG.engineId}/servingConfigs/default_search`

/**
 * Get OAuth2 access token using Application Default Credentials
 * In development: Uses GOOGLE_APPLICATION_CREDENTIALS
 * In Cloud Run: Uses service account attached to the instance
 */
async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })

  const client = await auth.getClient()
  const accessToken = await client.getAccessToken()

  if (!accessToken.token) {
    throw new Error('Failed to get access token')
  }

  return accessToken.token
}

/**
 * POST /api/discovery
 * Secure proxy endpoint for Discovery Engine search and answer generation
 *
 * Request body:
 * {
 *   query: string,          // Required: The search query
 *   pageSize?: number,      // Optional: Number of results (default: 10)
 *   action?: 'search' | 'answer'  // Optional: 'search' or 'answer' (default: 'answer')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, pageSize = 10, action = 'answer' } = body

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    if (query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query cannot be empty' },
        { status: 400 }
      )
    }

    console.log(`[Discovery API] Processing query: "${query}" (action: ${action})`)

    // Get OAuth2 access token
    let accessToken: string
    try {
      accessToken = await getAccessToken()
      console.log('[Discovery API] Successfully obtained access token')
    } catch (error) {
      console.error('[Discovery API] Failed to get access token:', error)
      return NextResponse.json(
        {
          error: 'Authentication failed',
          details: error instanceof Error ? error.message : 'Could not obtain access token',
          hint: 'Make sure GOOGLE_APPLICATION_CREDENTIALS is set or service account is attached to Cloud Run'
        },
        { status: 500 }
      )
    }

    // Step 1: Perform search
    const searchUrl = `${BASE_URL}:search`
    const sessionPath = `projects/${DISCOVERY_ENGINE_CONFIG.projectId}/locations/${DISCOVERY_ENGINE_CONFIG.location}/collections/${DISCOVERY_ENGINE_CONFIG.collection}/engines/${DISCOVERY_ENGINE_CONFIG.engineId}/sessions/-`

    const searchBody = {
      query,
      pageSize,
      session: sessionPath,
      spellCorrectionSpec: { mode: 'AUTO' },
      languageCode: 'en-GB',
      relevanceScoreSpec: { returnRelevanceScore: true },
      userInfo: { timeZone: 'Asia/Calcutta' },
      contentSearchSpec: {
        snippetSpec: { returnSnippet: true },
      },
      naturalLanguageQueryUnderstandingSpec: {
        filterExtractionCondition: 'ENABLED',
      },
    }

    console.log('[Discovery API] Sending search request...')

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchBody),
    })

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      console.error('[Discovery API] Search failed:', searchResponse.status, errorText)
      return NextResponse.json(
        {
          error: `Search failed: ${searchResponse.status}`,
          details: errorText,
          hint: searchResponse.status === 403
            ? 'Make sure Discovery Engine API is enabled and service account has correct permissions'
            : 'Check Discovery Engine configuration and API status'
        },
        { status: searchResponse.status }
      )
    }

    const searchData = await searchResponse.json()
    console.log(`[Discovery API] Search successful, found ${searchData.results?.length || 0} results`)

    // If only search is requested, return search results
    if (action === 'search') {
      const results = (searchData.results || []).map((result: any) => {
        const doc = result.document || {}
        const structData = doc.structData || {}
        const derivedData = doc.derivedStructData || {}
        const snippets = derivedData.snippets || []

        return {
          id: doc.id || '',
          title: structData.title || '',
          snippet: snippets[0]?.snippet || '',
          link: derivedData.link || '',
          relevanceScore: result.relevanceScore || 0,
        }
      })

      return NextResponse.json({
        results,
        queryId: searchData.queryId,
        session: searchData.session,
      })
    }

    // Step 2: Get AI-generated answer
    const answerUrl = `${BASE_URL}:answer`
    const queryId = searchData.queryId || ''
    const sessionName = searchData.session?.name || sessionPath

    const answerBody = {
      query: {
        text: query,
        queryId,
      },
      session: sessionName,
      relatedQuestionsSpec: { enable: true },
      answerGenerationSpec: {
        ignoreAdversarialQuery: false,
        ignoreNonAnswerSeekingQuery: false,
        ignoreLowRelevantContent: false,
        includeCitations: true,
      },
    }

    console.log('[Discovery API] Generating answer...')

    const answerResponse = await fetch(answerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answerBody),
    })

    if (!answerResponse.ok) {
      const errorText = await answerResponse.text()
      console.error('[Discovery API] Answer generation failed:', answerResponse.status, errorText)

      // Still return search results even if answer generation fails
      const searchResults = (searchData.results || []).map((result: any) => {
        const doc = result.document || {}
        const structData = doc.structData || {}
        const derivedData = doc.derivedStructData || {}
        const snippets = derivedData.snippets || []

        return {
          id: doc.id || '',
          title: structData.title || '',
          snippet: snippets[0]?.snippet || '',
          link: derivedData.link || '',
          relevanceScore: result.relevanceScore || 0,
        }
      })

      return NextResponse.json({
        answer: 'Answer generation failed, but search results are available.',
        searchResults,
        citations: [],
        metadata: {
          queryId,
          sessionId: sessionName,
          processingTimeMs: Date.now(),
          answerError: errorText,
        },
      })
    }

    const answerData = await answerResponse.json()
    console.log('[Discovery API] Answer generated successfully')

    // Format response
    const answer = answerData.answer || {}
    const citations = (answer.citations || []).flatMap((cite: any) => {
      return (cite.sources || []).map((source: any) => ({
        docId: source.referenceId || '',
        page: 0,
        span: source.title || '',
        source_url: source.uri || '',
        score: 1.0,
      }))
    })

    // Parse search results
    const searchResults = (searchData.results || []).map((result: any) => {
      const doc = result.document || {}
      const structData = doc.structData || {}
      const derivedData = doc.derivedStructData || {}
      const snippets = derivedData.snippets || []

      return {
        id: doc.id || '',
        title: structData.title || '',
        snippet: snippets[0]?.snippet || '',
        link: derivedData.link || '',
        relevanceScore: result.relevanceScore || 0,
      }
    })

    const response = {
      answer: answer.answerText || 'No answer generated',
      searchResults,
      citations,
      metadata: {
        queryId,
        sessionId: sessionName,
        processingTimeMs: Date.now(),
      },
    }

    console.log('[Discovery API] Request completed successfully')

    return NextResponse.json(response)

  } catch (error) {
    console.error('[Discovery API] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check server logs for more details'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/discovery
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Discovery Engine Proxy',
    config: {
      projectId: DISCOVERY_ENGINE_CONFIG.projectId,
      location: DISCOVERY_ENGINE_CONFIG.location,
      engineId: DISCOVERY_ENGINE_CONFIG.engineId,
    },
  })
}
