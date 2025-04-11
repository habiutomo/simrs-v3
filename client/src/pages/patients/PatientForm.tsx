import { useCreatePatient } from "@/hooks/usePatients";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import PatientFormComponent from "@/components/PatientForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatientForm() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const createPatient = useCreatePatient();

  const handleSubmit = async (data: any) => {
    try {
      const newPatient = await createPatient.mutateAsync(data);
      toast({
        title: "Pasien berhasil ditambahkan",
        description: `Pasien ${newPatient.name} telah berhasil terdaftar dengan nomor rekam medis ${newPatient.medicalRecordNumber}.`,
      });
      navigate(`/patients/${newPatient.id}`);
    } catch (error) {
      console.error("Error creating patient:", error);
      toast({
        title: "Gagal menambahkan pasien",
        description: "Terjadi kesalahan saat menyimpan data pasien. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Registrasi Pasien Baru</h2>
        <p className="mt-1 text-sm text-gray-500">Form pendaftaran pasien baru</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pasien</CardTitle>
          <CardDescription>
            Masukkan data pasien dengan lengkap dan benar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientFormComponent 
            onSubmit={handleSubmit} 
            isSubmitting={createPatient.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
