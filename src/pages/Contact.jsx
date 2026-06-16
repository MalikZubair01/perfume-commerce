import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  message: "",
};

const validators = {
  name: (v) => (!v.trim() ? "Name is required." : ""),
  email: (v) =>
    !v.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "Enter a valid email address."
        : "",
  mobile: (v) =>
    !v.trim()
      ? "Mobile number is required."
      : !/^[\d\s\+\-\(\)]{7,15}$/.test(v)
        ? "Enter a valid mobile number."
        : "",
  address: (v) => (!v.trim() ? "Address is required." : ""),
  message: (v) =>
    !v.trim()
      ? "Message is required."
      : v.trim().length < 10
        ? "Message must be at least 10 characters."
        : "",
};

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-[11px] text-red-400"
    >
      {msg}
    </motion.p>
  );
}

function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (fields = form) => {
    const errs = {};
    Object.keys(validators).forEach((k) => {
      const msg = validators[k](fields[k] || "");
      if (msg) errs[k] = msg;
    });
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(initialForm).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
      setTouched({});
      setErrors({});
    }
  };

  const inputClass = (name) =>
    `input-gold w-full rounded-xl px-4 py-3 text-sm placeholder-zinc-600 ${
      touched[name] && errors[name] ? "error" : ""
    }`;

  return (
    <section id="contact" className="scroll-mt-20 py-28 px-4 bg-[#0d0d0d]">
      <div className="container-main" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-clamp-label uppercase tracking-[0.5em] text-gold text-center"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-prim text-clamp-section font-bold tracking-wide text-white text-center mt-3"
        >
          Contact <span className="text-gold italic">Us</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <p className="text-clamp-body text-zinc-300 leading-8">
              For orders, wholesale deals, perfume customization, or simply to
              learn more about our collections — we'd love to hear from you.
            </p>

            {[
              {
                icon: <Mail size={18} />,
                label: "Email",
                value: "malikzubairmaqsood@gmail.com",
              },
              {
                icon: <Phone size={18} />,
                label: "Phone",
                value: "+92 3217523032",
              },
              {
                icon: <MapPin size={18} />,
                label: "Address",
                value: "Lahore, Pakistan",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-gold/15 bg-[#111] p-4 hover:border-gold/40 transition-colors duration-300"
              >
                <span className="mt-0.5 text-gold">{item.icon}</span>
                <div>
                  <p className="text-clamp-label uppercase tracking-widest text-gold/70 mb-1">
                    {item.label}
                  </p>
                  <p className="text-clamp-body text-zinc-300">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full rounded-2xl border border-gold/30 bg-[#111] p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="font-prim text-2xl font-bold text-gold mb-3">
                  Message Sent!
                </h3>
                <p className="text-clamp-body text-zinc-400">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2 border border-gold text-gold text-sm uppercase tracking-widest rounded-full hover:bg-gold/10 transition-all duration-200"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-gold/20 bg-[#111] p-8 flex flex-col gap-5"
              >
                {/* Name */}
                <div>
                  <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                    Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    className={inputClass("name")}
                  />
                  <FieldError msg={touched.name && errors.name} />
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                      Email <span className="text-gold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      className={inputClass("email")}
                    />
                    <FieldError msg={touched.email && errors.email} />
                  </div>
                  <div>
                    <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                      Mobile <span className="text-gold">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+92 300 0000000"
                      className={inputClass("mobile")}
                    />
                    <FieldError msg={touched.mobile && errors.mobile} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                    Address <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your delivery address"
                    className={inputClass("address")}
                  />
                  <FieldError msg={touched.address && errors.address} />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-clamp-label uppercase tracking-widest text-zinc-400 mb-2">
                    Message <span className="text-gold">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us about your requirements..."
                    rows={5}
                    className={`${inputClass("message")} resize-none`}
                  />
                  <FieldError msg={touched.message && errors.message} />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
