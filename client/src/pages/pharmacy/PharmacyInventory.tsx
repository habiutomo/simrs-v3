import { useState } from "react";
import { useMedications } from "@/hooks/usePharmacy";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Search, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";

export default function PharmacyInventory() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showLowStock, setShowLowStock] = useState(false);
  
  const { data: medications, isLoading } = useMedications({ 
    category, 
    lowStock: showLowStock 
  });

  // Filter medications based on search query
  const filteredMedications = debouncedSearchQuery.length > 0
    ? medications?.filter(medication => 
        medication.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        medication.code.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : medications;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled via state/debounce
  };

  return (
    <div className="py-6">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800">Inventaris Farmasi</h2>
          <p className="mt-1 text-sm text-gray-500">Manajemen stok obat dan farmasi</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex">
          <Button variant={showLowStock ? "default" : "outline"} 
            onClick={() => setShowLowStock(!showLowStock)}
            className="mr-2"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            {showLowStock ? "Semua Stok" : "Stok Menipis"}
          </Button>
          <Button asChild>
            <Link href="/pharmacy/prescriptions">
              <Package className="mr-2 h-4 w-4" />
              Resep Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Obat</CardTitle>
              <CardDescription>
                Total {filteredMedications?.length || 0} obat terdaftar
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Kategori:</span>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value || undefined)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Kategori</SelectItem>
                  <SelectItem value="Analgesic">Analgesik</SelectItem>
                  <SelectItem value="Antibiotic">Antibiotik</SelectItem>
                  <SelectItem value="Antacid">Antasida</SelectItem>
                  <SelectItem value="Antihypertensive">Antihipertensi</SelectItem>
                  <SelectItem value="Antipyretic">Antipiretik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari obat berdasarkan nama atau kode..."
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
          ) : filteredMedications && filteredMedications.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Stok Min.</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.code}</TableCell>
                      <TableCell>{medication.name}</TableCell>
                      <TableCell>{medication.category}</TableCell>
                      <TableCell>{medication.unit}</TableCell>
                      <TableCell>{medication.stock}</TableCell>
                      <TableCell>{medication.minStock}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(Number(medication.price))}
                      </TableCell>
                      <TableCell>
                        {medication.stock <= medication.minStock ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-100">
                            Stok Menipis
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-100">
                            Stok Cukup
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-700">Tidak ada obat</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery.length > 0
                  ? "Tidak ada obat yang sesuai dengan pencarian"
                  : showLowStock
                  ? "Tidak ada obat dengan stok menipis"
                  : "Belum ada obat yang terdaftar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
