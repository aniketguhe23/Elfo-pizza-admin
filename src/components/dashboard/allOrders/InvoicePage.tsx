'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Divider, IconButton, Stack, Typography } from '@mui/material';

interface InvoicePageProps {
  order: any;
}

export default function InvoicePage({ order }: InvoicePageProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const itemTotal = order?.item_total || 0;
  const discount = order?.discount || 0;
  const vat = order?.gst || 0;
  const delivery = order?.delivery || 0;
  const service = order?.service_charge || 0;
  const total = order?.total_price || 0;

 const handlePrint = () => {
  window.print();
};

  return (
    <Container maxWidth="sm" sx={{ py: 4, fontFamily: 'monospace', fontSize: 12 }}>
      {/* 🔹 Top Action Buttons */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Button
          onClick={() => router.back()}
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          ← Go Back
        </Button>

        <Button
          onClick={handlePrint}
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            backgroundColor: '#333',
            color: '#fff',
            fontWeight: 500,
            '&:hover': { backgroundColor: '#111' },
          }}
        >
          🖨️ Print
        </Button>
      </Stack>
      <div ref={printRef} data-print="invoice">

        {/* 🔹 Restaurant Info */}
        <Box textAlign="center" mb={2}>
          <Typography fontWeight="bold" fontSize={14}>
            {order?.restaurantInfo?.name || 'Restaurant'}
          </Typography>
          <Typography fontSize={11}>{order?.restaurantInfo?.address || '—'}</Typography>
          <Typography color="gray" fontSize={10}>
            {new Date(order?.created_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Typography>
          {order?.restaurantInfo?.contact_phone && (
            <Typography fontSize={11}>Phone: {order.restaurantInfo.contact_phone}</Typography>
          )}
        </Box>

        {/* 🔹 Order Type */}
        <Box display="flex" justifyContent="space-between" fontSize={11} mb={1}>
          <Typography>Order Type</Typography>
          <Typography>{order?.type === 'pickup' ? 'Pickup' : 'Home Delivery'}</Typography>
        </Box>

        {/* 🔹 Customer & Order Info */}
        <Box border="1px dashed #999" p={1} mb={2} fontSize={11} sx={{ borderRadius: 1, whiteSpace: 'pre-wrap' }}>
          <Typography>Order ID: {order?.Order_no}</Typography>
          <Typography>Customer Name: {order?.userInfo?.firstName}</Typography>
          <Typography>Phone: {order?.userInfo?.mobile}</Typography>
          <Typography>Delivery Address: {order?.address || '—'}</Typography>
        </Box>

        {/* 🔹 Ordered Items */}
        <Box display="flex" justifyContent="space-between" borderBottom="1px solid #000" pb={0.5} fontSize={11}>
          <Typography>QTY</Typography>
          <Typography>Item</Typography>
          <Typography>Price</Typography>
        </Box>

        {order?.items?.map((item: any, idx: number) => (
          <Box key={idx} mt={1}>
            <Box display="flex" justifyContent="space-between" fontSize={11}>
              <Typography>{item.quantity}x</Typography>
              <Typography>{item.name || 'Custom Pizza'}</Typography>
              <Typography>₹ {item.price}</Typography>
            </Box>
            <Box pl={2} fontSize={10} color="gray">
              {item.size && <Typography>Size: {item.size}</Typography>}
              {item.crust && <Typography>Crust: {item.crust}</Typography>}
              {item.toppings?.length > 0 && <Typography>Toppings: {item.toppings.join(', ')}</Typography>}
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

        {/* 🔹 Totals Section */}
        <Box fontSize={11}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Items Price</Typography>
            <Typography>₹ {itemTotal}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" fontWeight={600}>
            <Typography>Subtotal</Typography>
            <Typography>₹ {itemTotal}</Typography>
          </Box>
          {discount > 0 && (
            <Box display="flex" justifyContent="space-between" color="red">
              <Typography>Discount</Typography>
              <Typography>- ₹ {discount}</Typography>
            </Box>
          )}
          {vat > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography>VAT / Tax</Typography>
              <Typography>₹ {vat}</Typography>
            </Box>
          )}
          {delivery > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography>Delivery Charge</Typography>
              <Typography>₹ {delivery}</Typography>
            </Box>
          )}
          {service > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography>Service Charge</Typography>
              <Typography>₹ {service}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between" fontWeight={700} fontSize={13}>
            <Typography>Total</Typography>
            <Typography>₹ {total}</Typography>
          </Box>

          <Typography mt={1}>Paid By: {order?.payment_method || 'Cash On Delivery'}</Typography>
        </Box>

        {/* 🔹 Footer */}
        <Box textAlign="center" mt={3} fontSize={12} fontWeight={600}>
          <Typography>THANK YOU</Typography>
          <Typography fontSize={10} fontWeight={400}>
            For ordering from {order?.restaurantInfo?.name || 'our restaurant'}
          </Typography>
        </Box>
      </div>
    </Container>
  );
}
