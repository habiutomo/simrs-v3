import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import PatientSearch from "./PatientSearch";
import { useState } from "react";

const medicalRecordFormSchema = z.object({
  patientId: z.number({
    required_error: "Pasien harus dipilih",
  }),
  doctorId: z.number({
    required_error: "Dokter harus dipilih",
  }),
  departmentId: z.number({
    required_error: "Departemen harus dipilih",
  }),
  visitDate: z.date({
    required_error: "Tanggal kunjungan harus dipilih",
  }),
  visitType: z.enum(["outpatient", "inpatient", "emergency"], {
    required_error: "Tipe kunjungan harus dipilih",
  }),
  chiefComplaint: z.string().optional(),
  diagnosis: z.string().optional(),
  secondaryDiagnosis: z.string().optional(),
  clinicalNotes: z.string().optional(),
  treatment: z.string().optional(),
  vitalSigns: z.object({
    temperature: z.string().optional(),
    heartRate: z.string().optional(),
    bloodPressure: z.string().optional(),
    respiratoryRate: z.string().optional(),
    oxygenSaturation: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
  }).optional()
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordFormSchema>;

interface MedicalRecordFormProps {
  defaultValues?: Partial<MedicalRecordFormValues>;
  onSubmit: (data: MedicalRecordFormValues) => void;
  isSubmitting?: boolean;
}

export default function MedicalRecordForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: MedicalRecordFormProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(
    defaultValues?.departmentId
  );
  const [selectedPatient, setSelectedPatient] = useState<{ id: number; name: string } | null>(null);

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordFormSchema),
    defaultValues: defaultValues || {
      patientId: undefined,
      doctorId: undefined,
      departmentId: undefined,
      visitDate: new Date(),
      visitType: "outpatient",
      chiefComplaint: "",
      diagnosis: "",
      secondaryDiagnosis: "",
      clinicalNotes: "",
      treatment: "",
      vitalSigns: {
        temperature: "",
        heartRate: "",
        bloodPressure: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        height: "",
        weight: "",
      }
    },
  });

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['/api/departments'],
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['/api/doctors', { departmentId: selectedDepartmentId }],
    enabled: !!selectedDepartmentId,
  });

  // If we have a patientId in defaultValues, fetch the patient details
  const { data: patient } = useQuery({
    queryKey: ['/api/patients', defaultValues?.patientId],
    enabled: !!defaultValues?.patientId,
    onSuccess: (data) => {
      if (data) {
        setSelectedPatient({ id: data.id, name: data.name });
      }
    },
  });

  const handlePatientSelect = (patientId: number) => {
    form.setValue("patientId", patientId);
    // Fetch patient details to display the name
    fetch(`/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedPatient({ id: data.id, name: data.name });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>Pasien</FormLabel>
                <div className="flex-1">
                  {selectedPatient ? (
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{selectedPatient.name}</div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(null);
                          form.setValue("patientId", undefined as any);
                        }}
                      >
                        Ganti
                      </Button>
                    </div>
                  ) : (
                    <PatientSearch onPatientSelect={handlePatientSelect} />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Kunjungan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe kunjungan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="outpatient">Rawat Jalan</SelectItem>
                    <SelectItem value="inpatient">Rawat Inap</SelectItem>
                    <SelectItem value="emergency">UGD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departemen / Poli</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                    setSelectedDepartmentId(parseInt(value));
                    form.setValue("doctorId", undefined as any);
                  }}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih departemen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingDepartments ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dokter</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={!selectedDepartmentId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dokter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!selectedDepartmentId ? (
                      <SelectItem value="select-dept" disabled>
                        Pilih departemen terlebih dahulu
                      </SelectItem>
                    ) : isLoadingDoctors ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : doctors?.length === 0 ? (
                      <SelectItem value="no-doctors" disabled>
                        Tidak ada dokter di departemen ini
                      </SelectItem>
                    ) : (
                      doctors?.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Kunjungan</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-700">Tanda Vital</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="vitalSigns.temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suhu (°C)</FormLabel>
                  <FormControl>
                    <Input placeholder="36.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detak Jantung (bpm)</FormLabel>
                  <FormControl>
                    <Input placeholder="80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekanan Darah (mmHg)</FormLabel>
                  <FormControl>
                    <Input placeholder="120/80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.respiratoryRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laju Pernapasan (rpm)</FormLabel>
                  <FormControl>
                    <Input placeholder="18" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.oxygenSaturation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saturasi Oksigen (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="98" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berat Badan (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="70" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vitalSigns.height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tinggi Badan (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="170" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="chiefComplaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keluhan Utama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Keluhan pasien saat berkunjung"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis Utama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diagnosis utama pasien"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryDiagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis Sekunder</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diagnosis sekunder (jika ada)"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clinicalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Klinis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan klinis tentang pasien"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tindakan dan Pengobatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Rencana tindakan dan pengobatan"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
