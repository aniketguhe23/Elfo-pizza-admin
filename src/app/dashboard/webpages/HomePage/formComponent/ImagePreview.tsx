import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Box } from '@mui/material';

interface ImagePreviewProps {
  image: File | string;
}

function ImagePreview({ image }: ImagePreviewProps): JSX.Element | null {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof image === 'string') {
      setPreviewUrl(image);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  if (!previewUrl) return null;

  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        p: 1,
        ml: 7.5,
      }}
    >
      <img
        src={previewUrl}
        alt="Preview"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '12px',
        }}
      />
    </Box>
  );
}

export default ImagePreview;
