import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "wouter";
import { format, isToday, addDays, isTomorrow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  departmentName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
}

export default function UpcomingAppointmentsCard({ appointments }: UpcomingAppointmentsCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <CardTitle className="text-lg font-medium text-gray-900">Janji Temu Mendatang</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-primary truncate">
                        {appointment.patientName}
                      </p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        dengan {appointment.doctorName}
                      </p>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <Badge
                        variant="outline"
                        className={cn(
                          "mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800 border-green-100"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-100"
                            : "bg-red-100 text-red-800 border-red-100"
                        )}
                      >
                        {appointment.status === "confirmed"
                          ? "Konfirmasi"
                          : appointment.status === "pending"
                          ? "Menunggu"
                          : "Dibatalkan"}
                      </Badge>
                      <span>{appointment.departmentName}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <p className="text-gray-500">
                      {formatAppointmentDate(appointment.appointmentDate)},{" "}
                      {formatTime(appointment.appointmentTime)}
                    </p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </li>
          ))}
          {appointments.length === 0 && (
            <li className="px-4 py-4 text-center text-sm text-gray-500">
              Tidak ada janji temu mendatang
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link
          href="/appointments"
          className="text-sm font-medium text-primary hover:text-blue-700"
        >
          Lihat semua janji temu &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

function formatAppointmentDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return "Hari ini";
  } else if (isTomorrow(date)) {
    return "Besok";
  } else {
    return format(date, "dd MMM yyyy");
  }
}

function formatTime(timeString: string): string {
  // Convert "HH:MM:SS" to "HH:MM"
  return timeString.substring(0, 5);
}
