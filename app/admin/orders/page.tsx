"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, ArrowUpDown } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  orderItems: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: string;
  }>;
}

type SortField = "date" | "amount" | "status";
type SortDirection = "asc" | "desc";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentFilter,
    sortField,
    sortDirection,
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
      const matchesPayment =
        !paymentFilter || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

   
    filtered.sort((a, b) => {
      let aVal: string | number =
        a[
          sortField === "date"
            ? "createdAt"
            : sortField === "amount"
              ? "totalAmount"
              : "orderStatus"
        ] as string | number;
      let bVal: string | number =
        b[
          sortField === "date"
            ? "createdAt"
            : sortField === "amount"
              ? "totalAmount"
              : "orderStatus"
        ] as string | number;

      if (sortField === "amount") {
        aVal = parseFloat(String(aVal));
        bVal = parseFloat(String(bVal));
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: status as Order['orderStatus'] } : o,
        ),
      );
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all customer orders.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              placeholder="Search by order #, name, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm sm:col-span-2 lg:col-span-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl">Orders ({filteredOrders.length})</CardTitle>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="w-full sm:w-auto">
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">No orders found</p>
          ) : (
            <>
             
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Order #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        <button
                          onClick={() => {
                            setSortField("amount");
                            setSortDirection(
                              sortField === "amount" && sortDirection === "desc"
                                ? "asc"
                                : "desc",
                            );
                          }}
                          className="flex items-center space-x-1 hover:text-orange-600"
                        >
                          <span>Amount</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Order Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        <button
                          onClick={() => {
                            setSortField("date");
                            setSortDirection(
                              sortField === "date" && sortDirection === "desc"
                                ? "asc"
                                : "desc",
                            );
                          }}
                          className="flex items-center space-x-1 hover:text-orange-600"
                        >
                          <span>Date</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm font-semibold text-orange-600">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-gray-500 text-xs">
                              {order.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold">
                          ₦
                          {parseFloat(order.totalAmount).toLocaleString("en-NG", {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {order.orderStatus.charAt(0).toUpperCase() +
                              order.orderStatus.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getPaymentColor(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Dialog
                            open={selectedOrder?.id === order.id}
                            onOpenChange={(open) => {
                              if (!open) setSelectedOrder(null);
                            }}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setNewStatus(order.orderStatus);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Order Details: {order.orderNumber}
                                </DialogTitle>
                                <DialogDescription>
                                  Manage order status and view details
                                </DialogDescription>
                              </DialogHeader>

                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="font-semibold text-sm mb-2">
                                      Customer Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-500 text-xs">Name</p>
                                        <p className="font-medium">
                                          {order.customerName}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 text-xs">Email</p>
                                        <p className="font-medium text-xs sm:text-sm">
                                          {order.customerEmail}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 text-xs">Phone</p>
                                        <p className="font-medium">
                                          {order.customerPhone}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 text-xs">Date</p>
                                        <p className="font-medium">
                                          {new Date(
                                            order.createdAt,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold text-sm mb-2">
                                      Shipping Address
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-700">
                                      {order.shippingAddress.address}
                                      <br />
                                      {order.shippingAddress.city},{" "}
                                      {order.shippingAddress.postalCode}
                                      <br />
                                      {order.shippingAddress.country}
                                    </p>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold text-sm mb-2">
                                      Order Items
                                    </h3>
                                    <div className="space-y-2 text-xs sm:text-sm">
                                      {order.orderItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex flex-col sm:flex-row sm:justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <span className="mb-1 sm:mb-0">
                                            Product ID: {item.productId}
                                          </span>
                                          <span>
                                            Qty: {item.quantity} × ₦
                                            {parseFloat(
                                              item.price,
                                            ).toLocaleString("en-NG", {
                                              maximumFractionDigits: 0,
                                            })}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <p className="text-gray-500 text-xs">
                                        Total Amount
                                      </p>
                                      <p className="text-xl sm:text-2xl font-bold">
                                        ₦
                                        {parseFloat(
                                          order.totalAmount,
                                        ).toLocaleString("en-NG", {
                                          maximumFractionDigits: 0,
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-xs mb-2">
                                        Order Status
                                      </p>
                                      <div className="flex items-center space-x-2">
                                        <select
                                          value={newStatus}
                                          onChange={(e) =>
                                            setNewStatus(e.target.value)
                                          }
                                          className="flex-1 px-2 py-1 border rounded text-xs sm:text-sm"
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="processing">
                                            Processing
                                          </option>
                                          <option value="shipped">Shipped</option>
                                          <option value="delivered">
                                            Delivered
                                          </option>
                                          <option value="cancelled">
                                            Cancelled
                                          </option>
                                        </select>
                                        <Button
                                          onClick={() =>
                                            handleUpdateStatus(
                                              order.id,
                                              newStatus,
                                            )
                                          }
                                          size="sm"
                                          className="text-xs sm:text-sm"
                                        >
                                          Update
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-gray-500 text-xs">
                                      Payment Status
                                    </p>
                                    <Badge
                                      className={getPaymentColor(
                                        order.paymentStatus,
                                      )}
                                    >
                                      {order.paymentStatus
                                        .charAt(0)
                                        .toUpperCase() +
                                        order.paymentStatus.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

             
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredOrders.map((order) => (
                  <Dialog
                    key={order.id}
                    open={selectedOrder?.id === order.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedOrder(null);
                    }}
                  >
                    <div className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs sm:text-sm font-semibold text-orange-600">
                            {order.orderNumber}
                          </p>
                          <p className="font-medium text-sm">{order.customerName}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.orderStatus)} text-xs`}>
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-semibold">
                            ₦
                            {parseFloat(order.totalAmount).toLocaleString("en-NG", {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment</span>
                          <Badge className={`${getPaymentColor(order.paymentStatus)} text-xs`}>
                            {order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.orderStatus);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                    </div>

                    <DialogContent className="max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                          Order Details: {order.orderNumber}
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                          Manage order status and view details
                        </DialogDescription>
                      </DialogHeader>

                      {selectedOrder && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-2">
                              Customer Information
                            </h3>
                            <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Name</p>
                                <p className="font-medium">{order.customerName}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Email</p>
                                <p className="font-medium break-all text-xs sm:text-sm">
                                  {order.customerEmail}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Phone</p>
                                <p className="font-medium">{order.customerPhone}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Date</p>
                                <p className="font-medium">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-2">
                              Shipping Address
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 break-words">
                              {order.shippingAddress.address}
                              <br />
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.postalCode}
                              <br />
                              {order.shippingAddress.country}
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-2">
                              Order Items
                            </h3>
                            <div className="space-y-2 text-xs">
                              {order.orderItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-2 bg-gray-50 rounded"
                                >
                                  <p className="break-all mb-1">
                                    Product ID: {item.productId}
                                  </p>
                                  <p>
                                    Qty: {item.quantity} × ₦
                                    {parseFloat(item.price).toLocaleString(
                                      "en-NG",
                                      {
                                        maximumFractionDigits: 0,
                                      },
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="mb-3">
                              <p className="text-gray-500 text-xs">Total Amount</p>
                              <p className="text-xl font-bold">
                                ₦
                                {parseFloat(order.totalAmount).toLocaleString(
                                  "en-NG",
                                  {
                                    maximumFractionDigits: 0,
                                  },
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-2">
                                Order Status
                              </p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <select
                                  value={newStatus}
                                  onChange={(e) => setNewStatus(e.target.value)}
                                  className="flex-1 px-2 py-1 border rounded text-xs"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <Button
                                  onClick={() =>
                                    handleUpdateStatus(order.id, newStatus)
                                  }
                                  size="sm"
                                  className="text-xs w-full sm:w-auto"
                                >
                                  Update
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-500 text-xs">Payment Status</p>
                            <Badge className={getPaymentColor(order.paymentStatus)}>
                              {order.paymentStatus.charAt(0).toUpperCase() +
                                order.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
