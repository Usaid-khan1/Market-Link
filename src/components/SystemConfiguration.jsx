import React, { useState } from 'react';

export default function SystemConfiguration({ onNavigate, showToast }) {
  // Categories State
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fresh Vegetables', icon: 'eco', count: 48, active: true },
    { id: 2, name: 'Orchard Fruits', icon: 'nutrition', count: 32, active: true },
    { id: 3, name: 'Artisan Dairy & Cheese', icon: 'egg', count: 18, active: true },
    { id: 4, name: 'Hearth Breads & Baked Goods', icon: 'bakery_dining', count: 24, active: true },
    { id: 5, name: 'Medicinal & Culinary Herbs', icon: 'spa', count: 16, active: true },
    { id: 6, name: 'Raw Honey & Fruit Preserves', icon: 'hive', count: 14, active: true },
    { id: 7, name: 'Foraged Wild Mushrooms', icon: 'psychiatry', count: 9, active: true },
    { id: 8, name: 'Artisan Pantry & Ferments', icon: 'soup_kitchen', count: 22, active: true }
  ]);

  // Announcements State
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Harvest Weekend Inclement Weather Advisory',
      message: 'Light rain anticipated in North River District for Saturday morning. Tents and rain guards mandatory for stalls 1–18.',
      date: 'Oct 18, 2025',
      audience: 'Farmers & Shoppers',
      active: true
    },
    {
      id: 2,
      title: 'Double Up Food Bucks (SNAP) Matching Tokens Expanded',
      message: 'Central token pavilion #1 will have an additional $5,000 in wooden matching currency available starting at 7:30 AM.',
      date: 'Oct 16, 2025',
      audience: 'All Community',
      active: true
    },
    {
      id: 3,
      title: 'Annual Fall Apple & Sweet Cider Festival Sign-Up',
      message: 'Growers can register extra square footage for the Oct 25 special harvest festival pavilion. Applications close Wednesday.',
      date: 'Oct 14, 2025',
      audience: 'Farmers Only',
      active: false
    }
  ]);

  // Category Modals
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = Add, obj = Edit
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [deleteCategoryItem, setDeleteCategoryItem] = useState(null);

  // Announcement Modals
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    audience: 'All Community',
    publishImmediately: true
  });
  const [deleteAnnouncementItem, setDeleteAnnouncementItem] = useState(null);

  // ----------------------------------------------------
  // Category Handlers
  // ----------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryNameInput(cat.name);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name: categoryNameInput.trim() } : c
        )
      );
      showToast?.(`Category updated to "${categoryNameInput.trim()}".`);
    } else {
      const newCat = {
        id: Date.now(),
        name: categoryNameInput.trim(),
        icon: 'category',
        count: 0,
        active: true
      };
      setCategories((prev) => [...prev, newCat]);
      showToast?.(`New category "${categoryNameInput.trim()}" created!`);
    }

    setCategoryModalOpen(false);
    setCategoryNameInput('');
  };

  const handleConfirmDeleteCategory = () => {
    if (!deleteCategoryItem) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteCategoryItem.id));
    showToast?.(`Category "${deleteCategoryItem.name}" deleted.`);
    setDeleteCategoryItem(null);
  };

  // ----------------------------------------------------
  // Announcement Handlers
  // ----------------------------------------------------
  const handleOpenAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: '',
      message: '',
      audience: 'All Community',
      publishImmediately: true
    });
    setAnnouncementModalOpen(true);
  };

  const handleOpenEditAnnouncement = (item) => {
    setEditingAnnouncement(item);
    setAnnouncementForm({
      title: item.title,
      message: item.message,
      audience: item.audience,
      publishImmediately: item.active
    });
    setAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      showToast?.('Please fill out both title and message.');
      return;
    }

    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? {
                ...a,
                title: announcementForm.title.trim(),
                message: announcementForm.message.trim(),
                audience: announcementForm.audience,
                active: announcementForm.publishImmediately
              }
            : a
        )
      );
      showToast?.(`Announcement "${announcementForm.title.trim()}" updated.`);
    } else {
      const newPost = {
        id: Date.now(),
        title: announcementForm.title.trim(),
        message: announcementForm.message.trim(),
        date: 'Today',
        audience: announcementForm.audience,
        active: announcementForm.publishImmediately
      };
      setAnnouncements((prev) => [newPost, ...prev]);
      showToast?.(`Announcement broadcasted live!`);
    }

    setAnnouncementModalOpen(false);
  };

  const handleToggleAnnouncementActive = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = !a.active;
          showToast?.(`Announcement "${a.title}" is now ${next ? 'Active' : 'Inactive'}.`);
          return { ...a, active: next };
        }
        return a;
      })
    );
  };

  const handleConfirmDeleteAnnouncement = () => {
    if (!deleteAnnouncementItem) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== deleteAnnouncementItem.id));
    showToast?.(`Announcement "${deleteAnnouncementItem.title}" deleted.`);
    setDeleteAnnouncementItem(null);
  };

  return (
    <div className="px-gutter py-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-xl animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-xs">
          <span>PORTAL</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">SYSTEM CONFIGURATION</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg sm:text-3xl text-on-surface tracking-tight font-bold">
          System Configuration
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
          Manage platform-wide settings, configure taxonomy categories, and broadcast platform notices.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: PRODUCT CATEGORIES                           */}
      {/* ======================================================== */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/20 pb-space-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-lg">
                Product Categories
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Classification tags used by growers when listing produce in weekly catalogs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Category</span>
          </button>
        </div>

        {/* Categories Table / List */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-3 px-space-md" scope="col">Category Name</th>
                <th className="py-3 px-space-md" scope="col">Icon Tag</th>
                <th className="py-3 px-space-md" scope="col">Catalog Items Listed</th>
                <th className="py-3 px-space-md" scope="col">Status</th>
                <th className="py-3 px-space-md text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 text-on-surface text-xs">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-low/60 transition-colors">
                  {/* Category Name */}
                  <td className="py-3.5 px-space-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                      </div>
                      <span className="font-bold text-on-surface text-[13px]">{cat.name}</span>
                    </div>
                  </td>

                  {/* Icon */}
                  <td className="py-3.5 px-space-md font-mono text-[11px] text-on-surface-variant">
                    {cat.icon}
                  </td>

                  {/* Count */}
                  <td className="py-3.5 px-space-md">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-[11px] font-bold text-on-surface">
                      {cat.count} produce items
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-space-md">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold bg-primary-fixed text-on-primary-fixed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Active
                    </span>
                  </td>

                  {/* Actions (Edit and Delete) */}
                  <td className="py-3.5 px-space-md text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                        title="Edit Category Name"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCategoryItem(cat)}
                        className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: PLATFORM ANNOUNCEMENTS                       */}
      {/* ======================================================== */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/20 pb-space-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface font-bold text-lg">
                Platform Announcements
              </h2>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Broadcast system notices, weather advisories, and token program updates to portal users
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddAnnouncement}
            className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-tertiary-container text-on-tertiary font-label-md text-xs font-bold hover:bg-tertiary transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>+ New Announcement</span>
          </button>
        </div>

        {/* Announcements List */}
        <div className="flex flex-col gap-space-sm">
          {announcements.length === 0 ? (
            <div className="py-10 text-center text-on-surface-variant text-xs">
              No platform announcements currently scheduled.
            </div>
          ) : (
            announcements.map((post) => (
              <div
                key={post.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md ${
                  post.active
                    ? 'bg-surface-container-low border-outline-variant/30 hover:border-primary/50'
                    : 'bg-surface-container/40 border-outline-variant/20 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      post.active
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {post.active ? 'volume_up' : 'volume_off'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-[14px] font-bold text-on-surface">
                        {post.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-[10px] font-bold text-on-surface">
                        {post.audience}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        • {post.date}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 max-w-3xl">
                      {post.message}
                    </p>
                  </div>
                </div>

                {/* Right Action Controls: Toggle Switch + Edit + Delete */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                    <span className="text-[11px] text-on-surface-variant">
                      {post.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={post.active}
                      onClick={() => handleToggleAnnouncementActive(post.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        post.active ? 'bg-primary' : 'bg-outline-variant'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          post.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <div className="h-4 w-px bg-outline-variant/40 mx-1"></div>

                  {/* Edit Icon */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditAnnouncement(post)}
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                    title="Edit Announcement"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </button>

                  {/* Delete Icon */}
                  <button
                    type="button"
                    onClick={() => setDeleteAnnouncementItem(post)}
                    className="p-1.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY                              */}
      {/* ======================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-space-md text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface">Category Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="e.g. Foraged Mushrooms, Artisan Cider..."
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CATEGORY CONFIRMATION                     */}
      {/* ======================================================== */}
      {deleteCategoryItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] text-error">warning</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  Delete Category?
                </h3>
              </div>
            </div>

            <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
              Are you sure you want to delete <strong className="text-on-surface">{deleteCategoryItem.name}</strong>? Existing products mapped to this category may require re-tagging.
            </p>

            <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => setDeleteCategoryItem(null)}
                className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-space-md py-2 rounded-xl bg-error text-on-error font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT ANNOUNCEMENT                          */}
      {/* ======================================================== */}
      {announcementModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                </div>
                <h3 className="font-headline-sm text-on-surface font-bold text-base">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Platform Announcement'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAnnouncementModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-space-md text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="e.g. SNAP Token Booth 1 Update"
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Audience *</label>
                <select
                  value={announcementForm.audience}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, audience: e.target.value })}
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                >
                  <option>All Community</option>
                  <option>Farmers Only</option>
                  <option>Shoppers Only</option>
                  <option>Farmers &amp; Shoppers</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  placeholder="Type announcement message details for growers or visitors..."
                  className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Publish immediately toggle */}
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Publish Immediately</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Make this announcement active right away
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={announcementForm.publishImmediately}
                  onClick={() =>
                    setAnnouncementForm({
                      ...announcementForm,
                      publishImmediately: !announcementForm.publishImmediately
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    announcementForm.publishImmediately ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      announcementForm.publishImmediately ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-xl bg-tertiary-container text-on-tertiary font-bold hover:bg-tertiary shadow-sm cursor-pointer"
                >
                  {editingAnnouncement ? 'Save Announcement' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE ANNOUNCEMENT CONFIRMATION                 */}
      {/* ======================================================== */}
      {deleteAnnouncementItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/40">
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] text-error">delete_forever</span>
              </div>
              <h3 className="font-headline-sm text-on-surface font-bold text-base">
                Delete Announcement?
              </h3>
            </div>

            <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
              Are you sure you want to permanently delete broadcast <strong className="text-on-surface">"{deleteAnnouncementItem.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/20 text-xs">
              <button
                type="button"
                onClick={() => setDeleteAnnouncementItem(null)}
                className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAnnouncement}
                className="px-space-md py-2 rounded-xl bg-error text-on-error font-bold cursor-pointer"
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
