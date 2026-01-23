'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CommentDialogProps {
  open: boolean;
  selectedText: string;
  onClose: () => void;
  onSubmit: (commentText: string) => void;
}

export function CommentDialog({ open, selectedText, onClose, onSubmit }: CommentDialogProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
    onClose();
  }

  function handleClose() {
    setText('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
            <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded px-3 py-2 italic line-clamp-3">
              &ldquo;{selectedText}&rdquo;
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your comment:</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!text.trim()}>Add Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
