import React, { useState } from "react";
import { X, Plus, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateSchemeModal = ({ isOpen, onClose }) => {
    const [schemeData, setSchemeData] = useState({
        title: "",
        description: "",
        schemeStart: "",
        schemeEnd: "",
        settlementDate: "",
        slabs: [{ slab: "", benefit: "" }],
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSchemeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSlabChange = (index, field, value) => {
        const updatedSlabs = [...schemeData.slabs];
        updatedSlabs[index][field] = value;
        setSchemeData((prevData) => ({ ...prevData, slabs: updatedSlabs }));
    };

    const addSlab = () => {
        setSchemeData((prevData) => ({
            ...prevData,
            slabs: [...prevData.slabs, { slab: "", benefit: "" }],
        }));
    };

    const removeSlab = (index) => {
        const updatedSlabs = schemeData.slabs.filter((_, i) => i !== index);
        setSchemeData((prevData) => ({ ...prevData, slabs: updatedSlabs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!schemeData || typeof schemeData !== "object") {
            toast.error("Invalid scheme data");
            setLoading(false);
            return;
        }

        const payload = {
            ...schemeData,
            slabs: Array.isArray(schemeData.slabs)
                ? schemeData.slabs.map((slab) => ({
                    slab: slab.slab,
                    benefit: slab.benefit,
                }))
                : [],
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/scheme/add`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (![200, 201].includes(response.status)) {
                throw new Error("Failed to create scheme. Please try again.");
            }

            toast.success("Scheme created successfully");
            setSchemeData({
                title: "",
                description: "",
                schemeStart: "",
                schemeEnd: "",
                settlementDate: "",
                slabs: [{ slab: "", benefit: "" }],
            });
            onClose();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10">
                        <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Scheme</h2>
                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={schemeData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={schemeData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Scheme Start
                            </label>
                            <input
                                type="date"
                                name="schemeStart"
                                value={schemeData.schemeStart}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Scheme End
                            </label>
                            <input
                                type="date"
                                name="schemeEnd"
                                value={schemeData.schemeEnd}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Settlement Date
                            </label>
                            <input
                                type="date"
                                name="settlementDate"
                                value={schemeData.settlementDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Slabs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Slabs
                        </label>
                        {schemeData.slabs.map((slab, index) => (
                            <div key={index} className="flex items-center space-x-4 mt-2">
                                <input
                                    type="number"
                                    placeholder="Slab Amount"
                                    value={slab.slab}
                                    onChange={(e) =>
                                        handleSlabChange(index, "slab", e.target.value)
                                    }
                                    className="block w-1/3 border rounded-md p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Benefit"
                                    value={slab.benefit}
                                    onChange={(e) =>
                                        handleSlabChange(index, "benefit", e.target.value)
                                    }
                                    className="block w-2/3 border rounded-md p-2"
                                />
                                {schemeData.slabs.length > 1 && (
                                    <button
                                        onClick={() => removeSlab(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addSlab}
                            className="mt-2 flex items-center gap-1 text-blue-500 hover:text-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Add Slab
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Scheme"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSchemeModal;
