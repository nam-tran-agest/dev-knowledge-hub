import { RadarHUD } from "@/components/ui/cyber/radar-hud";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden gap-4">
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
      <RadarHUD className="w-24 h-24" />
      <div className="flex flex-col items-center gap-1 font-mono">
        <span className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">
          // INITIALIZING_NEO_STREAM...
        </span>
        <span className="text-[10px] text-primary/40 uppercase tracking-wider">
          ESTABLISHING_CYBER_LINK
        </span>
      </div>
    </div>
  )
}
