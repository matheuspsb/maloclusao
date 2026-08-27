import { useEffect, useState } from "react"
import { Loader2, ScanLine, Save, RotateCcw, AlertTriangle } from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PostureAnalysisCanvas } from "@/components/patients/posture/posture-analysis-canvas"
import { usePostureAnalyses, useCreatePostureAnalysis } from "@/hooks/use-posture-analysis"
import { analyzePostureImage } from "@/lib/analyze-posture"
import type { PostureAnalysisResult } from "@/types/posture-analysis"

interface Props {
  patientId: string
  images: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientImageLightbox({ patientId, images, initialIndex, open, onOpenChange }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const [freshResult, setFreshResult] = useState<PostureAnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const imageUrl = images[current]

  const { data: savedAnalyses } = usePostureAnalyses(patientId, imageUrl)
  const savePostureAnalysis = useCreatePostureAnalysis(patientId)

  const latestSaved = savedAnalyses?.[0]
  const result = freshResult ?? (latestSaved ? { landmarks: latestSaved.landmarks, metrics: latestSaved } : null)

  useEffect(() => {
    setFreshResult(null)
    setError(null)
  }, [current])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setCurrent((i) => Math.min(i + 1, images.length - 1))
      if (e.key === "ArrowLeft") setCurrent((i) => Math.max(i - 1, 0))
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, images.length])

  if (!images.length) return null

  async function handleAnalyze() {
    setAnalyzing(true)
    setError(null)
    try {
      const analysis = await analyzePostureImage(imageUrl)
      setFreshResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao analisar a imagem")
    } finally {
      setAnalyzing(false)
    }
  }

  function handleSave() {
    if (!freshResult) return
    savePostureAnalysis.mutate(
      {
        view: "ANTERIOR",
        imageUrl,
        landmarks: freshResult.landmarks,
        ...freshResult.metrics,
      },
      { onSuccess: () => setFreshResult(null) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-0 bg-black/90 p-0 [&>button]:text-white">
        <div className="relative flex h-[80vh] flex-col items-center justify-center gap-4 p-6">
          <span className="absolute left-4 top-4 text-sm text-white/70">
            {current + 1} / {images.length}
          </span>

          <div className="relative flex min-h-0 min-w-0 max-h-full max-w-full flex-1 items-center justify-center">
            {result ? (
              <PostureAnalysisCanvas
                imageUrl={imageUrl}
                landmarks={result.landmarks}
                className="max-h-full max-w-full rounded-md object-contain"
              />
            ) : (
              <img
                src={imageUrl}
                alt={`Imagem ${current + 1}`}
                className="max-h-full max-w-full rounded-md object-contain"
              />
            )}

            {analyzing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60">
                <Loader2 size={28} className="animate-spin text-white" />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {result && (
            <div className="grid w-full max-w-md grid-cols-2 gap-2 rounded-md bg-white/10 px-4 py-2 text-xs text-white/90">
              <span>Inclinação dos ombros: {result.metrics.shoulderTiltDeg.toFixed(1)}°</span>
              <span>Inclinação do quadril: {result.metrics.hipTiltDeg.toFixed(1)}°</span>
              <span>Desvio lateral (ombros): {(result.metrics.shoulderOffsetX * 100).toFixed(1)}%</span>
              <span>Desvio lateral (quadril): {(result.metrics.hipOffsetX * 100).toFixed(1)}%</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrent((i) => Math.max(i - 1, 0))}
                  disabled={current === 0}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white hover:bg-white/20 disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setCurrent((i) => Math.min(i + 1, images.length - 1))}
                  disabled={current === images.length - 1}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white hover:bg-white/20 disabled:opacity-30"
                >
                  Próxima →
                </button>
              </>
            )}

            {!result && (
              <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="gap-1.5">
                <ScanLine size={15} />
                Analisar Simetrógrafo
              </Button>
            )}

            {result && !freshResult && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="gap-1.5"
              >
                <RotateCcw size={15} />
                Reanalisar
              </Button>
            )}

            {freshResult && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={savePostureAnalysis.isPending}
                className="gap-1.5"
              >
                {savePostureAnalysis.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Salvar análise
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
