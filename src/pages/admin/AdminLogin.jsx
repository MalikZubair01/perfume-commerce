import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminAuthShell from "./layout/AdminAuthShell";

const LoginSchema = Yup.object().shape({
  email: Yup.string().trim().required("Email is required.").email("Enter a valid email address."),
  password: Yup.string().required("Password is required."),
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

function AdminLogin() {
  const { login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

  return (
    <AdminAuthShell
      title="Admin Sign In"
      subtitle="Manage products, stock and orders."
      footer={
        <>
          New here?{" "}
          <Link to="/admin/signup" className="text-gold hover:text-goldLight font-medium">
            Create an admin account
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError("");
          try {
            await login(values.email, values.password);
            navigate(redirectTo, { replace: true });
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
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                placeholder="admin@nkfragrances.com"
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
                  placeholder="••••••••"
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

            <div className="flex justify-end -mt-1">
              <Link
                to="/admin/forgot-password"
                className="text-[12px] text-gold hover:text-goldLight"
              >
                Forgot password?
              </Link>
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
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-600">
              Demo credentials: admin@nkfragrances.com / Admin@123
            </p>
          </Form>
        )}
      </Formik>
    </AdminAuthShell>
  );
}

export default AdminLogin;
