import { useContext, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import { CurrencyList } from "../utilities/Currency";
import { Link } from "react-router-dom";
import { RiMenu3Fill, RiMenuSearchFill } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoHeart, IoHeartOutline, IoMoonSharp, IoCall, IoCartOutline } from "react-icons/io5";
import { MainAppContext } from "@/context/MainContext";
import { useAuth } from "@/context/AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";

const NavList = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "OFFICE",
    dropdownList: [
      {
        id: "2.1",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 3,
    name: "HOSPITALITY",
    dropdownList: [
      {
        id: "3.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.3",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 4,
    name: "OUTDOOR ",
    dropdownList: [
      {
        id: "4.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.3",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.4",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 5,
    name: "UNIQUE",
    link: "/",
  },
  {
    id: 6,
    name: "HOW IT WORKS",
    link: "/",
  },
  {
    id: 7,
    name: "BECOME A PARTNER",
    link: "/",
  },
];
const Header = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    SetIsCartOpen,
    SetIsMenuOpen,
  } = useContext(AppContext);
  const { isDarkMode, SetIsDarkMode, cartCount, setCartCount } =
    useContext(MainAppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const [viewLogin, setViewLogin] = useState(false);
  const [viewCartLogin, setViewCartLogin] = useState(false);
  const [viewNavOptions, setViewNavOptions] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    if (userLoggedIn) {
      getCart(user?._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      // console.log(tempCart);
      setCartCount(tempCart?.length);
    }
    var themeMode = localStorage.getItem("darkMode");
    if (themeMode === "dark") {
      return SetIsDarkMode(true);
    } else {
      return SetIsDarkMode(false);
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    if (userLoggedIn) {
      getCart(user?._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(tempCart?.length);
      // // console.log(tempCart);
    }
  }, [userLoggedIn]);

  const getCart = async (userId) => {
    // // console.log(userLoggedIn);
    if (userLoggedIn) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/cart/${userDetails?._id || userId
          }`
        );
        console.log(response.data.cart);
        setCartCount(
          response.data.cart.products?.length !== 0
            ? response.data.cart.products?.length
            : 0
        );
        // // console.log(response.data.cart.products?.length);
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
    } else {
      return;
    }
  };
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    // // console.log(user.role);
    setUserDetails(user);
    if (userLoggedIn) {
      // console.log(user?._id);
      getCart(user?._id);
    }
  }, [userLoggedIn]);

  useEffect(() => {
    // Function to fetch the menu from the backend
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/menu`
        );
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    // Call the fetchMenu function when the component mounts
    fetchMenu();
  }, []);

  return (
    <div className=" w-full">
      <div className="off-white flex flex-col gap-1 border-gray-400 items-start  md:flex-row sm:items-center justify-between py-1.5 md:h-[45px] px-[3%] md:px-[8%] text-black dark:bg-black dark:text-white text-[10px] md:text-[13.2px] ">

        <div className=" flex items-center pl-[3%]">
          {/* <span>Language:</span>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
            className=" bg-transparent "
          >
            <option className=" text-black  " value="ENG">
              (ENG)
            </option>
            <option className=" text-black  " value="SPN">
              (SPN)
            </option>
          </select> */}
          {/* <span className=" inline-block w-[1px] mx-2 h-[13px] bg-gray-300 "></span> */}



          {!userLoggedIn && (
            <>
              <Link to="/login">
                <span className=" font-[600] plus-jakarta plus-jakarta ">
                  Login/
                </span>
              </Link>
              <Link to="/register">
                <span className=" font-[600] plus-jakarta plus-jakarta ">
                  SignUp
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className=" px-[3%] md:px-[8%] py-4 flex items-center justify-between bg-white dark:bg-white dark:text-black bottom-shadow">
        <div className=" flex items-center gap-2 md:gap-4 cursor-pointer pt-[4%]">
          <RiMenu3Fill
            onClick={() => {
              SetIsMenuOpen(true);
            }}
            className=" text-[20px] cursor-pointer "
          />
          {/* <div
            onClick={() => {
              setIsMenu((prev) => !prev);
            }}
            className="hidden md:flex items-center gap-1"
          >
            <RiMenu3Fill className=" text-[22px]" />
            <span className="  text-[13px] md:text-[15px] font-[500] plus-jakarta">
              Menu
            </span>
          </div> */}
          <Link className=" flex items-center gap-1" to="/search">
            <img
              className=" w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
              src="/logos/Search.svg"
              alt="search"
            />
            <span className=" hidden md:block text-[13px] md:text-[15px] font-[500] plus-jakarta text-[#353535]">
              Search
            </span>
          </Link>
          <Link className=" hidden md:flex items-center gap-1" to="/shop/all/all">
            <span className=" hidden md:block text-[13px] md:text-[15px] font-[500] plus-jakarta text-[#353535]">
              Products
            </span>
          </Link>
          <div>
            {!isDarkMode ? (
              <MdOutlineWbSunny
                title="lightmode"
                onClick={() => {
                  SetIsDarkMode(true);
                  localStorage.setItem("darkMode", "dark");
                }}
                className=" md:hidden text-[22px] cursor-pointer"
              />
            ) : (
              <IoMoonSharp
                title="darkmode"
                onClick={() => {
                  SetIsDarkMode(false);
                  localStorage.setItem("darkMode", "");
                }}
                className=" md:hidden text-[19px] cursor-pointer"
              />
            )}
          </div>
        </div>

        <Link to="/">
          CanX
          {/* <h2 className=" text-[18px] md:text-[28px] font-bold plus-jakarta ">E-Commerce</h2> */}
        </Link>
        <div className=" flex items-center pt-[4%]">
          <span className="pr-3">
            <Link to="tel:600 505253" className="flex justify-center">
              <span className="pr-2 text-[#353535]"><IoCall className="text-[20px] text-[#353535]" /></span>
              <span className="text-[#353535]">600 505253</span>
            </Link>
          </span>
          {/* <span className=" inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
          {!isDarkMode ? (
            <MdOutlineWbSunny
              title="lightmode"
              onClick={() => {
                SetIsDarkMode(true);
                localStorage.setItem("darkMode", "dark");
              }}
              className=" hidden md:block text-[22px] cursor-pointer text-[#353535]"
            />
          ) : (
            <IoMoonSharp
              title="darkmode"
              onClick={() => {
                SetIsDarkMode(false);
                localStorage.setItem("darkMode", "");
              }}
              className=" hidden md:block text-[19px] cursor-pointer text-[#353535]"
            />
          )}
          {/* <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}

          {/* {userLoggedIn && (
            <>
              <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
              <Link to="/cart">
                <img
                  className="hidden lg:block  w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
                  src="/logos/bag.svg"
                  alt="search"
                />
              </Link>
              <span className=" hidden  lg:inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
              <Link to="/wishlist">
                <IoHeartOutline className=" text-[20px]" />
              </Link>
              <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
              <img
                onClick={() => {
                  SetIsCartOpen(true);
                }}
                className=" lg:hidden w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
                src="/logos/bag.svg"
                alt="search"
              />
            </>
          )} */}
          {/* <span className=" hidden md:inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
          <Link to="/cart" className=" relative pl-4">
            <span className=" hidden  absolute -top-1.5 -right-1.5 bg-orange-500 font-medium text-[12px] z-20 h-3.5 w-3.5 lg:flex items-center justify-center rounded-full text-[#353535]">
              {cartCount ? cartCount : 0}
            </span>
            {/* <img
              className="hidden lg:block  w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
              src="/logos/bag.svg"
              alt="search"
            /> */}
            <IoCartOutline className="hidden lg:block  object-contain cursor-pointer text-[22px] text-[#353535]" />
          </Link>
          {userLoggedIn ? (
            <>
              {/* <span className=" hidden  lg:inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
              <Link to="/wishlist" className="px-4">
                <IoHeartOutline className=" text-[20px] text-[#353535]" />
              </Link>
              {/* <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
            </>
          ) : (
            <>
              {/* <span className=" hidden  lg:inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
              <Link to="/login" className="px-4">
                <IoHeartOutline className=" text-[20px] text-[#353535]" />
              </Link>
              {/* <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
              {/* <div>
                <div className=" relative flex items-center">
                  <>
                    <span className=" hidden  lg:inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
                    <IoHeartOutline
                      onClick={() => {
                        setViewCartLogin(!viewCartLogin);
                      }}
                      className=" text-[20px]"
                    />
                    <span className="  inline-block lg:hidden w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
                  </>
                  {viewCartLogin && !userLoggedIn && (
                    <div className=" absolute top-7 -right-5 px-2 z-50 py-2 bg-white">
                      <Link
                        onClick={() => {
                          setViewCartLogin((prev) => !prev);
                        }}
                        to="/login"
                      >
                        <button className="  bg-black text-sm font-semibold py-1.5 rounded-sm px-4 ml-1 text-white">
                          Login
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div> */}
            </>
          )}
          <div
            onClick={() => {
              SetIsCartOpen(true);
            }}
            className=" relative"
          >
            <span className=" lg:hidden absolute -top-2 -right-1 bg-orange-500 text-sm z-20 h-3.5 w-3.5 font-medium flex items-center justify-center rounded-full">
              {cartCount ? cartCount : 0}
            </span>
            {/* <img
              className=" lg:hidden w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
              src="/logos/bag.svg"
              alt="search"
            /> */}
            <IoCartOutline className="lg:hidden w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer  text-[20px] text-[#353535]" />
          </div>
          <div className=" flex items-center  gap-0.5">
            {/* {userLoggedIn && userDetails && (
             
            )} */}
            {userLoggedIn && userDetails ? (
              <>
                <Link to="/profile" className=" flex items-center ">
                  {/* <span className="  inline-block lg:hidden w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span> */}
                  <div className=" mr-1 hidden sm:flex flex-col justify-start  gap-0">
                    {/* <span className=" text-[11.5px] text-gray-600">Hello,</span> */}
                    {/* <span className=" sm:text-[15px] -mt-2 text-gray-600 font-semibold plus-jakarta capitalize pt-[16%]">
                      {userDetails?.name}
                    </span> */}
                  </div>
                  <img
                    className=" w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
                    src="/logos/Person.svg"
                    alt="profile"
                  />
                </Link>
              </>
            ) : (
              <>
                <span className="  inline-block w-[2px] mx-1 md:mx-2.5 h-[17px] bg-[#898989] "></span>
                <div>
                  <div className=" relative">
                    <Link to="/login">
                      <img
                        className=" w-[15.8px] md:w-[18px] h-[18px] object-contain cursor-pointer "
                        src="/logos/Person.svg"
                        alt="profile"
                      />
                    </Link>
                  </div>
                </div>{" "}
              </>
            )}

            {/*  */}
            <span className="  inline-block lg:hidden mx-1emd:n w-[2px] mx-0.5 h-[17px] bg-[#898989] "></span>
            {userLoggedIn &&
              userDetails &&
              (userDetails?.role == "vendor" ||
                userDetails?.role == "admin") && (
                <BsThreeDotsVertical
                  className="  cursor-pointer text-[18px] ml-1"
                  onClick={() => {
                    setViewNavOptions((prev) => !prev);
                  }}
                />
              )}

            {viewNavOptions &&
              userLoggedIn &&
              userDetails &&
              userDetails?.role !== "user" && (
                <div className=" relative bg-white">
                  <div className="w-[330px] border-radius border absolute top-3.5 right-0  p-2 lg:p-4 z-50 bg-white">
                    <span className=" sm:text-[15px] -mt-2 text-black-600 font-semibold plus-jakarta pt-[16%]">
                      <p className="pb-2">Username: {userDetails?.name}</p>
                      <p className="pb-3">Email: {userDetails?.email}</p>
                    </span>
                    {userDetails?.role == "vendor" && (
                      <Link
                        onClick={() => {
                          setViewNavOptions((prev) => !prev);
                        }}
                        to="/dashboard"
                      >
                        <button className=" w-[140px] lg:w-[200px] bg-black mb-2 text-xs  lg:text-sm font-semibold py-2 rounded-sm px-4 ml-0 text-white border-radius">
                          Vendor Dashboard
                        </button>
                      </Link>
                    )}
                    {userDetails?.role == "admin" && (
                      <Link
                        onClick={() => {
                          setViewNavOptions((prev) => !prev);
                        }}
                        to="/admindashboard"
                      >
                        <button className=" w-[140px] lg:w-[200px] bg-black text-xs  lg:text-sm font-semibold py-3 border-radius rounded-sm px-4 ml-0 text-white">
                          Admin Dashboard
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
          </div>
          {/* // ) : ( //{" "}
          <Link to="/login">
            //{" "}
            <button className=" bg-black text-sm font-semibold py-1.5 rounded-sm px-4 ml-1 text-white">
              // Login //{" "}
            </button>
            //{" "}
          </Link>
          // )} */}
        </div>
      </div>
      {isMenu && (
        <nav className=" hidden lg:flex items-center justify-center gap-10 bg-black h-[60px] text-white text-[13.6px] ">
          {NavList.map((item, index) => {
            return (
              <div className=" relative" key={index}>
                {item?.link ? (
                  <Link to={item.link}>
                    <span className=" uppercase" key={index}>
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <Menu>
                    <Menu.Button className=" flex items-center uppercase ">
                      {item.name}
                      <ChevronDownIcon className=" w-[15px]" />
                    </Menu.Button>
                    <Menu.Items className=" z-50 absolute top-4 flex flex-col bg-black/90 pl-2 py-4 gap-2 min-w-[100px] w-fit ">
                      {item?.dropdownList?.map((e, index) => {
                        return (
                          <Link to={e.link} key={index}>
                            <span className=" uppercase" key={index}>
                              {e.name}
                            </span>
                          </Link>
                        );
                      })}
                    </Menu.Items>
                  </Menu>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Header;
