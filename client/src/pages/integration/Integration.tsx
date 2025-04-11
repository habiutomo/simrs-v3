import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Download, Upload, CreditCard, CheckCircle, Shield, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Integration() {
  const [activeTab, setActiveTab] = useState("satu-sehat");

  // Sample insurance integration data
  const insurances = [
    { id: 1, name: "BPJS Kesehatan", type: "Pemerintah", status: "active", lastSync: "2025-04-10" },
    { id: 2, name: "Mandiri Inhealth", type: "Swasta", status: "active", lastSync: "2025-04-09" },
    { id: 3, name: "Prudential", type: "Swasta", status: "inactive", lastSync: "-" },
    { id: 4, name: "Allianz", type: "Swasta", status: "pending", lastSync: "-" },
    { id: 5, name: "AXA Mandiri", type: "Swasta", status: "active", lastSync: "2025-04-08" },
  ];

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Integrasi Sistem</h2>
        <p className="mt-1 text-sm text-gray-500">Integrasi dengan Satu Sehat dan layanan asuransi kesehatan</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="satu-sehat">Satu Sehat FHIR</TabsTrigger>
          <TabsTrigger value="insurance">Asuransi</TabsTrigger>
        </TabsList>

        {/* Satu Sehat Integration Tab */}
        <TabsContent value="satu-sehat">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Integrasi Satu Sehat</CardTitle>
                <CardDescription>
                  Status koneksi dengan layanan Satu Sehat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Server className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-700">Belum Terhubung</h3>
                    <p className="text-sm text-yellow-600">
                      Sistem belum terintegrasi dengan layanan Satu Sehat. Silakan konfigurasi koneksi terlebih dahulu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi Satu Sehat</CardTitle>
                <CardDescription>
                  Pengaturan koneksi ke layanan Satu Sehat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Client ID
                    </label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Masukkan Client ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Client Secret
                    </label>
                    <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Masukkan Client Secret" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Organization ID
                    </label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Masukkan Organization ID" />
                  </div>
                  <Button className="w-full">
                    Simpan Konfigurasi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sinkronisasi Data FHIR</CardTitle>
              <CardDescription>
                Sinkronisasi data pasien dan rekam medis dengan Satu Sehat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="h-6 w-6 text-blue-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Kirim Data ke Satu Sehat</h3>
                        <p className="text-sm text-gray-500">Mengirim data pasien dan kunjungan ke Satu Sehat</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Kirim
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Download className="h-6 w-6 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Ambil Data dari Satu Sehat</h3>
                        <p className="text-sm text-gray-500">Mengambil riwayat pasien dari Satu Sehat</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Ambil
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Integration Tab */}
        <TabsContent value="insurance">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Integrasi Asuransi Kesehatan</CardTitle>
                  <CardDescription>
                    Kelola integrasi dengan penyedia asuransi kesehatan
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Asuransi
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Asuransi</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sinkronisasi Terakhir</TableHead>
                        <TableHead>Tindakan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insurances.map((insurance) => (
                        <TableRow key={insurance.id}>
                          <TableCell className="font-medium">{insurance.name}</TableCell>
                          <TableCell>{insurance.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                insurance.status === "active"
                                  ? "bg-green-100 text-green-800 border-green-100"
                                  : insurance.status === "inactive"
                                  ? "bg-red-100 text-red-800 border-red-100"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-100"
                              }
                            >
                              {insurance.status === "active"
                                ? "Aktif"
                                : insurance.status === "inactive"
                                ? "Tidak Aktif"
                                : "Tertunda"}
                            </Badge>
                          </TableCell>
                          <TableCell>{insurance.lastSync}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                Konfigurasi
                              </Button>
                              <Button 
                                size="sm"
                                variant={insurance.status === "active" ? "default" : "outline"}
                                disabled={insurance.status === "pending"}
                              >
                                {insurance.status === "active" ? (
                                  <>
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Sinkronisasi
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-1 h-4 w-4" />
                                    Aktifkan
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrasi BPJS Kesehatan</CardTitle>
                <CardDescription>Pengaturan khusus untuk integrasi dengan BPJS Kesehatan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="text-sm font-medium text-green-700">Terhubung</h3>
                      <p className="text-sm text-green-600">
                        Integrasi dengan BPJS Kesehatan aktif dan berfungsi dengan baik.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-6 w-6 text-blue-500 mr-3" />
                          <div>
                            <h3 className="font-medium text-gray-800">Verifikasi Keanggotaan</h3>
                            <p className="text-sm text-gray-500">Verifikasi status keanggotaan BPJS pasien</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Verifikasi
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Upload className="h-6 w-6 text-green-500 mr-3" />
                          <div>
                            <h3 className="font-medium text-gray-800">Kirim Klaim</h3>
                            <p className="text-sm text-gray-500">Kirim data klaim layanan ke BPJS</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Kirim
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}