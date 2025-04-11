import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MedicalRecord, InsertMedicalRecord } from "@shared/schema";

export function useMedicalRecords(patientId: number) {
  return useQuery<MedicalRecord[]>({
    queryKey: ['/api/medical-records', { patientId }],
    enabled: !!patientId,
  });
}

export function useMedicalRecord(id: number) {
  return useQuery<MedicalRecord>({
    queryKey: ['/api/medical-records', id],
    enabled: !!id,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: InsertMedicalRecord) => {
      const res = await apiRequest('POST', '/api/medical-records', record);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records', { patientId: data.patientId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-activities'] });
    },
  });
}

export function useUpdateMedicalRecord(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Partial<InsertMedicalRecord>) => {
      const res = await apiRequest('PUT', `/api/medical-records/${id}`, record);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records', { patientId: data.patientId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records', id] });
    },
  });
}
