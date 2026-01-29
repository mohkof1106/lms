'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCustomers } from '@/lib/mock-data/customers';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  DollarSign,
  Building2,
} from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewOfferPage() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [vatRate, setVatRate] = useState(5);
  const [terms, setTerms] = useState('Payment: 50% upon acceptance, 50% upon delivery\nDelivery timeline to be confirmed upon project start\nIncludes: 3 rounds of revisions per deliverable');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Load data from sessionStorage (passed from estimator)
  useEffect(() => {
    const estimateData = sessionStorage.getItem('estimateToOffer');
    if (estimateData) {
      try {
        const data = JSON.parse(estimateData);
        if (data.customerId) setCustomerId(data.customerId);
        if (data.title) setTitle(data.title);
        if (data.lineItems) setLineItems(data.lineItems);
        sessionStorage.removeItem('estimateToOffer');
      } catch (e) {
        console.error('Failed to parse estimate data', e);
      }
    }
  }, []);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `LI-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const selectedCustomer = mockCustomers.find((c) => c.id === customerId);

  const handleSubmit = () => {
    if (!customerId) {
      toast.error('Please select a customer');
      return;
    }
    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    // In real app, this would save to database
    toast.success('Offer created successfully!');
    router.push('/offers');
  };

  return (
    <PageWrapper
      title="New Offer"
      description="Create a new offer for a customer"
      actions={
        <Button variant="outline" asChild>
          <Link href="/offers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Offer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validDays">Valid For (days)</Label>
                  <Input
                    id="validDays"
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(parseInt(e.target.value) || 30)}
                    min={1}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Offer Title / Reference</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brand Identity Project"
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Line Items
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddLineItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {lineItems.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead className="w-20 text-center">Qty</TableHead>
                        <TableHead className="w-32 text-right">Unit Price</TableHead>
                        <TableHead className="w-32 text-right">Total</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                handleLineItemChange(item.id, 'description', e.target.value)
                              }
                              placeholder="Service description"
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                              }
                              className="w-16 text-center h-8"
                              min={1}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                              }
                              className="w-28 text-right h-8"
                              min={0}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveLineItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                  No items added yet. Click "Add Item" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terms & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes (not shown to client)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any internal notes about this offer..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4">
          {/* Customer Info */}
          {selectedCustomer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.location}</p>
                {selectedCustomer.contacts[0] && (
                  <div className="mt-2 text-sm">
                    <p>{selectedCustomer.contacts[0].name}</p>
                    <p className="text-muted-foreground">{selectedCustomer.contacts[0].email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Line Items</span>
                  <span className="font-medium">{lineItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">VAT</span>
                    <Input
                      type="number"
                      value={vatRate}
                      onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                      className="w-16 h-6 text-center text-sm"
                      min={0}
                      max={100}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                  <span className="font-medium">{formatCurrency(vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button className="w-full" onClick={handleSubmit}>
                <FileText className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/offers">Cancel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
