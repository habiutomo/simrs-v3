import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Medication, Prescription, InsertPrescription } from "@shared/schema";

export function useMedications(options?: { category?: string; lowStock?: boolean }) {
  const queryParams = Object.entries(options || {})
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

  return useQuery<Medication[]>({
    queryKey: ['/api/medications', queryParams],
  });
}

export function useMedication(id: number) {
  return useQuery<Medication>({
    queryKey: ['/api/medications', id],
    enabled: !!id,
  });
}

export function usePrescriptions(patientId: number) {
  return useQuery<Prescription[]>({
    queryKey: ['/api/prescriptions', { patientId }],
    enabled: !!patientId,
  });
}

export function usePrescription(id: number) {
  return useQuery({
    queryKey: ['/api/prescriptions', id],
    enabled: !!id,
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { prescription: InsertPrescription; items: any[] }) => {
      const res = await apiRequest('POST', '/api/prescriptions', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions', { patientId: data.patientId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-activities'] });
    },
  });
}

export function useUpdatePrescription(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prescription: Partial<InsertPrescription>) => {
      const res = await apiRequest('PUT', `/api/prescriptions/${id}`, prescription);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions', { patientId: data.patientId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions', id] });
    },
  });
}
