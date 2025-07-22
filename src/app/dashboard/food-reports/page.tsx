"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectApiList from "@/app/api/ProjectApiList";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { BarChart2 } from "lucide-react";

export default function FoodReportPage() {
  const { apiGetFoodReport } = ProjectApiList();
  const router = useRouter();

  const [foodReport, setFoodReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFoodReport = async () => {
    try {
      const res = await axios.get(apiGetFoodReport);
      setFoodReport(res.data.data || []);
    } catch (err) {
      setError("Failed to load food report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodReport();
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4} gap={2}>
        <BarChart2 />
        <Typography variant="h5" fontWeight={600}>
          Food Sales Report
        </Typography>
      </Box>

      {/* Loader/Error */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Restaurant ID</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Sold Count</TableCell>
                <TableCell>Total Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foodReport.length > 0 ? (
                foodReport.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.restaurants_no}</TableCell>
                    <TableCell>{item.restaurant_address}</TableCell>
                    <TableCell>{item.item_name || "N/A"}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{item.sold_count}</TableCell>
                    <TableCell>₹{item.total_revenue}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No food sales data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
