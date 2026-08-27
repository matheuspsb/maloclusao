import { getPoseLandmarker } from "./pose-landmarker"
import { computePostureMetrics } from "./posture-metrics"
import type { PostureAnalysisResult } from "@/types/posture-analysis"

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem"))
    image.src = url
  })
}

export async function analyzePostureImage(imageUrl: string): Promise<PostureAnalysisResult> {
  const [landmarker, image] = await Promise.all([getPoseLandmarker(), loadImage(imageUrl)])

  const { landmarks } = landmarker.detect(image)
  const pose = landmarks[0]

  if (!pose) {
    throw new Error("Nenhuma pessoa foi detectada nesta imagem")
  }

  return {
    landmarks: pose,
    metrics: computePostureMetrics(pose),
  }
}
