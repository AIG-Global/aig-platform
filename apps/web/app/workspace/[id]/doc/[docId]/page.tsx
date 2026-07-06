'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

interface Document {
  id: string
  title: string
  content: string
  documentType: string
  createdAt: string
  updatedAt: string
  projectId?: string | null
}

const DOC_ICON: Record<string, string> = {
  specification: '📋',
  plan: '🗺️',
  notes: '📝',
  document: '📄',
}

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const docId = params.docId as string
  const workspaceId = params.id as string

  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`${API}/api/documents/${docId}`)
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        setDoc(data)
        setEditTitle(data.title)
        setEditContent(data.content)
      } catch {
        // will show error state
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [docId])

  const save = async () => {
    if (!doc || saving) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      if (res.ok) {
        const updated = await res.json()
        setDoc(updated)
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    if (!doc) return
    setEditTitle(doc.title)
    setEditContent(doc.content)
    setEditing(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <span style={{ fontSize: '32px' }}>◇</span>
      </div>
    )
  }

  if (!doc) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#e57373' }}>Document not found.</p>
          <button onClick={() => router.back()} style={{ marginTop: '16px', padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button onClick={() => router.push(`/workspace/${workspaceId}`)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ← Workspace
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '13px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {DOC_ICON[doc.documentType] ?? '📄'} {doc.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {editing ? (
            <>
              <button onClick={cancelEdit} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '7px', color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} style={{ padding: '7px 16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '7px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <>
              {saved && <span style={{ fontSize: '12px', color: '#4ade80', alignSelf: 'center' }}>✓ Saved</span>}
              <button onClick={() => setEditing(true)} style={{ padding: '7px 16px', background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)', borderRadius: '7px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                Edit
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Document */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        {editing ? (
          /* Edit mode */
          <div>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '8px', color: '#fff', fontSize: '26px', fontWeight: 700, padding: '10px 14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }}
            />
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', minHeight: '60vh', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ddd', fontSize: '14px', lineHeight: 1.7, padding: '16px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Write in Markdown…"
              onKeyDown={(e) => {
                // Ctrl+S / Cmd+S to save
                if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() }
              }}
            />
            <p style={{ marginTop: '8px', fontSize: '11px', color: '#555' }}>Markdown supported · Ctrl+S to save</p>
          </div>
        ) : (
          /* Read mode */
          <div>
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(102,126,234,0.2)', borderRadius: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {doc.documentType}
              </span>
              <span style={{ fontSize: '11px', color: '#555' }}>
                Updated {new Date(doc.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', lineHeight: 1.2 }}>
              {doc.title}
            </h1>
            <div style={{ color: '#ccc', lineHeight: 1.8, fontSize: '15px' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '32px 0 12px', color: '#fff' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '28px 0 10px', color: '#fff' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '20px 0 8px', color: '#ddd' }}>{children}</h3>,
                  p: ({ children }) => <p style={{ margin: '0 0 16px', lineHeight: 1.8 }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ marginLeft: '20px', marginBottom: '16px' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: '6px' }}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: '3px solid #667eea', paddingLeft: '16px', margin: '16px 0', opacity: 0.8, fontStyle: 'italic' }}>{children}</blockquote>
                  ),
                  code: ({ children, className }: any) => {
                    const isBlock = className?.startsWith('language-')
                    return isBlock ? (
                      <pre style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', overflow: 'auto', marginBottom: '16px' }}>
                        <code style={{ fontSize: '13px', color: '#e2e8f0' }}>{children}</code>
                      </pre>
                    ) : (
                      <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9em' }}>{children}</code>
                    )
                  },
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '8px 12px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>{children}</th>,
                  td: ({ children }) => <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px' }}>{children}</td>,
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '32px 0' }} />,
                  strong: ({ children }) => <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>,
                  a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'underline' }}>{children}</a>,
                }}
              >
                {doc.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
