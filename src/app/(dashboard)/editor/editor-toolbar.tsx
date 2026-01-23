'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Type,
  MessageSquarePlus,
} from 'lucide-react';

const COLORS = [
  { label: 'Black', value: '#000000' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Green', value: '#16A34A' },
  { label: 'Purple', value: '#9333EA' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Cyan', value: '#0891B2' },
  { label: 'Pink', value: '#DB2777' },
];

const FONT_SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Medium', value: '4' },
  { label: 'Large', value: '5' },
  { label: 'X-Large', value: '6' },
  { label: 'Huge', value: '7' },
];

interface EditorToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onAddComment: () => void;
}

export function EditorToolbar({ editorRef, onAddComment }: EditorToolbarProps) {
  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  return (
    <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('bold')} title="Bold">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('italic')} title="Italic">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('underline')} title="Underline">
        <Underline className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Text Color">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {COLORS.map((color) => (
            <DropdownMenuItem key={color.value} onClick={() => exec('foreColor', color.value)}>
              <span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color.value }} />
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Font Size">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FONT_SIZES.map((size) => (
            <DropdownMenuItem key={size.value} onClick={() => exec('fontSize', size.value)}>
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onAddComment}>
        <MessageSquarePlus className="h-4 w-4" />
        <span className="text-xs">Comment</span>
      </Button>
    </div>
  );
}
