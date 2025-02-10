import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { MainAppContext } from "@/context/MainContext";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    // price: "",
    discountValue: "",
    currency: "INR",
    available: "",
    sku: "",
    status: "available",
    // weight: "",
    minQuantity: "",
    quantityIncrement: "",
    vendorId: "6707bfdab2019e667a44de77",
    mainCategory: "",
    variants: [],
  });
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [variantInput, setVariantInput] = useState({ type: "", value: "", price: "" });

  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  const isMounted = useRef(false);

  const [selectedVariantType, setSelectedVariantType] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/category`);
        if (response.status === 200) {
          setCategories(response.data.categories || []);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        toast.error("An error occurred while fetching categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (!isMounted.current && (!user || user?.role !== "admin") && (!user1 || user1?.role !== "admin")) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantInput({ ...variantInput, [name]: value });

    if (name === "type") {
      setSelectedVariantType(value);  // Update selected variant type
    }
  };

  const addVariant = () => {
    const { type, value, price } = variantInput;

    if (!type || !value || !price) {
      toast.error("Please fill all variant fields before adding");
      return;
    }

    const updatedVariants = [...productDetails.variants, { type, value: Number(value), price: Number(price) }];
    setProductDetails({ ...productDetails, variants: updatedVariants });
    setVariantInput({ type: "", value: "", price: "" });
    toast.success("Variant added successfully");
  };

  const removeVariant = (index) => {
    const updatedVariants = productDetails.variants.filter((_, idx) => idx !== index);
    setProductDetails({ ...productDetails, variants: updatedVariants });
    toast.info("Variant removed");
  };


  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setProductDetails({ ...productDetails, mainCategory: selectedCategoryId });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!productDetails || typeof productDetails !== "object") {
      toast.error("Invalid product details");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
  
    // Add product details to FormData
    Object.entries(productDetails).forEach(([key, value]) => {
      if (key === "variants") {
        // Stringify variants array
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
  
    // Add images to FormData
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    if (additionalImages.length > 0) {
      additionalImages.forEach((image) => formData.append("additionalImages", image));
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/product/create`,
        formData
      );
  
      if (![200, 201].includes(response.status)) {
        throw new Error("Failed to add product. Please try again.");
      }
  
      toast.success("Product added successfully");

      navigate("/admindashboard/products");
      clearFormEntries();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFormEntries = () => {
    setProductDetails({
      title: "",
      description: "",
      // price: "",
      currency: "₹",
      available: "",
      sku: "",
      // weight: "",
      minQuantity: "",
      quantityIncrement: "",
      mainCategory: "",
      variants: [],
    });
    setMainImage(null);
    setAdditionalImages([]);
    setSelectedCategory("");
  };

  return (
    <>
      {loading ? (
        <div className="w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className="object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full min-h-[100vh] bg-[#F8F9FA] p-4">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>

          <div className="mb-4">
            <label htmlFor="product-title" className="block text-sm font-medium mb-1">Product Title<span className="text-red-500">*</span></label>
            <input
              required
              name="title"
              id="product-title"
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Type here"
              value={productDetails.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description<span className="text-red-500">*</span></label>
            <ReactQuill
              theme="snow"
              value={productDetails.description}
              onChange={(value) =>
                setProductDetails({ ...productDetails, description: value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="variant-section" className="block text-sm font-medium mb-1">
              Product Variants
            </label>
            <div className="flex items-center gap-2 mb-2">
              <select
                name="type"
                className="p-2 border rounded w-[120px]"
                value={variantInput.type}
                onChange={handleVariantChange}
              >
                <option value="">Type</option>
                <option value="g">Grams</option>
                <option value="kg">Kilograms</option>
                <option value="ml">Milliliters</option>
                <option value="litre">Liters</option>
              </select>
              <input
                type="number"
                name="value"
                placeholder="weight"
                className="p-2 border rounded w-[120px]"
                value={variantInput.value}
                onChange={handleVariantChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="p-2 border rounded w-[120px]"
                value={variantInput.price}
                onChange={handleVariantChange}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addVariant}
              >
                Add Variant
              </button>
            </div>

            {/* Displaying added variants */}
            {productDetails.variants.length > 0 && (
              <div className="mt-2">
                {productDetails.variants.map((variant, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <p>
                      {variant.type} - {variant.value} - ₹{variant.price}
                    </p>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeVariant(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Discounted Price</label>
            <input name="discountValue" id="discounted-price" type="number" className="w-full p-2 border rounded" placeholder="Enter discounted price (optional)" value={productDetails.discountValue} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category<span className="text-red-500">*</span></label>
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.fileName} value={category.fileName}>
                  {category.fileName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="sku" className="block text-sm font-medium mb-1">SKU</label>
            <input required name="sku" id="sku" type="text" className="w-full p-2 border rounded" placeholder="Enter SKU" value={productDetails.sku} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="minQuantity" className="block text-sm font-medium mb-1">Minimum Quantity<span className="text-red-500">*</span></label>
            <input required name="minQuantity" id="minQuantity" type="number" className="w-full p-2 border rounded" placeholder="Enter minimum quantity" value={productDetails.minQuantity} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="quantityIncrement" className="block text-sm font-medium mb-1">Quantity Increment<span className="text-red-500">*</span></label>
            <input required name="quantityIncrement" id="quantityIncrement" type="number" className="w-full p-2 border rounded" placeholder="Enter quantity increment value" value={productDetails.quantityIncrement} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="mainImage" className="block text-sm font-medium mb-1">Main Image<span className="text-red-500">*</span></label>
            <input required type='file' accept='image/*' onChange={handleMainImageChange} />
          </div>
          <div className='mb-4'>
            <label htmlFor='additionalImages' className='block text-sm font-medium mb-1'>Additional Images</label>
            <input type='file' multiple accept='image/*' onChange={handleImageChange} />
          </div>
          <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>Publish</button>
        </form>
      )}
    </>
  );
};

export default AddProduct;
