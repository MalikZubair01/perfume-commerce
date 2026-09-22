import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";

const ProductSchema = Yup.object().shape({
  name: Yup.string().trim().required("Product name is required."),
  type: Yup.string().trim().required("Category / type is required."),
  price: Yup.number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than 0.")
    .required("Price is required."),
  stock: Yup.number()
    .typeError("Stock must be a number.")
    .min(0, "Stock cannot be negative.")
    .required("Stock quantity is required."),
  badge: Yup.string(),
  sizes: Yup.string(),
  desc: Yup.string().trim().required("A short description is required."),
  image: Yup.string(),
  noteTop: Yup.string(),
  noteHeart: Yup.string(),
  noteBase: Yup.string(),
});

const fieldClass = (touched, error) =>
  `input-gold w-full rounded-xl px-4 py-2.5 text-sm placeholder-zinc-600 ${
    touched && error ? "error" : ""
  }`;

function FieldErrorText({ name }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => <p className="mt-1 text-[11px] text-red-400">{msg}</p>}
    </ErrorMessage>
  );
}

function productToInitialValues(product) {
  if (!product) {
    return {
      name: "",
      type: "",
      price: "",
      stock: "",
      badge: "",
      sizes: "30ml, 50ml, 100ml",
      desc: "",
      image: "",
      noteTop: "",
      noteHeart: "",
      noteBase: "",
    };
  }
  return {
    name: product.name || "",
    type: product.type || "",
    price: product.price ?? "",
    stock: product.stock ?? "",
    badge: product.badge || "",
    sizes: (product.sizes || []).join(", "),
    desc: product.desc || "",
    image: product.images?.[0] || "",
    noteTop: product.notes?.top || "",
    noteHeart: product.notes?.heart || "",
    noteBase: product.notes?.base || "",
  };
}

function ProductFormModal({ open, product, onClose, onSubmit }) {
  const isEdit = !!product;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[4%] z-50 mx-auto max-h-[92vh] w-[92%] max-w-2xl overflow-y-auto rounded-2xl border border-gold/25 bg-[#111] p-6 shadow-2xl shadow-black/60 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-prim text-xl font-bold text-white">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-gold"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <Formik
              enableReinitialize
              initialValues={productToInitialValues(product)}
              validationSchema={ProductSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  name: values.name,
                  type: values.type,
                  price: values.price,
                  stock: values.stock,
                  badge: values.badge,
                  sizes: values.sizes
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  desc: values.desc,
                  images: values.image ? [values.image] : undefined,
                  notes: {
                    top: values.noteTop,
                    heart: values.noteHeart,
                    base: values.noteBase,
                  },
                };
                await onSubmit(payload);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="flex flex-col gap-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Product Name
                      </label>
                      <Field
                        name="name"
                        placeholder="Royal Oud"
                        className={fieldClass(touched.name, errors.name)}
                      />
                      <FieldErrorText name="name" />
                    </div>

                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Category / Type
                      </label>
                      <Field
                        name="type"
                        placeholder="Luxury Perfume"
                        className={fieldClass(touched.type, errors.type)}
                      />
                      <FieldErrorText name="type" />
                    </div>

                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Price (PKR)
                      </label>
                      <Field
                        name="price"
                        type="number"
                        placeholder="4999"
                        className={fieldClass(touched.price, errors.price)}
                      />
                      <FieldErrorText name="price" />
                    </div>

                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Stock Quantity
                      </label>
                      <Field
                        name="stock"
                        type="number"
                        placeholder="20"
                        className={fieldClass(touched.stock, errors.stock)}
                      />
                      <FieldErrorText name="stock" />
                    </div>

                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Badge <span className="text-zinc-600">(optional)</span>
                      </label>
                      <Field
                        name="badge"
                        placeholder="Best Seller"
                        className={fieldClass(touched.badge, errors.badge)}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                        Sizes <span className="text-zinc-600">(comma separated)</span>
                      </label>
                      <Field
                        name="sizes"
                        placeholder="30ml, 50ml, 100ml"
                        className={fieldClass(touched.sizes, errors.sizes)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                      Image URL <span className="text-zinc-600">(optional)</span>
                    </label>
                    <Field
                      name="image"
                      placeholder="/images/products/royal-oud-1.jpg"
                      className={fieldClass(touched.image, errors.image)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      rows={3}
                      name="desc"
                      placeholder="Deep woody oud with warm amber, precious resins..."
                      className={fieldClass(touched.desc, errors.desc)}
                    />
                    <FieldErrorText name="desc" />
                  </div>

                  <div>
                    <p className="mb-2 text-clamp-label uppercase tracking-widest text-zinc-400">
                      Fragrance Notes <span className="text-zinc-600">(optional)</span>
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Field
                        name="noteTop"
                        placeholder="Top: Bergamot"
                        className={fieldClass(false, false)}
                      />
                      <Field
                        name="noteHeart"
                        placeholder="Heart: Rose"
                        className={fieldClass(false, false)}
                      />
                      <Field
                        name="noteBase"
                        placeholder="Base: Musk"
                        className={fieldClass(false, false)}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full border border-gold/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all duration-200 hover:border-gold/50 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-goldLight disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {isEdit ? "Save Changes" : "Add Product"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProductFormModal;
