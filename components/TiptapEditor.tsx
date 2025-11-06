'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Box,
  Paper,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  HorizontalRule,
} from '@mui/icons-material';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, p: 1, flexWrap: 'wrap' }}>
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive('bold') ? 'primary' : 'default'}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive('italic') ? 'primary' : 'default'}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive('bulletList') ? 'primary' : 'default'}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive('orderedList') ? 'primary' : 'default'}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Quote">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            color={editor.isActive('blockquote') ? 'primary' : 'default'}
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Block">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            color={editor.isActive('codeBlock') ? 'primary' : 'default'}
          >
            <Code />
          </IconButton>
        </Tooltip>

        <Tooltip title="Horizontal Rule">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <HorizontalRule />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Paper variant="outlined">
      <MenuBar />
      <Divider />
      <Box
        sx={{
          p: 2,
          minHeight: 400,
          '& .ProseMirror': {
            minHeight: 400,
            outline: 'none',
            '& > * + *': {
              marginTop: '0.75em',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              lineHeight: 1.3,
              fontWeight: 600,
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
            },
            '& pre': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& blockquote': {
              borderLeft: '3px solid #ddd',
              paddingLeft: '1rem',
              fontStyle: 'italic',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
