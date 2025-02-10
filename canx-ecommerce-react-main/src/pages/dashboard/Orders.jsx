import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/orders/${orderId}`)
        if (response.data.success) {
          setOrderDetails(response.data.data)
        } else {
          setError("Failed to fetch order details.")
        }
      } catch (err) {
        setError("Failed to fetch order details.")
      }
    }
    fetchOrderDetails()
  }, [orderId])

  const handleClose = () => {
    onClose()
  }

  if (!orderDetails) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  const parseVariant = (variantString) => {
    try {
      const cleanString = variantString.replace(/\n/g, "").replace(/\s+/g, " ").trim()
      const variantObject = JSON.parse(cleanString.replace(/'/g, '"'))
      return variantObject
    } catch (error) {
      console.error("Error parsing variant:", error)
      return null
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Order Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-700">
              <span className="font-semibold">Order ID:</span> {orderDetails.orderId}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Status:</span>{" "}
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {orderDetails.orderStatus}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Payment Status:</span>{" "}
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {orderDetails.paymentStatus}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Order Type:</span> {orderDetails.orderType}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Amount:</span> ₹{orderDetails.totalAmount}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Amount Paid:</span> ₹{orderDetails.amountPaid}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Amount Remaining:</span> ₹{orderDetails.amountRemaining}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Delivery Date:</span>{" "}
              {new Date(orderDetails.deliveryDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Due Date:</span>{" "}
              {new Date(orderDetails.products[0].dueDate).toLocaleDateString()}
            </p>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Products</h3>
          {orderDetails.products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-6 my-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-xl font-semibold text-gray-800 mb-2">Product name: {product.product.title}</p>

              <div className="bg-gray-100 p-4 rounded-md mt-2">
                {product.product.variants.length > 0 ? (
                  <>
                    <p className="font-semibold text-gray-700 mb-2 ">Attributes :</p>
                    {product.variant.map((variant, index) => (
                      <p key={index} className="ml-4 text-gray-600 tracking-widest">
                        • {variant}
                      </p>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-600">
                    <span className="font-semibold">Attribute:</span> No Attribute selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Quantity:</span> {product.quantity}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Discount:</span> ₹{product.cashDiscount}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Interest:</span> ₹{product.interest}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Due Amount:</span> ₹{product.dueAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


const EditOrderModal = ({ orderId, orderData, onClose, onSave }) => {
  const [order, setOrder] = useState(orderData);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderData) {
      // Calculate the total price from the selected variants and compare with the TotalAmount
      const updatedProducts = orderData.products.map((product) => {
        // Find the variant that matches the total amount or variant price logic
        const selectedVariant = product.product.variants.find((variant) =>
          orderData.totalAmount === product.quantity * variant.price
        );
        
        return {
          ...product,
          selectedVariant: selectedVariant?._id || product.product.variants[0]?._id, // Default to the first variant if no match
        };
      });

      setOrder({ ...orderData, products: updatedProducts });
      setLoading(false);
    }
  }, [orderData]);

  const handleUpdateOrder = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const updatedProduct = order.products.find((product) => product.selectedVariant);

      const requestData = {
        productId: updatedProduct?.product._id,
        variantId: updatedProduct?.selectedVariant,
        orderType: order.orderType,
        cashDiscount: order.cashDiscount,
        interest: order.interest,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        deliveryDate: order.deliveryDate,
        amountPaid: order.amountPaid,
      };

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        onSave(data.data);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleVariantClick = (productIndex, variantId) => {
    const newProducts = [...order.products];
    newProducts[productIndex] = {
      ...newProducts[productIndex],
      selectedVariant: variantId,
    };
    setOrder({
      ...order,
      products: newProducts,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Edit Order #{order._id}</h2>

        {/* Order Level Fields */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Cash Discount</label>
            <input
              type="number"
              value={order.cashDiscount}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Interest</label>
            <input
              type="number"
              value={order.interest}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Order Type</label>
            <select
              value={order.orderType}
              onChange={(e) =>
                setOrder({
                  ...order,
                  orderType: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Payment Status</label>
            <select
              value={order.paymentStatus}
              onChange={(e) =>
                setOrder({
                  ...order,
                  paymentStatus: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="pendingPayment">Pending Payment</option>
              <option value="pendingApproval">Pending Approval</option>
              <option value="paymentApproved">Payment Approved</option>
              <option value="paidInFull">Paid in Full</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Order Status</label>
            <select
              value={order.orderStatus}
              onChange={(e) =>
                setOrder({
                  ...order,
                  orderStatus: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="orderReceived">order Recieved</option>
              <option value="inProgress">in Progress</option>
              <option value="qualityCheck">quality Check</option>
              <option value="outForDelivery">Out for Delivery</option>
              <option value="orderDelivered">Order Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Delivery Date</label>
            <input
              type="date"
              value={new Date(order.deliveryDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setOrder({
                  ...order,
                  deliveryDate: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Amount Paid</label>
            <input
              type="number"
              value={order.amountPaid}
              onChange={(e) =>
                setOrder({
                  ...order,
                  amountPaid: Number.parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold">Products</h3>
          {order.products.map((product, productIndex) => (
            <div key={product._id} className="border border-gray-300 rounded-md p-4 mb-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium">Product</label>
                  <input
                    type="text"
                    value={product.product.title}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Attributes</label>
                  <div className="space-y-2">
                    {product.product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => handleVariantClick(productIndex, variant._id)}
                        className={`px-4 py-2 border rounded-md ${variant._id === product.selectedVariant ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {variant.value} {variant.type} - ₹{variant.price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button onClick={onClose} className="px-6 py-2 bg-gray-300 rounded-md text-black">
            Cancel
          </button>
          <button
            onClick={handleUpdateOrder}
            disabled={updating}
            className={`px-6 py-2 rounded-md ${updating ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
          >
            {updating ? "Updating..." : "Update Order"}
          </button>
        </div>
      </div>
    </div>
  );
};


const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/order`);
        setAllOrders(response.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchAllOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleEditClick = (orderId) => {
    const orderToEdit = allOrders.find((order) => order._id === orderId);
    setEditOrderId(orderId);
    setEditOrderData(orderToEdit);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
    setEditOrderId(null);
  };

  const handleSaveEdit = () => {
    setEditOrderData(null);
    setEditOrderId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Orders</h2>
        {allOrders.length > 0 ? (
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleOrderClick(order._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditClick(order._id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailsModal orderId={selectedOrderId} onClose={handleCloseModal} />
      )}

      {editOrderId && editOrderData && (
        <EditOrderModal
          orderId={editOrderId}
          orderData={editOrderData}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Orders;
