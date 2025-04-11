import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Appointment, InsertAppointment } from "@shared/schema";

export function useAppointments(options?: {
  patientId?: number;
  doctorId?: number;
  departmentId?: number;
  today?: boolean;
  upcoming?: boolean;
}) {
  const queryParams = Object.entries(options || {})
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

  return useQuery<Appointment[]>({
    queryKey: ['/api/appointments', queryParams],
  });
}

export function useAppointment(id: number) {
  return useQuery<Appointment>({
    queryKey: ['/api/appointments', id],
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointment: InsertAppointment) => {
      const res = await apiRequest('POST', '/api/appointments', appointment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/upcoming-appointments'] });
    },
  });
}

export function useUpdateAppointment(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointment: Partial<InsertAppointment>) => {
      const res = await apiRequest('PUT', `/api/appointments/${id}`, appointment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/upcoming-appointments'] });
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['/api/departments'],
  });
}

export function useDoctors(departmentId?: number) {
  return useQuery({
    queryKey: ['/api/doctors', { departmentId }],
    enabled: departmentId !== undefined,
  });
}
