import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CapacityOverviewProps {
  capacity: {
    bedCapacity: { total: number; occupied: number };
    icuCapacity: { total: number; occupied: number };
    outpatientCapacity: { total: number; occupied: number };
    emergencyCapacity: { total: number; occupied: number };
  };
}

export default function CapacityOverview({ capacity }: CapacityOverviewProps) {
  // Calculate percentages
  const bedPercentage = Math.round((capacity.bedCapacity.occupied / capacity.bedCapacity.total) * 100);
  const icuPercentage = Math.round((capacity.icuCapacity.occupied / capacity.icuCapacity.total) * 100);
  const outpatientPercentage = Math.round((capacity.outpatientCapacity.occupied / capacity.outpatientCapacity.total) * 100);
  const emergencyPercentage = Math.round((capacity.emergencyCapacity.occupied / capacity.emergencyCapacity.total) * 100);

  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <CardTitle className="text-lg font-medium text-gray-900">Kapasitas Rumah Sakit</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Bed Capacity */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Rawat Inap</h4>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Terisi: <span className="font-medium">{capacity.bedCapacity.occupied}</span>/{capacity.bedCapacity.total}
                </div>
                <div className={`text-sm font-medium ${getColorClass(bedPercentage)}`}>
                  {bedPercentage}%
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <Progress value={bedPercentage} className={getProgressColorClass(bedPercentage)} />
              </div>
            </div>
          </div>

          {/* ICU Capacity */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">ICU</h4>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Terisi: <span className="font-medium">{capacity.icuCapacity.occupied}</span>/{capacity.icuCapacity.total}
                </div>
                <div className={`text-sm font-medium ${getColorClass(icuPercentage)}`}>
                  {icuPercentage}%
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <Progress value={icuPercentage} className={getProgressColorClass(icuPercentage)} />
              </div>
            </div>
          </div>

          {/* Outpatient Capacity */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Poli Rawat Jalan</h4>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Terisi: <span className="font-medium">{capacity.outpatientCapacity.occupied}</span>/{capacity.outpatientCapacity.total}
                </div>
                <div className={`text-sm font-medium ${getColorClass(outpatientPercentage)}`}>
                  {outpatientPercentage}%
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <Progress value={outpatientPercentage} className={getProgressColorClass(outpatientPercentage)} />
              </div>
            </div>
          </div>

          {/* ER Capacity */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">UGD</h4>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Terisi: <span className="font-medium">{capacity.emergencyCapacity.occupied}</span>/{capacity.emergencyCapacity.total}
                </div>
                <div className={`text-sm font-medium ${getColorClass(emergencyPercentage)}`}>
                  {emergencyPercentage}%
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <Progress value={emergencyPercentage} className={getProgressColorClass(emergencyPercentage)} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorClass(percentage: number): string {
  if (percentage >= 90) return "text-red-600";
  if (percentage >= 70) return "text-yellow-600";
  return "text-blue-600";
}

function getProgressColorClass(percentage: number): string {
  if (percentage >= 90) return "bg-red-600";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-blue-600";
}
