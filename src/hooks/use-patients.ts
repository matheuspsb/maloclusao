import { useQuery, useMutation } from "@tanstack/react-query"
import { listPatients, deletePatient } from "@/services/patient.service"
import { queryClient } from "@/lib/query-client"

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => listPatients({ limit: 1000 }).then((response) => response.data),
    refetchOnMount: "always",
  })
}

export function useDeletePatient({ onSuccess }: { onSuccess?: () => void } = {}) {
  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      onSuccess?.()
    },
  })
}
