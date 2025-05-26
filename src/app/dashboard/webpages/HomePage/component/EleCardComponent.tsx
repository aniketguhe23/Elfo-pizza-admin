"use client";

import React , { useCallback, useEffect, useState } from "react";
import type { JSX } from 'react';
import ProjectApiList from "@/app/api/ProjectApiList";
import { Box, Button, Card, CardMedia, Divider, Typography } from "@mui/material";
import axios from "axios";

import EditCardModal from "../formComponent/EditCardModal";
import { toast } from "react-toastify";

// Define a type for card data
interface CardData {
  eleCardComp_title: string;
  eleCardComp_desc: string;
  eleCardComp_img1: string;
  eleCardComp_img2: string;
}

function EleCardComponent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [cardData, setCardData] = useState<CardData | null>(null);

  const { apiGetEleCardData, apiUpdateEleCardData } = ProjectApiList();

  // Fetch card data with proper typing and error handling
 const fetchCardData = useCallback(async () => {
  try {
    const res = await axios.get<{ data: CardData }>(apiGetEleCardData);
    setCardData(res.data.data);
  } catch (error) {
    toast.error("Error fetching card data");
  }
}, [apiGetEleCardData]);

  useEffect(() => {
  void fetchCardData();
}, [fetchCardData]);

  // Handle save with proper typing and FormData usage
  const handleSave = async (updatedForm: {
    title: string;
    description: string;
    image1: File | string | null;
    image2: File | string | null;
  }): Promise<void> => {
    try {
      const payload = new FormData();

      payload.append("eleCardComp_title", updatedForm.title);
      payload.append("eleCardComp_desc", updatedForm.description);

      // Append only if File, otherwise skip (if string URL, backend should handle)
      if (updatedForm.image1 instanceof File) {
        payload.append("eleCardComp_img1", updatedForm.image1);
      }

      if (updatedForm.image2 instanceof File) {
        payload.append("eleCardComp_img2", updatedForm.image2);
      }

      const res = await axios.put<{ status: string }>(apiUpdateEleCardData, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        await fetchCardData();
        setOpen(false);
      }
    } catch (error) {
      toast.error("Error updating card:");
    }
  };

  if (!cardData) {
    return <div>Loading...</div>; // Or add loading indicator
  }

  return (
    <Card
      sx={{
        p: 3,
        mb: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
        Elfo Combo Card
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <CardMedia
          component="img"
          image={cardData.eleCardComp_img1}
          alt="Combo Item 1"
          sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
        />
        <CardMedia
          component="img"
          image={cardData.eleCardComp_img2}
          alt="Combo Item 2"
          sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
        />

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {cardData.eleCardComp_title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cardData.eleCardComp_desc}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
            sx={{
              mt: { xs: 2, sm: 0 },
              ml: 15,
              backgroundColor: "#d3d3d3",
              color: "black",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <EditCardModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        data={{
          title: cardData.eleCardComp_title,
          description: cardData.eleCardComp_desc,
          image1: cardData.eleCardComp_img1,
          image2: cardData.eleCardComp_img2,
        }}
        onSave={handleSave}
      />
    </Card>
  );
};

export default EleCardComponent;
