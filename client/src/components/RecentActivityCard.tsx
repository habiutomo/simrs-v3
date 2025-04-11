import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "wouter";
import { format, formatDistance } from "date-fns";
import { id } from "date-fns/locale";

interface Activity {
  patientId: number;
  patientName: string;
  activity: string;
  timestamp: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <CardTitle className="text-lg font-medium text-gray-900">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pasien
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aktivitas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.patientName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{activity.activity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatActivityTime(activity.timestamp)}
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada aktivitas terbaru
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <CardFooter className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link href="/reports" className="text-sm font-medium text-primary hover:text-blue-700">
          Lihat semua aktivitas &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
  if (isToday) {
    return `Hari ini, ${format(date, 'HH:mm')}`;
  } else if (isYesterday) {
    return `Kemarin, ${format(date, 'HH:mm')}`;
  } else {
    return formatDistance(date, new Date(), { addSuffix: true, locale: id });
  }
}
