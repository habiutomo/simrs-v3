import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isToday, isFuture, isPast } from "date-fns";
import { Calendar, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AppointmentList() {
  const [filterType, setFilterType] = useState<string>("upcoming");
  
  const { data: appointments, isLoading, isError } = useAppointments({
    upcoming: filterType === "upcoming",
    today: filterType === "today",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-100">Terkonfirmasi</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-100">Menunggu</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-100">Dibatalkan</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-100">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Jadwal & Appointment</h2>
          <p className="mt-1 text-sm text-gray-500">Manajemen jadwal dan janji temu pasien</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button asChild>
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              Janji Temu Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Janji Temu</CardTitle>
              <CardDescription>
                Daftar pasien yang memiliki janji temu
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Mendatang</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="all">Semua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              Terjadi kesalahan saat memuat data janji temu
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    const isUpcoming = isFuture(appointmentDate) || 
                      (isToday(appointmentDate) && appointment.appointmentTime > format(new Date(), "HH:mm:ss"));
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {format(appointmentDate, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {appointment.appointmentTime.substring(0, 5)}
                        </TableCell>
                        <TableCell>
                          {/* This would ideally fetch the patient name */}
                          <Link 
                            href={`/patients/${appointment.patientId}`}
                            className="text-primary hover:underline"
                          >
                            Pasien ID {appointment.patientId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {/* This would ideally fetch the doctor name */}
                          Dr. ID {appointment.doctorId}
                        </TableCell>
                        <TableCell>
                          {/* This would ideally fetch the department name */}
                          Poli {appointment.departmentId}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {appointment.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" asChild size="sm">
                            <Link href={`/appointments/${appointment.id}`}>
                              Detail
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada janji temu</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterType === "upcoming"
                  ? "Tidak ada janji temu mendatang"
                  : filterType === "today"
                  ? "Tidak ada janji temu hari ini"
                  : "Tidak ada janji temu yang ditemukan"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
