import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Integration() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Integrasi Satu Sehat</h2>
        <p className="mt-1 text-sm text-gray-500">Integrasi sistem dengan FHIR Satu Sehat</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Integrasi</CardTitle>
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
            <CardTitle>Konfigurasi</CardTitle>
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

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sinkronisasi Data</CardTitle>
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
      </div>
    </div>
  );
}