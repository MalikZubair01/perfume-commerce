import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPKR } from "../../data/products";

const DELIVERY_CHARGE = 250;
const FREE_DELIVERY_THRESHOLD = 5000;
const JAZZCASH_NUMBER = "0321 7523032";
const JAZZCASH_ACCOUNT_NAME = "N&K Fragrances";

const CheckoutSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Full name is required."),
  mobile: Yup.string()
    .trim()
    .required("Mobile number is required.")
    .matches(/^(\+92|0)?3\d{9}$/, "Enter a valid Pakistani mobile number."),
  email: Yup.string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  address: Yup.string().trim().required("Complete address is required."),
  city: Yup.string().trim().required("City is required."),
  postalCode: Yup.string()
    .trim()
    .required("Postal code is required.")
    .matches(/^\d{4,6}$/, "Enter a valid postal code."),
  notes: Yup.string(),
  paymentMethod: Yup.string().oneOf(["jazzcash", "cod"]).required(),
});

const fieldClass = (touched, error) =>
  `input-gold w-full rounded-xl px-4 py-3 text-sm placeholder-zinc-600 ${
    touched && error ? "error" : ""
  }`;

function FieldErrorText({ name }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => <p className="mt-1 text-[11px] text-red-400">{msg}</p>}
    </ErrorMessage>
  );
}

function Checkout() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  if (items.length === 0 && !orderPlaced) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
        <h2 className="font-prim text-3xl font-bold text-white">
          Nothing to <span className="text-gold italic">Checkout</span>
        </h2>
        <p className="mt-3 text-zinc-400 max-w-sm">
          Your cart is empty. Add a few fragrances before heading to checkout.
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300"
        >
          Explore Collection
        </Link>
      </section>
    );
  }

  if (orderPlaced) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={36} className="text-gold" />
        </motion.div>
        <h2 className="font-prim text-3xl font-bold text-white">
          Order <span className="text-gold italic">Confirmed!</span>
        </h2>
        <p className="mt-3 text-zinc-400 max-w-md">
          Thank you for your purchase. We've received your order and will reach out shortly to confirm delivery details.
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="container-main">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors duration-200 mb-8 w-fit"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="font-prim text-clamp-section font-bold text-white mb-10">
          <span className="text-gold italic">Checkout</span>
        </h1>

        <Formik
          initialValues={{
            fullName: "",
            mobile: "",
            email: "",
            address: "",
            city: "",
            postalCode: "",
            notes: "",
            paymentMethod: "cod",
          }}
          validationSchema={CheckoutSchema}
          onSubmit={async (values, { setSubmitting }) => {
            // Simulate order placement (no backend wired up yet).
            await new Promise((res) => setTimeout(res, 1200));
            setSubmitting(false);
            setOrderPlaced(true);
            clearCart();
          }}
        >
          {({ values, touched, errors, isSubmitting, setFieldValue }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-10" noValidate>
              {/* Left: form */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Customer info */}
                <div className="rounded-2xl border border-gold/20 bg-[#111] p-8">
                  <h2 className="font-prim text-xl font-bold text-white mb-6">
                    Customer Information
                  </h2>

                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <Field
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        className={fieldClass(touched.fullName, errors.fullName)}
                      />
                      <FieldErrorText name="fullName" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                          Mobile Number <span className="text-gold">*</span>
                        </label>
                        <Field
                          name="mobile"
                          type="tel"
                          placeholder="+92 300 0000000"
                          className={fieldClass(touched.mobile, errors.mobile)}
                        />
                        <FieldErrorText name="mobile" />
                      </div>
                      <div>
                        <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                          Email Address <span className="text-gold">*</span>
                        </label>
                        <Field
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className={fieldClass(touched.email, errors.email)}
                        />
                        <FieldErrorText name="email" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                        Complete Address <span className="text-gold">*</span>
                      </label>
                      <Field
                        name="address"
                        type="text"
                        placeholder="House #, Street, Area"
                        className={fieldClass(touched.address, errors.address)}
                      />
                      <FieldErrorText name="address" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                          City <span className="text-gold">*</span>
                        </label>
                        <Field
                          name="city"
                          type="text"
                          placeholder="Lahore"
                          className={fieldClass(touched.city, errors.city)}
                        />
                        <FieldErrorText name="city" />
                      </div>
                      <div>
                        <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                          Postal Code <span className="text-gold">*</span>
                        </label>
                        <Field
                          name="postalCode"
                          type="text"
                          placeholder="54000"
                          className={fieldClass(touched.postalCode, errors.postalCode)}
                        />
                        <FieldErrorText name="postalCode" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                        Order Notes <span className="text-zinc-600">(Optional)</span>
                      </label>
                      <Field
                        as="textarea"
                        name="notes"
                        rows={4}
                        placeholder="Any special instructions for your order..."
                        className={`${fieldClass(touched.notes, errors.notes)} resize-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="rounded-2xl border border-gold/20 bg-[#111] p-8">
                  <h2 className="font-prim text-xl font-bold text-white mb-6">
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFieldValue("paymentMethod", "jazzcash")}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                        values.paymentMethod === "jazzcash"
                          ? "border-gold bg-gold/10"
                          : "border-gold/15 hover:border-gold/40"
                      }`}
                    >
                      <Smartphone size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">JazzCash</p>
                        <p className="text-xs text-zinc-500">Mobile wallet transfer</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFieldValue("paymentMethod", "cod")}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                        values.paymentMethod === "cod"
                          ? "border-gold bg-gold/10"
                          : "border-gold/15 hover:border-gold/40"
                      }`}
                    >
                      <Truck size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">Cash on Delivery</p>
                        <p className="text-xs text-zinc-500">Pay when it arrives</p>
                      </div>
                    </button>
                  </div>

                  {values.paymentMethod === "jazzcash" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 rounded-xl border border-gold/20 bg-black/40 p-5 overflow-hidden"
                    >
                      <p className="text-clamp-label uppercase tracking-widest text-gold mb-3">
                        JazzCash Payment Instructions
                      </p>
                      <ul className="text-sm text-zinc-300 space-y-2 leading-7">
                        <li>
                          1. Send <span className="text-gold font-semibold">{formatPKR(total)}</span> via JazzCash to the number below.
                        </li>
                        <li>
                          2. Account Title:{" "}
                          <span className="text-gold font-semibold">{JAZZCASH_ACCOUNT_NAME}</span>
                        </li>
                        <li>
                          3. JazzCash Number:{" "}
                          <span className="text-gold font-semibold">{JAZZCASH_NUMBER}</span>
                        </li>
                        <li>4. Keep the transaction screenshot — our team will confirm your order via call or WhatsApp.</li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: order summary */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-gold/20 bg-[#111] p-6 sticky top-24">
                  <h3 className="font-prim text-xl font-bold text-white mb-5">
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gold/10 bg-black/40 shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">
                            {item.size ? `${item.size} · ` : ""}Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm text-gold font-medium shrink-0">
                          {formatPKR(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-5 border-t border-gold/10 flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Items ({itemCount})</span>
                      <span className="text-zinc-200">{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Delivery Charges</span>
                      <span className="text-zinc-200">
                        {delivery === 0 ? "Free" : formatPKR(delivery)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gold/10 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium">Grand Total</span>
                    <span className="text-xl font-bold text-gold">{formatPKR(total)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default Checkout;
