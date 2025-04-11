import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Clock, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";

export default function OutpatientQueue() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("waiting");
  
  // Fetch today's appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments', { today: true }],
  });
  
  // Get the current date for display
  const today = new Date();
  const formattedDate = format(today, "EEEE, dd MMMM yyyy");
  
  // Update appointment status mutation
  const updateAppointment = useUpdateAppointment(0); // ID will be set when updating
  
  // Filter appointments based on active tab
  const filteredAppointments = appointments?.filter(appointment => {
    if (activeTab === "waiting") {
      return appointment.status === "confirmed" || appointment.status === "pending";
    } else if (activeTab === "completed") {
      return appointment.status === "completed";
    } else if (activeTab === "cancelled") {
      return appointment.status === "cancelled";
    }
    return true;
  });
  
  // Handle status change
  const handleStatusChange = async (id: number, status: string) => {
    try {
      updateAppointment.mutate({ id, status });
      toast({
        title: "Status diperbarui",
        description: `Status antrian berhasil diubah menjadi ${status === 'completed' ? 'Selesai' : 'Dibatalkan'}.`,
      });
    } catch (error) {
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat memperbarui status antrian.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Antrian Rawat Jalan</h2>
          <p className="mt-1 text-sm text-gray-500">Manajemen antrian pasien rawat jalan hari ini: {formattedDate}</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button asChild>
            <Link href="/appointments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pasien
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="waiting">Menunggu</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
          <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "waiting" 
                  ? "Daftar Antrian Menunggu" 
                  : activeTab === "completed" 
                  ? "Daftar Pasien Selesai"
                  : "Daftar Pasien Dibatalkan"}
              </CardTitle>
              <CardDescription>
                {activeTab === "waiting" 
                  ? "Daftar pasien yang sedang menunggu atau terkonfirmasi" 
                  : activeTab === "completed" 
                  ? "Daftar pasien yang telah selesai diperiksa"
                  : "Daftar pasien yang dibatalkan kunjungannya"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredAppointments && filteredAppointments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Antrian</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tindakan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment, index) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            {appointment.appointmentTime.substring(0, 5)}
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={`/patients/${appointment.patientId}`}
                              className="text-primary hover:underline"
                            >
                              Pasien ID {appointment.patientId}
                            </Link>
                          </TableCell>
                          <TableCell>
                            Poli {appointment.departmentId}
                          </TableCell>
                          <TableCell>
                            Dr. ID {appointment.doctorId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800 border-green-100"
                                  : appointment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-100"
                                  : appointment.status === "completed"
                                  ? "bg-blue-100 text-blue-800 border-blue-100"
                                  : "bg-red-100 text-red-800 border-red-100"
                              }
                            >
                              {appointment.status === "confirmed"
                                ? "Terkonfirmasi"
                                : appointment.status === "pending"
                                ? "Menunggu"
                                : appointment.status === "completed"
                                ? "Selesai"
                                : "Dibatalkan"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {activeTab === "waiting" && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleStatusChange(appointment.id, "completed")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Selesai
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleStatusChange(appointment.id, "cancelled")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Batal
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/medical-records/new?patientId=${appointment.patientId}`}>
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Rekam Medis
                                  </Link>
                                </Button>
                              </div>
                            )}
                            {activeTab !== "waiting" && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/medical-records?patientId=${appointment.patientId}`}>
                                  Lihat Rekam Medis
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  {activeTab === "waiting" ? (
                    <>
                      <Clock className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada antrian</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Belum ada pasien yang mengantri saat ini
                      </p>
                    </>
                  ) : activeTab === "completed" ? (
                    <>
                      <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada pasien selesai</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Belum ada pasien yang telah selesai diperiksa
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada pembatalan</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Belum ada pasien yang dibatalkan kunjungannya
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
