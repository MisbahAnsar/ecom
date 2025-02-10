import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  SlSocialFacebook,
  SlSocialInstagram,
  SlSocialTwitter,
} from "react-icons/sl";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  IoClose,
  IoCloseCircle,
  IoHeartCircle,
  IoStarOutline,
} from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import LoadSirv from "../LoadSirv";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import AttributeSlider from "@/components/AttributeSlider";
import { Tooltip } from "@material-tailwind/react";

const ProductPage = ({}) => {
  const [activeImage, SetActiveImage] = useState(1);
  const [viewMainImg, SetViewMainImg] = useState(false);
  const [materialImage, SetMaterialImage] = useState("");
  const [viewMaterialImg, SetViewMaterialImg] = useState(false);
  const [activeTab, SetActiveTab] = useState(1);
  const [isStock, SetIsStock] = useState(false);
  const {
    wishlistedProducts,
    handleAddToWishlist,
    handleRemoveWishlist,
    setCartCount,
    productPageId,
    setProductPageId,
    setBuyNow,
  } = useContext(MainAppContext);
  const [productQty, setProductQty] = useState(1);
  const [product, setProduct] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [sortedAttributes, setSortedAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [attributesArr, setAttributesArr] = useState({});
  const [is360, setIs360] = useState(false);
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(0);
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const navigate = useNavigate();
  const { currency, cart, setCart, wishlist, setWishlist } =
    useContext(AppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const param = useParams();
  // const productId = param.id;
  const model = useRef();
  // Accessing varient selections element
  const varient = useRef(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    console.log(userAgent);
    if (
      /iPhone|webOS|Android|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent)
    ) {
      console.log("AR Supported");
      setARSupported(true);
    } else {
      console.log("AR Not Supported");
    }
  }, [ARSupported]);

  const getProductDetails = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/${
          productPageId || productId
        }`
      );
      // if (response.data?.approved === false) {
      //   return navigate(-1);
      // }
      setProduct(response.data);
      setPrice(response.data?.price);
      SetActiveImage(response?.data?.mainImage);
      const sortedAttributes = response?.data?.attributes
        .filter((i) => {
          return i?.value !== "" && i?.type !== "";
        })
        .reduce((acc, curr) => {
          const index = acc.findIndex((item) => item.type === curr.type);
          if (index !== -1) {
            // If type already exists, push current object to its values array
            acc[index].values.push(curr);
          } else {
            // If type doesn't exist, create a new object with type and values array
            acc.push({ type: curr.type, values: [curr] });
          }
          return acc;
        }, []);

      let minPrice = Number.MAX_VALUE;
      let maxPrice = Number.MIN_VALUE;

      // Iterate over the outer array
      sortedAttributes.forEach((attribute) => {
        // Iterate over the inner array of values
        if (attribute.type?.toLowerCase() === "size") {
          attribute.values.forEach((value) => {
            const price = parseFloat(value.price); // Convert price to a number
            if (!isNaN(price)) {
              // Check if price is a valid number
              if (price < minPrice) {
                minPrice = price; // Update minPrice if necessary
              }
              if (price > maxPrice) {
                maxPrice = price; // Update maxPrice if necessary
              }
            }
          });
        }
      });
      if (minPrice == 0 || minPrice == Number.MAX_VALUE) {
        setMinPrice(response.data?.price);
      } else setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setSortedAttributes(sortedAttributes);
      // console.log(response.data.attributes);
      const organizedArrays = {};

      response.data.attributes.forEach((obj) => {
        const { type, value, price } = obj;
        if (!organizedArrays[type]) {
          organizedArrays[type] = [];
        }
        organizedArrays[type].push({ value, price });
      });

      setAttributesArr(organizedArrays);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const productPageId2 = JSON.parse(sessionStorage.getItem("productPageId"));
    // console.log(productPageId2);
    setUserDetails(user);
    getProductDetails(productPageId2);
    getAllProducts();
    getReview(productPageId2);
    // if (userDetails) {
    //   getWishlist();
    // }
    // setWishlistedProducts(wishlist);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const productPageId2 = JSON.parse(sessionStorage.getItem("productPageId"));
    // console.log(productPageId2);
    setUserDetails(user);
    getProductDetails(productPageId2);
    getAllProducts();
    getReview(productPageId2);
    // if (userDetails) {
    //   getWishlist();
    // }
    // setWishlistedProducts(wishlist);
  }, [param?.id]);
  useEffect(() => {
    if (typeof window.Sirv === "undefined") {
      LoadSirv().then(() => {
        window.Sirv.start();
      });
    } else {
      window.Sirv.start();
    }
  });
  useEffect(() => {
    function containsRequiredObjects(array) {
      let hasSize = false;
      let hasMaterial = false;
      let hasColor = false;

      for (const obj of array) {
        if (obj.type?.toLowerCase() === "size") {
          hasSize = true;
        } else if (obj.type?.toLowerCase() === "material") {
          hasMaterial = true;
        } else if (obj.type?.toLowerCase() === "color") {
          hasColor = true;
        }
        if (
          (hasSize && hasMaterial) ||
          (hasSize && hasColor) ||
          (hasMaterial && hasColor)
        ) {
          return true;
        }
      }

      return false;
    }
    const shouldDisableButton = !containsRequiredObjects(selectedAttribute);
    setShouldDisableButton(shouldDisableButton);
  }, [setSelectedAttributes, selectedAttribute]);

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
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      setProducts(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleAddToCart = () => {
    if (userDetails && userLoggedIn) {
      addToCart(userDetails?._id, product?._id, productQty);
    } else {
      toast.error("You are not logged in");
    }
  };

  const addToCart = async (userId, productPageId, quantity) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/addProduct`,
        {
          userId: userId,
          productId: productPageId,
          quantity: quantity,
          updatedPrice: minprice == 0 ? price : minprice,
        }
      );
      setCartCount((prev) => prev + 1);
      toast.success("Product Added to Cart");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
      // Handle error
    }
  };

  const getReview = async (productPageId2) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/review/${productPageId2}`
      );
      // console.log(response.data.reviews);
      setReviews(response?.data?.reviews);
      const totalRatings = response?.data?.reviews?.reduce(
        (acc, review) => acc + review.rating,
        0
      );

      // Calculate the average rating
      const averageRating = Math.floor(
        totalRatings / response?.data?.reviews?.length
      );
      setRating(averageRating);
      // // console.log(averageRating);
      // Assuming the response contains an array of reviews
      return response.data.reviews; // Assuming the response contains an array of reviews
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []; // Return an empty array in case of error
    }
  };

  const convertToText = (htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, "");

    return parse(textContent);
  };

  return (
    <>
      <div className=" ">
        <Helmet>
          <title>{product?.title}</title>
          <meta name="description" />
          <meta name="description" content={product?.metaDescription} />
          <meta name="keywords" content={product?.metaHead} />
          <meta name="author" content={product?.metaTitle} />
          {/* Add more meta tags as needed */}
        </Helmet>

        <div className=" px-[4%] md:px-[8%] py-1 md:py-3 bg-[#F4F5F7]  dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
          {/* <h2 className=" uppercase text-[13px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            {product.title?.slice(0, 50)}
          </h2> */}
          <div className=" flex items-center font-[500] text-[#858585] raleway text-[.8461538462rem] md:text-[.8461538462rem] ">
            <Link to="/">
              <span className="text-[#858585] cursor-pointer raleway">
                Home
              </span>
            </Link>
            <span className=" px-1 ">/</span>
            <span className="raleway">{product?.title}</span>
          </div>
        </div>

        <section className=" px-[3%] w-full mb-14 flex gap-10 mt-4 lg:mt-12 ">
          {loading || !product ? (
            <div className=" w-full flex items-center justify-center py-3">
              <img
                src="/Images/loader.svg"
                alt="loading..."
                className=" object-contain w-[60px] h-[60px]"
              />
            </div>
          ) : (
            <div className=" w-full  h-full">
              {viewMainImg && (
                <div className=" fixed w-full h-[100vh] flex items-center justify-center -top-0 z-50 left-0 bg-black/20">
                  <div className=" relative z-50 w-[70%] md:w-[50%] h-[60%]">
                    <IoClose
                      onClick={() => {
                        SetViewMainImg(false);
                      }}
                      className=" absolute text-[24px] -top-20 bg-orange-400 cursor-pointer right-0 z-50"
                    />
                    <img
                      src={activeImage}
                      alt={activeImage}
                      className=" w-full object-cover border border-white h-[80vh] absolute -top-20"
                    />
                  </div>
                </div>
              )}
              <div className=" bg-white dark:bg-white p-[2rem] border w-full flex flex-col md:grid grid-cols-9 gap-2 sm:gap-4 lg:gap-10 mb-3 lg:mb-10">
                <div className="flex relative flex-col items-start justify-start md:col-span-4 lg:col-span-3 gap-4">
                  <div className=" w-full h-fit ">
                    {!is360 ? (
                      <img
                        src={activeImage}
                        alt={activeImage}
                        onClick={() => {
                          SetViewMainImg(true);
                        }}
                        className="h-[200px]  lg:h-full w-full lg:max-h-[450px] object-cover cursor-pointer border border-black"
                      />
                    ) : (
                      <>
                        <div className="Sirv basic relative">
                          <div data-src="https://demo.sirv.com/example.spin" />
                          <div data-src="https://demo.sirv.com/example.spin" />
                          {/* <div data-src="https://demo.sirv.com/image.jpg" data-type="zoom" />
        <div data-src="https://demo.sirv.com/video.mp4" /> */}
                        </div>
                      </>
                    )}
                  </div>
                  <div className=" raleway grid grid-cols-4 gap-1">
                    {!is360 && (
                      <>
                        <img
                          onClick={() => {
                            SetActiveImage(product?.mainImage);
                          }}
                          src={product?.mainImage}
                          alt={"mainImage"}
                          className={`${
                            activeImage === product?.mainImage
                              ? "opacity-40 border-[2px] border-orange-400 "
                              : " cursor-pointer"
                          } h-[70px] lg:h-[80px] w-fit md:w-full object-cover`}
                        />{" "}
                      </>
                    )}
                    {!is360 && (
                      <>
                        {product?.additionalImages &&
                          product?.additionalImages
                            .slice(0, 3)
                            .map((image, index) => (
                              <img
                                key={index}
                                onClick={() => {
                                  SetActiveImage(image);
                                }}
                                src={image}
                                alt={"product-pics"}
                                className={`${
                                  activeImage === image
                                    ? "opacity-40 border-[2px] border-orange-400 "
                                    : " cursor-pointer"
                                } h-[70px] lg:h-[80px] w-fit md:w-full object-cover`}
                              />
                            ))}
                      </>
                    )}
                  </div>
                  {is360 && (
                    <IoCloseCircle
                      onClick={() => {
                        setIs360(false);
                      }}
                      className=" absolute text-[30px] cursor-pointer top-0 right-2"
                    />
                  )}

                  <div className="w-full">
                    <div className=" grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
                      {product.arFilePath && ARSupported && (
                        <model-viewer
                          key={product.id}
                          ref={model}
                          src={product.arFilePath}
                          ios-src={product.iOSSrc || ""}
                          alt="A 3D model"
                          ar
                          ar-modes="webxr scene-viewer quick-look"
                          camera-controls
                          auto-rotate
                          // style={modelViewerStyle}
                        >
                          <button
                            slot="ar-button"
                            className="raleway flex items-start justify-start gap-2 text-left text-[13px] py-2.5 mt-2 w-full"
                          >
                            <img
                              className="h-[23px] dark:invert object-contain"
                              src="/logos/space.svg"
                              alt="logo"
                            />
                          </button>
                        </model-viewer>
                      )}

                      {/* <Link to="/spin"> */}
                      <button
                        onClick={() => {
                          setIs360((prev) => !prev);
                        }}
                        className=" raleway flex items-center justify-center gap-5 text-center border-[2px] border-gray-500 text-[13px] py-2.5 mt-2  w-full"
                      >
                        <img
                          className=" h-[23px] dark:invert object-contain"
                          src="/logos/3d.svg"
                          alt="logo"
                        />
                        {is360 ? "See in Normal View" : "SEE IN 360 view"}
                      </button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>

                <div className=" flex flex-col lg:w-[100%] col-span-4 xl:w-[100%] ">
                  <h4 className=" dark:text-gray-400 capitalize text-[30px] md:text-[30px] 2xl:text-[30px] font-[600] raleway text-[#1d1d1d] ">
                    {product?.title}
                  </h4>
                  {/* <p className=" flex items-center"> */}
                  {/* <span className=" bg-green-400 w-fit px-2 text-sm font-medium">
                      {product?.promotional}
                    </span> */}
                  {/* {product?.promotional === "Discount" && (
                      <span className=" text-sm ml-1 raleway">
                        (
                        {(
                          (product?.price - product?.discountValue) /
                          product?.price
                        )?.toFixed(2) * 100}
                        %)
                      </span>
                    )} */}
                  {/* </p> */}

                  {/* <div className=" w-full flex items-center  gap-3"> */}
                  {/* <div className=" flex items-center gap-2">
                      <Stars stars={product.avgRating} />

                      <span className=" text-sm">({product.avgRating} )</span>
                    </div> */}

                  {/* {product?.isStock && (
                      <p className=" text-xs lg:text-sm">
                        In Stock:
                        <span className=" text-green-500 font-medium">
                          {product?.available} in stock
                        </span>
                      </p>
                    )} */}
                  {/* </div> */}
                  {/* <div className=" text-sm flex items-center gap-2">
                    {reviews?.length} Reviews
                  </div> */}
                  <p className=" pt-[20px]  text-[1.5rem] md:text-[1.7rem] 2xl:text-[1.9rem] font-semibold raleway  text-[#1d1d1d]">
                    {minprice !== 0 &&
                      maxprice !== 0 &&
                      minprice !== Number.MAX_VALUE &&
                      maxprice !== Number.MIN_VALUE && (
                        <span className=" text-black text-[1.6rem] mr-2 ">
                          {currency === "OMR" ? (
                            <>
                              <span className="line-through text-gray-400">
                                {currency} {(minprice * 0.1).toFixed(2)}
                              </span>{" "}
                              <span className="text-black">
                                {currency} {(maxprice * 0.1).toFixed(2)}
                              </span>
                              <span className="line-through text-[#484848] text-[1rem]">
                                {currency} {price}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-black">
                                {currency} {minprice}
                              </span>{" "}
                              <span className="line-through text-[#484848] text-[1rem]">
                                {currency} {price}
                              </span>
                              {product?.promotional && (
                                <span className="label label-warning text-sm ml-1 raleway">
                                  (
                                  {(
                                    (product?.price - product?.discountValue) /
                                    product?.price
                                  )?.toFixed(2) * 100}
                                  %)
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      )}
                    {/* </> */}
                    {/* )}{" "} */}
                    {(minprice === 0 ||
                      maxprice === 0 ||
                      minprice === Number.MAX_VALUE ||
                      maxprice === Number.MIN_VALUE) && (
                      <>
                        {currency}{" "}
                        {currency === "OMR"
                          ? (minprice * 0.1).toFixed(2)
                          : parseFloat(minprice).toFixed(2)}{" "}
                        <span className="line-through text-[#484848] text-[1rem]">
                          {currency} {price}
                        </span>
                        {product?.promotional && (
                          <span className="label label-warning text-sm ml-1 raleway">
                            {(((price - minprice) / price) * 100).toFixed(2)}%
                          </span>
                        )}
                      </>
                    )}

                    {/* <span className=" bg-green-400 w-fit px-2 text-sm font-medium">
                      {product?.promotional}
                    </span> */}
                    {/* {product?.promotional === "Discount" && (
                      <span className="label label-warning text-sm ml-1 raleway">
                        (
                        {(
                          (product?.price - product?.discountValue) /
                          product?.price
                        )?.toFixed(2) * 100}
                        %)
                      </span>
                    )} */}
                  </p>
                  <p className="  text-[10px] md:text-[12px] 2xl:text-[13px] -mt-2 raleway">
                    Tax Included
                  </p>

                  {product?.description && (
                    <div className=" text-[12px] text-[#484848] md:text-sm flex items-center gap-2 border-t pt-[15px] mt-[15px] raleway">
                      {convertToText(product?.description)}
                    </div>
                  )}

                  {/* {console.log(selectedAttribute)} */}
                  {sortedAttributes.map((item, index) => (
                    <div key={index} className=" flex flex-col mt-2">
                      <p className=" mt-3 mb-2 capitalize text-[12.3px] md:text-[13.6px] 2xl:text-[15px] font-bold raleway text-[#484848] text-[1rem]">
                        {item?.type?.toLowerCase() === "size"
                          ? "Dimensions"
                          : "Finish"}
                      </p>
                      <div className=" flex overflow-hidden gap-2 raleway mb-3">
                        {item.values?.length > 6 ? (
                          <>
                            <AttributeSlider
                              data={item}
                              setPrice={setPrice}
                              setMaxPrice={setMaxPrice}
                              setMinPrice={setMinPrice}
                              SetActiveImage={SetActiveImage}
                              selectedAttribute={selectedAttribute}
                              setSelectedAttributes={setSelectedAttributes}
                              SetViewMaterialImg={SetViewMaterialImg}
                              SetMaterialImage={SetMaterialImage}
                            />
                          </>
                        ) : (
                          <>
                            {item?.values?.map((attr, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  if (
                                    attr.type !== "material" &&
                                    Number(attr?.price) !== 0
                                  ) {
                                    setMinPrice(Number(attr?.price));
                                    setMaxPrice(0);
                                  }
                                  const existingAttribute =
                                    selectedAttribute.find(
                                      (attribute) =>
                                        attribute.type === attr.type
                                    );

                                  if (existingAttribute) {
                                    const newArr = selectedAttribute.filter(
                                      (i) => {
                                        return i?.type !== attr?.type;
                                      }
                                    );
                                    setSelectedAttributes([...newArr, attr]);
                                    console.log([...newArr, attr]);
                                  } else {
                                    setSelectedAttributes([
                                      ...selectedAttribute,
                                      attr,
                                    ]);
                                  }
                                }}
                                className={` h-full ${
                                  selectedAttribute?.find(
                                    (i) => i.value === attr.value
                                  )
                                    ? "bg-gray-300 text-gray-800"
                                    : ""
                                }cursor-pointer w-fit border border-gray-300 text-gray-600 ${
                                  attr.type === "material" ? "" : "px-3 py-1"
                                } text-sm ${
                                  attr?.type === "color"
                                    ? `bg-${attr.value} cursor-pointer `
                                    : ""
                                } ${
                                  selectedAttribute?.find(
                                    (i) => i.value === attr.value
                                  ) && attr?.type === "color"
                                    ? " border-2 border-green-500 cursor-pointer"
                                    : ""
                                } `}
                              >
                                {attr.type === "material" ? (
                                  <Tooltip
                                    className="z-20"
                                    content={attr?.value}
                                  >
                                    <img
                                      src={attr?.attributeImage}
                                      onClick={() => {
                                        SetMaterialImage(attr?.attributeImage);
                                        SetViewMaterialImg(true);
                                      }}
                                      alt="material-img"
                                      className={`w-[40px] h-[40px] md:w-[60px] md:h-[60px] object-cover border cursor-pointer  ${
                                        selectedAttribute?.find(
                                          (i) => i.value === attr?.value
                                        )
                                          ? " border-black"
                                          : ""
                                      }`}
                                    />
                                  </Tooltip>
                                ) : (
                                  <p>{attr.value}</p>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center gap-2 ">
                    <div className=" flex items-center w-fit  bg-light-300  dark:bg-transparent py-1  ">
                      <button
                        disabled={productQty <= 0}
                        onClick={() => {
                          if (productQty > 1) {
                            return setProductQty((prev) => prev - 1);
                          }
                        }}
                        className=" px-3 text-[23px] cursor-pointer raleway dark:hover:text-black hover:bg-gray-400 "
                      >
                        -
                      </button>
                      <input
                        className=" bg-transparent w-[50px] text-center raleway"
                        type="number"
                        disabled
                        value={productQty}
                      />
                      <span
                        onClick={() => {
                          if (productQty >= 0) {
                            return setProductQty((prev) => prev + 1);
                          }
                        }}
                        className=" px-3 text-[23px] cursor-pointer dark:hover:text-black hover:bg-gray-400 "
                      >
                        +
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setBuyNow([]);
                        if (userLoggedIn == true) {
                          return handleAddToCart();
                        } else {
                          var tempCart =
                            JSON.parse(localStorage.getItem("cart")) || [];
                          if (
                            tempCart?.find((i) => {
                              return (
                                i?.productId?._id === product._id &&
                                i?.quantity === productQty
                              );
                            })
                          ) {
                            return toast.warn("Product already in Cart");
                          } else if (
                            tempCart?.find((i) => {
                              return (
                                i?.productId?._id === product._id &&
                                i?.quantity !== productQty
                              );
                            })
                          ) {
                            var newTempCart = tempCart?.filter((i) => {
                              return i?.productId?._id !== product._id;
                            });
                            var tempPro = {
                              productId: product,
                              quantity: productQty,
                              updatedPrice: price,
                            };
                            newTempCart.push(tempPro);
                            setCartCount(newTempCart?.length);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(newTempCart)
                            );
                            return toast.success("Product added to Cart");
                          } else {
                            tempCart?.push({
                              productId: product,
                              quantity: productQty,
                              updatedPrice: price,
                            });
                            setCartCount(tempCart?.length);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(tempCart)
                            );
                            toast.success("Product added to Cart");
                          }
                        }
                      }}
                      disabled={shouldDisableButton}
                      className="raleway text-center disabled:bg-gray-300 disabled:text-gray-500 bg-black dark:bg-white dark:text-black font-medium text-white text-sm py-[11.3px] lg:py-0 h-full w-full"
                    >
                      Add to cart
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setBuyNow([
                        { productId: product, quantity: 1, _id: product?._id },
                      ]);
                      navigate("/checkout?param=buynow");
                    }}
                    disabled={shouldDisableButton}
                    className="raleway disabled:bg-gray-300 disabled:text-gray-500 text-center border-[2px] border-gray-500 font-semibold text-sm py-2.5 mt-2  w-full"
                  >
                    Buy Now
                  </button>
                  <div className=" flex items-center justify-between mt-2">
                    <div className=" flex items-center gap-5">
                      <button className="flex items-center gap-2">
                        {/* {// console.log(wishlistedProducts)} */}
                        {wishlistedProducts.find((i) => {
                          return i.productId?._id === product?._id;
                        }) ? (
                          <div
                            className=" flex items-center"
                            onClick={() => {
                              handleRemoveWishlist(product?._id);
                              // toast.error("Product Removed from Wishlist");
                            }}
                          >
                            <IoHeartCircle
                              className={`  cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                            />
                            <span className="text-[12px] w-full md:text-[13.5px] 2xl:text-[14px] font-[500] plus-jakarta">
                              Remove from wishlist
                            </span>
                          </div>
                        ) : (
                          <div
                            className=" flex items-center"
                            onClick={() => {
                              handleAddToWishlist(product?._id);
                            }}
                          >
                            <IoHeartCircle
                              className={`  cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                            />
                            <span className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                              Add to wishlist
                            </span>
                          </div>
                        )}
                      </button>
                      {/* <button className="flex items-center gap-2">
                      <IoIosGitCompare />
                      <span className="text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500] plus-jakarta">
                        Compare
                      </span>
                    </button> */}
                    </div>
                    <div className=" flex items-center gap-4">
                      <Link to="/">
                        <SlSocialFacebook />
                      </Link>
                      <Link to="/">
                        <SlSocialTwitter />
                      </Link>
                      <Link to="/">
                        <SlSocialInstagram />
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 pb-3 border-t border-gray-300">
                    <p className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                      <span>SKU:</span>{" "}
                      <span className="text-[#848484]">{product?.sku}</span>
                    </p>
                    <p className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                      <span>Brand:</span>{" "}
                      <span className="text-[#848484]">
                        {product?.brand ? product?.brand : "Not Available"}
                      </span>
                    </p>
                  </div>
                  {/* Buttons here */}
                </div>
                <div className=" h-full  col-span-2 hidden lg:block ">
                  <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-3 ">
                    You might also like
                  </h4>
                  <div className=" w-full h-full flex flex-col gap-1 ">
                    {products
                      ?.filter((e) => {
                        return (
                          e.approved &&
                          e.mainCategory === product?.mainCategory &&
                          e.title !== product?.title
                        );
                      })
                      .slice(0, 3)
                      .map((item, index) => {
                        return (
                          <div key={index}>
                            {/* {item.type === "card" ? ( */}
                            <div key={index} className=" p-1 relative flex ">
                              {/* <div className=" absolute top-3 left-4 flex gap-2 ">
                                {item?.dis && (
                                  <div className="  px-2 py-0.5 text-xs bg-[#000] text-white ">
                                    SALE
                                  </div>
                                )}
                                {item?.tag && (
                                  <div className="  px-2 py-0.5 text-xs bg-red-700 text-white ">
                                    HOT
                                  </div>
                                )}
                              </div> */}

                              {/* <div>
                                {wishlistedProducts.find((i) => {
                                  return i?.productId?._id === item?._id;
                                }) ? (
                                  <IoHeartCircle
                                    onClick={() => {
                                      handleRemoveWishlist(item?._id);
                                    }}
                                    className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                                  />
                                ) : (
                                  <IoHeartCircle
                                    onClick={() => {
                                      handleAddToWishlist(item?._id);
                                    }}
                                    className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                                  />
                                )}
                              </div> */}
                              <Link
                                to={`/product/${item?.title
                                  ?.replace(/\//g, "")
                                  .replace(/\s+/g, "-")}`}
                                onClick={() => {
                                  localStorage.setItem(
                                    "productPageId",
                                    item?._id
                                  );
                                  setProductPageId(item?._id);
                                }}
                                className=" flex gap-2 raleway"
                              >
                                <img
                                  className=" h-[60px] w-[60px] "
                                  src={item.mainImage}
                                  alt="product-img"
                                />
                                <div className=" flex flex-col">
                                  <p className="  text-xs font-[500] mt-2 mb-1 text-[#484848]">
                                    {item.title?.slice(0, 35)}
                                  </p>
                                  <div className=" flex ">
                                    {item?.discountValue > 0 &&
                                    item?.discountValue !== null ? (
                                      <>
                                        <p className="font-[600] text-xs mr-0.5 dark:text-gray-400 text-[#A4A4A4]">
                                          {currency}{" "}
                                          <span className="line-through">
                                            {currency === "OMR"
                                              ? (item.price * 0.1).toFixed(2)
                                              : item.price}
                                          </span>
                                        </p>
                                        <p className="font-[600] text-xs dark:text-gray-400 text-[#000]">
                                          <span>
                                            {currency === "OMR"
                                              ? (
                                                  item.discountValue * 0.1
                                                ).toFixed(2)
                                              : item.discountValue.toFixed(2)}
                                          </span>
                                        </p>
                                      </>
                                    ) : (
                                      <p className=" text-xs">
                                        {currency}{" "}
                                        {currency === "OMR"
                                          ? (item.price * 0.1).toFixed(2)
                                          : item.price}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    <div className=" flex-col flex items-start mt-2">
                      <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-1 mt-3 pb-3">
                        Quick Links
                      </h4>
                      <ul className=" raleway px-1 list-disc listing_disc text-[13px] md:text-[13.5px] flex flex-col sm:gap-3">
                        <li>
                          <Link to={"/contact"}>Get an Instant Quote!</Link>
                        </li>
                        <li>
                          <Link to={"/contact"}>Delivery & Installation</Link>
                        </li>
                        <li>
                          <Link to={"/materialsAndColors"}>
                            Material and Colors
                          </Link>
                        </li>
                        <li>
                          <Link to={"/contact"}>
                            CDS - Creative Design Studio
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" flex flex-col ">
                <div className=" flex items-start justify-left border-b border-gray-400 ">
                  <p
                    onClick={() => {
                      SetActiveTab(1);
                    }}
                    className={`raleway cursor-pointer text-center text-[11px] md:text-[16px] 2xl:text-[20px] py-1.5 px-7 ${
                      activeTab === 1 && "bg-white dark:text-black"
                    } `}
                  >
                    Details
                  </p>
                  <p
                    onClick={() => {
                      SetActiveTab(2);
                    }}
                    className={`raleway cursor-pointer text-center text-[11px] md:text-[16px] 2xl:text-[20px] py-1.5 px-7 ${
                      activeTab === 2 && "bg-white dark:text-black"
                    } `}
                  >
                    Delivery & Returns
                  </p>
                  <p
                    onClick={() => {
                      SetActiveTab(3);
                    }}
                    className={` raleway cursor-pointer text-center text-[11px] md:text-[16px] 2xl:text-[20px] py-1.5 px-7 ${
                      activeTab === 3 && "bg-white dark:text-black"
                    } `}
                  >
                    Reviews ({reviews.length})
                  </p>
                </div>
              </div>
              {activeTab === 1 ? (
                <div className="bg-white flex flex-col text-xs sm:text-sm lg:p-7 py-3 lg:py-10 font-[400]">
                  <p className=" raleway text-[12px] md:text-[13.3px] 2xl:text-[14px]">
                    {product?.editorContent && parse(product?.editorContent)}
                  </p>
                </div>
              ) : activeTab === 2 ? (
                <>
                  <div className="bg-white flex flex-col text-xs sm:text-sm lg:p-7 py-3 lg:py-10 font-[400]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    <br /> Explicabo deserunt harum fugit adipisci a cum nisi
                    sequi eveniet,
                    <br />
                    alias odio quam in fuga labore culpa, quia dignissimos optio
                    odit
                    <br />
                    doloribus, nam expedita rem eos. Esse, repellat quis
                  </div>
                </>
              ) : (
                <div className="bg-white flex flex-col items-center justify-center text-xs sm:text-sm lg:p-7 py-3 lg:py-10 font-[400]">
                  {/* {// console.log(reviews)} */}
                  {reviews.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex flex-col md:flex-row items-center justify-between shadow-sm shadow-black/30 bg-yellow-200 dark:bg-white/20 rounded-md my-2 md:w-[60%] p-5 "
                      >
                        <div>
                          <p>
                            Comment:
                            <span className=" ml-1  font-semibold">
                              {item.title}
                            </span>
                          </p>
                          <p className=" flex items-center gap-1">
                            Rating:
                            <Stars stars={item?.rating} />({item?.rating})
                          </p>
                          <p>
                            Review:
                            <span className=" ml-1  font-semibold">
                              {item.comment}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            By:
                            <span className=" ml-1  font-semibold">
                              {item?.userId?.name}
                            </span>
                          </p>
                          <p>
                            Date:
                            <span className=" ml-1  font-semibold">
                              {item.createdAt.split("T")[0]}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className=" lg:hidden">
                <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-1 ">
                  You might also like
                </h4>
                <div className=" w-full h-full grid-cols-2 sm:grid-cols-3 grid lg:grid-cols-4 gap-5 ">
                  {products
                    ?.filter((e) => {
                      e.approved &&
                        e.mainCategory === product?.mainCategory &&
                        e.title !== product?.title;
                    })
                    .slice(0, 3)
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          {/* {item.type === "card" ? ( */}
                          <div key={index} className=" relative ">
                            <div className=" absolute top-3 left-4 flex gap-2 ">
                              {item?.dis && (
                                <div className="  px-2 py-0.5 text-xs bg-[#000] text-white ">
                                  SALE
                                </div>
                              )}
                              {item?.tag && (
                                <div className="  px-2 py-0.5 text-xs bg-red-700 text-white ">
                                  HOT
                                </div>
                              )}
                            </div>

                            <div>
                              {wishlistedProducts.find((i) => {
                                return i?.productId?._id === item?._id;
                              }) ? (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleRemoveWishlist(item?._id);
                                  }}
                                  className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                                />
                              ) : (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleAddToWishlist(item?._id);
                                  }}
                                  className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                                />
                              )}
                            </div>
                            <Link
                              to={`/product/${item?.title
                                ?.replace(/\//g, "")
                                .replace(/\s+/g, "-")}`}
                              onClick={() => {
                                localStorage.setItem(
                                  "productPageId",
                                  item?._id
                                );
                                setProductPageId(item?._id);
                              }}
                            >
                              <img
                                className=" h-[200px] sm:h-[270px] lg:h-[300px] xl:h-[360px] "
                                src={item.mainImage}
                                alt="product-img"
                              />
                              <p className=" text-center text-sm sm:text-base  font-[500] mt-2 mb-1">
                                {item.title?.slice(0, 20)}
                              </p>
                              <div className=" flex items-center justify-center">
                                {item?.discountValue > 0 &&
                                item?.discountValue !== null ? (
                                  <>
                                    <p className="font-[600] text-xs md:text-base mr-0.5 dark:text-gray-400 text-[#A4A4A4]">
                                      {currency}{" "}
                                      <span className="line-through">
                                        {currency === "OMR"
                                          ? (item.price * 0.1).toFixed(2)
                                          : item.price}
                                      </span>
                                    </p>
                                    <p className="font-[600] text-xs md:text-base dark:text-gray-400 text-[#000]">
                                      {currency}{" "}
                                      <span>
                                        {currency === "OMR"
                                          ? (item.discountValue * 0.1).toFixed(
                                              2
                                            )
                                          : item.discountValue.toFixed(2)}
                                      </span>
                                    </p>
                                  </>
                                ) : (
                                  <p className=" text-center text-sm sm:text-base">
                                    {currency}{" "}
                                    {currency === "OMR"
                                      ? (item.price * 0.1).toFixed(2)
                                      : item.price}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  <div className=" flex-col flex items-start">
                    <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-1 ">
                      Quick Links
                    </h4>
                    <ul className=" px-1 list-disc text-[13px] sm:text-base flex flex-col sm:gap-3">
                      <Link to={"/"}>
                        <li>Get an Instant Quote!</li>
                      </Link>
                      <Link to={"/"}>
                        <li>Delivery & Installation</li>
                      </Link>
                      <Link to={"/"}>
                        <li>Material and Colors</li>
                      </Link>
                      <Link to={"/"}>
                        <li>CDS - Creative Design Studio</li>
                      </Link>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProductPage;
