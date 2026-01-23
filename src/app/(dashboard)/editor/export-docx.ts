import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  CommentRangeStart,
  CommentRangeEnd,
  CommentReference,
} from 'docx';
import { saveAs } from 'file-saver';
import type { EditorComment } from './types';

// Maps execCommand fontSize (1-7) to Word half-point sizes
const FONT_SIZE_MAP: Record<string, number> = {
  '1': 16,
  '2': 20,
  '3': 24,
  '4': 28,
  '5': 36,
  '6': 48,
  '7': 72,
};

interface TextStyle {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  color?: string;
  size?: number;
}

interface RunItem {
  type: 'text';
  text: string;
  style: TextStyle;
}

interface CommentStartItem {
  type: 'comment-start';
  commentIndex: number;
}

interface CommentEndItem {
  type: 'comment-end';
  commentIndex: number;
}

type ParagraphItem = RunItem | CommentStartItem | CommentEndItem;

export async function exportToDocx(editorElement: HTMLDivElement, comments: EditorComment[]) {
  // Build a map from comment id to index
  const commentIdToIndex = new Map<string, number>();
  comments.forEach((c, i) => commentIdToIndex.set(c.id, i));

  // Parse editor HTML into paragraphs
  const paragraphs = parseParagraphs(editorElement, commentIdToIndex);

  // Build docx comment definitions
  const commentChildren = comments.map((comment, index) => ({
    id: index,
    author: comment.author,
    date: comment.createdAt,
    children: [
      new Paragraph({
        children: [new TextRun({ text: comment.text })],
      }),
    ],
  }));

  // Build docx paragraphs
  const docParagraphs = paragraphs.map((items) => {
    const children: (TextRun | CommentRangeStart | CommentRangeEnd)[] = [];

    for (const item of items) {
      if (item.type === 'comment-start') {
        children.push(new CommentRangeStart(item.commentIndex));
      } else if (item.type === 'comment-end') {
        children.push(new CommentRangeEnd(item.commentIndex));
        children.push(
          new TextRun({
            children: [new CommentReference(item.commentIndex)],
          })
        );
      } else {
        const runOptions: Record<string, unknown> = { text: item.text };
        if (item.style.bold) runOptions.bold = true;
        if (item.style.italics) runOptions.italics = true;
        if (item.style.underline) runOptions.underline = { type: 'single' };
        if (item.style.color) runOptions.color = item.style.color.replace('#', '');
        if (item.style.size) runOptions.size = item.style.size;
        children.push(new TextRun(runOptions));
      }
    }

    return new Paragraph({ children });
  });

  const doc = new Document({
    comments: { children: commentChildren },
    sections: [{ children: docParagraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'document.docx');
}

function parseParagraphs(
  container: HTMLElement,
  commentIdToIndex: Map<string, number>
): ParagraphItem[][] {
  const paragraphs: ParagraphItem[][] = [];
  let currentParagraph: ParagraphItem[] = [];

  function walkNode(node: Node, inheritedStyle: TextStyle) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        currentParagraph.push({ type: 'text', text, style: { ...inheritedStyle } });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Check for paragraph breaks
    if (tag === 'div' || tag === 'p') {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
        currentParagraph = [];
      }
    }

    if (tag === 'br') {
      paragraphs.push(currentParagraph);
      currentParagraph = [];
      return;
    }

    // Build style from this element
    const style: TextStyle = { ...inheritedStyle };
    if (tag === 'b' || tag === 'strong') style.bold = true;
    if (tag === 'i' || tag === 'em') style.italics = true;
    if (tag === 'u') style.underline = true;
    if (tag === 'font') {
      const color = el.getAttribute('color');
      if (color) style.color = color;
      const size = el.getAttribute('size');
      if (size && FONT_SIZE_MAP[size]) style.size = FONT_SIZE_MAP[size];
    }
    // Check inline styles for color
    if (el.style.color) {
      style.color = rgbToHex(el.style.color);
    }

    // Handle comment marks
    if (tag === 'mark' && el.dataset.commentId) {
      const idx = commentIdToIndex.get(el.dataset.commentId);
      if (idx !== undefined) {
        currentParagraph.push({ type: 'comment-start', commentIndex: idx });
        for (const child of Array.from(el.childNodes)) {
          walkNode(child, style);
        }
        currentParagraph.push({ type: 'comment-end', commentIndex: idx });
        return;
      }
    }

    // Recurse into children
    for (const child of Array.from(el.childNodes)) {
      walkNode(child, style);
    }
  }

  for (const child of Array.from(container.childNodes)) {
    walkNode(child, {});
  }

  // Push last paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }

  // If nothing was parsed, add empty paragraph
  if (paragraphs.length === 0) {
    paragraphs.push([{ type: 'text', text: '', style: {} }]);
  }

  return paragraphs;
}

function rgbToHex(rgb: string): string {
  // Handle hex directly
  if (rgb.startsWith('#')) return rgb;
  // Parse rgb(r, g, b)
  const match = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return '#000000';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
