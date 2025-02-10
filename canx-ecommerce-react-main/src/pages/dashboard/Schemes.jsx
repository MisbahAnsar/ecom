import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, AlertCircle, ChevronUp, ChevronDown, Trash2, X } from 'lucide-react';
import CreateSchemeModal from './addScheme';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, schemeName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Scheme</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{schemeName}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const SchemeTimeline = ({ scheme, onDelete }) => {
    const [position, setPosition] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/scheme/${scheme._id}`);
            onDelete(scheme._id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting scheme:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
            {/* Header Section */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{scheme.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{scheme.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'
                }`}>
                <div className="p-4 pt-0">
                    {/* Dates */}
                    <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 text-gray-600 p-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="text-xs font-medium text-gray-400">Start</div>
                                <div className="text-xs">{new Date(scheme.schemeStart).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 p-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="text-xs font-medium text-gray-400">End</div>
                                <div className="text-xs">{new Date(scheme.schemeEnd).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 p-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="text-xs font-medium text-gray-400">Settlement</div>
                                <div className="text-xs">{new Date(scheme.settlementDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Control */}
                    <div className="mb-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Slabs Timeline */}
                    <div className="relative pt-6 pb-2">
                        <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200" />
                        <div className="flex justify-between relative">
                            {scheme.slabs.map((slab, index) => {
                                const isVisible = (index * (100 / scheme.slabs.length)) <= position;
                                return (
                                    <div
                                        key={slab._id}
                                        className={`transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                            }`}
                                        style={{ flex: '1' }}
                                    >
                                        <div className="flex flex-col items-center px-1">
                                            <div className={`w-2.5 h-2.5 rounded-full mb-2 transition-colors ${isVisible ? 'bg-blue-500' : 'bg-gray-300'
                                                }`} />
                                            <div className={`px-2 py-1.5 rounded text-center w-full transition-colors ${isVisible ? 'bg-blue-50' : 'bg-gray-50'
                                                }`}>
                                                <div className="font-medium text-sm text-gray-900">₹{slab.slab}</div>
                                                <div className="text-xs text-gray-600 truncate max-w-[100px]">
                                                    {slab.benefit}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                schemeName={scheme.title}
            />
        </div>
    );
};

const Schemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchSchemes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/scheme/all`);
            setSchemes(response.data.schemes);
            setError(null);
        } catch (error) {
            setError('Failed to fetch schemes. Please try again later.');
            console.error('Error fetching schemes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, []);

    const handleSchemeDelete = (deletedSchemeId) => {
        setSchemes(prevSchemes => prevSchemes.filter(scheme => scheme._id !== deletedSchemeId));
    };

    if (loading) {
        return (
            <div className="p-6 space-y-3">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
                {[1, 2, 3].map((n) => (
                    <div key={n} className="border rounded-lg p-4">
                        <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Schemes</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Add Scheme
                </button>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-red-800">Error</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {schemes.length === 0 && !error ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">No schemes available.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {schemes.map((scheme) => (
                        <SchemeTimeline
                            key={scheme._id}
                            scheme={scheme}
                            onDelete={handleSchemeDelete}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && <CreateSchemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Schemes;