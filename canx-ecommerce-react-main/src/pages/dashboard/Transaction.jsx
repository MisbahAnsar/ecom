import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [needsApprovalTransactions, setNeedsApprovalTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNeedsApproval, setShowNeedsApproval] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState({});

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/order/getAllPayments`
      );
      const allTransactions = response.data.payments;
      setTransactions(allTransactions);
      setNeedsApprovalTransactions(allTransactions.filter(transaction => !transaction.approved && transaction.status !== "rejected"));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransaction = async (transactionId, action) => {
    setLoading(true);
    const amount = selectedAmount[transactionId];

    if (action === 'approve' && (!amount || isNaN(amount) || amount <= 0)) {
      toast.error("Please enter a valid amount");
      setLoading(false);
      return;
    }

    const confirmMessage = action === 'approve'
      ? `Are you sure you want to approve this transaction with amount ₹${amount}?`
      : "Are you sure you want to reject this transaction?";

    const confirmAction = window.confirm(confirmMessage);

    if (confirmAction) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/order/payment/${action}`,
          {
            paymentId: transactionId,
            ...(action === 'approve' && { amount: parseFloat(amount) })
          },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success(`Transaction ${action}ed successfully`);
        console.log("Transaction processed successfully:", response.data);

        // Clear the amount input for this transaction
        setSelectedAmount(prev => {
          const newState = { ...prev };
          delete newState[transactionId];
          return newState;
        });

        fetchTransactions();
      } catch (error) {
        const errorMessage = error.response?.data?.message || `Error ${action}ing transaction`;
        toast.error(`Error: ${errorMessage}`);
        console.error(`Error ${action}ing transaction:`, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
        Transactions
      </p>

      <div className="flex justify-end my-4">
        <button
          onClick={() => setShowNeedsApproval(true)}
          className={`px-4 py-2 mr-2 ${showNeedsApproval ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          Needs Approval
        </button>
        <button
          onClick={() => setShowNeedsApproval(false)}
          className={`px-4 py-2 ${!showNeedsApproval ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          All Transactions
        </button>
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className="object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <div className="flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                  <th className="py-2 px-4">Transaction ID</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">UPI Reference Id</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Order Id</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {(showNeedsApproval ? needsApprovalTransactions : transactions).map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                      {transaction._id}
                    </td>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                      ₹{transaction.amount}
                    </td>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                      {transaction.upiRefNumber}
                    </td>
                    <td className="py-2 px-4 my-2">{transaction.status}</td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(transaction.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                      {transaction.order}
                    </td>
                    {!transaction.approved && (
                      <td className="py-2 px-4">
                        <div className="flex flex-col space-y-2">
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={selectedAmount[transaction._id] || ''}
                            onChange={(e) => setSelectedAmount(prev => ({
                              ...prev,
                              [transaction._id]: e.target.value
                            }))}
                            className="border p-2 rounded w-full"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTransaction(transaction._id, 'approve')}
                              className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700 flex-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleTransaction(transaction._id, 'reject')}
                              className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700 flex-1"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;