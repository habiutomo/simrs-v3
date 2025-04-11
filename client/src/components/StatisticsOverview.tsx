import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Building, CreditCard } from "lucide-react";

interface StatisticsProps {
  stats: {
    totalPatients: number;
    outpatientToday: number;
    inpatientActive: number;
    monthlyRevenue: number;
  };
}

export default function StatisticsOverview({ stats }: StatisticsProps) {
  // Format the monthly revenue as IDR
  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(stats.monthlyRevenue);
  
  // Convert to millions for display
  const revenueInMillions = (stats.monthlyRevenue / 1000000).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Patients */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Pasien</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.totalPatients.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-green-600">+3.2%</span>
                    <span className="ml-2 text-gray-500">dari bulan lalu</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outpatient Today */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rawat Jalan Hari Ini</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.outpatientToday}
                  </div>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-green-600">+5.4%</span>
                    <span className="ml-2 text-gray-500">dari minggu lalu</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inpatient Active */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Building className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rawat Inap (Aktif)</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.inpatientActive}
                  </div>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-red-600">-2.1%</span>
                    <span className="ml-2 text-gray-500">dari minggu lalu</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pendapatan Bulan Ini</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    Rp {revenueInMillions} Jt
                  </div>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-green-600">+8.2%</span>
                    <span className="ml-2 text-gray-500">dari bulan lalu</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
