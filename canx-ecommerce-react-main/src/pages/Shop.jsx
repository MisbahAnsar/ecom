import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import MultiRangeSlider from "multi-range-slider-react";
import { AiOutlineBars } from "react-icons/ai";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle, IoStarOutline } from "react-icons/io5";
import { array, number } from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const sortMethods = [
  {
    id: 1,
    name: "Sort By Popularity",
    parameter: "rating",
  },
  {
    id: 2,
    name: "Price(Low to High)",
    parameter: "price",
  },
  {
    id: 3,
    name: "Price(High to Low)",
    parameter: "price",
  },
  {
    id: 4,
    name: "A to Z",
    parameter: "name",
  },
  {
    id: 5,
    name: "Z to A",
    parameter: "name",
  },
];

const Shop = () => {
  const {
    filterCategories,
    setFilterCategories,
    filterSubCategories,
    setFilterSubCategories,
    filterColor,
    setFilterColor,
  } = useContext(AppContext);

  const {
    wishlistedProducts,
    setWishlistedProducts,
    handleAddToWishlist,
    setCartCount,
    minValue,
    set_minValue,
    maxValue,
    set_maxValue,
    maxPrice,
    setMaxPrice,
    Products,
    handleRemoveWishlist,
    buyNow,
    setBuyNow,
    setProductPageId,
  } = useContext(MainAppContext);
  const [page, setPage] = useState(0);
  const [isCard, setIsCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState(1);
  const [banners, setBanners] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  // const [Products, setProducts] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { category, subcategory } = useParams();

  const { SetIsMobileFilterOpen, currency, wishlist } = useContext(AppContext);
  const handleInput = (e) => {
    set_minValue(Number(e.minValue));
    set_maxValue(Number(e.maxValue));
  };
  const [categories, setCategories] = useState([]);
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      // console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllCategories();
    getAllBanners();
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    setSortedArray(Products);
    const maxPrice = Products.reduce((max, product) => {
      return product.price > max ? product.price : max;
    }, 0);
    setMaxPrice(Number(maxPrice));
    set_maxValue(Number(maxPrice));

    console.log(category, subcategory);
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
    setWishlistedProducts(wishlist);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [category, subcategory, Products]);

  useEffect(() => {
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
  }, [category, subcategory]);

  const sortProducts = (method) => {
    switch (method) {
      case "2":
        return [...Products].sort((a, b) => a.price - b.price);
      case "3":
        return [...Products].sort((a, b) => b.price - a.price);
      case "4":
        return [...Products].sort((a, b) => a.title.localeCompare(b.title));
      case "5":
        return [...Products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return [...Products].sort(
          (a, b) => Number(b.avgRating) - Number(a.avgRating)
        );
    }
  };

  useEffect(() => {
    setSortedArray(sortProducts(sortMethod));
  }, [Products, sortMethod]);

  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" dark:text-yellow-400 text-black" />
          ) : (
            <IoStarOutline className=" text-black dark:text-yellow-400 " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
  };

  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      setBanners(response.data?.banners);
      // // // // console.log(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  return (
    <>
      <div className=" ">
        <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7] dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600  flex items-center justify-between ">
          <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            Shop
          </h2>
          <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
            <Link to="/">
              <span className=" uppercase text-[#FF7004] cursor-pointer ">
                Home
              </span>
            </Link>
            <span className=" px-1 ">/</span>
            <span className=" uppercase">Shop</span>
          </div>
        </div>
        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <section className=" px-[3%] w-full mb-14 flex gap-10 mt-4 lg:mt-12 ">
            <div className=" hidden lg:block w-[23%] h-full border-[2px] p-2.5 border-[#E5E5E5] dark:border-gray-700 ">
              <p className="  border-b-[1px] py-2.5 border-[#E5E5E5]  dark:text-gray-400 text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                CATEGORIES
              </p>

              {categories?.map((i, index) => {
                return (
                  <div key={index}>
                    {i?.subcategories ? (
                      <Menu>
                        <Menu.Button
                          className={`w-full justify-between capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                            i?.fileName?.toLowerCase() === filterCategories
                              ? "text-[#F9BA48] font-bold plus-jakarta"
                              : "text-[#363F4D] dark:text-gray-400"
                          } font-[400] text-[13px] md:text-[14px] 2xl:text-[16px] `}
                        >
                          {i.fileName}
                          <ChevronDownIcon className=" w-[15px]" />
                        </Menu.Button>
                        <Menu.Items className="   flex flex-col  text-[13px] md:text-[13px] 2xl:text-[16px]  dark:text-gray-600 bg-white pl-2 gap-2 w-full ">
                          {i?.subcategories?.map((e, index) => {
                            return (
                              <Link
                                autoFocus="off"
                                to={`/shop/${i?.fileName}/${e?.name}`}
                                onClick={() => {
                                  SetIsMenuOpen(false);
                                }}
                                key={index}
                              >
                                <p
                                  className={`w-full capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                                    i?.fileName?.toLowerCase() ===
                                    filterCategories
                                      ? "text-[#F9BA48] font-bold plus-jakarta"
                                      : "text-[#363F4D] dark:text-gray-400"
                                  } font-[400] text-[12px] md:text-[13px] 2xl:text-[15px] `}
                                  key={index}
                                >
                                  {e?.name}
                                </p>
                              </Link>
                            );
                          })}
                        </Menu.Items>
                      </Menu>
                    ) : (
                      <Link
                        to={`/shop/${i?.fileName}/all`}
                        onClick={() => {
                          setFilterCategories(i?.fileName?.toLowerCase());
                        }}
                        className={`w-full capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                          i?.fileName?.toLowerCase() === filterCategories
                            ? "text-[#F9BA48] font-bold plus-jakarta"
                            : "text-[#363F4D] dark:text-gray-400"
                        } font-[400] text-[13px] md:text-[14px] 2xl:text-[16px] `}
                      >
                        {i?.fileName}
                      </Link>
                    )}
                  </div>
                );
              })}
              <div className=" bg-[#E5E5E5] p-3 ">
                <p className="  border-b-[1px] pt-2.5 border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                  FILTER BY PRICE
                </p>
                <MultiRangeSlider
                  min={0}
                  max={maxPrice}
                  step={5}
                  label="false"
                  ruler="false"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                  barInnerColor="#F9BA48"
                  barRightColor="#000"
                  barLeftColor="#000"
                  thumbLeftColor="#F9BA48"
                  thumbRightColor="#F9BA48"
                  minValue={minValue}
                  maxValue={maxValue}
                  onInput={(e) => {
                    handleInput(e);
                  }}
                />
                <p className="  border-b-[1px] border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[12.5px] md:text-[14px] 2xl:text-[15px] ">
                  Price: {currency}{" "}
                  {currency === "OMR" ? minValue * 0.1 : minValue} - {currency}{" "}
                  {currency === "OMR" ? maxValue * 0.1 : maxValue}
                </p>
              </div>

              <button
                onClick={() => {
                  setFilterColor("");
                  setFilterCategories("");
                  set_minValue(0);
                  set_maxValue(maxPrice);
                }}
                className=" my-2 bg-gray-600 text-white text-sm px-4 py-2 "
              >
                {" "}
                Clear Filters
              </button>
            </div>
            <div className="w-full lg:w-[77%] h-full">
              <div className="max-w-screen-lg mx-auto h-[150px] relative">
                <div className="relative w-full flex justify-center items-center">
                  <img
                    className="h-full w-full object-contain mx-auto"
                    src={
                      banners.find((banner) => banner.fileName === "Banner2")
                        ?.filePath
                        ? banners.find(
                            (banner) => banner.fileName === "Banner2"
                          ).filePath
                        : "/Images/shop-banner.png"
                    }
                    alt="product-img"
                  />
                  {banners.find((banner) => banner.fileName === "Banner2") && (
                    <div className="absolute bottom-1 left-0 right-0 p-4 flex justify-between items-end w-full">
                      <div className="p-2">
                        {banners.find((banner) => banner.fileName === "Banner2")
                          .title && (
                          <h2 className="text-xl md:text-2xl font-bold text-black">
                            {
                              banners.find(
                                (banner) => banner.fileName === "Banner2"
                              ).title
                            }
                          </h2>
                        )}
                        {banners.find((banner) => banner.fileName === "Banner2")
                          .description && (
                          <p className="text-sm md:text-base text-black">
                            {
                              banners.find(
                                (banner) => banner.fileName === "Banner2"
                              ).description
                            }
                          </p>
                        )}
                      </div>
                      {banners.find((banner) => banner.fileName === "Banner2")
                        .buttonContent && (
                        <a
                          href={
                            banners
                              .find((banner) => banner.fileName === "Banner2")
                              .redirectUrl.startsWith("http")
                              ? banners.find(
                                  (banner) => banner.fileName === "Banner2"
                                ).redirectUrl
                              : `${
                                  banners.find(
                                    (banner) => banner.fileName === "Banner2"
                                  ).redirectUrl
                                }`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded shadow-md hover:bg-blue-700 transition duration-300"
                        >
                          {
                            banners.find(
                              (banner) => banner.fileName === "Banner2"
                            ).buttonContent
                          }
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className=" w-full flex lg:grid grid-cols-3 gap-2 items-center justify-between ">
                <div className=" w-full hidden lg:flex gap-2 items-center">
                  <HiMiniSquares2X2
                    onClick={() => {
                      setIsCard(true);
                    }}
                    className={` text-[19px] cursor-pointer ${
                      isCard && "text-[#F9BA48]"
                    } `}
                  />
                  <AiOutlineBars
                    onClick={() => {
                      setIsCard(false);
                    }}
                    className={` text-[19px] cursor-pointer pointer ${
                      !isCard && "text-[#F9BA48]"
                    } `}
                  />
                </div>
                <div className=" flex items-center pr-3 py-2.5 text-[#7A7A7A] font-[400] text-[12px] md:text-[13.5px] 2xl:text-[14px] ">
                  <label htmlFor="sort-method">Sort By: </label>
                  <select
                    name="sort-method"
                    id="sort-method"
                    className="text-[14px] p-1 dark:bg-transparent dark:border dark:border-gray-700   "
                    value={sortMethod}
                    onChange={(e) => {
                      setSortMethod(e.target.value);
                    }}
                  >
                    {sortMethods.map((e, index) => {
                      return (
                        <option
                          className=" p-2 dark:bg-black "
                          key={index}
                          value={e.id}
                        >
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p
                  onClick={() => {
                    SetIsMobileFilterOpen(true);
                  }}
                  className=" lg:hidden underline text-sm cursor-pointer "
                >
                  Filters
                </p>
              </div>
              {loading ? (
                <div className=" w-full flex items-center justify-center py-3">
                  <img
                    src="/Images/loader.svg"
                    alt="loading..."
                    className=" object-contain w-[60px] h-[60px]"
                  />
                </div>
              ) : (
                <>
                  <div className="w-full grid-cols-2 sm:grid-cols-3 grid lg:grid-cols-4 gap-5">
                    {sortedArray
                      .filter((product) => {
                        console.log(product);
                        const isPriceInRange =
                          Number(product.price) > minValue &&
                          Number(product.price) < maxValue;
                        const matchesCategory =
                          filterCategories === "all" ||
                          product?.mainCategory?.some(
                            (cat) =>
                              cat.toLowerCase() ===
                              filterCategories.toLowerCase()
                          );

                        const matchesSubCategory =
                          filterSubCategories === "all" ||
                          product?.subCategory?.some(
                            (cat) =>
                              cat.toLowerCase() ===
                              filterSubCategories.toLowerCase()
                          );

                        return (
                          product?.approved &&
                          isPriceInRange &&
                          matchesCategory &&
                          (filterSubCategories === "all" || matchesSubCategory)
                        );
                      })
                      ?.slice(0, itemsPerPage)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`relative ${
                            isCard
                              ? "flex flex-col items-center justify-between"
                              : "col-span-2 gap-3 flex border border-gray-300 dark:border-gray-700 rounded-md p-3"
                          } shadow shadow-black/30`}
                        >
                          {wishlistedProducts.find(
                            (i) => i?.productId?._id === item._id
                          ) ? (
                            <IoHeartCircle
                              onClick={() => handleRemoveWishlist(item?._id)}
                              className="absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-red-500"
                            />
                          ) : (
                            <IoHeartCircle
                              onClick={() => handleAddToWishlist(item?._id)}
                              className="absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-gray-600"
                            />
                          )}
                          <Link
                            to={`/product/${item?.title.replace(/\s+/g, "-")}`}
                            onClick={() => {
                              sessionStorage.setItem(
                                "productPageId",
                                JSON.stringify(item?._id)
                              );
                              setProductPageId(item?._id);
                            }}
                            className="w-full h-full"
                          >
                            <img
                              className={`object-cover object-center w-full ${
                                isCard
                                  ? "w-full h-[200px]"
                                  : "h-[150px] row-span-2 col-span-1"
                              }`}
                              src={item.mainImage}
                              alt="product-img"
                            />
                          </Link>
                          <div
                            className={`w-full ${
                              isCard
                                ? "text-center"
                                : "flex flex-col justify-between"
                            }`}
                          >
                            <Link
                              to={`/product/${item?.title.replace(
                                /\s+/g,
                                "-"
                              )}`}
                              onClick={() => {
                                sessionStorage.setItem(
                                  "productPageId",
                                  JSON.stringify(item?._id)
                                );
                                setProductPageId(item._id);
                              }}
                            >
                              <p
                                className={`dark:text-gray-400 text-[#363F4D] ${
                                  isCard
                                    ? "font-[600] plus-jakarta my-1 text-[12px] md:text-[14px] 2xl:text-[14.5px]"
                                    : "font-[700] plus-jakarta my-1 text-[13px] md:text-[19px] 2xl:text-[16px]"
                                }`}
                              >
                                {item.title?.slice(0, 50)}
                              </p>
                              <div
                                className={`w-full flex ${
                                  isCard ? "items-center justify-center" : ""
                                }`}
                              >
                                <Stars
                                  stars={
                                    item?.avgRating
                                      ? item?.avgRating
                                      : Math.floor(Math.random() * 6)
                                  }
                                />
                              </div>
                              <div
                                className={`flex items-center ${
                                  isCard ? "justify-center" : ""
                                } text-[13px] md:text-[14.5px] 2xl:text-[15px]`}
                              >
                                <p className="font-[600] plus-jakarta dark:text-gray-400 text-[#A4A4A4]">
                                  {currency}{" "}
                                  <span className="line-through">
                                    {currency === "OMR"
                                      ? (item.price * 0.1).toFixed(2)
                                      : item.price}
                                  </span>
                                </p>
                                <span className="text-[#F9BA48] font-[600] plus-jakarta ml-2">
                                  {currency === "OMR"
                                    ? (item.discountValue * 0.1).toFixed(2)
                                    : item.discountValue}
                                </span>
                              </div>
                            </Link>
                            <Link
                              to={`/product/${item?.title.replace(
                                /\s+/g,
                                "-"
                              )}`}
                              onClick={() => {
                                sessionStorage.setItem(
                                  "productPageId",
                                  JSON.stringify(item?._id)
                                );
                                setProductPageId(item?._id);
                              }}
                            >
                              <button
                                className={`text-sm dark:text-black font-semibold bg-[#efefef] ${
                                  isCard
                                    ? "py-2 w-full"
                                    : "h-fit py-2 w-full px-6"
                                }`}
                              >
                                View Product
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                  {sortedArray?.filter((e) => {
                    const isPriceInRange =
                      Number(e.price) > minValue && Number(e.price) < maxValue;
                    const matchesCategory =
                      filterCategories === "all" ||
                      e?.mainCategory?.some(
                        (cat) =>
                          cat.toLowerCase() === filterCategories.toLowerCase()
                      );

                    const matchesSubCategory =
                      filterSubCategories === "all" ||
                      e?.subCategory?.some(
                        (cat) =>
                          cat.toLowerCase() ===
                          filterSubCategories.toLowerCase()
                      );

                    return (
                      e?.approved &&
                      isPriceInRange &&
                      matchesCategory &&
                      matchesSubCategory
                    );
                  })?.length > itemsPerPage ? (
                    <div
                      onClick={() => setItemsPerPage((prev) => prev + 8)}
                      className="p-3 cursor-pointer border-t bg-gray-200 text-gray-700 font-semibold border-b border-gray-300 my-2 flex items-center justify-center gap-3"
                    >
                      See More
                    </div>
                  ) : (
                    <p className="mt-10 text-center">
                      No More Products Available
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Shop;
