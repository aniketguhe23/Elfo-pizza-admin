'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
// ✅ ClassicEditor can be imported directly (no dynamic)
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// ✅ Dynamic only for CKEditor React wrapper
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), { ssr: false });

interface EditLegalLinksModalProps {
  open: boolean;
  onClose: () => void;
  field: string;
  label: string;
  value: string;
  onSave: (value: string) => void;
}

function EditLegalLinksModal({ open, onClose, field, label, value, onSave }: EditLegalLinksModalProps) {
  const [content, setContent] = useState(value);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit {label}</DialogTitle>
      <DialogContent dividers>
        <CKEditor
          editor={ClassicEditor as any}
          data={content}
          onChange={(_, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
          config={{
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'link',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'undo',
              'redo',
            ],
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => onSave(content)}
          variant="contained"
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#000' } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditLegalLinksModal;
