export type PostureView = "ANTERIOR"

export interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface PostureMetrics {
  shoulderTiltDeg: number
  hipTiltDeg: number
  shoulderOffsetX: number
  hipOffsetX: number
}

export interface PostureAnalysisResult {
  landmarks: PoseLandmark[]
  metrics: PostureMetrics
}

export interface PostureAnalysis extends PostureMetrics {
  id: string
  patientId: string
  view: PostureView
  imageUrl: string
  landmarks: PoseLandmark[]
  createdAt: string
}

export interface CreatePostureAnalysisPayload extends PostureMetrics {
  view: PostureView
  imageUrl: string
  landmarks: PoseLandmark[]
}
