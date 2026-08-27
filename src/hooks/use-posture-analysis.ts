import { useQuery, useMutation } from "@tanstack/react-query"
import { listPostureAnalyses, createPostureAnalysis } from "@/services/posture-analysis.service"
import { queryClient } from "@/lib/query-client"
import type { CreatePostureAnalysisPayload } from "@/types/posture-analysis"

export function usePostureAnalyses(patientId: string, imageUrl: string) {
  return useQuery({
    queryKey: ["posture-analyses", patientId, imageUrl],
    queryFn: () => listPostureAnalyses(patientId, imageUrl),
    enabled: !!patientId && !!imageUrl,
  })
}

export function useCreatePostureAnalysis(patientId: string) {
  return useMutation({
    mutationFn: (payload: CreatePostureAnalysisPayload) =>
      createPostureAnalysis(patientId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posture-analyses", patientId, variables.imageUrl],
      })
    },
  })
}
