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
import { FlaskRound, SearchIcon, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LabRequestList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // Fetch patient details if selected
  const { data: patient } = useQuery({
    queryKey: ['/api/patients', selectedPatientId],
    enabled: !!selectedPatientId,
  });
  
  // Fetch lab requests for the selected patient
  const { data: labRequests, isLoading } = useQuery({
    queryKey: ['/api/lab-requests', { patientId: selectedPatientId }],
    enabled: !!selectedPatientId,
  });
  
  // Update lab request status mutation
  const updateLabRequest = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PUT', `/api/lab-requests/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lab-requests', { patientId: selectedPatientId }] });
      toast({
        title: "Status diperbarui",
        description: "Status permintaan lab berhasil diperbarui.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat memperbarui status permintaan lab.",
        variant: "destructive",
      });
    },
  });
  
  // Filter lab requests based on active tab
  const filteredLabRequests = labRequests?.filter(request => {
    if (activeTab === "pending") {
      return request.status === "pending";
    } else if (activeTab === "processing") {
      return request.status === "processing";
    } else if (activeTab === "completed") {
      return request.status === "completed";
    }
    return true;
  });
  
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };
  
  const handleStatusUpdate = (id: number, status: string) => {
    updateLabRequest.mutate({ id, status });
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Permintaan Laboratorium</h2>
        <p className="mt-1 text-sm text-gray-500">Manajemen pemeriksaan dan hasil laboratorium</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari pasien untuk melihat permintaan laboratorium
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
              Permintaan Lab: {patient?.name}
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
              ) : filteredLabRequests && filteredLabRequests.length > 0 ? (
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
                      {filteredLabRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            {format(new Date(request.requestDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            Dr. ID {request.doctorId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                request.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-100"
                                  : request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-100"
                                  : request.status === "processing"
                                  ? "bg-blue-100 text-blue-800 border-blue-100"
                                  : "bg-red-100 text-red-800 border-red-100"
                              }
                            >
                              {request.status === "completed"
                                ? "Selesai"
                                : request.status === "pending"
                                ? "Menunggu"
                                : request.status === "processing"
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
                                <Link href={`/laboratory/requests/${request.id}`}>
                                  Detail
                                </Link>
                              </Button>
                              
                              {request.status === "pending" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleStatusUpdate(request.id, "processing")}
                                >
                                  <Clock className="mr-1 h-4 w-4" />
                                  Proses
                                </Button>
                              )}
                              
                              {request.status === "processing" && (
                                <Button 
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/laboratory/results/new/${request.id}`}>
                                    <FlaskRound className="mr-1 h-4 w-4" />
                                    Input Hasil
                                  </Link>
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
                  <FlaskRound className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada permintaan lab</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === "all" 
                      ? "Pasien ini belum memiliki permintaan pemeriksaan lab" 
                      : `Tidak ada permintaan lab dengan status "${activeTab}"`}
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
