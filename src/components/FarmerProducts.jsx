import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import farmerApi from '../api/farmer';
import PageLoader from './PageLoader';

export default function FarmerProducts({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, obj = Edit
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);

  // Initial Form State
  const initialFormState = {
    name: '',
    category: 'Fresh Vegetables',
    price: '4.50',
    unit: 'lb',
    quantity: 25,
    description: '',
    status: 'Available',
    image: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Products Dataset
  const [products, setProducts] = useState([]);

  // Categories list
  const categories = ['all', 'Fresh Vegetables', 'Culinary Herbs', 'Orchard Fruits', 'Artisan Pantry'];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchStatus =
        statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Available
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
            Low Stock
          </span>
        );
      case 'Sold Out':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Sold Out
          </span>
        );
      case 'Temporarily Unavailable':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant/70 font-label-sm text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            Temporarily Unavailable
          </span>
        );
    }
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview('');
    setImageFileName('');
    setShowUrlInput(false);
    setIsDragging(false);
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.numericPrice ? String(product.numericPrice) : product.price.replace('$', ''),
      unit: product.unit,
      quantity: product.quantity,
      description: product.description,
      status: product.status,
      image: product.image || ''
    });
    setImageFile(null);
    setImagePreview(product.image || '');
    setImageFileName('');
    setShowUrlInput(false);
    setIsDragging(false);
    setIsFormModalOpen(true);
  };

  // Image Selection Handler
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast?.('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast?.('Image size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageFileName('');
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load products from backend
  useEffect(() => {
    setLoading(true);
    farmerApi.getProducts()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((p) => {
            const numPrice = Number(p.price) || 0;
            const statusLabel = p.status === 'sold_out' || p.stock_quantity <= 0
              ? 'Sold Out'
              : (p.stock_quantity <= 5 ? 'Low Stock' : 'Available');
            return {
              id: p.id,
              name: p.name,
              category: p.category?.name || p.category_name || 'Fresh Produce',
              price: `$${numPrice.toFixed(2)}`,
              numericPrice: numPrice,
              unit: p.unit || 'unit',
              quantity: p.stock_quantity ?? 0,
              status: statusLabel,
              description: p.description || '',
              image: p.image || initialFormState.image
            };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.warn('Could not load farmer products:', err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Toggle Sold Out / Available
  const handleToggleSoldOut = async (prod) => {
    const nextStatus = prod.status === 'Sold Out' ? 'Available' : 'Sold Out';
    const nextQty = nextStatus === 'Sold Out' ? 0 : 20;
    try {
      await farmerApi.toggleProductStatus(prod.id, nextStatus === 'Sold Out' ? 'sold_out' : 'available');
    } catch (err) {
      console.warn('API toggleProductStatus error:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, status: nextStatus, quantity: nextQty } : p))
    );
    window.dispatchEvent(new CustomEvent('marketlink:product-added', { detail: { id: prod.id, status: nextStatus } }));
    showToast?.(`"${prod.name}" marked as ${nextStatus}.`);
  };

  // Save Product Form
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast?.('Please fill out product name and price.');
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const formattedPrice = `$${priceNum.toFixed(2)}`;
    const qty = parseInt(formData.quantity) || 0;

    let autoStatus = formData.status;
    if (qty === 0 && autoStatus === 'Available') autoStatus = 'Sold Out';
    if (qty > 0 && qty <= 5 && autoStatus === 'Available') autoStatus = 'Low Stock';

    let finalImageUrl = formData.image;

    // If an image file was selected from user's device, upload to server
    if (imageFile) {
      setIsUploadingImage(true);
      try {
        const uploadRes = await farmerApi.uploadProductImage(imageFile);
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        }
      } catch (uploadErr) {
        console.warn('Image upload API error, fallback to preview data URL:', uploadErr);
        // Keeps finalImageUrl as data URL so it displays immediately
      } finally {
        setIsUploadingImage(false);
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    }

    const payload = {
      name: formData.name.trim(),
      price: priceNum,
      unit: formData.unit,
      stock_quantity: qty,
      description: formData.description,
      status: autoStatus === 'Sold Out' ? 'sold_out' : 'available',
      image: finalImageUrl
    };

    if (editingProduct) {
      try {
        await farmerApi.updateProduct(editingProduct.id, payload);
      } catch (err) {
        console.warn('API updateProduct error:', err);
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name.trim(),
                category: formData.category,
                price: formattedPrice,
                numericPrice: priceNum,
                unit: formData.unit,
                quantity: qty,
                status: autoStatus,
                description: formData.description,
                image: finalImageUrl
              }
            : p
        )
      );
      window.dispatchEvent(new CustomEvent('marketlink:product-added', { detail: { id: editingProduct.id, ...payload } }));
      showToast?.(`Product "${formData.name}" updated successfully.`);
    } else {
      let createdId = `p-${Date.now()}`;
      try {
        const res = await farmerApi.createProduct(payload);
        if (res?.data?.id) createdId = res.data.id;
      } catch (err) {
        console.warn('API createProduct error:', err);
      }
      const newProd = {
        id: createdId,
        name: formData.name.trim(),
        category: formData.category,
        price: formattedPrice,
        numericPrice: priceNum,
        unit: formData.unit,
        quantity: qty,
        status: autoStatus,
        description: formData.description || 'Freshly harvested from Green Pastures farm beds.',
        image: finalImageUrl
      };
      setProducts([newProd, ...products]);
      window.dispatchEvent(new CustomEvent('marketlink:product-added', { detail: newProd }));
      showToast?.(`"${formData.name}" listed to your stall catalog!`);
    }

    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalProduct) return;
    try {
      await farmerApi.deleteProduct(deleteModalProduct.id);
    } catch (err) {
      console.warn('API deleteProduct error:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteModalProduct.id));
    window.dispatchEvent(new CustomEvent('marketlink:product-added', { detail: { id: deleteModalProduct.id, deleted: true } }));
    showToast?.(`Product "${deleteModalProduct.name}" removed from stall.`);
    setDeleteModalProduct(null);
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Product Catalog..."
        subtitle="Retrieving current field stock, pricing, and availability..."
        minHeight="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-gutter py-4 sm:py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-5 sm:gap-space-lg animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
            <span>FARMER STALL</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">MY PRODUCTS</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
            My Products
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Manage your harvest listings, set market pricing, track available quantities, and toggle availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>+ Add Product</span>
        </button>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        
        {/* Search */}
        <div className="relative w-full sm:w-80 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce, herbs, heirloom..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>

        {/* Category & Status Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-bold border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Fresh Vegetables">Fresh Vegetables</option>
            <option value="Culinary Herbs">Culinary Herbs</option>
            <option value="Orchard Fruits">Orchard Fruits</option>
            <option value="Artisan Pantry">Artisan Pantry</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-bold border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Temporarily Unavailable">Temporarily Unavailable</option>
          </select>
        </div>
      </div>

      {/* 3. Products Data Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3.5 px-space-md" scope="col">Product Item</th>
                <th className="py-3.5 px-space-md" scope="col">Category</th>
                <th className="py-3.5 px-space-md" scope="col">Price / Unit</th>
                <th className="py-3.5 px-space-md" scope="col">Qty Available</th>
                <th className="py-3.5 px-space-md" scope="col">Status</th>
                <th className="py-3.5 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-space-sm text-primary">
                      <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      No products yet, add your first product.
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 mb-space-md max-w-sm mx-auto">
                      Start listing your fresh garden harvest so shoppers at regional pavilions can reserve produce.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm cursor-pointer"
                    >
                      + Add First Product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-container-low/60 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                          alt={prod.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/30 shadow-2xs"
                        />
                        <div className="flex flex-col min-w-0 max-w-[240px]">
                          <span className="font-headline-sm text-[13px] font-bold text-on-surface line-clamp-1">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant line-clamp-1">
                            {prod.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-space-md">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-[11px] font-bold text-on-surface">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price & Unit */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-primary text-sm">{prod.price}</span>
                        <span className="text-on-surface-variant text-[11px]">/ {prod.unit}</span>
                      </div>
                    </td>

                    {/* Quantity Available */}
                    <td className="py-3.5 px-space-md">
                      <span
                        className={`font-mono font-bold text-xs ${
                          prod.quantity === 0
                            ? 'text-error'
                            : prod.quantity <= 5
                            ? 'text-[#F28C28]'
                            : 'text-on-surface'
                        }`}
                      >
                        {prod.quantity} {prod.unit}s
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-space-md">
                      {renderStatusBadge(prod.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-space-md text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSoldOut(prod)}
                          className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
                            prod.status === 'Sold Out'
                              ? 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                          title="Toggle Sold Out / Available"
                        >
                          {prod.status === 'Sold Out' ? 'Restock' : 'Mark Sold Out'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteModalProduct(prod)}
                          className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error cursor-pointer transition-colors"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container/40 flex items-center justify-between border-t border-outline-variant/20 text-xs">
          <span className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> of{' '}
            <span className="font-bold text-on-surface">{products.length}</span> stall listings
          </span>
          <span className="font-body-sm text-secondary font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Certified Organic Stallholder
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT FORM                          */}
      {/* ======================================================== */}
      {isFormModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFormModalOpen(false);
          }}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full max-h-[88vh] shadow-[0_24px_64px_rgba(0,0,0,0.35)] flex flex-col border border-outline-variant/40 overflow-hidden animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4 shrink-0 bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">
                    {editingProduct ? 'edit_note' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base sm:text-lg">
                    {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Harvest Item'}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    List item on your public storefront and pavilion pickup catalog
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable Form Body with Visible Scrollbar */}
              <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs flex-1">
                {/* Product Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-on-surface">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Heirloom Brandywine Tomatoes"
                    className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold cursor-pointer"
                    >
                      <option>Fresh Vegetables</option>
                      <option>Culinary Herbs</option>
                      <option>Orchard Fruits</option>
                      <option>Artisan Pantry</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold cursor-pointer"
                    >
                      <option>Available</option>
                      <option>Low Stock</option>
                      <option>Sold Out</option>
                      <option>Temporarily Unavailable</option>
                    </select>
                  </div>
                </div>

                {/* Price, Unit & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface">Price ($) *</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface">Unit *</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="lb">per lb</option>
                      <option value="kg">per kg</option>
                      <option value="bunch">per bunch</option>
                      <option value="piece">per piece</option>
                      <option value="dozen">per dozen</option>
                      <option value="jar">per jar</option>
                      <option value="loaf">per loaf</option>
                      <option value="basket">per basket</option>
                      <option value="pint">per pint</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface">Qty Available *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-on-surface">Produce Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Notes on harvesting date, tasting profile, recommended use..."
                    className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                  ></textarea>
                </div>

                {/* Product Image Upload Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-on-surface flex items-center gap-1.5">
                      <span>Product Image</span>
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                        {imagePreview ? 'Photo Selected' : 'Recommended'}
                      </span>
                    </label>

                    {/* Quick toggle to paste URL if desired */}
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] text-primary hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {showUrlInput ? 'upload_file' : 'link'}
                      </span>
                      <span>{showUrlInput ? 'Back to File Upload' : 'Paste Image URL instead'}</span>
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  {showUrlInput ? (
                    /* Manual Image URL Input Box */
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col gap-2 animate-fade-in">
                      <div className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value });
                            setImagePreview(e.target.value);
                            setImageFile(null);
                            setImageFileName('');
                          }}
                          placeholder="Paste direct image URL (e.g. https://example.com/item.jpg)"
                          className="flex-1 p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none text-xs font-mono text-on-surface"
                        />
                        {formData.image && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image: '' });
                              setImagePreview('');
                            }}
                            className="p-2 text-error hover:bg-error-container/30 rounded-lg text-xs font-bold cursor-pointer"
                            title="Clear URL"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={imagePreview}
                            alt="URL Preview"
                            className="w-12 h-12 rounded-lg object-cover border border-outline-variant/40 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <span className="text-[11px] text-on-surface-variant truncate">
                            Preview loaded from external URL
                          </span>
                        </div>
                      )}
                    </div>
                  ) : imagePreview ? (
                    /* Image Preview Card (When an image is loaded or selected) */
                    <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative group shrink-0">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-16 h-16 rounded-xl object-cover border border-primary/30 shadow-xs"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 text-on-surface font-bold text-xs truncate">
                            <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
                              check_circle
                            </span>
                            <span className="truncate max-w-[220px]">
                              {imageFileName || (editingProduct ? 'Current Stall Image' : 'Selected Harvest Photo')}
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant mt-0.5">
                            {imageFile
                              ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                              : 'Ready for catalog listing'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Change</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drag & Drop Upload Zone */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                        isDragging
                          ? 'border-primary bg-primary/10 scale-[1.01]'
                          : 'border-outline-variant/60 bg-surface-container-low hover:border-primary/50 hover:bg-surface-container-low/80'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                        <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
                      </div>
                      <div>
                        <span className="font-bold text-on-surface text-xs block">
                          Click to browse or drag & drop harvest photo
                        </span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">
                          PNG, JPG, JPEG, or WebP up to 5MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-[11px] font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">upload</span>
                        <span>Browse File</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isUploadingImage}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer transition-colors text-xs disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold shadow-md cursor-pointer transition-all active:scale-95 text-xs flex items-center gap-2 disabled:opacity-60"
                >
                  {isUploadingImage ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        {editingProduct ? 'check' : 'add'}
                      </span>
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                      */}
      {/* ======================================================== */}
      {deleteModalProduct && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteModalProduct(null);
          }}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-error">
              <span className="material-symbols-outlined text-[24px]">delete_forever</span>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                Delete Product?
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Are you sure you want to delete <strong className="text-on-surface font-bold">{deleteModalProduct.name}</strong> from your market catalog? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-bold cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-error text-on-error font-bold cursor-pointer hover:bg-error/90 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
