import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InpatientManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("active");
  const [showAdmissionDialog, setShowAdmissionDialog] = useState(false);
  const [showDischargeDialog, setShowDischargeDialog] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  // Load active admissions
  const { data: activeAdmissions, isLoading: loadingActive } = useQuery({
    queryKey: ['/api/inpatient/admissions', 'active'],
    queryFn: () => 
      apiRequest('/api/inpatient/admissions?active=true', { method: 'GET' }),
    enabled: selectedTab === "active"
  });

  // Load available beds
  const { data: availableBeds, isLoading: loadingBeds } = useQuery({
    queryKey: ['/api/beds/available'],
    queryFn: () => 
      apiRequest('/api/beds?status=available', { method: 'GET' }),
  });

  // Load rooms
  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['/api/rooms'],
    queryFn: () => 
      apiRequest('/api/rooms', { method: 'GET' }),
  });

  // Load all patients for admission form
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: () => 
      apiRequest('/api/patients', { method: 'GET' }),
  });

  // Load doctors
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['/api/doctors'],
    queryFn: () => 
      apiRequest('/api/doctors', { method: 'GET' }),
  });

  // Create admission mutation
  const admissionMutation = useMutation({
    mutationFn: (newAdmission: any) => 
      apiRequest('/api/inpatient/admissions', {
        method: 'POST',
        body: JSON.stringify(newAdmission),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inpatient/admissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds/available'] });
      setShowAdmissionDialog(false);
      toast({
        title: "Pasien berhasil dirawat inap",
        description: "Data rawat inap berhasil disimpan",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menyimpan data rawat inap",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Discharge patient mutation
  const dischargeMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest(`/api/inpatient/admissions/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'discharged',
          dischargeDate: format(new Date(), 'yyyy-MM-dd'),
          dischargeTime: format(new Date(), 'HH:mm:ss')
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inpatient/admissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds/available'] });
      setShowDischargeDialog(false);
      toast({
        title: "Pasien berhasil dipulangkan",
        description: "Status rawat inap telah diperbarui",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal memulangkan pasien",
        description: "Terjadi kesalahan saat memperbarui status",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Admission form schema
  const admissionSchema = z.object({
    patientId: z.string().min(1, "Pilih pasien"),
    doctorId: z.string().min(1, "Pilih dokter"),
    bedId: z.string().min(1, "Pilih tempat tidur"),
    admissionDate: z.string().min(1, "Masukkan tanggal masuk"),
    admissionTime: z.string().min(1, "Masukkan waktu masuk"),
    diagnosis: z.string().min(1, "Masukkan diagnosis"),
    status: z.string().default("active"),
  });

  // Admission form
  const admissionForm = useForm<z.infer<typeof admissionSchema>>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      bedId: "",
      admissionDate: format(new Date(), 'yyyy-MM-dd'),
      admissionTime: format(new Date(), 'HH:mm'),
      diagnosis: "",
      status: "active",
    },
  });

  // Handle form submission
  const onSubmitAdmission = (data: z.infer<typeof admissionSchema>) => {
    admissionMutation.mutate({
      patientId: parseInt(data.patientId),
      doctorId: parseInt(data.doctorId),
      bedId: parseInt(data.bedId),
      admissionDate: data.admissionDate,
      admissionTime: data.admissionTime + ":00",
      diagnosis: data.diagnosis,
      status: data.status,
    });
  };

  // Handle discharge action
  const handleDischarge = (admission: any) => {
    setSelectedAdmission(admission);
    setShowDischargeDialog(true);
  };

  // Confirm discharge 
  const confirmDischarge = () => {
    if (selectedAdmission) {
      dischargeMutation.mutate({ id: selectedAdmission.id });
    }
  };

  // Helper to get room details for a bed
  const getRoomForBed = (bedId: number) => {
    if (!availableBeds || !rooms) return "Unknown";
    
    const bed = availableBeds.find((b: any) => b.id === bedId);
    if (!bed) return "Unknown";
    
    const room = rooms.find((r: any) => r.id === bed.roomId);
    return room ? `${room.wardName} - ${room.roomNumber}` : "Unknown";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Rawat Inap</h1>
          <p className="text-gray-500">Kelola pasien rawat inap, kamar, dan tempat tidur</p>
        </div>
        <Button onClick={() => setShowAdmissionDialog(true)}>Tambah Pasien Rawat Inap</Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Pasien Aktif</TabsTrigger>
          <TabsTrigger value="rooms">Kamar & Tempat Tidur</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pasien Rawat Inap Aktif</CardTitle>
              <CardDescription>Manajemen pasien rawat inap yang sedang dirawat</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActive ? (
                <div className="py-8 text-center">Memuat data pasien...</div>
              ) : !activeAdmissions || activeAdmissions.length === 0 ? (
                <div className="py-8 text-center">Tidak ada pasien rawat inap aktif</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Pasien</TableHead>
                      <TableHead>Dokter Penanggung Jawab</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Tanggal Masuk</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeAdmissions.map((admission: any) => {
                      const patient = patients?.find((p: any) => p.id === admission.patientId);
                      const doctor = doctors?.find((d: any) => d.id === admission.doctorId);
                      const bed = availableBeds?.find((b: any) => b.id === admission.bedId);
                      const room = bed ? rooms?.find((r: any) => r.id === bed.roomId) : null;

                      return (
                        <TableRow key={admission.id}>
                          <TableCell className="font-medium">{patient?.name || "Unknown"}</TableCell>
                          <TableCell>{doctor?.name || "Unknown"}</TableCell>
                          <TableCell>
                            {room ? `${room.wardName}, Kamar ${room.roomNumber}, Bed ${bed.bedNumber}` : "Unknown"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(admission.admissionDate), 'dd-MM-yyyy')}
                            <div className="text-xs text-gray-500">{admission.admissionTime}</div>
                          </TableCell>
                          <TableCell>{admission.diagnosis}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleDischarge(admission)}
                            >
                              Pulangkan
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Kamar & Tempat Tidur</CardTitle>
              <CardDescription>Lihat status ketersediaan tempat tidur</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRooms || loadingBeds ? (
                <div className="py-8 text-center">Memuat data kamar dan tempat tidur...</div>
              ) : !rooms || rooms.length === 0 ? (
                <div className="py-8 text-center">Tidak ada data kamar</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room: any) => (
                    <Card key={room.id} className="overflow-hidden">
                      <CardHeader className="bg-muted pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{room.wardName}</CardTitle>
                            <CardDescription>Kamar {room.roomNumber} ({room.roomType})</CardDescription>
                          </div>
                          <Badge variant={room.roomType === 'vip' ? 'default' : (room.roomType === 'icu' ? 'destructive' : 'outline')}>
                            {room.roomType.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Biaya per hari:</span>
                          <span className="font-semibold">Rp {parseInt(room.costPerDay).toLocaleString('id-ID')}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Status Tempat Tidur:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: room.bedCount }, (_, i) => i + 1).map((bedNum) => {
                              const bedData = availableBeds?.find(
                                (b: any) => b.roomId === room.id && b.bedNumber.endsWith(`-${bedNum}`)
                              );
                              const isAvailable = bedData?.status === 'available';
                              
                              return (
                                <div 
                                  key={bedNum}
                                  className={`border rounded-md p-2 text-center ${
                                    isAvailable ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                                  }`}
                                >
                                  <span className="text-sm block">{room.roomNumber}-{bedNum}</span>
                                  <Badge variant={isAvailable ? 'outline' : 'secondary'} className="mt-1">
                                    {isAvailable ? 'Tersedia' : 'Terisi'}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for new admission */}
      <Dialog open={showAdmissionDialog} onOpenChange={setShowAdmissionDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Tambah Pasien Rawat Inap</DialogTitle>
            <DialogDescription>
              Isi data pasien yang akan dirawat inap
            </DialogDescription>
          </DialogHeader>

          <Form {...admissionForm}>
            <form onSubmit={admissionForm.handleSubmit(onSubmitAdmission)} className="space-y-4">
              <FormField
                control={admissionForm.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pasien</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pasien" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!loadingPatients && patients ? patients.map((patient: any) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name} ({patient.medicalRecordNumber})
                          </SelectItem>
                        )) : <SelectItem value="">Memuat data...</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={admissionForm.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dokter Penanggung Jawab</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih dokter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!loadingDoctors && doctors ? doctors.map((doctor: any) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name} ({doctor.specialization})
                          </SelectItem>
                        )) : <SelectItem value="">Memuat data...</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={admissionForm.control}
                name="bedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Tidur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tempat tidur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!loadingBeds && availableBeds ? availableBeds
                          .filter((bed: any) => bed.status === 'available')
                          .map((bed: any) => (
                            <SelectItem key={bed.id} value={bed.id.toString()}>
                              {bed.bedNumber} - {getRoomForBed(bed.roomId)}
                            </SelectItem>
                          )) : <SelectItem value="">Memuat data...</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={admissionForm.control}
                  name="admissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Masuk</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={admissionForm.control}
                  name="admissionTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Masuk</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={admissionForm.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan diagnosis" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAdmissionDialog(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={admissionMutation.isPending}>
                  {admissionMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for discharge */}
      <Dialog open={showDischargeDialog} onOpenChange={setShowDischargeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pulangkan Pasien</DialogTitle>
            <DialogDescription>
              Konfirmasi pemulangan pasien dari rawat inap?
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <p>Anda akan memulangkan pasien ini dan mengubah status tempat tidur menjadi tersedia. Lanjutkan?</p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDischargeDialog(false)}
            >
              Batal
            </Button>
            <Button 
              type="button" 
              onClick={confirmDischarge} 
              disabled={dischargeMutation.isPending}
            >
              {dischargeMutation.isPending ? "Memproses..." : "Konfirmasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}