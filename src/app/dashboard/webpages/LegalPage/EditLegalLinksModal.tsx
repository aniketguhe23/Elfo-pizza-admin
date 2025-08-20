'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import dynamic from 'next/dynamic';

// dynamic import for Next.js SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface EditLegalLinksModalProps {
  open: boolean;
  onClose: () => void;
  field: string;
  label: string;
  value: string;
  onSave: (value: string) => void;
}

function EditLegalLinksModal({
  open,
  onClose,
  field,
  label,
  value,
  onSave,
}: EditLegalLinksModalProps) {
  const [content, setContent] = useState(value);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit {label}</DialogTitle>
      <DialogContent dividers>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder={`Edit ${label}...`}
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
