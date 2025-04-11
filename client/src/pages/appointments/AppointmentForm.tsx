import { useCreateAppointment } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";
import AppointmentFormComponent from "@/components/AppointmentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AppointmentForm() {
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
        status: "pending"
      });
    }
  }, [patientId]);
  
  const createAppointment = useCreateAppointment();

  const handleSubmit = async (data: any) => {
    try {
      const newAppointment = await createAppointment.mutateAsync(data);
      toast({
        title: "Janji temu berhasil dibuat",
        description: `Janji temu telah berhasil dijadwalkan.`,
      });
      navigate(`/appointments`);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Gagal membuat janji temu",
        description: "Terjadi kesalahan saat menyimpan janji temu. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Buat Janji Temu Baru</h2>
        <p className="mt-1 text-sm text-gray-500">Form pembuatan janji temu pasien</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Janji Temu</CardTitle>
          <CardDescription>
            Masukkan data janji temu dengan lengkap dan benar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentFormComponent 
            defaultValues={defaultValues}
            onSubmit={handleSubmit} 
            isSubmitting={createAppointment.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
