import { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerWithEmail } from "../api/auth.api.js";

// ─── Animation variants ───────────────────────────────────────────────────────

const shake = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

// ─── Password strength ────────────────────────────────────────────────────────

/**
 * Returns a score 0–4 and a label for the given password.
 * 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
 */
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  // Clamp to 4
  score = Math.min(score, 4);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

const strengthConfig = {
  1: { bars: 1, color: "bg-red-400", text: "text-red-500 dark:text-red-400" },
  2: {
    bars: 2,
    color: "bg-amber-400",
    text: "text-amber-500 dark:text-amber-400",
  },
  3: { bars: 3, color: "bg-sky-400", text: "text-sky-500 dark:text-sky-400" },
  4: {
    bars: 4,
    color: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};

function PasswordStrengthBar({ password }) {
  const { score, label } = getPasswordStrength(password);
  if (!password) return null;
  const cfg = strengthConfig[score] ?? strengthConfig[1];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < cfg.bars ? cfg.color : "bg-stone-200 dark:bg-stone-700",
            ].join(" ")}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${cfg.text}`}>{label}</p>
    </motion.div>
  );
}

// ─── Shared primitives (mirrors LoginPage) ────────────────────────────────────

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  hint,
  rightSlot,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-widest uppercase text-stone-500 dark:text-stone-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={[
            "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400",
            "outline-none transition-all duration-200",
            "dark:text-stone-100 dark:placeholder:text-stone-600",
            rightSlot ? "pr-11" : "",
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600 dark:focus:ring-red-700/30"
              : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/60 dark:border-stone-700 dark:focus:border-amber-500 dark:focus:ring-amber-900/40",
          ].join(" ")}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-stone-400 dark:text-stone-500">{hint}</p>
      )}
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

function EyeToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="text-stone-400 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
    >
      {visible ? (
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
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
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

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessPanel({ displayName }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 py-4 text-center"
    >
      {/* Animated checkmark ring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60"
      >
        <svg
          className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <div>
        <h2 className="font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Welcome{displayName ? `, ${displayName.split(" ")[0]}` : ""}!
        </h2>
        <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
          Your account has been created. Redirecting you now…
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-600">
        <Spinner />
        <span>Setting up your workspace</span>
      </div>
    </motion.div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate({
  displayName,
  email,
  password,
  confirmPassword,
  agreedToTerms,
}) {
  const errs = {};

  if (!displayName.trim()) {
    errs.displayName = "Full name is required.";
  } else if (displayName.trim().length < 2) {
    errs.displayName = "Name must be at least 2 characters.";
  }

  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = "Enter a valid email address.";
  }

  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 8) {
    errs.password = "Password must be at least 8 characters.";
  } else if (getPasswordStrength(password).score < 2) {
    errs.password = "Password is too weak. Add uppercase letters or numbers.";
  }

  if (!confirmPassword) {
    errs.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    errs.confirmPassword = "Passwords do not match.";
  }

  if (!agreedToTerms) {
    errs.agreedToTerms = "You must agree to the terms to continue.";
  }

  return errs;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const uid = useId();

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  // ── Field-level clear on change ─────────────────────────────────────────────

  function clearField(field) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (status === "error") setStatus("idle");
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errs = validate({
      displayName,
      email,
      password,
      confirmPassword,
      agreedToTerms,
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      await registerWithEmail(email, password, {
        displayName: displayName.trim(),
      });
      setStatus("success");
      // Give the success animation a moment before navigating
      setTimeout(() => navigate("/dashboard", { replace: true }), 1800);
    } catch (err) {
      setStatus("error");
      setServerError(err.message ?? "Registration failed. Please try again.");
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div initial="hidden" animate="visible" className="w-full">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <SuccessPanel key="success" displayName={displayName} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Create an account
              </h1>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Get started — it only takes a minute.
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
              variants={
                status === "error" && Object.keys(errors).length ? shake : {}
              }
              animate={
                status === "error" && Object.keys(errors).length
                  ? "shake"
                  : undefined
              }
              className="flex flex-col gap-4"
            >
              {/* Full name */}
              <InputField
                id={`${uid}-name`}
                label="Full name"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  clearField("displayName");
                }}
                error={errors.displayName}
                autoComplete="name"
                placeholder="Jane Smith"
              />

              {/* Email */}
              <InputField
                id={`${uid}-email`}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearField("email");
                }}
                error={errors.email}
                autoComplete="email"
                placeholder="you@example.com"
              />

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${uid}-password`}
                  className="text-xs font-medium tracking-widest uppercase text-stone-500 dark:text-stone-400"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id={`${uid}-password`}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearField("password");
                    }}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className={[
                      "w-full rounded-lg border bg-transparent px-4 py-3 pr-11 text-sm text-stone-900 placeholder:text-stone-400",
                      "outline-none transition-all duration-200",
                      "dark:text-stone-100 dark:placeholder:text-stone-600",
                      errors.password
                        ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600 dark:focus:ring-red-700/30"
                        : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/60 dark:border-stone-700 dark:focus:border-amber-500 dark:focus:ring-amber-900/40",
                    ].join(" ")}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <EyeToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                  </div>
                </div>

                {/* Strength bar — only when something is typed */}
                <AnimatePresence>
                  {password && (
                    <PasswordStrengthBar key="strength" password={password} />
                  )}
                </AnimatePresence>

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

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${uid}-confirm`}
                  className="text-xs font-medium tracking-widest uppercase text-stone-500 dark:text-stone-400"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id={`${uid}-confirm`}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearField("confirmPassword");
                    }}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={[
                      "w-full rounded-lg border bg-transparent px-4 py-3 pr-11 text-sm text-stone-900 placeholder:text-stone-400",
                      "outline-none transition-all duration-200",
                      "dark:text-stone-100 dark:placeholder:text-stone-600",
                      errors.confirmPassword
                        ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600 dark:focus:ring-red-700/30"
                        : confirmPassword && confirmPassword === password
                          ? "border-emerald-400 focus:ring-2 focus:ring-emerald-300/40 dark:border-emerald-600 dark:focus:ring-emerald-700/30"
                          : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/60 dark:border-stone-700 dark:focus:border-amber-500 dark:focus:ring-amber-900/40",
                    ].join(" ")}
                  />
                  {/* Match indicator */}
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                    <AnimatePresence>
                      {confirmPassword && confirmPassword === password && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <svg
                            className="h-4 w-4 text-emerald-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <EyeToggle
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                    />
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {errors.confirmPassword && (
                    <motion.p
                      key="confirm-err"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-red-500 dark:text-red-400"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Terms checkbox */}
              <div className="flex flex-col gap-1">
                <label className="flex cursor-pointer items-start gap-3">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      id={`${uid}-terms`}
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        clearField("agreedToTerms");
                      }}
                      className="peer sr-only"
                    />
                    {/* Custom checkbox */}
                    <div
                      className={[
                        "flex h-4 w-4 items-center justify-center rounded border transition-all duration-150",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-stone-400 peer-focus-visible:ring-offset-1",
                        agreedToTerms
                          ? "border-stone-900 bg-stone-900 dark:border-stone-100 dark:bg-stone-100"
                          : errors.agreedToTerms
                            ? "border-red-400 bg-transparent dark:border-red-600"
                            : "border-stone-300 bg-transparent dark:border-stone-600",
                      ].join(" ")}
                    >
                      <AnimatePresence>
                        {agreedToTerms && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                            className="h-2.5 w-2.5 text-white dark:text-stone-900"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-stone-900 underline-offset-2 hover:underline dark:text-stone-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-stone-900 underline-offset-2 hover:underline dark:text-stone-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <AnimatePresence mode="wait">
                  {errors.agreedToTerms && (
                    <motion.p
                      key="terms-err"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-7 text-xs text-red-500 dark:text-red-400"
                    >
                      {errors.agreedToTerms}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 w-full overflow-hidden rounded-lg bg-stone-950 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </motion.form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
              <span className="text-xs text-stone-400">or</span>
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
            </div>

            {/* Login CTA */}
            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-stone-900 underline-offset-2 hover:underline dark:text-stone-100"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal footer */}
      <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-600">
        By creating an account you agree to our{" "}
        <Link
          to="/terms"
          className="underline-offset-2 hover:underline hover:text-stone-600 dark:hover:text-stone-400"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="underline-offset-2 hover:underline hover:text-stone-600 dark:hover:text-stone-400"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}
