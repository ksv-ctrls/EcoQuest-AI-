import type { SdgProgressMetric } from '@/impact/types/impact'

interface SdgProgressTrackerProps {
  progress: SdgProgressMetric[]
  compact?: boolean
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-sage/20">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function SdgProgressTracker({ progress, compact = false }: SdgProgressTrackerProps) {
  const rows = compact ? progress.slice(0, 6) : progress

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-cream">
      <div className="grid grid-cols-[1.4fr_repeat(5,0.7fr)] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sage">
        <span>SDG</span>
        <span>Learning</span>
        <span>Quiz</span>
        <span>Mission</span>
        <span>Game</span>
        <span>Mastery</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((item) => (
          <div
            key={item.sdgId}
            className="grid grid-cols-[1.4fr_repeat(5,0.7fr)] items-center gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0">
              <p className="font-semibold text-primary-dark">SDG {item.sdgNumber}</p>
              <p className="truncate text-xs text-sage">{item.title}</p>
            </div>
            <span className="text-sage">{item.learningPercent}%</span>
            <span className="text-sage">{item.quizPercent}%</span>
            <span className="text-sage">{item.missionPercent}%</span>
            <span className="text-sage">{item.gamePercent}%</span>
            <div className="space-y-1">
              <p className="font-semibold text-primary-dark">{item.overallMasteryPercent}%</p>
              <ProgressBar value={item.overallMasteryPercent} color={item.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
