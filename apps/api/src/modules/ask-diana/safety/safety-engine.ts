/**
 * Safety Engine
 * 
 * Provides security and moderation:
 * - Prompt injection detection
 * - Content moderation
 * - PII (Personally Identifiable Information) protection
 * - Jailbreak attempt detection
 * - Policy enforcement
 */

export interface SafetyResult {
  safe: boolean
  score: number // 0-100, higher = more unsafe
  threats: SafetyThreat[]
  piiDetected: string[]
  recommendations: string[]
}

export interface SafetyThreat {
  type:
    | 'prompt_injection'
    | 'jailbreak'
    | 'malicious_intent'
    | 'policy_violation'
    | 'unsafe_content'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: string
}

export class SafetyEngine {
  private injectionPatterns = [
    /ignore previous instructions/i,
    /forget everything/i,
    /system prompt/i,
    /give me admin/i,
    /execute code/i,
    /hack|exploit|vulnerability/i,
  ]

  private jailbreakPatterns = [
    /pretend you are/i,
    /act as if/i,
    /roleplay/i,
    /imagine you are/i,
    /hypothetically/i,
  ]

  private piiPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  }

  private blockedTerms = [
    'ransomware',
    'malware',
    'exploit',
    'ddos',
    'bomb',
  ]

  /**
   * Analyze user input for safety issues
   */
  analyzeInput(input: string): SafetyResult {
    const threats: SafetyThreat[] = []
    let score = 0

    // Check for prompt injection
    const injectionThreats = this.detectPromptInjection(input)
    threats.push(...injectionThreats)
    score += injectionThreats.length * 15

    // Check for jailbreak attempts
    const jailbreakThreats = this.detectJailbreak(input)
    threats.push(...jailbreakThreats)
    score += jailbreakThreats.length * 20

    // Check for blocked terms
    const blockedThreats = this.detectBlockedTerms(input)
    threats.push(...blockedThreats)
    score += blockedThreats.length * 10

    // Detect PII
    const piiDetected = this.detectPII(input)

    // Calculate safety
    const safe = score < 50 && threats.length === 0

    return {
      safe,
      score: Math.min(score, 100),
      threats,
      piiDetected,
      recommendations: this.getRecommendations(
        threats,
        piiDetected,
      ),
    }
  }

  /**
   * Analyze AI response for safety
   */
  analyzeResponse(response: string): SafetyResult {
    const threats: SafetyThreat[] = []
    let score = 0

    // Check for blocked terms in response
    const blockedThreats = this.detectBlockedTerms(response)
    threats.push(...blockedThreats)
    score += blockedThreats.length * 5

    // Detect PII in response
    const piiDetected = this.detectPII(response)
    score += piiDetected.length * 10

    const safe = score < 30 && threats.length === 0

    return {
      safe,
      score: Math.min(score, 100),
      threats,
      piiDetected,
      recommendations: this.getRecommendations(
        threats,
        piiDetected,
      ),
    }
  }

  private detectPromptInjection(input: string): SafetyThreat[] {
    const threats: SafetyThreat[] = []

    for (const pattern of this.injectionPatterns) {
      if (pattern.test(input)) {
        threats.push({
          type: 'prompt_injection',
          severity: 'high',
          description: 'Detected potential prompt injection attempt',
          evidence: input.match(pattern)?.[0] || '',
        })
      }
    }

    return threats
  }

  private detectJailbreak(input: string): SafetyThreat[] {
    const threats: SafetyThreat[] = []

    for (const pattern of this.jailbreakPatterns) {
      if (pattern.test(input)) {
        threats.push({
          type: 'jailbreak',
          severity: 'medium',
          description: 'Detected potential jailbreak attempt',
          evidence: input.match(pattern)?.[0] || '',
        })
      }
    }

    return threats
  }

  private detectBlockedTerms(text: string): SafetyThreat[] {
    const threats: SafetyThreat[] = []
    const lowerText = text.toLowerCase()

    for (const term of this.blockedTerms) {
      if (lowerText.includes(term)) {
        threats.push({
          type: 'unsafe_content',
          severity: 'high',
          description: `Contains blocked term: ${term}`,
          evidence: term,
        })
      }
    }

    return threats
  }

  private detectPII(text: string): string[] {
    const detectedPII: string[] = []

    // Check email
    const emails = text.match(this.piiPatterns.email)
    if (emails) detectedPII.push(...emails)

    // Check phone
    const phones = text.match(this.piiPatterns.phone)
    if (phones) detectedPII.push(...phones)

    // Check SSN
    const ssns = text.match(this.piiPatterns.ssn)
    if (ssns) detectedPII.push(...ssns)

    // Check credit card
    const cards = text.match(this.piiPatterns.creditCard)
    if (cards) detectedPII.push(...cards)

    // Check IP address
    const ips = text.match(this.piiPatterns.ipAddress)
    if (ips) detectedPII.push(...ips)

    return [...new Set(detectedPII)] // Remove duplicates
  }

  private getRecommendations(
    threats: SafetyThreat[],
    piiDetected: string[],
  ): string[] {
    const recommendations: string[] = []

    if (threats.length > 0) {
      const criticalThreats = threats.filter((t) => t.severity === 'critical')
      if (criticalThreats.length > 0) {
        recommendations.push('Request blocked due to critical security threat')
      }
    }

    if (piiDetected.length > 0) {
      recommendations.push(
        `PII detected: ${piiDetected.length} sensitive items found`,
      )
      recommendations.push('Consider removing personal information before resubmitting')
    }

    return recommendations
  }

  /**
   * Sanitize text by removing PII
   */
  sanitizePII(text: string): string {
    let sanitized = text

    // Replace emails
    sanitized = sanitized.replace(
      this.piiPatterns.email,
      '[EMAIL]',
    )

    // Replace phones
    sanitized = sanitized.replace(
      this.piiPatterns.phone,
      '[PHONE]',
    )

    // Replace SSNs
    sanitized = sanitized.replace(
      this.piiPatterns.ssn,
      '[SSN]',
    )

    // Replace credit cards
    sanitized = sanitized.replace(
      this.piiPatterns.creditCard,
      '[CARD]',
    )

    // Replace IPs
    sanitized = sanitized.replace(
      this.piiPatterns.ipAddress,
      '[IP]',
    )

    return sanitized
  }
}
