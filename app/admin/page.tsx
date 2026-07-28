"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import type { Order, Product } from "@/lib/types";

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  lowStockProducts: number;
  pendingReviews: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const ordersRes = await fetch("/api/admin/orders");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const orders = await ordersRes.json();

      //low stock
      const productsRes = await fetch("/api/products?limit=1000");
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const productsData = await productsRes.json();

      const products = Array.isArray(productsData)
        ? productsData
        : productsData.products || [];

      
      const reviewsRes = await fetch("/api/admin/reviews?pending=true");
      let pendingReviews = 0;
      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json();
        pendingReviews = reviews.length;
      }

   
      const ordersTyped: Order[] = Array.isArray(orders) ? orders : [];
      const productsTyped: Product[] = Array.isArray(products) ? products : [];

      const toNumber = (val: string | number | undefined) =>
        typeof val === "number" ? val : parseFloat(String(val || 0));

      const paidOrders = ordersTyped.filter((o) => o.paymentStatus === "paid");
      const totalRevenue = paidOrders.reduce(
        (sum: number, o: Order) => sum + toNumber(o.totalAmount),
        0,
      );
      const totalOrders = ordersTyped.length;
      const uniqueCustomers = new Set(ordersTyped.map((o) => o.customerEmail))
        .size;
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / paidOrders.length : 0;
      const lowStockCount = productsTyped.filter((p) => p.stock < 10).length;

      setMetrics({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        lowStockProducts: lowStockCount,
        pendingReviews,
      });

   
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const revenueByDate = last7Days.map((date) => {
        const dayRevenue = paidOrders
          .filter((o) => o.createdAt?.split("T")[0] === date)
          .reduce((sum: number, o: Order) => sum + toNumber(o.totalAmount), 0);
        return { date, revenue: Math.round(dayRevenue * 100) / 100 };
      });
      setRevenueData(revenueByDate);

      
      const statusCounts: Record<string, number> = {};
      ordersTyped.forEach((o) => {
        const status = o.orderStatus || "pending";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const statusMap: Record<string, string> = {
        pending: "#FBBF24",
        processing: "#60A5FA",
        shipped: "#34D399",
        delivered: "#10B981",
        cancelled: "#EF4444",
      };

      const statusData = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          color: statusMap[status] || "#6B7280",
        }),
      );
      setOrderStatusData(statusData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <Button
              onClick={fetchDashboardData}
              className="mt-4 cursor-pointer"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
    
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Welcome back! Here is your store overview.
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₦
              {metrics?.totalRevenue.toLocaleString("en-NG", {
                maximumFractionDigits: 0,
              })}
              
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From {metrics?.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
                {metrics?.totalOrders}
         
                </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
                {metrics?.totalCustomers}
                
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <Package className="h-4 w-4 text-orange-500 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₦
              {metrics?.averageOrderValue.toLocaleString("en-NG", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      
      {(metrics?.lowStockProducts || 0) > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <CardTitle className="text-sm sm:text-base text-yellow-900">
                {metrics?.lowStockProducts} Products Low on Stock
              </CardTitle>
            </div>
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Manage
              </Button>
            </Link>
          </CardHeader>
        </Card>
      )}

      {(metrics?.pendingReviews || 0) > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <CardTitle className="text-sm sm:text-base text-orange-900">
                {metrics?.pendingReviews} Reviews Pending Approval
              </CardTitle>
            </div>
            <Link href="/admin/reviews">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Review
              </Button>
            </Link>
          </CardHeader>
        </Card>
      )}

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `₦${value == null ? '0' : Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    name="Revenue"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const payload = props.payload as any;
                      return `${payload.status}: ${payload.count}`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} orders`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Link href="/admin/orders" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Manage Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              View and update order statuses
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Manage Products</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              Add, edit, or remove products
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reviews" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Review Approvals</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              Approve or reject customer reviews
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
