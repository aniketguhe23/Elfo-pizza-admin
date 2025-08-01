"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import ProjectApiList from "@/app/api/ProjectApiList";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Button,
} from "@mui/material";

type Props = {
  refund: any;
  onStatusChange?: (status: string) => void;
};

export default function RefundDetailDialog({ refund, onStatusChange }: Props) {
  const { apiUpdateRefundsStatus } = ProjectApiList();
  const [status, setStatus] = useState(refund?.status || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.post(`${apiUpdateRefundsStatus}/${refund.id}`, {
        status,
      });
      onStatusChange?.(status);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="grid" gap={2}>
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Customer Name
          </Typography>
          <Typography fontWeight="500">
            {refund.firstName} {refund.lastName}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Order ID
          </Typography>
          <Typography fontWeight="500">
            <Link
              href={`/dashboard/allOrders/orderById?order_no=${refund.Order_no}`}
              style={{ textDecoration: "underline", color: "#000" }}
            >
              {refund.Order_no}
            </Link>
          </Typography>
        </Box>

        <Box gridColumn={{ md: "span 2" }}>
          <Typography variant="caption" color="text.secondary">
            Reason for Refund
          </Typography>
          <Typography fontWeight="500">{refund.reason}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Refund Amount
          </Typography>
          <Typography fontWeight="500">₹{refund.amount}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Current Status
          </Typography>
          <Typography fontWeight="500" sx={{ textTransform: "capitalize" }}>
            {refund.status}
          </Typography>
        </Box>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel id="status-label">Update Refund Status</InputLabel>
        <Select
          labelId="status-label"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          label="Update Refund Status"
          sx={{ backgroundColor: "#fff", color: "#000" }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </FormControl>

      <Button
        onClick={handleUpdate}
        variant="contained"
        color="inherit"
        fullWidth
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </Box>
  );
}
