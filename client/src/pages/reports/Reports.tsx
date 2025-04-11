import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Activity, CreditCard, User, Clipboard } from "lucide-react";

// Custom type for report period
type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

// Sample report data generators
const generatePatientVisitData = (period: ReportPeriod) => {
  if (period === "daily") {
    return [
      { name: "00:00", outpatient: 0, inpatient: 0, emergency: 0 },
      { name: "03:00", outpatient: 2, inpatient: 1, emergency: 1 },
      { name: "06:00", outpatient: 5, inpatient: 2, emergency: 3 },
      { name: "09:00", outpatient: 18, inpatient: 4, emergency: 6 },
      { name: "12:00", outpatient: 15, inpatient: 3, emergency: 4 },
      { name: "15:00", outpatient: 12, inpatient: 2, emergency: 5 },
      { name: "18:00", outpatient: 8, inpatient: 1, emergency: 7 },
      { name: "21:00", outpatient: 3, inpatient: 1, emergency: 4 },
    ];
  } else if (period === "weekly") {
    return [
      { name: "Senin", outpatient: 45, inpatient: 12, emergency: 18 },
      { name: "Selasa", outpatient: 38, inpatient: 10, emergency: 14 },
      { name: "Rabu", outpatient: 42, inpatient: 11, emergency: 16 },
      { name: "Kamis", outpatient: 40, inpatient: 10, emergency: 15 },
      { name: "Jumat", outpatient: 35, inpatient: 9, emergency: 12 },
      { name: "Sabtu", outpatient: 25, inpatient: 8, emergency: 20 },
      { name: "Minggu", outpatient: 15, inpatient: 7, emergency: 25 },
    ];
  } else {
    return [
      { name: "Jan", outpatient: 180, inpatient: 45, emergency: 70 },
      { name: "Feb", outpatient: 195, inpatient: 48, emergency: 65 },
      { name: "Mar", outpatient: 210, inpatient: 50, emergency: 72 },
      { name: "Apr", outpatient: 205, inpatient: 47, emergency: 68 },
      { name: "Mei", outpatient: 220, inpatient: 52, emergency: 75 },
      { name: "Jun", outpatient: 215, inpatient: 51, emergency: 70 },
      { name: "Jul", outpatient: 225, inpatient: 55, emergency: 72 },
      { name: "Agt", outpatient: 230, inpatient: 56, emergency: 74 },
      { name: "Sep", outpatient: 220, inpatient: 54, emergency: 71 },
      { name: "Okt", outpatient: 215, inpatient: 52, emergency: 70 },
      { name: "Nov", outpatient: 205, inpatient: 50, emergency: 67 },
      { name: "Des", outpatient: 190, inpatient: 47, emergency: 65 },
    ];
  }
};

const generateRevenueData = (period: ReportPeriod) => {
  if (period === "monthly") {
    return [
      { name: "Jan", rawatJalan: 180, rawatInap: 270, farmasi: 90, lab: 60, total: 600 },
      { name: "Feb", rawatJalan: 195, rawatInap: 285, farmasi: 100, lab: 70, total: 650 },
      { name: "Mar", rawatJalan: 210, rawatInap: 300, farmasi: 110, lab: 80, total: 700 },
      { name: "Apr", rawatJalan: 205, rawatInap: 290, farmasi: 105, lab: 75, total: 675 },
      { name: "Mei", rawatJalan: 220, rawatInap: 320, farmasi: 115, lab: 85, total: 740 },
      { name: "Jun", rawatJalan: 215, rawatInap: 310, farmasi: 112, lab: 83, total: 720 },
    ];
  } else {
    return [
      { name: "2020", rawatJalan: 2000, rawatInap: 3000, farmasi: 1200, lab: 800, total: 7000 },
      { name: "2021", rawatJalan: 2200, rawatInap: 3300, farmasi: 1300, lab: 900, total: 7700 },
      { name: "2022", rawatJalan: 2400, rawatInap: 3600, farmasi: 1400, lab: 1000, total: 8400 },
      { name: "2023", rawatJalan: 2600, rawatInap: 3900, farmasi: 1500, lab: 1100, total: 9100 },
    ];
  }
};

const generatePatientDemographicsData = () => {
  return [
    { name: "0-17", value: 250, color: "#8884d8" },
    { name: "18-30", value: 300, color: "#83a6ed" },
    { name: "31-45", value: 400, color: "#8dd1e1" },
    { name: "46-60", value: 350, color: "#82ca9d" },
    { name: "61+", value: 200, color: "#a4de6c" },
  ];
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState("visits");
  const [visitPeriod, setVisitPeriod] = useState<ReportPeriod>("monthly");
  const [revenuePeriod, setRevenuePeriod] = useState<ReportPeriod>("monthly");
  
  // Dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });
  
  // Get report data based on selected period
  const visitData = generatePatientVisitData(visitPeriod);
  const revenueData = generateRevenueData(revenuePeriod);
  const demographicsData = generatePatientDemographicsData();
  
  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Laporan & Analitik</h2>
          <p className="mt-1 text-sm text-gray-500">Statistik dan laporan rumah sakit</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Laporan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pasien</p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {isLoadingStats ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    stats?.totalPatients.toLocaleString() || "0"
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Kunjungan Bulan Ini</p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {isLoadingStats ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    "652"
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendapatan Bulan Ini</p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {isLoadingStats ? (
                    <Skeleton className="h-7 w-20" />
                  ) : (
                    `Rp ${(stats?.monthlyRevenue / 1000000).toFixed(1)} Jt` || "Rp 0"
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="visits">Kunjungan Pasien</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="demographics">Demografi Pasien</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grafik Kunjungan Pasien</CardTitle>
                  <CardDescription>
                    Statistik kunjungan pasien berdasarkan tipe kunjungan
                  </CardDescription>
                </div>
                <Select value={visitPeriod} onValueChange={(value: ReportPeriod) => setVisitPeriod(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Harian</SelectItem>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visitData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="outpatient" name="Rawat Jalan" fill="#3b82f6" />
                    <Bar dataKey="inpatient" name="Rawat Inap" fill="#10b981" />
                    <Bar dataKey="emergency" name="UGD" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grafik Pendapatan</CardTitle>
                  <CardDescription>
                    Statistik pendapatan rumah sakit berdasarkan layanan
                  </CardDescription>
                </div>
                <Select value={revenuePeriod} onValueChange={(value: ReportPeriod) => setRevenuePeriod(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rp ${value} Jt`} />
                    <Legend />
                    <Bar dataKey="rawatJalan" name="Rawat Jalan" fill="#3b82f6" />
                    <Bar dataKey="rawatInap" name="Rawat Inap" fill="#10b981" />
                    <Bar dataKey="farmasi" name="Farmasi" fill="#f59e0b" />
                    <Bar dataKey="lab" name="Laboratorium" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Umur Pasien</CardTitle>
                <CardDescription>
                  Persentase pasien berdasarkan kelompok umur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} pasien`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Laporan Tersedia</CardTitle>
                <CardDescription>
                  Unduh laporan rumah sakit dalam format PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Laporan Kunjungan Bulanan</h3>
                        <p className="text-sm text-gray-500">Periode: September 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Laporan Keuangan</h3>
                        <p className="text-sm text-gray-500">Periode: Q3 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                    <div className="flex items-center">
                      <Clipboard className="h-6 w-6 text-gray-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">Laporan Regulasi (RL 1-2)</h3>
                        <p className="text-sm text-gray-500">Periode: 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
