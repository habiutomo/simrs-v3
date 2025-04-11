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
import { CreditCard, SearchIcon, Plus, Check, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BillingList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // Fetch patient details if selected
  const { data: patient } = useQuery({
    queryKey: ['/api/patients', selectedPatientId],
    enabled: !!selectedPatientId,
  });
  
  // Fetch billings for the selected patient
  const { data: billings, isLoading } = useQuery({
    queryKey: ['/api/billings', { patientId: selectedPatientId }],
    enabled: !!selectedPatientId,
  });
  
  // Update billing status mutation
  const updateBilling = useMutation({
    mutationFn: async ({ id, status, paidAmount }: { id: number; status: string; paidAmount?: string }) => {
      const res = await apiRequest('PUT', `/api/billings/${id}`, { status, paidAmount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billings', { patientId: selectedPatientId }] });
      toast({
        title: "Status diperbarui",
        description: "Status pembayaran berhasil diperbarui.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat memperbarui status pembayaran.",
        variant: "destructive",
      });
    },
  });
  
  // Filter billings based on active tab
  const filteredBillings = billings?.filter(billing => {
    if (activeTab === "pending") {
      return billing.status === "pending";
    } else if (activeTab === "partial") {
      return billing.status === "partial";
    } else if (activeTab === "paid") {
      return billing.status === "paid";
    }
    return true;
  });
  
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };
  
  const handlePayment = (id: number, totalAmount: string, paidAmount: string) => {
    // Simulate payment completion
    // In a real app, this would open a payment form
    const remaining = Number(totalAmount) - Number(paidAmount);
    if (remaining > 0) {
      // Mark as partial if there's still remaining balance
      updateBilling.mutate({ id, status: "partial", paidAmount: totalAmount });
    } else {
      // Mark as paid if fully paid
      updateBilling.mutate({ id, status: "paid", paidAmount: totalAmount });
    }
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manajemen Billing</h2>
        <p className="mt-1 text-sm text-gray-500">Manajemen tagihan dan pembayaran pasien</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari pasien untuk melihat tagihan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSearch onPatientSelect={handlePatientSelect} placeholder="Cari pasien berdasarkan nama atau nomor rekam medis..." />
        </CardContent>
      </Card>

      {selectedPatientId ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Tagihan: {patient?.name}
              </CardTitle>
              <CardDescription>
                No. Rekam Medis: {patient?.medicalRecordNumber}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href={`/billing/new?patientId=${selectedPatientId}`}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Tagihan
              </Link>
            </Button>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Belum Dibayar</TabsTrigger>
                <TabsTrigger value="partial">Dibayar Sebagian</TabsTrigger>
                <TabsTrigger value="paid">Lunas</TabsTrigger>
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
              ) : filteredBillings && filteredBillings.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Terbayar</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tindakan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBillings.map((billing) => (
                        <TableRow key={billing.id}>
                          <TableCell className="font-medium">{billing.invoiceNumber}</TableCell>
                          <TableCell>
                            {format(new Date(billing.billDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {billing.billType === "outpatient" ? "Rawat Jalan" :
                             billing.billType === "inpatient" ? "Rawat Inap" :
                             billing.billType === "pharmacy" ? "Farmasi" : "Laboratorium"}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(Number(billing.totalAmount))}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(Number(billing.paidAmount))}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                billing.status === "paid"
                                  ? "bg-green-100 text-green-800 border-green-100"
                                  : billing.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-100"
                                  : "bg-blue-100 text-blue-800 border-blue-100"
                              }
                            >
                              {billing.status === "paid"
                                ? "Lunas"
                                : billing.status === "pending"
                                ? "Belum Dibayar"
                                : "Dibayar Sebagian"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                              >
                                <Link href={`/billing/${billing.id}`}>
                                  Detail
                                </Link>
                              </Button>
                              
                              {(billing.status === "pending" || billing.status === "partial") && (
                                <Button 
                                  size="sm"
                                  onClick={() => handlePayment(
                                    billing.id, 
                                    billing.totalAmount, 
                                    billing.paidAmount
                                  )}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Bayar
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
                  <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada tagihan</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === "all" 
                      ? "Pasien ini belum memiliki tagihan" 
                      : `Tidak ada tagihan dengan status "${activeTab}"`}
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
