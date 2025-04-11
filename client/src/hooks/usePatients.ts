import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Patient, InsertPatient } from "@shared/schema";

export function usePatients(searchQuery?: string) {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients', { query: searchQuery }],
  });
}

export function usePatient(id: number) {
  return useQuery<Patient>({
    queryKey: ['/api/patients', id],
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: InsertPatient) => {
      const res = await apiRequest('POST', '/api/patients', patient);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    },
  });
}

export function useUpdatePatient(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: Partial<InsertPatient>) => {
      const res = await apiRequest('PUT', `/api/patients/${id}`, patient);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients', id] });
    },
  });
}
