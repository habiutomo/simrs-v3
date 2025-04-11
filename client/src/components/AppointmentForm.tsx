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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
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

const appointmentFormSchema = z.object({
  patientId: z.number({
    required_error: "Pasien harus dipilih",
  }),
  doctorId: z.number({
    required_error: "Dokter harus dipilih",
  }),
  departmentId: z.number({
    required_error: "Departemen harus dipilih",
  }),
  appointmentDate: z.date({
    required_error: "Tanggal janji temu harus dipilih",
  }),
  appointmentTime: z.string({
    required_error: "Waktu janji temu harus dipilih",
  }),
  status: z.enum(["pending", "confirmed", "cancelled"], {
    required_error: "Status harus dipilih",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormValues>;
  onSubmit: (data: AppointmentFormValues) => void;
  isSubmitting?: boolean;
}

export default function AppointmentForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: AppointmentFormProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(
    defaultValues?.departmentId
  );
  const [selectedPatient, setSelectedPatient] = useState<{ id: number; name: string } | null>(null);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: defaultValues || {
      patientId: undefined,
      doctorId: undefined,
      departmentId: undefined,
      appointmentDate: undefined,
      appointmentTime: "",
      status: "pending",
      notes: "",
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

  // Generate time slots from 08:00 to 16:00 with 30-minute intervals
  const timeSlots = [];
  const startHour = 8;
  const endHour = 16;
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 30]) {
      if (hour === endHour && minute > 0) continue;
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeSlots.push(`${formattedHour}:${formattedMinute}`);
    }
  }

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
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Janji Temu</FormLabel>
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
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Janji Temu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih waktu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={`${time}:00`}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan tambahan untuk janji temu"
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
