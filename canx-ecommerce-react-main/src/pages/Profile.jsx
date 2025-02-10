import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoIosLogOut, IoMdCart, IoMdMenu, IoMdPerson } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { TiLocation } from "react-icons/ti";
import { MdCloudDownload } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import RatingForm from "@/components/RatingForm";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import RatingForm2 from "@/components/RatingForm2";
import OrdersTrack from "../pages/OrdersTrack";

const ProfileData = [
  {
    name: "Alex Tuntuni",
    orders: [
      {
        id: 1,
        name: "Chairs",
        img: "/Images/prod1.png",
        quantity: 2,
        total: 2000,
      },
    ],
    paymentMethod: [
      {
        id: 1,
        name: "card",
        details: "name: Rodger Mike,Number: 0987-7654-8789, cvv:097",
      },
    ],
    address: `22A, North-Street, California, USA`,
    email: "knjh@mn .com",
    phone: "099999999999999",
  },
];

const ProfileTabs = [
  {
    id: 1,
    name: "Dashboard",
    type: "tab",
    param: "name",
    icon: <AiOutlineDashboard />,
  },
  { id: 2, name: "Orders", type: "tab", param: "orders", icon: <IoMdCart /> },
  // {
  //   id: 3,
  //   name: "Download",
  //   type: "tab",
  //   param: "name",
  //   icon: <MdCloudDownload />,
  // },
  // {
  //   id: 4,
  //   name: "Payment-Method",
  //   type: "tab",
  //   param: "paymentMethod",
  //   icon: <FaRegCreditCard />,
  // },
  {
    id: 5,
    name: "Address",
    type: "tab",
    param: "address",
    icon: <TiLocation />,
  },
  {
    id: 6,
    name: "Account-Details",
    type: "tab",
    param: "user",
    icon: <IoMdPerson />,
  },
];

const Dashboard = ({ userData }) => {
  const { currency } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState({});
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    // // console.log(user.name);
    setUserDetails(user);
    setUserLoggedIn(user ? true : false);
  }, []);

  return (
    <>
      <p className=" text-[#7A7A7A] text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium mb-2 ">
        Hello, <b>{userData?.name}</b>
      </p>
      <p className=" text-[#7A7A7A] text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium ">
        From your account dashboard. you can easily check & view your recent
        orders, manage your shipping and billing addresses and edit your
        password and account details.
      </p>
      {userDetails?.role == "vendor" && (
        <Link to="/dashboard">
          <button className=" bg-orange-500 dark:text-black py-2 px-4 text-[14px] md:text-[15px] 2xl:text-[16px] font-medium mt-6 ">
            View Vendor Dashboard
          </button>
        </Link>
      )}
      {userDetails?.role == "admin" && (
        <Link to="/admindashboard">
          <button className=" block bg-orange-500 dark:text-black py-2 px-4 text-[14px] md:text-[15px] 2xl:text-[16px] font-medium mt-6 ">
            View Admin Dashboard
          </button>
        </Link>
      )}
    </>
  );
};

const Orders = ({ userData }) => {
  const {
    currency,
    isRatingFormOpen,
    setIsRatingFormOpen,
    isOrdersTrackForm,
    setIsOrdersTrackForm,
  } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  // // console.log(userData);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Make a GET request to the backend route to fetch orders for the specific user
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/order/${userData?._id}`
        );

        // Update the orders state with the fetched orders
        // console.log(response.data.orders);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Call the fetchOrders function when the component mounts
    fetchOrders();
  }, [setOrders, userData?._id]);

  return (
    <div>
      {!orders?.length > 0 ? (
        <p>You have not ordered anything yet!</p>
      ) : (
        <>
          {orders?.map((order, orderIndex) => (
            <div key={orderIndex}>
              {order?.products?.map((product, productIndex) => {
                const modifiedMainImage = product.product.mainImage.startsWith(
                  import.meta.env.VITE_SERVER_URL
                )
                  ? product.product.mainImage
                  : `${
                      import.meta.env.VITE_SERVER_URL
                    }/${product.product.mainImage.replace(/\\/g, "/")}`;
                return (
                  <div
                    className="flex flex-col md:flex-row md:justify-between w-full dark:bg-white/40 bg-gray-100 p-2 border-b border-gray-300"
                    key={productIndex}
                  >
                    <div className="flex items-center">
                      {}
                      {isRatingFormOpen && <RatingForm2 order={product} />}
                      {isOrdersTrackForm && (
                        <OrdersTrack
                          order={product}
                          status={order?.status}
                          deliveryDate={order?.deliveryDate}
                          createdAt={order?.createdAt}
                        />
                      )}
                      <Link
                        className="flex items-center"
                        to={`/product/${product.product._id}`}
                      >
                        <img
                          className="h-[100px] mr-4 w-[100px] object-cover"
                          src={modifiedMainImage}
                          alt="product-img"
                        />
                        <div className="flex flex-col">
                          <p className="text-[#000] flex flex-col lg:flex-row text-[15px] md:text-[16.5px] 2xl:text-[18px] font-bold plus-jakarta">
                            {product.product.title}
                            <span className=" lg:ml-2 text-xs sm:text-sm font-semibold bg-green-200 text-green-800 text-center py-1 w-fit px-3 ">
                              <p>{order.status}</p>
                            </span>
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[18px]">
                              <span className="text-xs sm:text-sm font-medium">
                                Quantity:
                              </span>{" "}
                              <b>{product.quantity}</b>
                            </p>
                            {/* <p className="text-[#000] text-[15px] md:text-[14px] 2xl:text-[14px] capitalize">
                      <span className="text-xs sm:text-sm font-medium capitalize">Color:</span> {product.color}
                    </p>
                    <p className="text-[#000] text-[15px] md:text-[14px] 2xl:text-[14px]">
                      <span className="text-xs sm:text-sm font-medium capitalize">Rating:</span> {product.rating}
                    </p> */}
                          </div>
                          <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[16px] font-semibold">
                            <span className="text-xs sm:text-sm font-medium">
                              Total:
                            </span>
                            {item.quantity} x {currency}
                            {currency === "OMR"
                              ? (product.product.price * 1 * 0.1).toFixed(2)
                              : product.product.price * 1}
                          </p>
                        </div>
                      </Link>
                    </div>
                    <div className=" pt-2 md:p-4 flex flex-col gap-2 items-center justify-center">
                      <button
                        onClick={() => {
                          setIsOrdersTrackForm(true);
                        }}
                        className="bg-green-500 w-full md:w-fit hover:bg-green-600 text-white text-sm font-semibold py-2 px-4"
                      >
                        Track Order
                      </button>
                      {order?.status?.toLowerCase() === "received" && (
                        <button
                          onClick={() => {
                            setIsRatingFormOpen(true);
                          }}
                          className="bg-green-500 w-full md:w-fit hover:bg-green-600 text-white text-sm font-semibold py-2 px-4"
                        >
                          Rate Product
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const PaymentMethod = ({ userData }) => {
  return (
    <div className=" border border-gray-300 p-3 ">
      <p className=" text-[#000]  dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium mb-1 ">
        Method:{" "}
        <b className=" capitalize ">{ProfileData[0].paymentMethod[0].name}</b>
      </p>
      <p className=" text-[#373737] dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium ">
        {ProfileData[0].paymentMethod[0].details}
      </p>
    </div>
  );
};
const Address = ({ userData }) => {
  return (
    <div className=" border border-gray-300 p-3 ">
      {userData?.address ? (
        <>
          <p className=" text-[#000] dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium mb-1 ">
            Your Address:
          </p>
          <p className=" text-[#373737] dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium ">
            {userData?.address}
          </p>
        </>
      ) : (
        <p>you have not added your address details</p>
      )}
    </div>
  );
};
const AccountDetails = ({ userData }) => {
  return (
    <div className="p-3">
      <p className="text-[#000] dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-semibold mb-1">
        Your Profile
      </p>
      <p className="text-[#373737] dark:text-gray-500 text-[14px] md:text-[15.6px] 2xl:text-[17px] font-medium">
        <b>Name:</b> {userData?.name}
        <br />
        <b>Email:</b> {userData?.email}
        <br />
        <b>Phone No:</b> {userData?.phone}
        <br />
        <b>Address:</b> {userData?.address}
        <br />
      </p>
    </div>
  );
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState(ProfileTabs[0]);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const { currency } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { setUserLoggedIn } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    toast.success("Successfully logged out");
    navigate("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" ">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7] dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400">
          My Account
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">My Account</span>
        </div>
      </div>

      <IoMdMenu
        onClick={() => {
          if (isMobileMenu) {
            return setIsMobileMenu(false);
          }
          setIsMobileMenu(true);
        }}
        className={` mx-3 lg:hidden py-2 px-5 bg-[#FF7004] text-lg w-fit h-fit`}
      />

      <section className=" px-[4%] xl:px-[8%] mt-4 md:mt-10 mb-10 ">
        <div className=" relative w-full flex gap-3">
          <div
            className={`${
              isMobileMenu ? "block absolute bg-white " : " hidden lg:block"
            } lg:w-[22%] border border-gray-300`}
          >
            {ProfileTabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab.type === "link") {
                      return navigate(tab.param);
                    }
                    setIsMobileMenu(false);
                  }}
                  className={`flex items-center gap-2 ${
                    tab.id === activeTab.id
                      ? "bg-[#FF7004] text-white"
                      : "text-[#7A7A7A] cursor-pointer hover:bg-gray-100 "
                  }  font-[600] plus-jakarta p-3 px-5 text-[13px] md:text-[15.5px] 2xl:text-[16.5px] `}
                >
                  {tab.icon}
                  {tab.name}
                </div>
              );
            })}
            <div
              onClick={() => {
                handleLogout();
              }}
              className={`flex items-center gap-2 hover:bg-[#FF7004] hover:text-white text-[#7A7A7A] cursor-pointer 
              font-[600] plus-jakarta p-3 px-5 text-[12px] md:text-[15.5px] 2xl:text-[16.5px] `}
            >
              <IoIosLogOut />
              Log Out
            </div>
          </div>

          <div
            className={` w-full lg:w-[78%] px-5 py-3 border border-gray-300`}
          >
            <p className=" text-[#363F4D] dark:text-gray-400 font-bold plus-jakarta text-[17px] md:text-[22px] 2xl:text-[24px] mb-5 ">
              {activeTab.name}
            </p>
            {activeTab.id === 1 && <Dashboard userData={userData} />}
            {activeTab.id === 2 && <Orders userData={userData} />}
            {activeTab.id === 4 && <PaymentMethod userData={userData} />}
            {activeTab.id === 5 && <Address userData={userData} />}
            {activeTab.id === 6 && <AccountDetails userData={userData} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
