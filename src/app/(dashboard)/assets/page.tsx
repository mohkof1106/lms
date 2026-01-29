'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout';
import { SearchInput } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  mockAssets,
  assetCategoryLabels,
} from '@/lib/mock-data/assets';
import { mockEmployees } from '@/lib/mock-data/employees';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Plus, Box, DollarSign, TrendingDown, Users } from 'lucide-react';
import { AssetCategory, Asset } from '@/types';
import { AssetForm, AssetFormData } from '@/components/assets';
import { toast } from 'sonner';

const categoryColors: Record<AssetCategory, string> = {
  equipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  software: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  furniture: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  vehicle: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  other: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        asset.name.toLowerCase().includes(searchLower) ||
        asset.serialNumber?.toLowerCase().includes(searchLower);

      const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, assets]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
    const totalDepreciation = totalPurchaseValue - totalValue;
    const assignedCount = assets.filter((a) => a.assignedTo).length;

    return { totalValue, totalPurchaseValue, totalDepreciation, assignedCount };
  }, [assets]);

  const handleAddAsset = (data: AssetFormData) => {
    const newAsset: Asset = {
      id: `AST-${String(assets.length + 1).padStart(3, '0')}`,
      name: data.name,
      category: data.category,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      usefulLifeYears: data.usefulLifeYears,
      currentValue: data.purchasePrice, // New asset, no depreciation yet
      depreciationPerYear: data.purchasePrice / data.usefulLifeYears,
      assignedTo: data.assignedTo || undefined,
      serialNumber: data.serialNumber || undefined,
      notes: data.notes || undefined,
    };

    setAssets([...assets, newAsset]);
    setIsAddSheetOpen(false);
    toast.success('Asset added successfully');
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '—';
    const employee = mockEmployees.find((e) => e.id === employeeId);
    return employee?.fullName || '—';
  };

  return (
    <PageWrapper
      title="Assets"
      description={`${assets.length} company assets`}
      actions={
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{assets.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Depreciation</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalDepreciation)}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold">{stats.assignedCount}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search assets..."
          className="flex-1 max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(assetCategoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Yearly Depr.</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      {asset.serialNumber && (
                        <p className="text-sm text-muted-foreground font-mono">
                          {asset.serialNumber}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={categoryColors[asset.category]}>
                      {assetCategoryLabels[asset.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getEmployeeName(asset.assignedTo)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(asset.purchasePrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(asset.currentValue)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatCurrency(asset.depreciationPerYear)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(asset.purchaseDate)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Asset Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Asset</SheetTitle>
            <SheetDescription>
              Add a new company asset. Depreciation is calculated automatically.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AssetForm
              onSubmit={handleAddAsset}
              onCancel={() => setIsAddSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </PageWrapper>
  );
}
