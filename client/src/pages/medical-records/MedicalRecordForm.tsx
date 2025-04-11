import { useCreateMedicalRecord } from "@/hooks/useMedicalRecords";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";
import MedicalRecordFormComponent from "@/components/MedicalRecordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function MedicalRecordForm() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const patientId = params.get("patientId");
  
  const [defaultValues, setDefaultValues] = useState<any>({});
  
  useEffect(() => {
    // Set initial values if patientId is provided
    if (patientId) {
      setDefaultValues({
        patientId: parseInt(patientId),
        visitDate: new Date(),
        visitType: "outpatient"
      });
    }
  }, [patientId]);
  
  const createMedicalRecord = useCreateMedicalRecord();

  const handleSubmit = async (data: any) => {
    try {
      // Transform vital signs into JSON string for the API
      const formData = {
        ...data,
        vitalSigns: JSON.stringify(data.vitalSigns)
      };
      
      const newRecord = await createMedicalRecord.mutateAsync(formData);
      toast({
        title: "Rekam medis berhasil dibuat",
        description: `Rekam medis pasien telah berhasil disimpan.`,
      });
      navigate(`/patients/${data.patientId}`);
    } catch (error) {
      console.error("Error creating medical record:", error);
      toast({
        title: "Gagal membuat rekam medis",
        description: "Terjadi kesalahan saat menyimpan rekam medis. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Buat Rekam Medis</h2>
        <p className="mt-1 text-sm text-gray-500">Form pencatatan rekam medis pasien</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Rekam Medis</CardTitle>
          <CardDescription>
            Masukkan data rekam medis dengan lengkap dan benar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MedicalRecordFormComponent 
            defaultValues={defaultValues}
            onSubmit={handleSubmit} 
            isSubmitting={createMedicalRecord.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
