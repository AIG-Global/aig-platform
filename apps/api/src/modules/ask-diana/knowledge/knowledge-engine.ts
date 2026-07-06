/**
 * Knowledge Engine
 * 
 * Provides RAG (Retrieval-Augmented Generation):
 * - Document search and retrieval
 * - Vector similarity search
 * - Knowledge graph integration
 * - Context enrichment from knowledge base
 */

export interface Document {
  id: string
  title: string
  content: string
  metadata?: Record<string, any>
  embedding?: number[]
  source: 'internal' | 'external' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  document: Document
  relevance: number // 0-100
  excerpt: string
  matchedTerms: string[]
}

export interface KnowledgeContext {
  documents: Document[]
  summary: string
  sources: string[]
  confidence: number // 0-100
}

export class KnowledgeEngine {
  private documents = new Map<string, Document>()
  private searchIndex = new Map<string, Set<string>>() // term -> doc IDs

  /**
   * Index a document for search
   */
  indexDocument(doc: Document): void {
    this.documents.set(doc.id, doc)

    // Simple tokenization for search
    const tokens = this.tokenize(doc.title + ' ' + doc.content)
    for (const token of tokens) {
      if (!this.searchIndex.has(token)) {
        this.searchIndex.set(token, new Set())
      }
      this.searchIndex.get(token)!.add(doc.id)
    }
  }

  /**
   * Search documents by query
   */
  search(query: string, limit: number = 5): SearchResult[] {
    const queryTerms = this.tokenize(query)
    const scores = new Map<string, number>()

    // Score documents by term matches
    for (const term of queryTerms) {
      const docIds = this.searchIndex.get(term) || new Set()
      for (const docId of docIds) {
        scores.set(docId, (scores.get(docId) || 0) + 1)
      }
    }

    // Convert scores to results
    const results: SearchResult[] = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([docId, score]) => {
        const doc = this.documents.get(docId)!
        return {
          document: doc,
          relevance: Math.min(score * 20, 100),
          excerpt: this.extractExcerpt(doc.content, queryTerms),
          matchedTerms: queryTerms.filter(
            (t) => doc.content.toLowerCase().includes(t),
          ),
        }
      })

    return results
  }

  /**
   * Search by semantic similarity using simple heuristics
   * In production, use actual vector embeddings
   */
  semanticSearch(query: string, limit: number = 5): SearchResult[] {
    const results: SearchResult[] = []

    for (const doc of this.documents.values()) {
      const similarity = this.calculateSimilarity(
        query,
        doc.content,
      )

      if (similarity > 0.3) {
        results.push({
          document: doc,
          relevance: similarity * 100,
          excerpt: this.extractExcerpt(
            doc.content,
            this.tokenize(query),
          ),
          matchedTerms: this.tokenize(query),
        })
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit)
  }

  /**
   * Get context for a topic by combining multiple documents
   */
  getContext(topic: string, limit: number = 5): KnowledgeContext {
    const results = this.search(topic, limit * 2)

    if (results.length === 0) {
      return {
        documents: [],
        summary: `No knowledge base documents found for "${topic}"`,
        sources: [],
        confidence: 0,
      }
    }

    const documents = results.slice(0, limit).map((r) => r.document)
    const sources = [...new Set(documents.map((d) => d.source))]
    const confidence =
      results.reduce((sum, r) => sum + r.relevance, 0) / results.length

    // Create summary
    const summary = this.createSummary(documents, topic)

    return {
      documents,
      summary,
      sources,
      confidence: Math.round(confidence),
    }
  }

  /**
   * Add document to knowledge base
   */
  addDocument(
    id: string,
    title: string,
    content: string,
    source: 'internal' | 'external' | 'user' = 'internal',
    metadata?: Record<string, any>,
  ): Document {
    const doc: Document = {
      id,
      title,
      content,
      metadata,
      source,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.indexDocument(doc)
    return doc
  }

  /**
   * Get all documents
   */
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values())
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): Document | undefined {
    return this.documents.get(id)
  }

  /**
   * Remove document
   */
  removeDocument(id: string): boolean {
    return this.documents.delete(id)
  }

  /**
   * Get knowledge base statistics
   */
  getStats() {
    return {
      totalDocuments: this.documents.size,
      totalTerms: this.searchIndex.size,
      sources: [
        ...new Set(Array.from(this.documents.values()).map((d) => d.source)),
      ],
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2)
      .map((t) => t.replace(/[^\w]/g, ''))
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const tokens1 = new Set(this.tokenize(text1))
    const tokens2 = new Set(this.tokenize(text2))

    const intersection = new Set(
      [...tokens1].filter((x) => tokens2.has(x)),
    )
    const union = new Set([...tokens1, ...tokens2])

    return union.size === 0 ? 0 : intersection.size / union.size
  }

  private extractExcerpt(
    content: string,
    terms: string[],
  ): string {
    const sentences = content.split(/[.!?]+/).map((s) => s.trim())

    let bestSentence = sentences[0] || ''

    for (const sentence of sentences) {
      const matches = terms.filter(
        (t) =>
          sentence.toLowerCase().includes(t),
      ).length
      if (matches > 0) {
        bestSentence = sentence
        break
      }
    }

    return bestSentence.substring(0, 200) + (bestSentence.length > 200 ? '...' : '')
  }

  private createSummary(
    documents: Document[],
    topic: string,
  ): string {
    if (documents.length === 0) return ''

    const titles = documents.map((d) => d.title).join(', ')
    return `Found ${documents.length} relevant document(s) on "${topic}": ${titles}`
  }
}
