'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { supabase } from '@/lib/supabase';
import { TaskBoardColumn } from '@/types';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Lock,
  ArrowUp,
  ArrowDown,
  Loader2,
  Pencil,
} from 'lucide-react';

export default function ColumnManagementPage() {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<TaskBoardColumn[]>([]);
  const [saving, setSaving] = useState(false);

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<TaskBoardColumn | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('#6366f1');

  // Delete confirmation
  const [deleteColumn, setDeleteColumn] = useState<TaskBoardColumn | null>(null);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    fetchColumns();
  }, []);

  async function fetchColumns() {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('task_board_columns')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      setColumns(
        (data || []).map((col: any) => ({
          id: col.id,
          name: col.name,
          color: col.color,
          sortOrder: col.sort_order,
          isSystem: col.is_system,
        }))
      );
    } catch (err) {
      console.error('Error fetching columns:', err);
      toast.error('Failed to load columns');
    } finally {
      setLoading(false);
    }
  }

  const handleMoveUp = async (column: TaskBoardColumn) => {
    const currentIndex = columns.findIndex((c) => c.id === column.id);
    if (currentIndex <= 0) return;

    setSaving(true);
    try {
      const prevColumn = columns[currentIndex - 1];

      // Swap sort orders
      await (supabase as any)
        .from('task_board_columns')
        .update({ sort_order: prevColumn.sortOrder })
        .eq('id', column.id);

      await (supabase as any)
        .from('task_board_columns')
        .update({ sort_order: column.sortOrder })
        .eq('id', prevColumn.id);

      // Update local state
      const newColumns = [...columns];
      newColumns[currentIndex] = { ...prevColumn, sortOrder: column.sortOrder };
      newColumns[currentIndex - 1] = { ...column, sortOrder: prevColumn.sortOrder };
      newColumns.sort((a, b) => a.sortOrder - b.sortOrder);
      setColumns(newColumns);

      toast.success('Column moved');
    } catch (err) {
      console.error('Error moving column:', err);
      toast.error('Failed to move column');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveDown = async (column: TaskBoardColumn) => {
    const currentIndex = columns.findIndex((c) => c.id === column.id);
    if (currentIndex >= columns.length - 1) return;

    setSaving(true);
    try {
      const nextColumn = columns[currentIndex + 1];

      // Swap sort orders
      await (supabase as any)
        .from('task_board_columns')
        .update({ sort_order: nextColumn.sortOrder })
        .eq('id', column.id);

      await (supabase as any)
        .from('task_board_columns')
        .update({ sort_order: column.sortOrder })
        .eq('id', nextColumn.id);

      // Update local state
      const newColumns = [...columns];
      newColumns[currentIndex] = { ...nextColumn, sortOrder: column.sortOrder };
      newColumns[currentIndex + 1] = { ...column, sortOrder: nextColumn.sortOrder };
      newColumns.sort((a, b) => a.sortOrder - b.sortOrder);
      setColumns(newColumns);

      toast.success('Column moved');
    } catch (err) {
      console.error('Error moving column:', err);
      toast.error('Failed to move column');
    } finally {
      setSaving(false);
    }
  };

  const openAddDialog = () => {
    setEditingColumn(null);
    setFormName('');
    setFormColor('#6366f1');
    setDialogOpen(true);
  };

  const openEditDialog = (column: TaskBoardColumn) => {
    setEditingColumn(column);
    setFormName(column.name);
    setFormColor(column.color);
    setDialogOpen(true);
  };

  const handleSaveColumn = async () => {
    if (!formName.trim()) {
      toast.error('Column name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingColumn) {
        // Update existing column
        const { error } = await (supabase as any)
          .from('task_board_columns')
          .update({ name: formName.trim(), color: formColor })
          .eq('id', editingColumn.id);

        if (error) throw error;

        setColumns((prev) =>
          prev.map((c) =>
            c.id === editingColumn.id
              ? { ...c, name: formName.trim(), color: formColor }
              : c
          )
        );
        toast.success('Column updated');
      } else {
        // Create new column
        const maxSortOrder = Math.max(...columns.map((c) => c.sortOrder), -1);

        const { data, error } = await (supabase as any)
          .from('task_board_columns')
          .insert({
            name: formName.trim(),
            color: formColor,
            sort_order: maxSortOrder + 1,
            is_system: false,
          })
          .select()
          .single();

        if (error) throw error;

        setColumns((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            color: data.color,
            sortOrder: data.sort_order,
            isSystem: data.is_system,
          },
        ]);
        toast.success('Column created');
      }

      setDialogOpen(false);
    } catch (err) {
      console.error('Error saving column:', err);
      toast.error('Failed to save column');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (column: TaskBoardColumn) => {
    // Get task count for this column
    try {
      const { count, error } = await (supabase as any)
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('column_id', column.id);

      if (error) throw error;

      setTaskCount(count || 0);
      setDeleteColumn(column);
    } catch (err) {
      console.error('Error checking tasks:', err);
      toast.error('Failed to check tasks');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteColumn) return;

    setSaving(true);
    try {
      // Move tasks to Backlog first if any exist
      if (taskCount > 0) {
        const backlogColumn = columns.find((c) => c.name === 'Backlog');
        if (backlogColumn) {
          await (supabase as any)
            .from('tasks')
            .update({ column_id: backlogColumn.id })
            .eq('column_id', deleteColumn.id);
        }
      }

      const { error } = await (supabase as any)
        .from('task_board_columns')
        .delete()
        .eq('id', deleteColumn.id);

      if (error) throw error;

      setColumns((prev) => prev.filter((c) => c.id !== deleteColumn.id));
      toast.success('Column deleted');
    } catch (err) {
      console.error('Error deleting column:', err);
      toast.error('Failed to delete column');
    } finally {
      setSaving(false);
      setDeleteColumn(null);
    }
  };

  // Predefined colors
  const colorOptions = [
    '#64748b', // slate
    '#8b5cf6', // violet
    '#3b82f6', // blue
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#22c55e', // green
    '#eab308', // yellow
    '#f97316', // orange
    '#ef4444', // red
    '#ec4899', // pink
  ];

  if (loading) {
    return (
      <PageWrapper title="Manage Columns">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Manage Columns"
      description="Customize your task board columns"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Board Columns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />

                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: column.color }}
                />

                <span className="font-medium flex-1">{column.name}</span>

                {column.isSystem && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    System
                  </Badge>
                )}

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveUp(column)}
                    disabled={index === 0 || saving}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveDown(column)}
                    disabled={index === columns.length - 1 || saving}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(column)}
                    disabled={saving}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(column)}
                    disabled={column.isSystem || saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            System columns (Backlog, Completed) cannot be deleted. Reorder columns using the arrow buttons.
          </p>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingColumn ? 'Edit Column' : 'Add Column'}</DialogTitle>
            <DialogDescription>
              {editingColumn
                ? 'Update the column name and color.'
                : 'Create a new column for your task board.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Review"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formColor === color ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveColumn} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingColumn ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteColumn} onOpenChange={() => setDeleteColumn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              {taskCount > 0 ? (
                <>
                  This column has <strong>{taskCount}</strong> task{taskCount !== 1 ? 's' : ''}.
                  Deleting will move them to Backlog. This action cannot be undone.
                </>
              ) : (
                <>Are you sure you want to delete this column? This action cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
