import React, { useState } from 'react';

const RegistrationModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        shopName: '',
        shopOwnerName: '',
        shopAddress: '',
        gstNumber: '',
        panNumber: '',
        aadharNumber: '',
        aadharFront: null,
        aadharBack: null,
        role: 'user',
        password: '',
        pesticideLicense: null,
        securityChecksImage: null,
        dealershipForm: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();

            // Add all text fields
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'string') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add file fields
            const fileFields = [
                'aadharFront',
                'aadharBack',
                'pesticideLicense',
                'securityChecksImage',
                'dealershipForm'
            ];

            fileFields.forEach(field => {
                if (formData[field]) {
                    formDataToSend.append(field, formData[field]);
                }
            });

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/local/register/`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);

            // Clear form and close modal
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                shopName: '',
                shopOwnerName: '',
                shopAddress: '',
                gstNumber: '',
                panNumber: '',
                aadharNumber: '',
                aadharFront: null,
                aadharBack: null,
                role: 'user',
                password: '',
                pesticideLicense: null,
                securityChecksImage: null,
                dealershipForm: null
            });
            if (onSuccess) {
                onSuccess();
            }
            onClose();

        } catch (err) {
            setError(err.message || 'An error occurred during registration');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputClassName = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {/* Shop Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>Shop Name</label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Shop Owner Name</label>
                            <input
                                type="text"
                                name="shopOwnerName"
                                value={formData.shopOwnerName}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Shop Address</label>
                        <textarea
                            name="shopAddress"
                            value={formData.shopAddress}
                            onChange={handleChange}
                            className={inputClassName}
                            rows="3"
                            required
                            autoComplete="off"
                        />
                    </div>

                    {/* Documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>GST Number</label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>PAN Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>Aadhar Number</label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClassName}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>Aadhar Front</label>
                            <input
                                type="file"
                                name="aadharFront"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,.pdf"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Aadhar Back</label>
                            <input
                                type="file"
                                name="aadharBack"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,.pdf"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClassName}>Pesticide License</label>
                            <input
                                type="file"
                                name="pesticideLicense"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,.pdf"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Security Checks Image</label>
                            <input
                                type="file"
                                name="securityChecksImage"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,.pdf"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Dealership Form</label>
                        <input
                            type="file"
                            name="dealershipForm"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*,.pdf"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;