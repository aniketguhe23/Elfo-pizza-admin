"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import BackendUrl from "@/app/api/BackendUrl";
import ProjectApiList from "@/app/api/ProjectApiList";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

import EditFileUploadModal from "./EditFileUploadModal";
import EditLegalLinksModal from "./EditLegalLinksModal";

interface LegalLinksApiData {
  id: number;
  terms_conditions: string;
  terms_conditions_pdf: string;
  cookie_policy: string;
  privacy_policy: string;
  accessibility_info: string;
  supply_chain_policy: string;
  fssai_details: string;
  policy_images: string[];
}

function LegalLinksComponent(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<keyof Omit<LegalLinksApiData, "id"> | null>(null);
  const [data, setData] = useState<LegalLinksApiData | null>(null);

  const { apiGetFooterLegalLinks, apiUpdateFooterLegalLinks } = ProjectApiList();

  // ✅ Fetch API Data
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: LegalLinksApiData[] }>(apiGetFooterLegalLinks);
      setData(res.data.data[0]);
    } catch {
      toast.error("Failed to fetch legal links");
    }
  }, [apiGetFooterLegalLinks]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ✅ Save API Data (always FormData)
  const handleSave = async (payload: { [key: string]: string | File | File[] }) => {
    try {
      if (!data?.id) throw new Error("No policy id");

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, value as string);
        }
      });

      const res = await axios.put<{ data: LegalLinksApiData }>(
        `${apiUpdateFooterLegalLinks}/${data.id}`,
        formData
      );

      setData(res.data.data);
      toast.success("Updated successfully!");
      setOpen(false);
      setSelectedField(null);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update legal links");
    }
  };

  if (!data) return <div>Loading...</div>;

  const items = [
    { label: "Terms & Conditions", field: "terms_conditions", type: "text" },
    { label: "Terms & Conditions (PDF)", field: "terms_conditions_pdf", type: "file" },
    { label: "Cookie Policy", field: "cookie_policy", type: "text" },
    { label: "Privacy Policy", field: "privacy_policy", type: "text" },
    { label: "Accessibility Info", field: "accessibility_info", type: "text" },
    { label: "Supply Chain Policy", field: "supply_chain_policy", type: "text" },
    { label: "FSSAI Details", field: "fssai_details", type: "text" },
  ] as const;

  return (
    <Box>
      <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 3 }}>
        Legal Information
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} key={item.field}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, backgroundColor: "#fdfdfd" }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {item.label}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ pl: 1, mb: 2 }}>
                {item.field === "terms_conditions_pdf" ? (
                  data.terms_conditions_pdf ? (
                    <Box>
                      <iframe
                        src={`${BackendUrl}/${data.terms_conditions_pdf}`}
                        width="70%"
                        height="400px"
                        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No PDF uploaded yet
                    </Typography>
                  )
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data[item.field] as string,
                    }}
                  />
                )}
              </Box>
              <Box textAlign="right">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setSelectedField(item.field);
                    setOpen(true);
                  }}
                  sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#000" } }}
                >
                  Edit {item.label}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Modals */}
      {selectedField &&
        (selectedField === "terms_conditions_pdf" ? (
          <EditFileUploadModal
            open={open}
            onClose={() => {
              setOpen(false);
              setSelectedField(null);
            }}
            label="Terms & Conditions (PDF)"
            onSave={(file) => handleSave({ terms_conditions_pdf: file })}
          />
        ) : selectedField === "policy_images" ? (
          <EditFileUploadModal
            open={open}
            onClose={() => {
              setOpen(false);
              setSelectedField(null);
            }}
            label="Policy Images"
            multiple
            onSave={(files) => handleSave({ policy_images: files })}
          />
        ) : (
         <EditLegalLinksModal
  open={open}
  onClose={() => {
    setOpen(false);
    setSelectedField(null);
  }}
  initialData={{
    terms_conditions: data.terms_conditions,
    privacy_policy: data.privacy_policy,
    cookie_policy: data.cookie_policy,
    accessibility_info: data.accessibility_info,
    supply_chain_policy: data.supply_chain_policy,
    fssai_details: data.fssai_details,
  }}
  onSubmit={(updatedData) =>
    handleSave({
      terms_conditions: updatedData.terms_conditions,
      privacy_policy: updatedData.privacy_policy,
      cookie_policy: updatedData.cookie_policy,
      accessibility_info: updatedData.accessibility_info,
      supply_chain_policy: updatedData.supply_chain_policy,
      fssai_details: updatedData.fssai_details,
    })
  }
/>

        ))}
    </Box>
  );
}

export default LegalLinksComponent;
