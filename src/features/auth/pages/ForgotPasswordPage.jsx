import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPasswordSchema } from "../schema/auth.schema";
import { useForgotPassword } from "../hooks/useForgotPassword";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

function Background() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-950/40" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-950/30" />
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

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending, isSuccess, isError, error, reset } =
    useForgotPassword();

  function onSubmit(values) {
    mutate(values.email);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <Background />

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
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

        <motion.div
          custom={1}
          variants={fadeUp}
          className="rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-900/80"
        >
          <Link
            to="/auth/login"
            className="mb-4 flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10 12L6 8l4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to sign in
          </Link>

          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Reset password
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            We'll send a reset link to your email address.
          </p>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center dark:border-emerald-800 dark:bg-emerald-950/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <svg
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Check your inbox
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  If an account exists for <strong>{getValues("email")}</strong>
                  , a reset link is on its way.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-6 flex flex-col gap-4"
              >
                {isError ? (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/60 dark:bg-red-950/40">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error?.message ?? "Something went wrong."}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reset-email"
                    className="text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400"
                  >
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email", { onChange: () => reset() })}
                    className={[
                      "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400",
                      "outline-none transition-all duration-200",
                      "dark:text-zinc-100 dark:placeholder:text-zinc-600",
                      errors.email
                        ? "border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-600"
                        : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200/60 dark:border-zinc-700 dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40",
                    ].join(" ")}
                  />
                  {errors.email ? (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full overflow-hidden rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Sending…
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
