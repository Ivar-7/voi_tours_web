import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigation } from "react-router-dom";

export default function RouteProgress() {
  const navigation = useNavigation();
  const shouldReduceMotion = useReducedMotion();
  const isPending = navigation.state !== "idle";

  return (
    <AnimatePresence>
      {isPending ? (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-brand-100/70 dark:bg-stone-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-brand-500"
            initial={{ x: "-100%" }}
            animate={{ x: shouldReduceMotion ? "0%" : "100%" }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.1,
              ease: "easeInOut",
              repeat: shouldReduceMotion ? 0 : Infinity,
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
