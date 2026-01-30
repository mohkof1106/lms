'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Box, DollarSign, TrendingDown, Users, Loader2, Pencil, Trash2 } from 'lucide-react';
import { AssetCategory, Asset, Employee } from '@/types';
import { AssetForm, AssetFormData } from '@/components/assets';
import { toast } from 'sonner';

const assetCategoryLabels: Record<AssetCategory, string> = {
  equipment: 'Equipment',
  software: 'Software',
  furniture: 'Furniture',
  vehicle: 'Vehicle',
  other: 'Other',
};

const categoryColors: Record<AssetCategory, string> = {
  equipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  software: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  furniture: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  vehicle: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  other: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

  // Fetch assets and employees from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [assetsRes, employeesRes] = await Promise.all([
          supabase.from('assets').select('*').order('name'),
          supabase.from('employees').select('id, full_name, job_title').eq('active', true),
        ]);

        if (assetsRes.error) throw assetsRes.error;
        if (employeesRes.error) throw employeesRes.error;

        const mappedAssets: Asset[] = (assetsRes.data || []).map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category as AssetCategory,
          purchaseDate: a.purchase_date,
          purchasePrice: Number(a.purchase_price),
          usefulLifeYears: a.useful_life_years,
          currentValue: Number(a.current_value),
          depreciationPerYear: Number(a.depreciation_per_year),
          assignedTo: a.assigned_to || undefined,
          serialNumber: a.serial_number || undefined,
          notes: a.notes || undefined,
        }));

        const mappedEmployees: Employee[] = (employeesRes.data || []).map((e) => ({
          id: e.id,
          fullName: e.full_name,
          email: '',
          phone: '',
          role: 'designer',
          jobTitle: e.job_title || '',
          department: '',
          baseSalary: 0,
          compensation: 0,
          insurance: 0,
          ticketValue: 0,
          visaCost: 0,
          vacationDays: 0,
          startDate: '',
          active: true,
        }));

        setAssets(mappedAssets);
        setEmployees(mappedEmployees);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
    const totalDepreciation = totalPurchaseValue - totalValue;
    const assignedCount = assets.filter((a) => a.assignedTo).length;

    return { totalValue, totalPurchaseValue, totalDepreciation, assignedCount };
  }, [assets]);

  const handleAddAsset = async (data: AssetFormData) => {
    try {
      const { data: newAsset, error } = await supabase
        .from('assets')
        .insert({
          name: data.name,
          category: data.category,
          purchase_date: data.purchaseDate,
          purchase_price: data.purchasePrice,
          useful_life_years: data.usefulLifeYears,
          current_value: data.purchasePrice,
          depreciation_per_year: data.purchasePrice / data.usefulLifeYears,
          assigned_to: data.assignedTo === 'none' ? null : data.assignedTo || null,
          serial_number: data.serialNumber || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const mapped: Asset = {
        id: newAsset.id,
        name: newAsset.name,
        category: newAsset.category as AssetCategory,
        purchaseDate: newAsset.purchase_date,
        purchasePrice: Number(newAsset.purchase_price),
        usefulLifeYears: newAsset.useful_life_years,
        currentValue: Number(newAsset.current_value),
        depreciationPerYear: Number(newAsset.depreciation_per_year),
        assignedTo: newAsset.assigned_to || undefined,
        serialNumber: newAsset.serial_number || undefined,
        notes: newAsset.notes || undefined,
      };

      setAssets([...assets, mapped]);
      setIsAddSheetOpen(false);
      toast.success('Asset added successfully');
    } catch (err) {
      console.error('Error adding asset:', err);
      toast.error('Failed to add asset');
    }
  };

  const handleUpdateAsset = async (data: AssetFormData) => {
    if (!selectedAsset) return;

    try {
      const { error } = await supabase
        .from('assets')
        .update({
          name: data.name,
          category: data.category,
          purchase_date: data.purchaseDate,
          purchase_price: data.purchasePrice,
          useful_life_years: data.usefulLifeYears,
          depreciation_per_year: data.purchasePrice / data.usefulLifeYears,
          assigned_to: data.assignedTo === 'none' ? null : data.assignedTo || null,
          serial_number: data.serialNumber || null,
          notes: data.notes || null,
        })
        .eq('id', selectedAsset.id);

      if (error) throw error;

      setAssets(
        assets.map((a) =>
          a.id === selectedAsset.id
            ? {
                ...a,
                name: data.name,
                category: data.category as AssetCategory,
                purchaseDate: data.purchaseDate,
                purchasePrice: data.purchasePrice,
                usefulLifeYears: data.usefulLifeYears,
                depreciationPerYear: data.purchasePrice / data.usefulLifeYears,
                assignedTo: data.assignedTo === 'none' ? undefined : data.assignedTo || undefined,
                serialNumber: data.serialNumber || undefined,
                notes: data.notes || undefined,
              }
            : a
        )
      );
      setIsEditSheetOpen(false);
      setSelectedAsset(null);
      toast.success('Asset updated successfully');
    } catch (err) {
      console.error('Error updating asset:', err);
      toast.error('Failed to update asset');
    }
  };

  const handleDeleteAsset = async () => {
    if (!deleteAssetId) return;

    try {
      const { error } = await supabase.from('assets').delete().eq('id', deleteAssetId);

      if (error) throw error;

      setAssets(assets.filter((a) => a.id !== deleteAssetId));
      setDeleteAssetId(null);
      toast.success('Asset deleted successfully');
    } catch (err) {
      console.error('Error deleting asset:', err);
      toast.error('Failed to delete asset');
    }
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditSheetOpen(true);
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '—';
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.fullName || '—';
  };

  if (loading) {
    return (
      <PageWrapper title="Assets" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Assets" description="Error">
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </PageWrapper>
    );
  }

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
                <TableHead className="w-[100px]">Actions</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(asset)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteAssetId(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
          <div className="mt-6 px-4 pb-4">
            <AssetForm
              employees={employees.map((e) => ({
                id: e.id,
                fullName: e.fullName,
                jobTitle: e.jobTitle,
              }))}
              onSubmit={handleAddAsset}
              onCancel={() => setIsAddSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Asset Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
            <SheetDescription>
              Update asset information. Depreciation recalculates automatically.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 pb-4">
            {selectedAsset && (
              <AssetForm
                asset={selectedAsset}
                employees={employees.map((e) => ({
                  id: e.id,
                  fullName: e.fullName,
                  jobTitle: e.jobTitle,
                }))}
                onSubmit={handleUpdateAsset}
                onCancel={() => {
                  setIsEditSheetOpen(false);
                  setSelectedAsset(null);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAssetId} onOpenChange={() => setDeleteAssetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
