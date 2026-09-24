// src/api/categories.api.js
import axiosInstance from "./axiosInstance";

const normalizeCategory = (c) => ({
  id: c.slug,
  _id: c._id,
  name: c.name,
  slug: c.slug,
  description: c.description || "",
  image: c.image?.url || null,
  isActive: c.isActive,
});

// GET /api/categories
export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories");
  return (data.categories || []).map(normalizeCategory);
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/categories/${slug}`);
  return normalizeCategory(data.category);
};

// POST /api/categories  (admin) — imageFile is optional (File object)
export const createCategory = async ({ name, description, imageFile }) => {
  const form = new FormData();
  form.append("name", name);
  if (description) form.append("description", description);
  if (imageFile) form.append("image", imageFile);

  const { data } = await axiosInstance.post("/categories", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeCategory(data.category);
};

// PUT /api/categories/:id  (admin)
export const updateCategory = async (id, { name, description, isActive, imageFile }) => {
  const form = new FormData();
  if (name !== undefined) form.append("name", name);
  if (description !== undefined) form.append("description", description);
  if (isActive !== undefined) form.append("isActive", isActive);
  if (imageFile) form.append("image", imageFile);

  const { data } = await axiosInstance.put(`/categories/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeCategory(data.category);
};

// DELETE /api/categories/:id  (admin)
export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};
