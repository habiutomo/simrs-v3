import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ['/api/dashboard/stats'],
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['/api/dashboard/recent-activities'],
  });
}

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: ['/api/dashboard/upcoming-appointments'],
  });
}

export function useHospitalCapacity() {
  return useQuery({
    queryKey: ['/api/dashboard/hospital-capacity'],
  });
}
