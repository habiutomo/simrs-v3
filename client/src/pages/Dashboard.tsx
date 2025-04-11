import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import StatisticsOverview from "@/components/StatisticsOverview";
import RecentActivityCard from "@/components/RecentActivityCard";
import UpcomingAppointmentsCard from "@/components/UpcomingAppointmentsCard";
import CapacityOverview from "@/components/CapacityOverview";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-activities'],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/dashboard/upcoming-appointments'],
  });

  const { data: capacity, isLoading: capacityLoading } = useQuery({
    queryKey: ['/api/dashboard/hospital-capacity'],
  });

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Ringkasan kegiatan rumah sakit</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Laporan
          </Button>
          <Button className="ml-3 flex items-center gap-2" asChild>
            <Link href="/patients/new">
              <Plus className="h-4 w-4" />
              Pasien Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <StatisticsOverview stats={stats} />
      )}

      {/* Recent Activity and Upcoming Appointments Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        {activitiesLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <RecentActivityCard activities={activities || []} />
        )}

        {/* Upcoming Appointments */}
        {appointmentsLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <UpcomingAppointmentsCard appointments={appointments || []} />
        )}
      </div>

      {/* Capacity Overview Section */}
      <div className="mt-8">
        {capacityLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <CapacityOverview capacity={capacity} />
        )}
      </div>
    </div>
  );
}
