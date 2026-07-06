'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

interface Task {
  id: string
  title: string
  status: string
  priority: string
}

interface Project {
  id: string
  name: string
  color: string
  tasks: Task[]
}

interface Document {
  id: string
  title: string
  documentType: string
  createdAt: string
}

interface Workspace {
  id: string
  title: string
  goal: string | null
  type: string
  emoji: string
  color: string
  createdAt: string
  projects: Project[]
  documents: Document[]
  conversations: Array<{ id: string; title: string; updatedAt: string }>
}

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.id as string

  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingTask, setTogglingTask] = useState<string | null>(null)

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    setTogglingTask(taskId)
    try {
      await fetch(`${API}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setWorkspace((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          projects: prev.projects.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t),
          })),
        }
      })
    } finally {
      setTogglingTask(null)
    }
  }

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await fetch(`${API}/api/workspaces/${workspaceId}`)
        if (!res.ok) throw new Error(`${res.status}`)
        setWorkspace(await res.json())
      } catch (e: any) {
        setError('Could not load workspace.')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkspace()
  }, [workspaceId])

  const allTasks = workspace?.projects.flatMap((p) => p.tasks) ?? []
  const todoTasks = allTasks.filter((t) => t.status === 'todo')
  const doneTasks = allTasks.filter((t) => t.status === 'done')
  const progressPct = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>◇</div>
          <p style={{ color: '#aaa' }}>Loading workspace…</p>
        </div>
      </div>
    )
  }

  if (error || !workspace) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#e57373' }}>{error || 'Workspace not found.'}</p>
          <button
            onClick={() => router.push('/chat')}
            style={{ marginTop: '16px', padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >
            ← Back to Diana
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top nav */}
      <nav style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <button
          onClick={() => router.push('/chat')}
          style={{
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
        >
          ← Diana
        </button>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
          {workspace.emoji} {workspace.title}
        </span>
      </nav>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Workspace header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '40px' }}>{workspace.emoji}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{workspace.title}</h1>
              <span style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '2px 10px',
                background: 'rgba(102,126,234,0.2)',
                border: '1px solid rgba(102,126,234,0.4)',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#aaa',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {workspace.type}
              </span>
            </div>
          </div>
          {workspace.goal && (
            <p style={{ margin: 0, color: '#aaa', fontSize: '14px', maxWidth: '600px', lineHeight: 1.5 }}>
              {workspace.goal}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {allTasks.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#aaa' }}>Progress</span>
              <span style={{ fontSize: '12px', color: '#aaa' }}>{doneTasks.length}/{allTasks.length} tasks</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '2px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Three-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {/* Projects */}
          <Section title="Projects" icon="📁" count={workspace.projects.length}>
            {workspace.projects.length === 0 ? (
              <EmptyState text="No projects yet" />
            ) : (
              workspace.projects.map((p) => (
                <Card key={p.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#667eea', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{p.name}</span>
                  </div>
                  {p.tasks.length > 0 && (
                    <p style={{ margin: '6px 0 0 18px', fontSize: '11px', color: '#888' }}>
                      {p.tasks.filter(t => t.status === 'done').length}/{p.tasks.length} tasks done
                    </p>
                  )}
                </Card>
              ))
            )}
          </Section>

          {/* Documents */}
          <Section title="Documents" icon="📄" count={workspace.documents.length}>
            {workspace.documents.length === 0 ? (
              <EmptyState text="No documents yet" />
            ) : (
              workspace.documents.map((d) => (
                <Card key={d.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px' }}>
                      {d.documentType === 'specification' ? '📋' : d.documentType === 'plan' ? '🗺️' : '📝'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{d.title}</span>
                  </div>
                </Card>
              ))
            )}
          </Section>

          {/* Tasks */}
          <Section title="Tasks" icon="✓" count={todoTasks.length} subtitle="remaining">
            {allTasks.length === 0 ? (
              <EmptyState text="No tasks yet" />
            ) : (
              allTasks.map((t) => (
                <Card key={t.id}>
                  <div
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}
                    onClick={() => toggleTask(t.id, t.status)}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      border: t.status === 'done' ? 'none' : '1px solid rgba(255,255,255,0.3)',
                      background: t.status === 'done' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                      flexShrink: 0, marginTop: '1px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', opacity: togglingTask === t.id ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                    }}>
                      {t.status === 'done' && '✓'}
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: t.status === 'done' ? '#555' : '#fff', textDecoration: t.status === 'done' ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                        {t.title}
                      </span>
                      <span style={{ display: 'inline-block', marginLeft: '8px', fontSize: '10px', padding: '1px 6px', borderRadius: '8px', background: t.priority === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)', color: t.priority === 'high' ? '#f87171' : '#888' }}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </Section>
        </div>

        {/* Ask Diana inline */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)', borderRadius: '12px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa' }}>
            ◇ Continue with Diana
          </p>
          <button
            onClick={() => router.push('/chat')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Ask Diana about this workspace →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tiny shared components ──────────────────────────────────────────────────

function Section({
  title, icon, count, subtitle = 'total', children,
}: {
  title: string; icon: string; count: number; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{title}</h2>
        </div>
        <span style={{
          padding: '2px 8px',
          background: 'rgba(102,126,234,0.2)',
          borderRadius: '10px',
          fontSize: '11px',
          color: '#aaa',
        }}>
          {count} {subtitle}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '8px',
      transition: 'background 0.2s',
    }}>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <p style={{ color: '#555', fontSize: '13px', margin: 0, textAlign: 'center', padding: '16px 0' }}>
      {text}
    </p>
  )
}
