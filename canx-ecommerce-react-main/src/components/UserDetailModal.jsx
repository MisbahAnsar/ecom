import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserDetailModal = ({ user, onClose }) => {
    const [creditLimit, setCreditLimit] = useState(user.creditLimit || '');
    const [loadingSave, setLoadingSave] = useState(false);  // Loading state for saving credit limit
    const [loadingApprove, setLoadingApprove] = useState(false);  // Loading state for approving user
    const [error, setError] = useState(null);

    const handleSaveCreditLimit = async () => {
        setLoadingSave(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/admin/addCreditLimit/${user._id}`, {
                creditLimit: creditLimit,
            });
            toast.success("Credit limit added successfully");
            console.log("Credit limit saved:", response.data);
        } catch (err) {
            toast.error("Error adding credit limit: " + err);
            console.error("Error saving credit limit:", err);
            setError('Failed to save credit limit. Please try again.');
        } finally {
            setLoadingSave(false);  // Reset loading state
        }
    };

    const handleApproveUser = async (userId) => {
        setLoadingApprove(true);  // Set loading for approval
        const confirmApproval = window.confirm("Are you sure you want to approve this user?");
        if (confirmApproval) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/admin/approveCustomer`,
                    {
                        "user": {
                            "_id": userId
                        }
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                toast.success("User approved successfully");
                console.log("User approved successfully:", response.data);
            } catch (error) {
                toast.error("Error approving user: " + error);
                console.error("Error approving user:", error);
            } finally {
                setLoadingApprove(false);  // Reset loading state
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">User Details</h2>

                {error && <div className="text-red-600 mb-2 text-center">{error}</div>} {/* Error message */}

                <div className="space-y-4">
                    {/* ID */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">ID:</span>
                        <span className="text-gray-800">{user._id}</span>
                    </div>

                    {/* Name */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Name:</span>
                        <span className="text-gray-800">{user.firstName} {user.lastName}</span>
                    </div>

                    {/* Email */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Email:</span>
                        <span className="text-gray-800">{user.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Phone:</span>
                        <span className="text-gray-800">{user.phone}</span>
                    </div>

                    {/* Show Credit Limit if user has customer access */}
                    {user.customerAccess && (
                        <>
                            <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                                <span className="font-medium text-gray-600 mr-4">Credit Limit:</span>
                                <span className="text-gray-800">₹{user.creditLimit}</span>
                            </div>
                            <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                                <span className="font-medium text-gray-600 mr-4">Used Credits:</span>
                                <span className="text-gray-800">₹{user.usedCredit.toFixed(2)}</span>
                            </div>

                        </>
                    )}

                    {/* Show input field and buttons if user does not have customer access */}
                    {!user.customerAccess && (
                        <div className="flex items-center bg-gray-100 p-3 rounded-md shadow-sm">
                            <span className="font-medium text-gray-600 mr-4">Set Credit Limit:</span>
                            <input
                                type="number"
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 mr-4"
                                placeholder="Enter credit limit"
                            />
                            <button
                                onClick={handleSaveCreditLimit}
                                disabled={loadingSave}
                                className={`bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-500 transition duration-300 ease-in-out ${loadingSave ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loadingSave ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}

                    {/* Shop Name */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Shop Name:</span>
                        <span className="text-gray-800">{user.shopName}</span>
                    </div>
                    {/* Shop Address */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Shop Address:</span>
                        <span className="text-gray-800">{user.shopAddress}</span>
                    </div>

                    {/* Aadhar */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">Aadhar:</span>
                        <span className="text-gray-800">{user.aadharNumber}</span>
                    </div>

                    {/* PAN */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">PAN:</span>
                        <span className="text-gray-800">{user.panNumber}</span>
                    </div>

                    {/* GST */}
                    <div className="flex bg-gray-100 p-3 rounded-md shadow-sm">
                        <span className="font-medium text-gray-600 mr-4">GST:</span>
                        <span className="text-gray-800">{user.gstNumber}</span>
                    </div>
                </div>

                {/* Approve button at the end */}
                {!user.customerAccess && (
                    <button
                        onClick={() => handleApproveUser(user._id)}
                        disabled={loadingApprove}
                        className={`mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 transition duration-300 ease-in-out ${loadingApprove ? 'opacity-50 cursor-not-allowed' : ''} w-full`}
                    >
                        {loadingApprove ? 'Approving...' : 'Approve'}
                    </button>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="mt-2 bg-gray-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserDetailModal;
