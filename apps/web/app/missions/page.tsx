'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Mission {
  id: string
  title: string
  description?: string
  objective?: string
  status: 'planning' | 'active' | 'paused' | 'completed' | 'archived'
  priority?: string
  deadline?: string
  createdAt: string
  progress?: {
    percentComplete: number
    tasksCompleted: number
    tasksTotal: number
  }
  workspace?: {
    id: string
    title: string
  }
}

export default function MissionsPage() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [objective, setObjective] = useState('')

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId') || 'demo-user'
      const orgId = localStorage.getItem('orgId') || 'demo-org'

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/missions`, {
        headers: {
          'x-user-id': userId,
          'x-org-id': orgId,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch missions: ${response.statusText}`)
      }

      const data = await response.json()
      setMissions(data.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missions')
      console.error('Error fetching missions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setCreating(true)
      const userId = localStorage.getItem('userId') || 'demo-user'
      const orgId = localStorage.getItem('orgId') || 'demo-org'

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-org-id': orgId,
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          objective: objective || undefined,
          priority: 'medium',
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create mission: ${response.statusText}`)
      }

      const newMission = await response.json()
      setMissions([newMission.data || newMission, ...missions])
      setTitle('')
      setDescription('')
      setObjective('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mission')
      console.error('Error creating mission:', err)
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: Mission['status']) => {
    const colors: Record<Mission['status'], string> = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleMissionClick = (mission: Mission) => {
    if (mission.workspace?.id) {
      router.push(`/workspace/${mission.workspace.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Missions</h1>
          <p className="text-slate-400">Create and manage your missions to organize your goals and track progress.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {/* Create Mission Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Mission</h2>
          <form onSubmit={handleCreateMission} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mission Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Launch Alpha, Build MVP, Scale to 1000 users"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                disabled={creating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this mission is about"
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                disabled={creating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What does success look like for this mission?"
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                disabled={creating}
              />
            </div>

            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {creating ? 'Creating...' : 'Create Mission'}
            </button>
          </form>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your Missions</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-400">Loading missions...</p>
            </div>
          ) : missions.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">No missions yet. Create your first mission above!</p>
            </div>
          ) : (
            missions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                    {mission.description && (
                      <p className="text-sm text-slate-400 mt-1">{mission.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </span>
                </div>

                {mission.objective && (
                  <p className="text-slate-300 text-sm mb-3">
                    <strong>Goal:</strong> {mission.objective}
                  </p>
                )}

                {mission.progress && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Progress</span>
                      <span className="text-sm font-medium text-slate-300">
                        {mission.progress.percentComplete}% ({mission.progress.tasksCompleted}/{mission.progress.tasksTotal} tasks)
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mission.progress.percentComplete}%` }}
                      />
                    </div>
                  </div>
                )}

                {mission.deadline && (
                  <p className="text-xs text-slate-400">
                    Deadline: {new Date(mission.deadline).toLocaleDateString()}
                  </p>
                )}

                {mission.workspace && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <Link
                      href={`/workspace/${mission.workspace.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open Workspace →
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
