/**
 * Streaming response handler
 * Manages SSE and WebSocket streaming for real-time responses
 */

import { Response } from 'express'

export interface StreamOptions {
  writeInterval?: number
  keepAliveInterval?: number
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
    const message = {
      event: eventType,
      data: JSON.stringify(data),
      ...(id && { id }),
    }

    res.write(`event: ${message.event}\n`)
    res.write(`data: ${message.data}\n`)
    if (id) res.write(`id: ${id}\n`)
    res.write('\n')
  }

  /**
   * Send a token chunk
   */
  sendToken(res: Response, token: string): void {
    this.sendEvent(res, 'token', { content: token })
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
    res.write(': keep-alive\n\n')
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
   * Stream an async iterable response
   */
  async streamAsyncIterable<T>(
    res: Response,
    iterable: AsyncIterable<T>,
    options?: StreamOptions,
  ): Promise<void> {
    this.setupSSE(res)

    const keepAliveInterval = options?.keepAliveInterval ?? 30000
    const keepAliveTimer = this.setupKeepAlive(res, keepAliveInterval)

    try {
      let eventId = 0
      for await (const event of iterable) {
        if (!res.destroyed) {
          res.write(`id: ${++eventId}\n`)
          res.write(`data: ${JSON.stringify(event)}\n\n`)
        }
      }

      res.write(': [DONE]\n\n')
      res.end()
    } catch (error) {
      if (!res.destroyed) {
        this.sendError(res, String(error))
      }
    } finally {
      clearInterval(keepAliveTimer)
    }
  }
}
