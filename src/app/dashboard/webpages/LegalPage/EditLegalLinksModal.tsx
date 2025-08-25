"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

// ✅ Dynamically import ReactQuill to avoid "document is not defined"
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface EditLegalLinksModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    terms_conditions: string;
    privacy_policy: string;
    cookie_policy: string;
  }) => void;
  initialData: {
    terms_conditions: string;
    privacy_policy: string;
    cookie_policy: string;
  };
}

const EditLegalLinksModal: React.FC<EditLegalLinksModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [terms, setTerms] = useState(initialData?.terms_conditions || "");
  const [privacy, setPrivacy] = useState(initialData?.privacy_policy || "");
  const [cookie, setCookie] = useState(initialData?.cookie_policy || "");

  const handleSave = () => {
    onSubmit({
      terms_conditions: terms,
      privacy_policy: privacy,
      cookie_policy: cookie,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Legal Links</DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
          <ReactQuill value={terms} onChange={setTerms} />
        </Box>

        <Box mb={3}>
          <h3 className="text-lg font-semibold mb-2">Privacy Policy</h3>
          <ReactQuill value={privacy} onChange={setPrivacy} />
        </Box>

        <Box mb={3}>
          <h3 className="text-lg font-semibold mb-2">Cookie Policy</h3>
          <ReactQuill value={cookie} onChange={setCookie} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLegalLinksModal;
