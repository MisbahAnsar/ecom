import React, { useContext, useEffect, useState } from "react";
import { MainAppContext } from "@/context/MainContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import axios from "axios";

const EditProduct = ({ product, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(product.mainCategory?.[0] || "");
  const [productDetails, setProductDetails] = useState({
    title: product.title || "",
    description: product.description || "",
    // price: product.price || "",
    discountValue: product.discountValue || "",
    currency: product.currency || "INR",
    available: product.available || "",
    status: product.status || "available",
    sku: product.sku || "",
    // weight: product.weight || "",
    minQuantity: product.minQuantity || "",
    quantityIncrement: product.quantityIncrement || "",
    mainCategory: product.mainCategory || [],
    vendorId: "6707bfdab2019e667a44de77",
    mainImage: product.mainImage || "",
    additionalImages: product.additionalImages || [],
    variants: product.variants?.map(variant => ({
      type: variant.type || "",
      value: variant.value || "",
      price: variant.price || ""
    })) || []
  });

  const { user } = useContext(MainAppContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/category`);
        if (response.status === 200) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setProductDetails(prev => ({
      ...prev,
      mainCategory: [selectedCategoryId]
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductDetails(prev => ({
        ...prev,
        mainImage: file
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setProductDetails(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...files].slice(0, 5)
      }));
    }
  };

  const handleDeleteMainImage = () => {
    setProductDetails(prev => ({
      ...prev,
      mainImage: ""
    }));
  };

  const handleDeleteAdditionalImage = (index) => {
    setProductDetails(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductDetails(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  const handleAddVariant = () => {
    setProductDetails(prev => ({
      ...prev,
      variants: [...prev.variants, { type: "", value: "", price: "" }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setProductDetails(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(productDetails).forEach(([key, value]) => {
        if (key !== 'variants' && key !== 'additionalImages' && key !== 'mainImage') {
          formData.append(key, value);
        }
      });

      // Add variants as JSON string
      formData.append('variants', JSON.stringify(productDetails.variants));

      // Add images
      if (productDetails.mainImage instanceof File) {
        formData.append('mainImage', productDetails.mainImage);
      }

      productDetails.additionalImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('additionalImages', image);
        }
      });

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/product/edit/${product._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        toast.success("Product updated successfully");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Product Title<span className="text-red-500">*</span>
            </label>
            <input
              required
              name="title"
              id="title"
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Type here"
              value={productDetails.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={productDetails.description}
              onChange={(value) =>
                setProductDetails(prev => ({ ...prev, description: value }))
              }
            />
          </div>

          {/* Variants Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Product Attributes
              </label>
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                onClick={handleAddVariant}
              >
                Add Attribute
              </button>
            </div>

            {productDetails.variants.map((variant, idx) => (
              <div key={idx} className="border p-4 rounded mb-4 bg-white">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Attribute {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                <div>
  <label className="block text-sm font-medium mb-1">
    Type
  </label>
  <select
    value={variant.type}
    onChange={(e) => handleVariantChange(idx, "type", e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="g">g</option>
    <option value="kg">kg</option>
    <option value="ml">ml</option>
    <option value="litre">litre</option>
  </select>
</div>


                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={variant.value}
                      onChange={(e) => handleVariantChange(idx, "value", e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Large"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Variant price"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="discountValue" className="block text-sm font-medium mb-1">
              Discount Value
            </label>
            <input
              name="discountValue"
              id="discountValue"
              type="number"
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
              placeholder="Enter discount value"
              value={productDetails.discountValue}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category<span className="text-red-500">*</span>
            </label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="sku" className="block text-sm font-medium mb-1">
                SKU
              </label>
              <input
                name="sku"
                id="sku"
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter SKU"
                value={productDetails.sku}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="minQuantity" className="block text-sm font-medium mb-1">
                Minimum Quantity<span className="text-red-500">*</span>
              </label>
              <input
                required
                name="minQuantity"
                id="minQuantity"
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                placeholder="Enter minimum quantity"
                value={productDetails.minQuantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="quantityIncrement" className="block text-sm font-medium mb-1">
                Quantity Increment<span className="text-red-500">*</span>
              </label>
              <input
                required
                name="quantityIncrement"
                id="quantityIncrement"
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                placeholder="Enter increment value"
                value={productDetails.quantityIncrement}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Main Image<span className="text-red-500">*</span>
            </label>
            {productDetails.mainImage && (
              <div className="mb-2">
                <img
                  src={typeof productDetails.mainImage === 'string' ? productDetails.mainImage : URL.createObjectURL(productDetails.mainImage)}
                  alt="Main Product"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleDeleteMainImage}
                  className="text-red-500 text-sm mt-1"
                >
                  Remove Image
                </button>
              </div>
            )}
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Additional Images (Max 5)
            </label>
            <div className="grid grid-cols-5 gap-4 mb-2">
              {productDetails.additionalImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAdditionalImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {productDetails.additionalImages.length < 5 && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditProduct;