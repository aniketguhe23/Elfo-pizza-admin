'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ProjectApiList from '@/app/api/ProjectApiList';
import InvoicePage from '@/components/dashboard/allOrders/InvoicePage';

export default function InvoiceWrapperPage() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('order_no');
  const { apiGetOrdersById } = ProjectApiList();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${apiGetOrdersById}/${orderNo}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNo) fetchOrder();
  }, [orderNo]);

  if (loading) return <div className="p-4 text-sm">Loading invoice...</div>;
  if (!order) return <div className="p-4 text-sm text-red-600">Order not found.</div>;

  return (
    <div className="p-4">
      <InvoicePage order={order} />
    </div>
  );
}
