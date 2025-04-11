import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LabTest, LabRequest, InsertLabRequest, InsertLabResult } from "@shared/schema";

export function useLabTests() {
  return useQuery<LabTest[]>({
    queryKey: ['/api/lab-tests'],
  });
}

export function useLabRequests(patientId: number) {
  return useQuery<LabRequest[]>({
    queryKey: ['/api/lab-requests', { patientId }],
    enabled: !!patientId,
  });
}

export function useLabRequest(id: number) {
  return useQuery({
    queryKey: ['/api/lab-requests', id],
    enabled: !!id,
  });
}

export function useCreateLabRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { request: InsertLabRequest; items: any[] }) => {
      const res = await apiRequest('POST', '/api/lab-requests', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/lab-requests', { patientId: data.patientId }] });
    },
  });
}

export function useCreateLabResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (result: InsertLabResult) => {
      const res = await apiRequest('POST', '/api/lab-results', result);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/lab-requests', data.labRequestId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-activities'] });
    },
  });
}
