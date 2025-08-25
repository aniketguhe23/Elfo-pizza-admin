'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
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
  onSave: (file: File | File[]) => void; // ✅ Support single OR multiple
  multiple?: boolean; // ✅ optional prop
}

function EditFileUploadModal({
  open,
  onClose,
  label,
  onSave,
  multiple = false,
}: EditFileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // ✅ Handle file preview
  useEffect(() => {
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);

      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviewUrls([]);
    }
  }, [files]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload {label}</DialogTitle>
      <DialogContent dividers>
        <input
          type="file"
          accept={multiple ? 'image/*' : 'application/pdf'} // ✅ PDF for single, images for multiple
          multiple={multiple}
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : [])
          }
        />

        {files.length > 0 && (
          <Box mt={2}>
            {files.map((file, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body2" gutterBottom>
                  {file.name}
                </Typography>

                {/* ✅ Show preview for images */}
                {multiple && previewUrls[index] ? (
                  <img
                    src={previewUrls[index]}
                    alt={`preview-${index}`}
                    width={120}
                    height={120}
                    style={{
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                    }}
                  />
                ) : !multiple && previewUrls[index] ? (
                  // ✅ Show preview for PDF
                  <iframe
                    src={previewUrls[index]}
                    width="100%"
                    height="400px"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                ) : null}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => onSave(multiple ? files : files[0])}
          variant="contained"
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#000' } }}
          disabled={files.length === 0}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFileUploadModal;
