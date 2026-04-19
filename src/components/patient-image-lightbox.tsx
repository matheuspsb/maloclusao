import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Props {
  images: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientImageLightbox({ images, initialIndex, open, onOpenChange }: Props) {
  const [current, setCurrent] = useState(initialIndex)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-0 bg-black/90 p-0 [&>button]:text-white">
        <div className="relative flex h-[80vh] flex-col items-center justify-center gap-4 p-6">
          <span className="absolute left-4 top-4 text-sm text-white/70">
            {current + 1} / {images.length}
          </span>

          <img
            src={images[current]}
            alt={`Imagem ${current + 1}`}
            className="max-h-full max-w-full rounded-md object-contain"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-3">
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
