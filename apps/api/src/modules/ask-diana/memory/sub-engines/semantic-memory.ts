/**
 * Semantic Memory
 * 
 * For future: Stores concepts, relationships, embeddings
 * Enables cross-conversation knowledge synthesis
 */

export interface Concept {
  id: string
  name: string
  description: string
  embedding?: number[] // Vector embedding
  relatedConcepts: string[] // IDs of related concepts
  frequency: number // How often mentioned
  lastMentioned: Date
}

export class SemanticMemory {
  private concepts = new Map<string, Concept>()
  private relationships = new Map<string, Set<string>>()

  /**
   * Add or update a concept
   */
  upsertConcept(concept: Concept): void {
    this.concepts.set(concept.id, concept)

    // Update relationships
    for (const relatedId of concept.relatedConcepts) {
      if (!this.relationships.has(concept.id)) {
        this.relationships.set(concept.id, new Set())
      }
      this.relationships.get(concept.id)!.add(relatedId)
    }
  }

  /**
   * Get a concept
   */
  getConcept(id: string): Concept | undefined {
    return this.concepts.get(id)
  }

  /**
   * Find related concepts
   */
  getRelated(conceptId: string): Concept[] {
    const relatedIds = this.relationships.get(conceptId) || new Set()
    return Array.from(relatedIds)
      .map((id) => this.concepts.get(id))
      .filter((c) => !!c) as Concept[]
  }

  /**
   * Get all concepts
   */
  getAllConcepts(): Concept[] {
    return Array.from(this.concepts.values())
  }

  /**
   * Search concepts by name
   */
  search(query: string): Concept[] {
    const queryLower = query.toLowerCase()
    return Array.from(this.concepts.values()).filter(
      (c) =>
        c.name.toLowerCase().includes(queryLower) ||
        c.description.toLowerCase().includes(queryLower),
    )
  }
}
