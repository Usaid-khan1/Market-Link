import React, { useState, useMemo, useEffect } from 'react';
import farmerApi from '../api/farmer';

export default function FarmerProducts({ showToast }) {
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5M_Jb-g3RIEObP_vUiplndD9sEKJ_Lx0Sgl3lL_8A0ZU5IGI_oshUgCGad4ZJtpqRMEWiVK8ytrwcJ9Intg9z7_W5J0fPW6S4mXBdn7t5IYLtNLjUujKtDJXuRzcF1rsCDTxQ9QxSgQAYRYRXhtD5sgdF7rYcV4A8XuPIvw7wfLzV-mtiFOrs__kBPIFF6OcghZ58jEraL_t2Hb4HdY5cZOtUFuWhWRjhXMxnBPjsgxdRrj4yOAYo'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Products Dataset for Green Pastures Organic
  const [products, setProducts] = useState([
    {
      id: 'p-1',
      name: 'Heirloom Brandywine Tomatoes',
      category: 'Fresh Vegetables',
      price: '$4.50',
      numericPrice: 4.50,
      unit: 'lb',
      quantity: 24,
      status: 'Available',
      description: 'Vine-ripened, rich acidic bite with velvety sweetness. Picked Friday afternoon.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5M_Jb-g3RIEObP_vUiplndD9sEKJ_Lx0Sgl3lL_8A0ZU5IGI_oshUgCGad4ZJtpqRMEWiVK8ytrwcJ9Intg9z7_W5J0fPW6S4mXBdn7t5IYLtNLjUujKtDJXuRzcF1rsCDTxQ9QxSgQAYRYRXhtD5sgdF7rYcV4A8XuPIvw7wfLzV-mtiFOrs__kBPIFF6OcghZ58jEraL_t2Hb4HdY5cZOtUFuWhWRjhXMxnBPjsgxdRrj4yOAYo'
    },
    {
      id: 'p-2',
      name: 'Rainbow Swiss Chard & Lacinato Kale',
      category: 'Fresh Vegetables',
      price: '$3.75',
      numericPrice: 3.75,
      unit: 'bunch',
      quantity: 4,
      status: 'Low Stock',
      description: 'Crisp vibrant mineral-rich leafy bunches, cold washed and iced.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rX6QqpjAbOj4aS9tyXHfexwLNZNbzSxXT3wnnRZ2XMSpA3M7N8idUFHiRchav_OFiX0mQuqWd0Z-t9_fUwFZGiWRa-be7DDkZhArudA_GozKGr25dEhHpyZDDvoWZ64z6hyMDey5Sgy9ZMPo0jIoAHHOox4FIup4zjPod4TRo-inqmbqmJZBvCIggYQsqchQqcay4tIPkUr3UN4vh-7SRbi3jh2cpjLmrpd164fewdifDCyYcmgR'
    },
    {
      id: 'p-3',
      name: 'Organic Romanesco Cauliflower',
      category: 'Fresh Vegetables',
      price: '$5.00',
      numericPrice: 5.00,
      unit: 'piece',
      quantity: 16,
      status: 'Available',
      description: 'Fractal geometric lime-green florets with nutty crunch.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQIVndwY6KiYUSQMD2yK4gZjwGqK7C-IrX-yA-8C5c0dHfW8aLwUMJVHKo9lCs7s3TwLOtpGVX8sSjiObmOI5WNhoP2e1xPPZs5wu1uCJmvmB74F2tcpXrGgzHfVIZmuzzSViBWDVpK41SAs5HD0IAR5gSNf6BDZd_dmlJc4Gwr673FRLx3MRB4oHsUSbZR7gGSKtFvj4dkFUFJ4XT1oYBkrmMGHAN0xf7nIB4zZi_rEJD-dPQaonw'
    },
    {
      id: 'p-4',
      name: 'Sweet Italian Genovese Basil',
      category: 'Culinary Herbs',
      price: '$2.50',
      numericPrice: 2.50,
      unit: 'bunch',
      quantity: 0,
      status: 'Sold Out',
      description: 'Aromatic tender leaves perfect for pesto, salads, and culinary garnishes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXHd2qeZZyVt24nGx_Xq1Fy2jmny8L32l94sE8JNxGmwxuopCRVhCsYq_iOfR3qTflEDvlE2SmboghlxiowRxiL6NqML_zvVy5d5SS6KR2u0sGvIK5y9utLfepMYCQTGEv3UdVgZb27cuaIgV7AdP3a2WnfWhkhbwK_W8O0Dp3m-npCw8uFePYK-Qe6hkJYf7KOcUl-eoPuE7PeRtQ-0JsG7Ehk7txuZuAk_u_hdo37rhmMfE6Lo0N'
    },
    {
      id: 'p-5',
      name: 'Japanese Sweet Bell Peppers',
      category: 'Fresh Vegetables',
      price: '$4.00',
      numericPrice: 4.00,
      unit: 'lb',
      quantity: 0,
      status: 'Temporarily Unavailable',
      description: 'Thin-skinned crisp sweet frying peppers. Next harvest ripening in 10 days.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5r9n84_MegsorAvtL8LFeNQKwAvICYTZXDO2fBF1mfiPLmoVq1Ta8OpFGXSUkxXMqQgvaQyQ881mqUuUmEKbJNEtG5X8dZ1gnluHUvRPhIM0mXpv-Km4-fetXUUuDFT2Au2m3EMaAgJKvrHemEvwFhQb4CW8JsL-91uXLXopIthyMsh7W-YFn5bbfWlmd-YSE1_zALoINwkJjYN_Bv2FLdr5o_ZCRBFcuBiGK5h7TXg7Spipjxtud'
    },
    {
      id: 'p-6',
      name: 'Baby Sugar Snap Peas',
      category: 'Fresh Vegetables',
      price: '$4.25',
      numericPrice: 4.25,
      unit: 'basket',
      quantity: 18,
      status: 'Available',
      description: 'Tender sweet edible-pod peas picked fresh at dawn.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCquoPg0yi78P7qTB24IUjOHUxmGNNT3xqn1sx0X4k7uCHChJVDeJoTXYhLF4JZ7rCVX6owMZMAvVses65cLYHpq8D_JSnCx6_n5SuBR_cN9Ig7e6Pzyx8UtDduNIcejXg_yQfQSpKq4AarEkMrquJU_fOCQ-X15j3SO--rDRaodW-OQX2PVWRUjIOjle9GTAhrzzk5huyq7iSSukMQo10eGweK-e0lUrcad1ZNMSQh7eDorA-LKfT'
    }
  ]);

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
      image: product.image
    });
    setIsFormModalOpen(true);
  };

  // Load products from backend
  useEffect(() => {
    farmerApi.getProducts()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p) => {
            const numPrice = Number(p.price) || 0;
            const statusLabel = p.status === 'sold_out' ? 'Sold Out' : (p.stock_quantity <= 5 && p.stock_quantity > 0 ? 'Low Stock' : 'Available');
            return {
              id: p.id,
              name: p.name,
              category: p.category_name || 'Fresh Produce',
              price: `$${numPrice.toFixed(2)}`,
              numericPrice: numPrice,
              unit: p.unit || 'unit',
              quantity: p.stock_quantity ?? 10,
              status: statusLabel,
              description: p.description || '',
              image: p.image || initialFormState.image
            };
          });
          setProducts(mapped);
        }
      })
      .catch((err) => console.warn('Could not load farmer products:', err));
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

    const payload = {
      name: formData.name.trim(),
      price: priceNum,
      unit: formData.unit,
      stock_quantity: qty,
      description: formData.description,
      status: autoStatus === 'Sold Out' ? 'sold_out' : 'available',
      image: formData.image || initialFormState.image
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
                image: formData.image || p.image
              }
            : p
        )
      );
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
        image: formData.image || initialFormState.image
      };
      setProducts([newProd, ...products]);
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
    showToast?.(`Product "${deleteModalProduct.name}" removed from stall.`);
    setDeleteModalProduct(null);
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg animate-fade-in">
      
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
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/30"
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
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 my-8">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    {editingProduct ? 'edit' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface font-bold text-base">
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
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-space-md text-xs">
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heirloom Brandywine Tomatoes"
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  >
                    <option>Fresh Vegetables</option>
                    <option>Culinary Herbs</option>
                    <option>Orchard Fruits</option>
                    <option>Artisan Pantry</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  >
                    <option>Available</option>
                    <option>Low Stock</option>
                    <option>Sold Out</option>
                    <option>Temporarily Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Price, Unit & Quantity */}
              <div className="grid grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Price ($) *</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
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
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface">Qty Available *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Produce Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes on harvesting date, tasting profile, recommended use..."
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Image Upload Placeholder */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface">Product Image</label>
                <div className="p-3 rounded-xl border-2 border-dashed border-outline-variant/60 flex items-center gap-3 bg-surface-container-low">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-outline-variant/40 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-on-surface">Upload fresh harvest photo</span>
                    <span className="text-[11px] text-on-surface-variant">PNG, JPG or WebP up to 5MB</span>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or paste image URL"
                      className="mt-1 p-1 bg-surface-container-lowest rounded text-[11px] border border-outline-variant/30 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                      */}
      {/* ======================================================== */}
      {deleteModalProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40 text-xs">
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
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-error text-on-error font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
