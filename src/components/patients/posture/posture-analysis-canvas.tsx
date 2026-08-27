import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { PoseLandmark } from "@/types/posture-analysis"
import { POSE_LANDMARK } from "@/lib/posture-metrics"

interface Props {
  imageUrl: string
  landmarks: PoseLandmark[]
  className?: string
}

export function PostureAnalysisCanvas({ imageUrl, landmarks, className }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  function draw() {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !img.naturalWidth) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)

    const { width, height } = canvas
    const nose = landmarks[POSE_LANDMARK.NOSE]
    const leftShoulder = landmarks[POSE_LANDMARK.LEFT_SHOULDER]
    const rightShoulder = landmarks[POSE_LANDMARK.RIGHT_SHOULDER]
    const leftHip = landmarks[POSE_LANDMARK.LEFT_HIP]
    const rightHip = landmarks[POSE_LANDMARK.RIGHT_HIP]

    const axisX = nose.x * width
    const shoulderY = ((leftShoulder.y + rightShoulder.y) / 2) * height
    const hipY = ((leftHip.y + rightHip.y) / 2) * height

    ctx.lineWidth = Math.max(2, width * 0.0035)

    ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"
    ctx.beginPath()
    ctx.moveTo(axisX, 0)
    ctx.lineTo(axisX, height)
    ctx.stroke()

    ctx.strokeStyle = "rgba(59, 130, 246, 0.9)"
    ctx.beginPath()
    ctx.moveTo(0, shoulderY)
    ctx.lineTo(width, shoulderY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, hipY)
    ctx.lineTo(width, hipY)
    ctx.stroke()

    const radius = Math.max(3, width * 0.006)
    ctx.fillStyle = "rgba(250, 204, 21, 0.95)"
    for (const point of [nose, leftShoulder, rightShoulder, leftHip, rightHip]) {
      ctx.beginPath()
      ctx.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    setReady(true)
  }

  useEffect(() => {
    setReady(false)
    const img = imgRef.current
    if (img?.complete && img.naturalWidth) draw()
    // draw() only depends on the current imgRef/canvasRef + these props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, landmarks])

  return (
    <div className="relative flex max-h-full max-w-full items-center justify-center">
      {/* Drives the layout box (same sizing the plain <img> used before), so the
          modal never collapses to the canvas's zero-size default while it loads. */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        onLoad={draw}
        className={cn(className, ready && "invisible")}
      />
      <canvas
        ref={canvasRef}
        className={cn("pointer-events-none absolute inset-0 h-full w-full", !ready && "invisible")}
      />
    </div>
  )
}
