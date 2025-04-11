import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { usePatient } from "@/hooks/usePatients";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import PatientSearch from "@/components/PatientSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MedicalRecordList() {
  const [_, navigate] = useLocation();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  const { data: patient } = usePatient(selectedPatientId || 0);
  const { data: medicalRecords, isLoading } = useMedicalRecords(selectedPatientId || 0);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Rekam Medis</h2>
          <p className="mt-1 text-sm text-gray-500">Manajemen rekam medis pasien</p>
        </div>
        {selectedPatientId && (
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button asChild>
              <Link href={`/medical-records/new?patientId=${selectedPatientId}`}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Rekam Medis
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari pasien untuk melihat rekam medisnya
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
              Rekam Medis: {patient?.name}
            </CardTitle>
            <CardDescription>
              No. Rekam Medis: {patient?.medicalRecordNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : medicalRecords && medicalRecords.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe Kunjungan</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Dokter</TableHead>
                      <TableHead>Diagnosa</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(new Date(record.visitDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {record.visitType === "outpatient" ? "Rawat Jalan" : 
                           record.visitType === "inpatient" ? "Rawat Inap" : "UGD"}
                        </TableCell>
                        <TableCell>
                          {/* This would ideally fetch the department name */}
                          Poli {record.departmentId}
                        </TableCell>
                        <TableCell>
                          {/* This would ideally fetch the doctor name */}
                          Dr. ID {record.doctorId}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.diagnosis || "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" asChild size="sm">
                            <Link href={`/medical-records/${record.id}`}>
                              Detail
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-semibold text-gray-700">Belum ada rekam medis</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Pasien ini belum memiliki rekam medis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
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
