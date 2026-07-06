/**
 * Streaming Response Handler
 * 
 * Manages Server-Sent Events (SSE) streaming with:
 * - Keep-alive pings
 * - Cancellation support
 * - Token counting
 * - Latency measurement
 * - Client disconnect detection
 * - Retry handling
 */

import { Response } from 'express'

export interface StreamOptions {
  writeInterval?: number
  keepAliveInterval?: number
  enableMetrics?: boolean
}

export interface StreamMetrics {
  startTime: Date
  tokenCount: number
  totalBytes: number
  disconnected: boolean
}

export class StreamingResponseHandler {
  /**
   * Set up SSE (Server-Sent Events) for streaming responses
   */
  setupSSE(res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('X-Accel-Buffering', 'no') // Disable nginx buffering
  }

  /**
   * Send a stream event as SSE
   */
  sendEvent(
    res: Response,
    eventType: string,
    data: any,
    id?: string,
  ): void {
    if (res.destroyed) return

    const message = {
      event: eventType,
      data: JSON.stringify(data),
      ...(id && { id }),
    }

    try {
      res.write(`event: ${message.event}\n`)
      res.write(`data: ${message.data}\n`)
      if (id) res.write(`id: ${id}\n`)
      res.write('\n')
    } catch (error) {
      console.error('Failed to send SSE event:', error)
    }
  }

  /**
   * Send a token chunk
   */
  sendToken(res: Response, token: string, id?: string): void {
    this.sendEvent(res, 'token', { content: token }, id)
  }

  /**
   * Send a tool call event
   */
  sendToolCall(
    res: Response,
    toolName: string,
    parameters: any,
    toolCallId?: string,
  ): void {
    this.sendEvent(res, 'tool_call', {
      toolName,
      parameters,
      toolCallId,
    })
  }

  /**
   * Send metrics event
   */
  sendMetrics(res: Response, metrics: StreamMetrics): void {
    this.sendEvent(res, 'metrics', {
      duration: new Date().getTime() - metrics.startTime.getTime(),
      tokenCount: metrics.tokenCount,
      totalBytes: metrics.totalBytes,
    })
  }

  /**
   * Send a completion event
   */
  sendComplete(res: Response, summary: any): void {
    this.sendEvent(res, 'complete', summary)
  }

  /**
   * Send an error event
   */
  sendError(res: Response, error: string): void {
    this.sendEvent(res, 'error', { message: error })
    res.end()
  }

  /**
   * Send a keep-alive ping
   */
  sendKeepAlive(res: Response): void {
    if (res.destroyed) return

    try {
      res.write(': keep-alive\n\n')
    } catch (error) {
      console.error('Failed to send keep-alive:', error)
    }
  }

  /**
   * Set up keep-alive interval
   */
  setupKeepAlive(res: Response, interval: number = 30000): NodeJS.Timeout {
    return setInterval(() => {
      if (!res.destroyed) {
        this.sendKeepAlive(res)
      }
    }, interval)
  }

  /**
   * Detect client disconnect
   */
  onClientDisconnect(
    res: Response,
    callback: () => void,
  ): void {
    res.on('close', () => {
      callback()
    })

    res.on('error', () => {
      callback()
    })
  }

  /**
   * Stream an async iterable response with full features
   */
  async streamAsyncIterable<T extends { type: string; data: any }>(
    res: Response,
    iterable: AsyncIterable<T>,
    options?: StreamOptions,
  ): Promise<void> {
    this.setupSSE(res)

    const keepAliveInterval = options?.keepAliveInterval ?? 30000
    const keepAliveTimer = this.setupKeepAlive(res, keepAliveInterval)

    const metrics: StreamMetrics = {
      startTime: new Date(),
      tokenCount: 0,
      totalBytes: 0,
      disconnected: false,
    }

    // Set up client disconnect detection
    this.onClientDisconnect(res, () => {
      metrics.disconnected = true
      clearInterval(keepAliveTimer)
    })

    try {
      let eventId = 0

      for await (const event of iterable) {
        if (res.destroyed || metrics.disconnected) {
          break
        }

        const eventId_str = `${++eventId}`

        // Count tokens in content
        if (event.data.content) {
          metrics.tokenCount += Math.ceil(event.data.content.length / 4)
          metrics.totalBytes += event.data.content.length
        }

        try {
          res.write(`id: ${eventId_str}\n`)
          res.write(`event: ${event.type}\n`)
          res.write(`data: ${JSON.stringify(event.data)}\n\n`)
        } catch (error) {
          console.error('Failed to write event:', error)
          break
        }
      }

      if (!metrics.disconnected) {
        // Send final metrics
        if (options?.enableMetrics) {
          this.sendMetrics(res, metrics)
        }

        res.write(': [DONE]\n\n')
        res.end()
      }
    } catch (error) {
      if (!metrics.disconnected) {
        this.sendError(res, String(error))
      }
    } finally {
      clearInterval(keepAliveTimer)
      if (!res.destroyed) {
        res.end()
      }
    }
  }

  /**
   * Retry with exponential backoff
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    backoffMs: number = 1000,
  ): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, backoffMs * Math.pow(2, attempt)),
          )
        }
      }
    }

    throw lastError
  }

  /**
   * Measure streaming latency
   */
  measureLatency(startTime: Date): number {
    return new Date().getTime() - startTime.getTime()
  }
}
