import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Search, Image, List } from "lucide-react";
import PatientSearch from "@/components/PatientSearch";

export default function Radiology() {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };
  
  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Radiologi</h2>
          <p className="mt-1 text-sm text-gray-500">Manajemen pemeriksaan radiologi</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button disabled>
            <Zap className="mr-2 h-4 w-4" />
            Permintaan Baru
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Pasien</CardTitle>
          <CardDescription>
            Cari pasien untuk melihat permintaan radiologi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSearch onPatientSelect={handlePatientSelect} placeholder="Cari pasien berdasarkan nama atau nomor rekam medis..." />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Permintaan</TabsTrigger>
          <TabsTrigger value="results">Hasil</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "requests" 
                  ? "Daftar Permintaan Radiologi" 
                  : activeTab === "results" 
                  ? "Hasil Radiologi"
                  : "Laporan Radiologi"}
              </CardTitle>
              <CardDescription>
                {activeTab === "requests" 
                  ? "Daftar permintaan pemeriksaan radiologi" 
                  : activeTab === "results" 
                  ? "Hasil pemeriksaan radiologi"
                  : "Laporan dan interpretasi radiologi"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {activeTab === "requests" ? (
                  <>
                    <List className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada permintaan radiologi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedPatientId 
                        ? "Pasien ini belum memiliki permintaan radiologi"
                        : "Silakan pilih pasien terlebih dahulu"}
                    </p>
                  </>
                ) : activeTab === "results" ? (
                  <>
                    <Image className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada hasil radiologi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedPatientId 
                        ? "Pasien ini belum memiliki hasil radiologi"
                        : "Silakan pilih pasien terlebih dahulu"}
                    </p>
                  </>
                ) : (
                  <>
                    <Zap className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada laporan radiologi</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedPatientId 
                        ? "Pasien ini belum memiliki laporan radiologi"
                        : "Silakan pilih pasien terlebih dahulu"}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}