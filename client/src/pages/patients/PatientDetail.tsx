import { usePatient } from "@/hooks/usePatients";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useAppointments } from "@/hooks/useAppointments";
import { usePrescriptions } from "@/hooks/usePharmacy";
import { useLabRequests } from "@/hooks/useLaboratory";
import { Link } from "wouter";
import {
  CalendarRange,
  FileText,
  Package,
  FlaskRound,
  PlusCircle,
  Edit,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientDetailProps {
  id: number;
}

export default function PatientDetail({ id }: PatientDetailProps) {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  
  const { data: patient, isLoading: isLoadingPatient, isError: isErrorPatient } = usePatient(id);
  const { data: medicalRecords, isLoading: isLoadingRecords } = useMedicalRecords(id);
  const { data: appointments, isLoading: isLoadingAppointments } = useAppointments({ patientId: id });
  const { data: prescriptions, isLoading: isLoadingPrescriptions } = usePrescriptions(id);
  const { data: labRequests, isLoading: isLoadingLabRequests } = useLabRequests(id);

  useEffect(() => {
    if (isErrorPatient) {
      navigate("/patients");
    }
  }, [isErrorPatient, navigate]);

  if (isLoadingPatient) {
    return (
      <div className="py-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return null; // Will be redirected by useEffect
  }

  const calculateAge = (birthDate: string | Date): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            {patient.name}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({patient.gender === "male" ? "Laki-laki" : "Perempuan"}, {calculateAge(patient.birthDate)} tahun)
            </span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            No. RM: {patient.medicalRecordNumber}
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex">
          <Button variant="outline" asChild>
            <Link href={`/patients/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Pasien
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="records">Rekam Medis</TabsTrigger>
          <TabsTrigger value="appointments">Janji Temu</TabsTrigger>
          <TabsTrigger value="prescriptions">Resep</TabsTrigger>
          <TabsTrigger value="lab">Laboratorium</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pasien</CardTitle>
              <CardDescription>Detail informasi pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informasi Umum</h3>
                  <div className="mt-2 border rounded-md divide-y">
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Nama Lengkap</span>
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Jenis Kelamin</span>
                      <span className="text-sm font-medium text-gray-900">
                        {patient.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Tanggal Lahir</span>
                      <span className="text-sm font-medium text-gray-900">
                        {format(new Date(patient.birthDate), "dd MMMM yyyy")}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Usia</span>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateAge(patient.birthDate)} tahun
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Alamat</span>
                      <span className="text-sm font-medium text-gray-900">{patient.address || "-"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informasi Medis</h3>
                  <div className="mt-2 border rounded-md divide-y">
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Golongan Darah</span>
                      <span className="text-sm font-medium text-gray-900">
                        {patient.bloodType ? `${patient.bloodType} (${patient.rhesus === "positive" ? "+" : "-"})` : "-"}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Alergi</span>
                      <span className="text-sm font-medium text-gray-900">{patient.allergies || "Tidak ada"}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mt-4">Kontak & Identitas</h3>
                  <div className="mt-2 border rounded-md divide-y">
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Telepon</span>
                      <span className="text-sm font-medium text-gray-900">{patient.phone || "-"}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-gray-900">{patient.email || "-"}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">No. Identitas (KTP)</span>
                      <span className="text-sm font-medium text-gray-900">{patient.identityNumber || "-"}</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Asuransi</span>
                      <span className="text-sm font-medium text-gray-900">
                        {patient.insuranceProvider ? `${patient.insuranceProvider} (${patient.insuranceNumber})` : "Tidak ada"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rekam Medis</CardTitle>
                <CardDescription>Riwayat rekam medis pasien</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/medical-records/new?patientId=${id}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Rekam Medis
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingRecords ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : medicalRecords && medicalRecords.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe Kunjungan</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Diagnosa</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicalRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(new Date(record.visitDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {record.visitType === "outpatient" ? "Rawat Jalan" : 
                             record.visitType === "inpatient" ? "Rawat Inap" : "UGD"}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the department name */}
                            Poli {record.departmentId}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the doctor name */}
                            Dr. ID {record.doctorId}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {record.diagnosis || "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild size="sm">
                              <Link href={`/medical-records/${record.id}`}>
                                Detail
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada rekam medis</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tambahkan rekam medis baru untuk pasien ini
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Janji Temu</CardTitle>
                <CardDescription>Riwayat dan jadwal janji temu pasien</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/appointments/new?patientId=${id}`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Janji Temu
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {format(new Date(appointment.appointmentDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {appointment.appointmentTime.substring(0, 5)}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the department name */}
                            Poli {appointment.departmentId}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the doctor name */}
                            Dr. ID {appointment.doctorId}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              appointment.status === "confirmed" ? "bg-green-100 text-green-800" : 
                              appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"
                            }`}>
                              {appointment.status === "confirmed" ? "Terkonfirmasi" : 
                               appointment.status === "pending" ? "Menunggu" : "Dibatalkan"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {appointment.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarRange className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada janji temu</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tambahkan janji temu baru untuk pasien ini
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resep</CardTitle>
                <CardDescription>Riwayat resep obat pasien</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPrescriptions ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : prescriptions && prescriptions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>
                            {format(new Date(prescription.prescriptionDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the doctor name */}
                            Dr. ID {prescription.doctorId}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              prescription.status === "completed" ? "bg-green-100 text-green-800" : 
                              prescription.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                              prescription.status === "processing" ? "bg-blue-100 text-blue-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {prescription.status === "completed" ? "Selesai" : 
                               prescription.status === "pending" ? "Menunggu" : 
                               prescription.status === "processing" ? "Diproses" :
                               "Dibatalkan"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild size="sm">
                              <Link href={`/pharmacy/prescriptions/${prescription.id}`}>
                                Detail
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada resep</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Resep obat akan muncul saat dokter membuat resep
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hasil Laboratorium</CardTitle>
                <CardDescription>Riwayat pemeriksaan laboratorium pasien</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLabRequests ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : labRequests && labRequests.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            {format(new Date(request.requestDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {/* This would ideally fetch the doctor name */}
                            Dr. ID {request.doctorId}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === "completed" ? "bg-green-100 text-green-800" : 
                              request.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                              request.status === "processing" ? "bg-blue-100 text-blue-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {request.status === "completed" ? "Selesai" : 
                               request.status === "pending" ? "Menunggu" : 
                               request.status === "processing" ? "Diproses" :
                               "Dibatalkan"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild size="sm">
                              <Link href={`/laboratory/requests/${request.id}`}>
                                Detail
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FlaskRound className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada pemeriksaan lab</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Hasil laboratorium akan muncul saat pasien menjalani pemeriksaan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
