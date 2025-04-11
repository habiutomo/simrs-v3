import { useEffect, useState } from "react";
import { useLabRequest } from "@/hooks/useLaboratory";
import { useCreateLabResult } from "@/hooks/useLaboratory";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface LabResultFormProps {
  requestId: number;
}

export default function LabResultForm({ requestId }: LabResultFormProps) {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { data: labRequest, isLoading, isError } = useLabRequest(requestId);
  const createLabResult = useCreateLabResult();
  
  const [results, setResults] = useState<any[]>([]);
  
  useEffect(() => {
    // Initialize results once lab request data is loaded
    if (labRequest && labRequest.items) {
      setResults(
        labRequest.items.map((item: any) => ({
          labRequestId: requestId,
          labTestId: item.labTestId,
          result: "",
          referenceRange: "",
          unit: "",
          flag: "normal", // default flag
          performedById: 1, // default to admin user
          performedDate: new Date(),
          verified: false,
          verifiedById: null,
          verifiedDate: null,
        }))
      );
    }
  }, [labRequest, requestId]);
  
  const handleResultChange = (index: number, field: string, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };
  
  const handleSubmit = async () => {
    try {
      // Submit each result
      for (const result of results) {
        await createLabResult.mutateAsync({
          ...result,
          performedDate: format(result.performedDate, "yyyy-MM-dd")
        });
      }
      
      toast({
        title: "Hasil lab berhasil disimpan",
        description: "Data hasil pemeriksaan laboratorium telah berhasil disimpan",
      });
      
      navigate("/laboratory/requests");
    } catch (error) {
      console.error("Error saving lab results:", error);
      toast({
        title: "Gagal menyimpan hasil lab",
        description: "Terjadi kesalahan saat menyimpan hasil pemeriksaan laboratorium",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !labRequest) {
    return (
      <div className="py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Input Hasil Laboratorium</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium text-red-600">Permintaan laboratorium tidak ditemukan</h3>
              <p className="mt-2 text-gray-500">
                Permintaan lab dengan ID {requestId} tidak ditemukan atau telah dihapus.
              </p>
              <Button className="mt-4" onClick={() => navigate("/laboratory/requests")}>
                Kembali ke Daftar Permintaan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get patient information
  const patientName = labRequest.patientName || `Pasien ID ${labRequest.patientId}`;
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Input Hasil Laboratorium</h2>
        <p className="mt-1 text-sm text-gray-500">
          Form pengisian hasil pemeriksaan laboratorium
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Permintaan Lab</CardTitle>
          <CardDescription>
            Detail permintaan pemeriksaan laboratorium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pasien</Label>
              <div className="mt-1 text-sm font-medium">{patientName}</div>
            </div>
            <div>
              <Label>Tanggal Permintaan</Label>
              <div className="mt-1 text-sm font-medium">
                {format(new Date(labRequest.requestDate), "dd MMMM yyyy")}
              </div>
            </div>
            <div>
              <Label>Dokter</Label>
              <div className="mt-1 text-sm font-medium">
                Dr. ID {labRequest.doctorId}
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="mt-1 text-sm font-medium">
                {labRequest.status === "completed"
                  ? "Selesai"
                  : labRequest.status === "pending"
                  ? "Menunggu"
                  : labRequest.status === "processing"
                  ? "Diproses"
                  : "Dibatalkan"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hasil Pemeriksaan</CardTitle>
          <CardDescription>
            Isi hasil pemeriksaan untuk setiap tes laboratorium yang diminta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {labRequest.items && labRequest.items.length > 0 ? (
            <div className="space-y-6">
              {labRequest.items.map((item: any, index: number) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    {item.test?.name || `Test ID ${item.labTestId}`}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Hasil</Label>
                      <Input
                        value={results[index]?.result || ""}
                        onChange={(e) => handleResultChange(index, "result", e.target.value)}
                        placeholder="Masukkan hasil pemeriksaan"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Satuan</Label>
                      <Input
                        value={results[index]?.unit || ""}
                        onChange={(e) => handleResultChange(index, "unit", e.target.value)}
                        placeholder="Contoh: mg/dL"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Nilai Rujukan</Label>
                      <Input
                        value={results[index]?.referenceRange || ""}
                        onChange={(e) => handleResultChange(index, "referenceRange", e.target.value)}
                        placeholder="Contoh: 70-110"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Flag</Label>
                      <Select
                        value={results[index]?.flag || "normal"}
                        onValueChange={(value) => handleResultChange(index, "flag", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Pilih flag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="low">Rendah</SelectItem>
                          <SelectItem value="critical">Kritis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Catatan</Label>
                      <Textarea
                        value={results[index]?.notes || ""}
                        onChange={(e) => handleResultChange(index, "notes", e.target.value)}
                        placeholder="Catatan tambahan jika ada"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/laboratory/requests")}
                  className="mr-2"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createLabResult.isPending}
                >
                  {createLabResult.isPending ? "Menyimpan..." : "Simpan Hasil"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <h3 className="text-lg font-medium text-gray-600">Tidak ada tes laboratorium yang diminta</h3>
              <p className="mt-2 text-gray-500">
                Permintaan lab ini tidak memiliki tes yang diminta.
              </p>
              <Button className="mt-4" onClick={() => navigate("/laboratory/requests")}>
                Kembali ke Daftar Permintaan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
