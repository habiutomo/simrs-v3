import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Link } from "wouter";

interface PatientSearchProps {
  onPatientSelect?: (patientId: number) => void;
  placeholder?: string;
}

export default function PatientSearch({ onPatientSelect, placeholder = "Cari pasien..." }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients', { query: debouncedSearchTerm }],
    enabled: debouncedSearchTerm.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The actual search is triggered by the debounced value changing
  };

  const handlePatientClick = (patientId: number) => {
    if (onPatientSelect) {
      onPatientSelect(patientId);
    }
    setIsResultsOpen(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length > 2) {
                setIsResultsOpen(true);
              } else {
                setIsResultsOpen(false);
              }
            }}
            className="pl-9"
            onFocus={() => {
              if (debouncedSearchTerm.length > 2) {
                setIsResultsOpen(true);
              }
            }}
          />
        </div>
      </form>

      {isResultsOpen && debouncedSearchTerm.length > 2 && (
        <Card className="absolute z-10 mt-1 w-full">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">Mencari...</div>
            ) : patients && patients.length > 0 ? (
              <ul className="max-h-60 overflow-auto divide-y divide-gray-100">
                {patients.map((patient) => (
                  <li
                    key={patient.id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePatientClick(patient.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          No. RM: {patient.medicalRecordNumber}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.gender === "male" ? "Laki-laki" : "Perempuan"},{" "}
                        {calculateAge(patient.birthDate)} tahun
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center">
                {debouncedSearchTerm.length > 0
                  ? "Tidak ada hasil yang ditemukan"
                  : "Silakan masukkan kata kunci pencarian"}
              </div>
            )}
            {patients && patients.length > 0 && (
              <div className="p-2 border-t border-gray-100 text-center">
                <Link href="/patients/new" className="text-xs text-primary hover:underline">
                  Pasien tidak ditemukan? Register baru
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function calculateAge(birthDate: string | Date): number {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const month = today.getMonth() - birthDateObj.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
}
