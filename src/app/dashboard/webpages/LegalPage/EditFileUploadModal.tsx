'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface EditFileUploadModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  onSave: (file: File) => void;
}

function EditFileUploadModal({ open, onClose, label, onSave }: EditFileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url); // cleanup on unmount/change
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload {label}</DialogTitle>
      <DialogContent dividers>
        {/* <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        /> */}
        <input
          type="file"
          name="terms_conditions_pdf"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              Selected File: {file.name}
            </Typography>

            {/* Show inline PDF preview */}
            {previewUrl && (
              <iframe
                src={previewUrl}
                width="100%"
                height="400px"
                style={{ border: '1px solid #ccc', borderRadius: '8px' }}
              />
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => file && onSave(file)}
          variant="contained"
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#000' } }}
          disabled={!file}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFileUploadModal;
