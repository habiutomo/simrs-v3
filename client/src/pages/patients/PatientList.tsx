import { useState } from "react";
import { usePatients } from "@/hooks/usePatients";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { User, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: patients, isLoading, isError } = usePatients(searchQuery.length > 2 ? searchQuery : undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled via the useState/useEffect
  };

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Manajemen Pasien</h2>
          <p className="mt-1 text-sm text-gray-500">Daftar pasien yang terdaftar di rumah sakit</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button asChild>
            <Link href="/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              Pasien Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pasien</CardTitle>
          <CardDescription>
            Total {patients?.length || 0} pasien terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari berdasarkan nama, no. rekam medis, atau identitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              Terjadi kesalahan saat memuat data pasien
            </div>
          ) : patients && patients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Rekam Medis</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Asuransi</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.medicalRecordNumber}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {patient.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(patient.birthDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{patient.phone || "-"}</TableCell>
                      <TableCell>
                        {patient.insuranceProvider ? (
                          <Badge variant="outline">{patient.insuranceProvider}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" asChild size="sm">
                          <Link href={`/patients/${patient.id}`}>
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
              <User className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada pasien</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery.length > 0
                  ? "Tidak ada pasien yang sesuai dengan pencarian"
                  : "Mulai tambahkan pasien dengan mengklik tombol Pasien Baru"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
