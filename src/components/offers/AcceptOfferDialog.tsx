'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';

interface AcceptOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerNumber: string;
  onAccept: (lpoNumber: string) => Promise<void>;
}

export function AcceptOfferDialog({
  open,
  onOpenChange,
  offerNumber,
  onAccept,
}: AcceptOfferDialogProps) {
  const [lpoNumber, setLpoNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (!lpoNumber.trim()) {
      setError('LPO number is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onAccept(lpoNumber.trim());
      setLpoNumber('');
      onOpenChange(false);
    } catch (err) {
      setError('Failed to accept offer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setLpoNumber('');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Accept Offer
          </DialogTitle>
          <DialogDescription>
            Enter the client's LPO (Local Purchase Order) number to accept offer{' '}
            <span className="font-medium">{offerNumber}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="lpo-number">
              LPO Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lpo-number"
              value={lpoNumber}
              onChange={(e) => {
                setLpoNumber(e.target.value);
                setError('');
              }}
              placeholder="e.g., LPO-2026-001234"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleAccept();
                }
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Accept Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
