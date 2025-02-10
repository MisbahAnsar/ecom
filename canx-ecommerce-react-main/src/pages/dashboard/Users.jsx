import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortProducts } from "../../utilities/SortMethod";
import VendorDetailsDialog from "../VendorDetailsDialog";
import { IoMail } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import { toast } from "react-toastify";
import UserDetailModal from "@/components/UserDetailModal";
import RegistrationModal from "../auth/RegisterModel";


const Users = () => {
  const [sortMethod, setSortMethod] = useState(2);
  const [filterMethod, setFilterMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);


  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const refreshUsers = () => {
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/getUsers`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleApproveUser = async (userId) => {
    setLoading(true);
    console.log("Approving user with ID:", userId);
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
        setLoading(false);
        toast.success("User approved Successful");
        console.log("User approved successfully:", response.data);

        fetchUsers();
      } catch (error) {
        setLoading(false);

        toast.error("Error approving user: " + error);
        console.error("Error approving user:", error);
      }
    }
  };

  const handleRejectUser = async (userId) => {
    setLoading(true);
    console.log("Rejecting user with ID:", userId);
    const confirmRejection = window.confirm("Are you sure you want to reject this user?");
    if (confirmRejection) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/admin/rejectCustomer`,
          {
            user: {
              _id: userId,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        toast.success("User rejected successfully");
        console.log("User rejected successfully:", response.data);

        // Refresh the users list
        fetchUsers();
      } catch (error) {
        setLoading(false);
        toast.error("Error rejecting user: " + error);
        console.error("Error rejecting user:", error);
      }
    }
  };


  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedUser(null); // Clear the selected user
  };

  const fetchSubscribedUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/subscribe`
      );
      setSubscribedUsers(response.data);
    } catch (error) {
      console.error("Error fetching subscribed users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchSubscribedUsers();
  }, []);

  const isSubscribed = (email) => {
    return subscribedUsers.some((user) => user.email === email);
  };

  // Separate the users into approved and non-approved
  const approvedUsers = users.filter((user) => user.customerAccess && user.role !== "admin");
  const nonApprovedUsers = users.filter((user) => !user.customerAccess && user.role !== "admin" && !user.customerRejected);

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <div className="flex justify-between items-center">
        <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
          Users
        </p>
        <button className="bg-[#007bff] px-4 py-2 rounded-md text-white font-medium hover:bg-[#0056b3] transition-colors" onClick={() => setShowRegistrationModal(true)}
        >
          Add New User
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
          {/* Approved Users Section */}
          <div className="mb-2">
            <h2 className="text-xl font-bold mb-2">Approved Users</h2>
            <table className="w-full border-collapse mb-5">
              <thead>
                <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                  <th className="py-2 px-4">#ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  {/* <th className="py-2 px-4">Subscription Status</th> */}
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Orders</th>
                  <th className="py-2 px-4">Action</th>
                  <th className="py-2 px-4">Mail</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center py-2 px-4">{item._id}</td>
                    <td className="text-center py-2 px-4">{item.firstName} {item.lastName}</td>
                    <td className="text-center py-2 px-4">{item.email}</td>
                    {/* <td className={`text-center py-2 px-4 ${isSubscribed(item.email) ? "text-green-500" : "text-red-500"}`}>
                      {isSubscribed(item.email) ? "Subscribed" : "Unsubscribed"}
                    </td> */}
                    <td className="text-center py-2 px-4">{item.phone}</td>
                    <td className="text-center py-2 px-4">{item.orders}</td>
                    <button
                      onClick={() => handleViewUser(item)} // Pass the entire user object
                      title="view user"
                      className="bg-[#007bff] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-white"
                    >
                      View
                    </button>
                    <td className="items-center gap-2 py-2 px-4">
                      <Link to={`/admindashboard/newsletter?email=${item.email}`}>
                        <button className="px-4 py-2.5 my-1 text-[22px] mx-auto font-medium text-black dark:text-white">
                          <IoMail />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Non-Approved Users Section */}
          <h2 className="text-xl font-bold mb-2">Non-Approved Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">#ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                {/* <th className="py-2 px-4">Subscription Status</th> */}
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Orders</th>
                <th className="py-2 px-4">Action</th>
                <th className="py-2 px-4">Mail</th>
              </tr>
            </thead>
            <tbody>
              {nonApprovedUsers.map((item, index) => (
                <tr key={index}>
                  <td className="text-center py-2 px-4">{item._id}</td>
                  <td className="text-center py-2 px-4">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="text-center py-2 px-4">{item.email}</td>
                  <td className="text-center py-2 px-4">{item.phone}</td>
                  <td className="text-center py-2 px-4">{item.orders}</td>
                  <td className="items-center gap-2 py-2 px-4">
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to approve this user?")) {
                          handleApproveUser(item._id);
                        }
                      }}
                      title="Approve user"
                      className="bg-[#109e10] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reject this user?")) {
                          handleRejectUser(item._id);
                        }
                      }}
                      title="Reject user"
                      className="bg-[#ff4d4f] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-white"
                    >
                      Reject
                    </button>
                  </td>
                  <td className="items-center gap-2 py-2 px-4">
                    <Link to={`/admindashboard/newsletter?email=${item.email}`}>
                      <button className="px-4 py-2.5 my-1 text-[22px] mx-auto font-medium text-black dark:text-white">
                        <IoMail />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
      {/* User Detail Modal */}
      {showModal && (
        <UserDetailModal
          user={selectedUser}
          onClose={closeModal}
        />
      )}

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={refreshUsers}  // Add this line

      />
    </div>
  );
};

export default Users;
