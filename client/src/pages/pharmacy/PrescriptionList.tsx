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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PatientSearch from "@/components/PatientSearch";
import { Package, SearchIcon, Check, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PrescriptionList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // Fetch patient details if selected
  const { data: patient } = useQuery({
    queryKey: ['/api/patients', selectedPatientId],
    enabled: !!selectedPatientId,
  });
  
  // Fetch prescriptions for the selected patient
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['/api/prescriptions', { patientId: selectedPatientId }],
    enabled: !!selectedPatientId,
  });
  
  // Update prescription status mutation
  const updatePrescription = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PUT', `/api/prescriptions/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions', { patientId: selectedPatientId }] });
      toast({
        title: "Status diperbarui",
        description: "Status resep berhasil diperbarui.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat memperbarui status resep.",
        variant: "destructive",
      });
    },
  });
  
  // Filter prescriptions based on active tab
  const filteredPrescriptions = prescriptions?.filter(prescription => {
    if (activeTab === "pending") {
      return prescription.status === "pending";
    } else if (activeTab === "processing") {
      return prescription.status === "processing";
    } else if (activeTab === "completed") {
      return prescription.status === "completed";
    }
    return true;
  });
  
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };
  
  const handleStatusUpdate = (id: number, status: string) => {
    updatePrescription.mutate({ id, status });
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Pelayanan Resep</h2>
        <p className="mt-1 text-sm text-gray-500">Manajemen dan pelayanan resep obat pasien</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari pasien untuk melihat resep obatnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSearch onPatientSelect={handlePatientSelect} placeholder="Cari pasien berdasarkan nama atau nomor rekam medis..." />
        </CardContent>
      </Card>

      {selectedPatientId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Resep Obat: {patient?.name}
            </CardTitle>
            <CardDescription>
              No. Rekam Medis: {patient?.medicalRecordNumber}
            </CardDescription>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Menunggu</TabsTrigger>
                <TabsTrigger value="processing">Diproses</TabsTrigger>
                <TabsTrigger value="completed">Selesai</TabsTrigger>
                <TabsTrigger value="all">Semua</TabsTrigger>
              </TabsList>
            </div>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredPrescriptions && filteredPrescriptions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tindakan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>
                            {format(new Date(prescription.prescriptionDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            Dr. ID {prescription.doctorId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                prescription.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-100"
                                  : prescription.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-100"
                                  : prescription.status === "processing"
                                  ? "bg-blue-100 text-blue-800 border-blue-100"
                                  : "bg-red-100 text-red-800 border-red-100"
                              }
                            >
                              {prescription.status === "completed"
                                ? "Selesai"
                                : prescription.status === "pending"
                                ? "Menunggu"
                                : prescription.status === "processing"
                                ? "Diproses"
                                : "Dibatalkan"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                              >
                                <Link href={`/pharmacy/prescriptions/${prescription.id}`}>
                                  Detail
                                </Link>
                              </Button>
                              
                              {prescription.status === "pending" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleStatusUpdate(prescription.id, "processing")}
                                >
                                  <Clock className="mr-1 h-4 w-4" />
                                  Proses
                                </Button>
                              )}
                              
                              {prescription.status === "processing" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleStatusUpdate(prescription.id, "completed")}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Selesai
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada resep</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === "all" 
                      ? "Pasien ini belum memiliki resep obat" 
                      : `Tidak ada resep dengan status "${activeTab}"`}
                  </p>
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-700">Pilih pasien terlebih dahulu</h3>
            <p className="mt-1 text-sm text-gray-500">
              Gunakan pencarian di atas untuk menemukan pasien
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
