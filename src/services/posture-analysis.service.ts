import { api } from "./api"
import type { CreatePostureAnalysisPayload, PostureAnalysis } from "@/types/posture-analysis"

export async function listPostureAnalyses(
  patientId: string,
  imageUrl: string
): Promise<PostureAnalysis[]> {
  const { data } = await api.get<{ data: PostureAnalysis[] }>(
    `/patients/${patientId}/posture-analyses`,
    { params: { imageUrl } }
  )
  return data.data
}

export async function createPostureAnalysis(
  patientId: string,
  payload: CreatePostureAnalysisPayload
): Promise<PostureAnalysis> {
  const { data } = await api.post<{ data: PostureAnalysis }>(
    `/patients/${patientId}/posture-analyses`,
    payload
  )
  return data.data
}
