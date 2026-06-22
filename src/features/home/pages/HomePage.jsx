import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useDestinations } from "@features/destinations/hooks/useDestinations";
import { usePackages } from "@features/packages/hooks/usePackages";
import {
  formatCurrency,
  formatDuration,
  getMinPrice,
} from "@features/packages/utils/packages.utils";
import InquiryForm from "@features/inquiries/components/InquiryForm";
import InquirySuccessMessage from "@features/inquiries/components/InquirySuccessMessage";
import HomepageReviewsCarousel from "@features/reviews/components/HomepageReviewsCarousel";

// ─── Design tokens (mirrored as Tailwind arbitrary values where needed) ────────
// Primary:   amber-800 / amber-600 / amber-400  (savanna gold)
// Secondary: stone-900 / stone-800 / stone-100  (earth)
// Accent:    emerald-700 / emerald-500          (savanna green)

// ─── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
  }),
};

function useSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <path
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="9 22 9 12 15 12 15 22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Hotel Bookings",
    desc: "Curated lodges, beach resorts, and bush camps from budget to ultra-luxury.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
        <path
          d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Tour Packages",
    desc: "Custom itineraries for individuals, families, schools, and corporates.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <path
          d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Safaris & Adventures",
    desc: "Tsavo, Amboseli, Maasai Mara — wildlife drives, hiking, and beach escapes.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012.1 8.18 2 2 0 014.11 6h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 13.9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 20.92z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "SGR Transfers",
    desc: "Seamless pick-up and drop-off between SGR stations, airports, and hotels.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <path
          d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" />
      </svg>
    ),
    title: "Events Planning",
    desc: "Conferences, weddings, retreats, and corporate tourism expos managed end-to-end.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-7 w-7"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" />
        <path
          d="M16 8h4l3 4v5h-7V8z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Door-to-Door Delivery",
    desc: "Parcels, shopping products, and logistics support delivered across Kenya.",
  },
];

// ─── Shared primitives ─────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
      <span className="h-px w-6 bg-amber-500" />
      {children}
    </span>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────────

function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1600&q=85"
          alt="Savanna landscape at sunrise"
          onLoad={() => setImgLoaded(true)}
          className={[
            "h-full w-full object-cover transition-opacity duration-1000",
            imgLoaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        {/* Multi-layer overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
      </div>

      {/* Decorative grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/50 bg-amber-600/20 backdrop-blur-sm">
            <svg
              className="h-5 w-5 text-amber-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                strokeLinecap="round"
              />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
              <path
                d="M9 9h.01M15 9h.01"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-serif text-sm font-bold tracking-wide text-white">
              Savanna Crown
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-amber-400/80">
              Tours & Travel
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: "Services", to: "#services" },
            { label: "Destinations", to: "/destinations" },
            { label: "Packages", to: "/packages" },
            { label: "Inquire", to: "/inquiry" },
          ].map((item) =>
            item.to.startsWith("#") ? (
              <a
                key={item.label}
                href={item.to}
                className="text-sm font-medium text-stone-200 transition-colors hover:text-amber-400"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-stone-200 transition-colors hover:text-amber-400"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <Link
          to="/dashboard/book/safari"
          className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-500 active:scale-95"
        >
          Book Now
        </Link>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-24 pt-12 md:px-12 lg:px-20">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div custom={0} variants={fadeUp}>
            <SectionLabel>Voi Town, Kenya</SectionLabel>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mt-5 font-serif text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Wild Kenya,{" "}
            <em className="not-italic text-amber-400">Beautifully</em> Explored.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg"
          >
            From Tsavo's red elephants to Diani's turquoise coast — Savanna
            Crown delivers unforgettable safaris, seamless transfers, and
            tailor-made travel experiences across East Africa.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/packages"
              className="group flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-all duration-200 hover:bg-amber-500 active:scale-95"
            >
              Explore Packages
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-95"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 2.049.541 3.972 1.487 5.638L0 23l6.073-1.462A11.45 11.45 0 0011.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0zm0 21.046a9.513 9.513 0 01-4.86-1.332l-.35-.207-3.604.867.9-3.508-.228-.361A9.518 9.518 0 011.954 11.5c0-5.267 4.279-9.546 9.546-9.546S21.046 6.233 21.046 11.5s-4.279 9.546-9.546 9.546z" />
              </svg>
              WhatsApp Us
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-stone-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Section: Stats ────────────────────────────────────────────────────────────

function Stats({ destinationsCount, packagesCount }) {
  const { ref, inView } = useSection();

  const stats = [
    { value: `${destinationsCount}+`, label: "Destinations" },
    { value: String(packagesCount), label: "Safari Packages" },
    { value: "24/7", label: "Support" },
    { value: "100%", label: "Tailor-Made" },
  ];

  return (
    <section ref={ref} className="relative bg-amber-600 py-16">
      {/* Diagonal edge top */}
      <div className="diagonal-edge absolute -top-8 left-0 right-0 h-8 bg-amber-600" />

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="font-serif text-4xl font-bold text-white md:text-5xl">
              {s.value}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-100/80">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Services ─────────────────────────────────────────────────────────

function Services() {
  const { ref, inView } = useSection();
  return (
    <section
      id="services"
      ref={ref}
      className="bg-stone-50 py-24 dark:bg-stone-950"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 flex flex-col gap-4"
        >
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 md:text-5xl">
            All-in-one travel services
          </h2>
          <p className="max-w-xl text-base text-stone-500 dark:text-stone-400">
            One company, every need. From the first booking to the final
            drop-off, we handle it all.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 transition-shadow duration-300 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
            >
              {/* Hover accent */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-amber-500 transition-transform duration-300 group-hover:scale-x-100" />

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                {svc.icon}
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-stone-900 dark:text-stone-50">
                {svc.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Featured Destinations ───────────────────────────────────────────

function FeaturedDestinations({ destinations }) {
  const { ref, inView } = useSection();
  const [active, setActive] = useState(0);

  if (!destinations.length) return null;

  return (
    <section ref={ref} className="bg-stone-900 py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 flex flex-col gap-4"
        >
          <SectionLabel>Top Destinations</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
              Where will you
              <br />
              go next?
            </h2>
            <Link
              to="/destinations"
              className="group flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              View all
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Desktop: large grid */}
        <motion.div
          custom={1}
          variants={fadeIn}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="hidden grid-cols-4 gap-3 lg:grid"
        >
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              onMouseEnter={() => setActive(i)}
              className={[
                "group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500",
                active === i ? "col-span-2" : "col-span-1",
              ].join(" ")}
              style={{ height: 420 }}
            >
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
              {dest.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-serif text-xl font-bold text-white">
                  {dest.name}
                </p>
                <p className="mt-1 text-sm text-stone-300">{dest.tagline}</p>
                <div
                  className={[
                    "mt-3 overflow-hidden transition-all duration-300",
                    active === i ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
                  ].join(" ")}
                >
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                  >
                    Explore <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mobile: vertical stack */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className="group relative block overflow-hidden rounded-2xl"
              style={{ height: 260 }}
            >
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 to-transparent" />
              {dest.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-serif text-lg font-bold text-white">
                  {dest.name}
                </p>
                <p className="text-sm text-stone-300">{dest.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Featured Packages ────────────────────────────────────────────────

function FeaturedPackages({ packages }) {
  const { ref, inView } = useSection();

  if (!packages.length) return null;

  return (
    <section ref={ref} className="bg-stone-50 py-24 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 flex flex-col gap-4"
        >
          <SectionLabel>Safari Packages</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 md:text-5xl">
              Ready-made
              <br />
              adventures
            </h2>
            <Link
              to="/packages"
              className="group flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400"
            >
              All packages
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {packages.map((pkg, i) => {
            const minPrice = getMinPrice(pkg.pricing);

            return (
              <motion.article
                key={pkg.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pkg.hero_image}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-amber-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {formatDuration(pkg.duration_days)}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
                    {pkg.title}
                  </h3>

                  <ul className="mt-4 flex flex-col gap-2">
                    {(pkg.highlights || []).slice(0, 4).map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400"
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                          <svg
                            className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                          Starting from
                        </p>
                        <p className="font-serif text-xl font-bold text-amber-600 dark:text-amber-400">
                          {minPrice
                            ? `From ${formatCurrency(minPrice.price, minPrice.currency)}`
                            : "Price on request"}
                        </p>
                      </div>
                      <Link
                        to={`/dashboard/book/safari?package=${pkg.slug}`}
                        className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-600 active:scale-95 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-amber-500"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Testimonials ─────────────────────────────────────────────────────

function Testimonials() {
  const { ref, inView } = useSection();
  return (
    <section ref={ref} className="relative overflow-hidden bg-amber-950 py-24">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=40"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-amber-950/80" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 flex flex-col items-center gap-4 text-center"
        >
          <SectionLabel>Client Stories</SectionLabel>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-amber-50 md:text-5xl">
            Heard from our travelers
          </h2>
        </motion.div>

        <HomepageReviewsCarousel />
      </div>
    </section>
  );
}

// ─── Section: Inquiry CTA ──────────────────────────────────────────────────────

function InquiryCta() {
  const { ref, inView } = useSection();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section ref={ref} className="bg-stone-50 py-24 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <SectionLabel>Get in Touch</SectionLabel>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 md:text-5xl">
              Plan your
              <br />
              dream safari
            </h2>
            <p className="text-base leading-relaxed text-stone-500 dark:text-stone-400">
              Send us an inquiry and our team in Voi Town will craft a
              personalised itinerary for you within 24 hours.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: "📍",
                  label: "Location",
                  value: "Voi Town, Taita Taveta County, Kenya",
                },
                {
                  icon: "✉️",
                  label: "Email",
                  value: "info@savannacrowntours.com",
                },
                {
                  icon: "🌐",
                  label: "Website",
                  value: "www.savannacrowntours.com",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.5 0C5.149 0 0 5.149 0 11.5c0 2.049.541 3.972 1.487 5.638L0 23l6.073-1.462A11.45 11.45 0 0011.5 23C17.851 23 23 17.851 23 11.5S17.851 0 11.5 0zm0 21.046a9.513 9.513 0 01-4.86-1.332l-.35-.207-3.604.867.9-3.508-.228-.361A9.518 9.518 0 011.954 11.5c0-5.267 4.279-9.546 9.546-9.546S21.046 6.233 21.046 11.5s-4.279 9.546-9.546 9.546z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right: form */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg dark:border-stone-800 dark:bg-stone-900"
          >
            {submitted ? (
              <InquirySuccessMessage />
            ) : (
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50">
                  Send an enquiry
                </h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  Tell us about your dream trip.
                </p>
                <div className="mt-5">
                  <InquiryForm onSuccess={() => setSubmitted(true)} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 px-6 py-12 dark:border-stone-800 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/40 bg-amber-600/20">
                <svg
                  className="h-5 w-5 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    strokeLinecap="round"
                  />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                  <path
                    d="M9 9h.01M15 9h.01"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-white">
                  Savanna Crown
                </p>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70">
                  Tours & Travel
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              Voi Town, Taita Taveta County — your gateway to Kenya's greatest
              wildlife and coastal experiences.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              info@savannacrowntours.com
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Services", to: "#services" },
                { label: "Destinations", to: "/destinations" },
                { label: "Packages", to: "/packages" },
                { label: "Reviews", to: "/reviews" },
                { label: "Contact", to: "/inquiry" },
              ].map((l) => (
                <li key={l.label}>
                  {l.to.startsWith("#") ? (
                    <a
                      href={l.to}
                      className="text-sm text-stone-400 transition-colors hover:text-amber-400"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-sm text-stone-400 transition-colors hover:text-amber-400"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
              Contact
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-stone-400">
              <a
                href="mailto:info@savannacrowntours.com"
                className="hover:text-amber-400"
              >
                info@savannacrowntours.com
              </a>
              <a href="tel:+254700000000" className="hover:text-amber-400">
                +254 700 000 000
              </a>
              <span>Voi Town, Taita Taveta County</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800 pt-8">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Savanna Crown Tours & Travel. All
            rights reserved.
          </p>
          <p className="text-xs text-stone-700">Suleiman Baya & Juma Gonzi</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page root ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { data: featuredDestinations = [] } = useDestinations({
    featured: true,
    limit: 4,
    orderBy: "updatedAt",
    order: "desc",
  });
  const { data: packages = [] } = usePackages({ limit: 3 });
  const { data: allDestinations = [] } = useDestinations();

  return (
    <div className="min-h-screen font-sans antialiased">
      <Hero />
      <Stats
        destinationsCount={allDestinations.length}
        packagesCount={packages.length}
      />
      <Services />
      <FeaturedDestinations destinations={featuredDestinations} />
      <FeaturedPackages packages={packages} />
      <Testimonials />
      <InquiryCta />
      <Footer />
    </div>
  );
}
