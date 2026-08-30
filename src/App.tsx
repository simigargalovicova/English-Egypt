import { useCallback, useEffect, useState } from 'react'
import type { StageId } from './types'
import { AdventureMap } from './components/AdventureMap'
import { Dunes } from './components/Mascot'
import { FinalSummary } from './components/FinalSummary'
import { ProgressHeader } from './components/ProgressHeader'
import { SettingsPanel } from './components/SettingsPanel'
import { BadgePopup, XpLayer } from './components/Overlays'
import { ProgressProvider } from './state/progress'
import { Stage1ColdStart } from './stages/Stage1ColdStart'
import { Stage2Engine } from './stages/Stage2Engine'
import { Stage3Surgery } from './stages/Stage3Surgery'
import { Stage4Chunks } from './stages/Stage4Chunks'
import { Stage5Build } from './stages/Stage5Build'
import { Stage6Hotel } from './stages/Stage6Hotel'
import { Stage7Restaurant } from './stages/Stage7Restaurant'
import { Stage8SmallTalk } from './stages/Stage8SmallTalk'
import { Stage9Errors } from './stages/Stage9Errors'
import { Stage10FinalBoss } from './stages/Stage10FinalBoss'
import { Stage11Retrieval } from './stages/Stage11Retrieval'
import { stopSpeaking } from './lib/speech'

type View = { name: 'map' } | { name: 'stage'; id: StageId } | { name: 'summary' } | { name: 'settings' }

function Adventure() {
  const [view, setView] = useState<View>({ name: 'map' })

  const goMap = useCallback(() => setView({ name: 'map' }), [])
  const goSummary = useCallback(() => setView({ name: 'summary' }), [])

  // Any navigation cancels speech that is still playing and returns to the top.
  useEffect(() => {
    stopSpeaking()
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [view])

  function renderStage(id: StageId) {
    switch (id) {
      case 'coldstart':
        return <Stage1ColdStart onExit={goMap} />
      case 'engine':
        return <Stage2Engine onExit={goMap} />
      case 'surgery':
        return <Stage3Surgery onExit={goMap} />
      case 'chunks':
        return <Stage4Chunks onExit={goMap} />
      case 'build':
        return <Stage5Build onExit={goMap} />
      case 'hotel':
        return <Stage6Hotel onExit={goMap} />
      case 'smalltalk':
        return <Stage8SmallTalk onExit={goMap} />
      case 'restaurant':
        return <Stage7Restaurant onExit={goMap} />
      case 'errors':
        return <Stage9Errors onExit={goMap} />
      case 'finalboss':
        return <Stage10FinalBoss onExit={goMap} />
      case 'retrieval':
        return <Stage11Retrieval onExit={goMap} onFinish={goSummary} />
      default:
        return null
    }
  }

  return (
    <div className="shell">
      <div className="shell__sky" aria-hidden="true" />
      <div className="shell__sun" aria-hidden="true" />
      <Dunes className="shell__dunes" />

      <ProgressHeader onHome={goMap} onSettings={() => setView({ name: 'settings' })} />

      <main className="shell__main">
        {view.name === 'map' && (
          <AdventureMap onOpenStage={(id) => setView({ name: 'stage', id })} onOpenSummary={goSummary} />
        )}
        {view.name === 'stage' && renderStage(view.id)}
        {view.name === 'summary' && <FinalSummary onExit={goMap} />}
        {view.name === 'settings' && <SettingsPanel onExit={goMap} />}
      </main>

      <XpLayer />
      <BadgePopup />
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Adventure />
    </ProgressProvider>
  )
}
