import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { canAccessByPackage, readAuthSessionFromCookies } from '../../../../lib/auth-session'
import { TOOLKIT_APPS } from '../../../../lib/toolkit-apps'
import ToolkitNavControls from './ToolkitNavControls'

type Props = {
  params: {
    appId: string
  }
}

export default async function ToolkitAppRunnerPage({ params }: Props) {
  const cookieStore = await cookies()
  const session = readAuthSessionFromCookies(cookieStore)
  if (!session) {
    redirect('/auth?mode=signin')
  }

  const app = TOOLKIT_APPS.find((entry) => entry.id === params.appId)
  if (!app) notFound()

  if (!canAccessByPackage(session.packageId, app.minPackage)) {
    redirect('/toolkit')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '10px 12px', borderBottom: '1px solid rgba(148,163,184,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <strong style={{ color: '#f8d57a' }}>{app.icon} {app.name}</strong>
          <span style={{ marginLeft: '10px', color: '#94a3b8', fontSize: '12px' }}>{app.relativeHtmlPath}</span>
        </div>
        <ToolkitNavControls />
      </header>

      <iframe
        title={`${app.name} app frame`}
        src={`/api/toolkit-file/${app.id}/index.html`}
        sandbox='allow-scripts allow-forms allow-modals allow-popups allow-same-origin'
        style={{ border: 'none', width: '100%', height: 'calc(100vh - 58px)', background: '#ffffff' }}
      />
    </main>
  )
}
