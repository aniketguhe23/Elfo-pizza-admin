'use client';

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface EditFileUploadModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  multiple?: boolean;
  onSave: (files: File | File[]) => void;
}

function EditFileUploadModal({
  open,
  onClose,
  label,
  multiple = false,
  onSave,
}: EditFileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSave = () => {
    if (selectedFiles) {
      if (multiple) {
        onSave(selectedFiles);
      } else {
        onSave(selectedFiles[0]);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload {label}</DialogTitle>
      <DialogContent dividers>
        <input
          type="file"
          accept={multiple ? 'image/*' : undefined}
          multiple={multiple}
          onChange={handleFileChange}
        />

        {selectedFiles && selectedFiles.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="body2">Selected Files:</Typography>
            <ul>
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: '#333',
            '&:hover': { backgroundColor: '#000' },
          }}
          disabled={!selectedFiles}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFileUploadModal;
