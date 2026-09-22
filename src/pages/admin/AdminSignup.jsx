import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminAuthShell from "./layout/AdminAuthShell";

const SignupSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name is required."),
  email: Yup.string().trim().required("Email is required.").email("Enter a valid email address."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
  confirmPassword: Yup.string()
    .required("Please confirm your password.")
    .oneOf([Yup.ref("password")], "Passwords do not match."),
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

function AdminSignup() {
  const { signup } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  if (success) {
    return (
      <AdminAuthShell title="Account Created" subtitle="You're all set.">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-gold">
            <CheckCircle2 size={30} />
          </div>
          <p className="text-clamp-body text-zinc-400">
            Your admin account has been created. You can now sign in to manage
            products, stock and orders.
          </p>
          <Link
            to="/admin/login"
            className="mt-2 w-full rounded-full bg-gold px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-goldLight"
          >
            Go to Sign In
          </Link>
        </div>
      </AdminAuthShell>
    );
  }

  return (
    <AdminAuthShell
      title="Create Admin Account"
      subtitle="Get access to the store dashboard."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/admin/login" className="text-gold hover:text-goldLight font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError("");
          try {
            await signup(values);
            setSuccess(true);
          } catch (err) {
            setFormError(err.message || "Something went wrong. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="flex flex-col gap-5" noValidate>
            <div>
              <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                Full Name
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Your name"
                className={fieldClass(touched.name, errors.name)}
              />
              <FieldErrorText name="name" />
            </div>

            <div>
              <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                placeholder="you@nkfragrances.com"
                className={fieldClass(touched.email, errors.email)}
              />
              <FieldErrorText name="email" />
            </div>

            <div>
              <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  className={`${fieldClass(touched.password, errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-gold"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldErrorText name="password" />
            </div>

            <div>
              <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
                Confirm Password
              </label>
              <div className="relative">
                <Field
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className={`${fieldClass(touched.confirmPassword, errors.confirmPassword)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-gold"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldErrorText name="confirmPassword" />
            </div>

            {formError && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-goldLight disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </AdminAuthShell>
  );
}

export default AdminSignup;
