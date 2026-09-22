import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck, KeyRound } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminAuthShell from "./layout/AdminAuthShell";

const EmailSchema = Yup.object().shape({
  email: Yup.string().trim().required("Email is required.").email("Enter a valid email address."),
});

const ResetSchema = Yup.object().shape({
  password: Yup.string()
    .required("New password is required.")
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

function AdminForgotPassword() {
  const { requestPasswordReset, resetPassword } = useAdminAuth();
  const [step, setStep] = useState("request"); // request -> reset -> done
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  if (step === "done") {
    return (
      <AdminAuthShell title="Password Updated" subtitle="You're good to go.">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-gold">
            <KeyRound size={28} />
          </div>
          <p className="text-clamp-body text-zinc-400">
            Your password has been reset successfully. Use your new password
            to sign in.
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

  if (step === "reset") {
    return (
      <AdminAuthShell
        title="Set New Password"
        subtitle={`Choose a new password for ${email}.`}
      >
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={ResetSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError("");
            try {
              await resetPassword(email, values.password);
              setStep("done");
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
                  New Password
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
                  Confirm New Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  className={fieldClass(touched.confirmPassword, errors.confirmPassword)}
                />
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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </AdminAuthShell>
    );
  }

  return (
    <AdminAuthShell
      title="Forgot Password"
      subtitle="Enter your admin email to reset your password."
      footer={
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 text-gold hover:text-goldLight font-medium"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      }
    >
      <Formik
        initialValues={{ email: "" }}
        validationSchema={EmailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError("");
          try {
            await requestPasswordReset(values.email);
            setEmail(values.email);
            setStep("reset");
          } catch (err) {
            setFormError(err.message || "Something went wrong. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="flex flex-col gap-5" noValidate>
            <div className="flex items-start gap-3 rounded-xl border border-gold/15 bg-black/40 p-4 text-[12px] leading-5 text-zinc-400">
              <MailCheck size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                In production this sends a secure reset link to your email.
                For now, verifying your email lets you set a new password
                directly.
              </span>
            </div>

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
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </AdminAuthShell>
  );
}

export default AdminForgotPassword;
