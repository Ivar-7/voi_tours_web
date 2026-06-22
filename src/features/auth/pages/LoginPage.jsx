import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginWithEmail } from "../api/auth.api.js";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const shake = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400",
          "outline-none transition-all duration-200",
          "dark:text-zinc-100 dark:placeholder:text-zinc-600",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600 dark:focus:ring-red-700/30"
            : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-700 dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40",
        ].join(" ")}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spinner({ size = "sm" }) {
  const cls = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg
      className={`${cls} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Decorative background ────────────────────────────────────────────────────

function Background() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Top-right orb */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-950/40" />
      {/* Bottom-left orb */}
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-950/30" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [serverError, setServerError] = useState("");

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Minimum 6 characters.";
    return errs;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setStatus("error");
      setServerError(err.message ?? "Sign in failed. Please try again.");
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <Background />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo / wordmark */}
        <motion.div
          custom={0}
          variants={fadeUp}
          className="mb-8 flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
            <svg
              className="h-4 w-4 text-white dark:text-zinc-900"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM8 7a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Savanna Crown
          </span>
        </motion.div>

        {/* Panel */}
        <motion.div
          custom={1}
          variants={fadeUp}
          className="rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-900/80"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Welcome back
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Sign in to continue to your workspace.
                  </p>
                </div>

                {/* Server error banner */}
                <AnimatePresence>
                  {status === "error" && serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/60 dark:bg-red-950/40"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v3a1 1 0 01-2 0V9zm1 7a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 16z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {serverError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  variants={status === "error" ? shake : {}}
                  animate={status === "error" ? "shake" : undefined}
                  className="flex flex-col gap-4"
                >
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: "" }));
                      setStatus("idle");
                    }}
                    error={errors.email}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400"
                      >
                        Password
                      </label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-zinc-700 hover:underline dark:hover:text-zinc-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((p) => ({ ...p, password: "" }));
                          setStatus("idle");
                        }}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className={[
                          "w-full rounded-lg border bg-transparent px-4 py-3 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400",
                          "outline-none transition-all duration-200",
                          "dark:text-zinc-100 dark:placeholder:text-zinc-600",
                          errors.password
                            ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600"
                            : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-700 dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40",
                        ].join(" ")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        {showPassword ? (
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                          >
                            <path
                              d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.password && (
                        <motion.p
                          key="pwd-err"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-500 dark:text-red-400"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-1 w-full overflow-hidden rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Spinner /> Signing in…
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </motion.form>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                  <span className="text-xs text-zinc-400">or</span>
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {/* Register CTA */}
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
                  >
                    Create one
                  </Link>
                </p>
          </motion.div>
        </motion.div>

        {/* Legal footer */}
        <motion.p
          custom={2}
          variants={fadeUp}
          className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600"
        >
          By signing in you agree to our{" "}
          <Link
            to="/terms"
            className="underline-offset-2 hover:underline hover:text-zinc-600 dark:hover:text-zinc-400"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline-offset-2 hover:underline hover:text-zinc-600 dark:hover:text-zinc-400"
          >
            Privacy Policy
          </Link>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}
