import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Activity,
  Package,
  FlaskRound,
  Zap,
  BarChart2,
  Server,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Manajemen Pasien", href: "/patients", icon: Users },
    { name: "Jadwal & Appointment", href: "/appointments", icon: Calendar },
    { name: "Rekam Medis", href: "/medical-records", icon: FileText },
    { name: "Rawat Jalan", href: "/outpatient", icon: Activity },
    { name: "Farmasi", href: "/pharmacy/inventory", icon: Package },
    { name: "Laboratorium", href: "/laboratory/requests", icon: FlaskRound },
    { name: "Radiologi", href: "/radiology", icon: Zap },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Laporan & Analitik", href: "/reports", icon: BarChart2 },
    { name: "Integrasi Sistem", href: "/integration", icon: Server },
  ];

  return (
    <>
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-primary">SIMRS</h1>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">A</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Dr. Sutono</p>
            <p className="text-xs font-medium text-gray-500">Admin</p>
          </div>
          <button className="ml-auto p-1 text-gray-500 hover:text-gray-700">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
