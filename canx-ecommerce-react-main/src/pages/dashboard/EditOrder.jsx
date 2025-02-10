import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const EditOrderDetails = ({ onClose }) => {
  const location = useLocation();
  const { orderId } = location.state || {};  // Access the orderId from state

  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOrderDetails(null);  // Clear old order details when the component is re-rendered

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/orders/${orderId}`);
        const data = await response.json();

        console.log("Order details fetched:", data);
        
        if (data.success) {
          setOrderDetails(data.data);  // Set the fetched order details
        } else {
          alert("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

      fetchOrderDetails();
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        alert("Order details updated successfully!");
        onClose();  // Close the modal or form after success
      } else {
        console.error("Failed to update order details.");
      }
    } catch (error) {
      console.error("Error updating order details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Order Details</h2>
        
        {/* Order details display */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Status</label>
            <p>{orderDetails?.orderStatus}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
            <p>{orderDetails?.paymentStatus}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <p>{orderDetails?.totalAmount} INR</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
            <p>{orderDetails?.amountPaid} INR</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Remaining</label>
            <p>{orderDetails?.amountRemaining} INR</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Discount</label>
            <p>{orderDetails?.cashDiscount} INR</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interest</label>
            <p>{orderDetails?.interest} INR</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
            <p>{new Date(orderDetails?.deliveryDate).toLocaleDateString()}</p>
          </div>

          {/* Display Product Details */}
          <div className="mt-6">
            <h3 className="text-lg font-bold">Products</h3>
            {orderDetails?.products.map((productItem) => (
              <div key={productItem._id} className="mt-4 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Title</label>
                  <p>{productItem.product?.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Product Price</label>
                  <p>{productItem.price} INR</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <p>{productItem.quantity}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p>{new Date(productItem.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Variant</label>
                  <p>{productItem.variant?.map((variantId) => variantId).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Editing Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">
              Order Status
            </label>
            <select
              id="orderStatus"
              name="orderStatus"
              value={orderDetails?.orderStatus || ""}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="pendingPayment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderDetails;
