'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Box,
  Paper,
  IconButton,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  HorizontalRule,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        return null;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit.');
        return null;
      }

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'content');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          // Check if the item is an image
          if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            
            const file = item.getAsFile();
            if (file) {
              setUploading(true);
              uploadImage(file).then((url) => {
                setUploading(false);
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
            }
            return true;
          }
        }

        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        // Check if any of the files is an image
        const imageFile = Array.from(files).find((file: File) => 
          file.type.startsWith('image/')
        );

        if (imageFile) {
          event.preventDefault();
          
          setUploading(true);
          uploadImage(imageFile as File).then((url) => {
            setUploading(false);
            if (url && editor) {
              // Get the position where the image was dropped
              const coordinates = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coordinates);
              
              if (pos) {
                editor.chain()
                  .focus()
                  .insertContentAt(pos.pos, {
                    type: 'image',
                    attrs: { src: url },
                  })
                  .run();
              } else {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }
          });
          return true;
        }

        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setImageDialogOpen(false);
    }
  };

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

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Insert Image">
          <IconButton
            size="small"
            onClick={() => setImageDialogOpen(true)}
          >
            <ImageIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Paper variant="outlined">
      <MenuBar />
      <Divider />
      {uploading && (
        <Box sx={{ p: 1, bgcolor: 'info.main', color: 'white', textAlign: 'center' }}>
          Uploading image...
        </Box>
      )}
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
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
            placeholder="https://example.com/image.jpg"
            helperText="Enter the URL of the image you want to insert"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={addImage} variant="contained" disabled={!imageUrl}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
