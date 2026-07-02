// Seeds Firestore with catalogue + sample transactional data for the
// react-abcederian project via the Admin SDK (bypasses security rules).
// Auth is left untouched — only the two existing Auth accounts are used for
// user-owned records (no fake Auth users are created).
const admin = require("firebase-admin");
const path = require("path");
const { pick } = require("./images.js");

const serviceAccount = require(
  path.join(__dirname, "..", "react-abcederian-firebase-adminsdk.json")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const now = FieldValue.serverTimestamp();

const ADMIN_UID = "Jl7SrYWh2hNgdEPhz2bg27H0VwJ3"; // ivar@admin.com
const MEMBER_UID = "lq0YQ1plbTc4OesqK69RSxPD74v1"; // member@member.com

async function commitAll(refs, dataFn) {
  const BATCH_LIMIT = 400;
  for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    refs.slice(i, i + BATCH_LIMIT).forEach((ref, idx) => {
      batch.set(ref, dataFn(ref, i + idx));
    });
    await batch.commit();
  }
}

async function seedUsers() {
  await db.collection("users").doc(ADMIN_UID).set({
    id: ADMIN_UID,
    email: "ivar@admin.com",
    full_name: "Ivar Admin",
    phone: "0712000001",
    role: "admin",
    tier: "resident",
    is_active: true,
    avatar_url: pick(0),
    created_at: now,
    updated_at: now,
  });

  await db.collection("users").doc(MEMBER_UID).set({
    id: MEMBER_UID,
    email: "member@member.com",
    full_name: "Sam Member",
    phone: "0712000002",
    role: "customer",
    tier: "citizen",
    is_active: true,
    avatar_url: pick(1),
    created_at: now,
    updated_at: now,
  });

  console.log("Seeded users/ (2 docs, matching existing Auth accounts)");
}

const DESTINATIONS = [
  {
    slug: "maasai-mara",
    name: "Maasai Mara National Reserve",
    tagline: "Home of the Great Migration",
    description:
      "Kenya's most famous reserve, renowned for the annual wildebeest migration, dense predator populations and rolling savanna plains.",
    region: "savanna",
    highlights: ["Great Migration", "Big Five", "Hot air balloon safaris"],
    featured: true,
    priceFrom: 25000,
    tags: ["wildlife", "safari", "migration"],
  },
  {
    slug: "amboseli-national-park",
    name: "Amboseli National Park",
    tagline: "Elephants under Kilimanjaro",
    description:
      "Famous for large elephant herds photographed against the backdrop of Mount Kilimanjaro, Africa's tallest peak.",
    region: "savanna",
    highlights: ["Elephant herds", "Kilimanjaro views", "Maasai culture"],
    featured: true,
    priceFrom: 18000,
    tags: ["wildlife", "elephants", "photography"],
  },
  {
    slug: "tsavo-east",
    name: "Tsavo East National Park",
    tagline: "The red-earth wilderness",
    description:
      "One of the world's largest game reserves, known for its red-dust elephants, the Yatta Plateau and the Galana River.",
    region: "savanna",
    highlights: ["Red elephants", "Yatta Plateau", "Lugard Falls"],
    featured: false,
    priceFrom: 15000,
    tags: ["wildlife", "safari"],
  },
  {
    slug: "diani-beach",
    name: "Diani Beach",
    tagline: "Powder-white sands on the Indian Ocean",
    description:
      "A palm-fringed stretch of white sand on Kenya's south coast, popular for water sports, kite surfing and reef diving.",
    region: "coast",
    highlights: ["White-sand beach", "Kite surfing", "Coral reef diving"],
    featured: true,
    priceFrom: 12000,
    tags: ["beach", "relaxation", "watersports"],
  },
  {
    slug: "lake-nakuru",
    name: "Lake Nakuru National Park",
    tagline: "The flamingo lake",
    description:
      "A soda lake famed for its flocks of flamingos and healthy populations of both black and white rhino.",
    region: "lake",
    highlights: ["Flamingos", "Rhino sanctuary", "Baboon cliff viewpoint"],
    featured: false,
    priceFrom: 14000,
    tags: ["wildlife", "birdwatching"],
  },
  {
    slug: "mount-kenya",
    name: "Mount Kenya National Park",
    tagline: "Africa's second-highest peak",
    description:
      "A UNESCO World Heritage site offering trekking routes through afro-alpine moorland to glacier-capped peaks.",
    region: "mountain",
    highlights: ["Point Lenana trek", "Afro-alpine flora", "Glacial tarns"],
    featured: false,
    priceFrom: 30000,
    tags: ["trekking", "mountain", "adventure"],
  },
  {
    slug: "lamu-island",
    name: "Lamu Island",
    tagline: "A living Swahili heritage town",
    description:
      "A UNESCO World Heritage old town with car-free streets, dhow sailing and centuries of Swahili-Arab architecture.",
    region: "marine",
    highlights: ["Old Town architecture", "Dhow sailing", "Swahili cuisine"],
    featured: false,
    priceFrom: 16000,
    tags: ["culture", "island", "heritage"],
  },
  {
    slug: "nairobi-national-park",
    name: "Nairobi National Park",
    tagline: "Wildlife within sight of the skyline",
    description:
      "The only national park bordering a capital city, offering rhino, lion and giraffe sightings against a city skyline backdrop.",
    region: "urban",
    highlights: ["City-skyline safari", "Rhino sanctuary", "Nairobi Safari Walk"],
    featured: true,
    priceFrom: 8000,
    tags: ["wildlife", "day-trip"],
  },
];

async function seedDestinations() {
  const refs = DESTINATIONS.map(() => db.collection("destinations").doc());
  const ids = {};

  await commitAll(refs, (ref, i) => {
    const d = DESTINATIONS[i];
    ids[d.slug] = ref.id;
    return {
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      description: d.description,
      region: d.region,
      highlights: d.highlights,
      heroImage: pick(i * 3),
      gallery: [pick(i * 3 + 1), pick(i * 3 + 2), pick(i * 3 + 3)],
      featured: d.featured,
      priceFrom: d.priceFrom,
      currency: "KES",
      tags: d.tags,
      seo: {
        title: `${d.name} | Voi Tours`,
        description: d.tagline,
        keywords: d.tags,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: ADMIN_UID,
      updatedBy: ADMIN_UID,
    };
  });

  console.log(`Seeded destinations/ (${refs.length} docs)`);
  return ids;
}

function buildPackages(destIds) {
  return [
    {
      slug: "mara-migration-safari-4d",
      title: "Maasai Mara Migration Safari",
      description:
        "A 4-day escorted safari through the Maasai Mara timed for peak wildebeest migration season, with two game drives daily.",
      duration_days: 4,
      is_active: true,
      hero_image: pick(2),
      highlights: ["Great Migration river crossings", "Big Five game drives", "Maasai village visit"],
      destinations: [{ destination_id: destIds["maasai-mara"], name: "Maasai Mara National Reserve", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Arrival & afternoon game drive", activity_description: "Transfer from Nairobi, check in, evening game drive.", included_meals: "dinner", accommodation_hint: "Mara tented camp" },
        { day_number: 2, activity_title: "Full-day migration safari", activity_description: "Full day tracking migration herds along the Mara River.", included_meals: "full board", accommodation_hint: "Mara tented camp" },
        { day_number: 3, activity_title: "Hot air balloon safari", activity_description: "Optional sunrise balloon safari followed by bush breakfast.", included_meals: "full board", accommodation_hint: "Mara tented camp" },
        { day_number: 4, activity_title: "Morning drive & departure", activity_description: "Final game drive then transfer back to Nairobi.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 42000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 55000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 950, currency: "USD" },
        { tier: "citizen", season: "peak", price_per_person: 52000, currency: "KES" },
        { tier: "international", season: "peak", price_per_person: 1150, currency: "USD" },
      ],
    },
    {
      slug: "amboseli-kilimanjaro-3d",
      title: "Amboseli & Kilimanjaro Views Safari",
      description:
        "A 3-day safari to Amboseli National Park focused on elephant herds and iconic Kilimanjaro backdrops.",
      duration_days: 3,
      is_active: true,
      hero_image: pick(5),
      highlights: ["Elephant herds", "Kilimanjaro sunrise photography", "Observation hill"],
      destinations: [{ destination_id: destIds["amboseli-national-park"], name: "Amboseli National Park", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Arrival & evening game drive", activity_description: "Drive from Nairobi, afternoon game drive.", included_meals: "dinner", accommodation_hint: "Amboseli lodge" },
        { day_number: 2, activity_title: "Full-day game viewing", activity_description: "Game drives around Enkongo Narok swamp.", included_meals: "full board", accommodation_hint: "Amboseli lodge" },
        { day_number: 3, activity_title: "Sunrise views & departure", activity_description: "Early Kilimanjaro photography then return to Nairobi.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 28000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 36000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 620, currency: "USD" },
      ],
    },
    {
      slug: "tsavo-east-explorer-3d",
      title: "Tsavo East Explorer",
      description:
        "Explore Kenya's largest park, home to red-dust elephants, Lugard Falls and the Yatta Plateau lava flow.",
      duration_days: 3,
      is_active: true,
      hero_image: pick(8),
      highlights: ["Red elephants", "Lugard Falls", "Yatta Plateau"],
      destinations: [{ destination_id: destIds["tsavo-east"], name: "Tsavo East National Park", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Arrival & game drive", activity_description: "Transfer in, afternoon game drive to Lugard Falls.", included_meals: "dinner", accommodation_hint: "Tsavo safari lodge" },
        { day_number: 2, activity_title: "Full-day safari", activity_description: "Explore Yatta Plateau and Galana River.", included_meals: "full board", accommodation_hint: "Tsavo safari lodge" },
        { day_number: 3, activity_title: "Morning drive & departure", activity_description: "Final game drive then departure.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 24000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 30000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 540, currency: "USD" },
      ],
    },
    {
      slug: "diani-beach-getaway-5d",
      title: "Diani Beach Getaway",
      description:
        "A relaxed 5-day beach escape on Diani's white sands with optional water sports and a dhow sunset cruise.",
      duration_days: 5,
      is_active: true,
      hero_image: pick(11),
      highlights: ["White-sand beach", "Dhow sunset cruise", "Kite surfing lessons"],
      destinations: [{ destination_id: destIds["diani-beach"], name: "Diani Beach", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Arrival & beach relaxation", activity_description: "Check in to beachfront resort, free afternoon.", included_meals: "dinner", accommodation_hint: "Diani beach resort" },
        { day_number: 2, activity_title: "Water sports day", activity_description: "Kite surfing lessons and snorkeling trip.", included_meals: "breakfast", accommodation_hint: "Diani beach resort" },
        { day_number: 3, activity_title: "Dhow sunset cruise", activity_description: "Evening traditional dhow cruise with seafood dinner.", included_meals: "full board", accommodation_hint: "Diani beach resort" },
        { day_number: 4, activity_title: "Free day", activity_description: "Leisure day at the resort.", included_meals: "breakfast", accommodation_hint: "Diani beach resort" },
        { day_number: 5, activity_title: "Departure", activity_description: "Checkout and transfer.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 32000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 40000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 700, currency: "USD" },
      ],
    },
    {
      slug: "nakuru-flamingo-day-trip",
      title: "Lake Nakuru Flamingo Day Trip",
      description:
        "A single-day trip to Lake Nakuru to see flamingos and both black and white rhino.",
      duration_days: 1,
      is_active: true,
      hero_image: pick(14),
      highlights: ["Flamingo flocks", "Rhino sanctuary", "Baboon cliff viewpoint"],
      destinations: [{ destination_id: destIds["lake-nakuru"], name: "Lake Nakuru National Park", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Full-day game drive", activity_description: "Early departure from Nairobi, full-day game drive, return in the evening.", included_meals: "lunch", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 9000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 11000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 220, currency: "USD" },
      ],
    },
    {
      slug: "mount-kenya-trek-6d",
      title: "Mount Kenya Point Lenana Trek",
      description:
        "A 6-day guided trek to Point Lenana via the Sirimon route, through moorland, glacial valleys and alpine peaks.",
      duration_days: 6,
      is_active: true,
      hero_image: pick(17),
      highlights: ["Point Lenana summit", "Afro-alpine moorland", "Glacial tarns"],
      destinations: [{ destination_id: destIds["mount-kenya"], name: "Mount Kenya National Park", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Sirimon gate to Old Moses Camp", activity_description: "Trek through montane forest to Old Moses Camp.", included_meals: "full board", accommodation_hint: "Old Moses Camp" },
        { day_number: 2, activity_title: "Old Moses to Shipton's Camp", activity_description: "Cross open moorland with views of the peaks.", included_meals: "full board", accommodation_hint: "Shipton's Camp" },
        { day_number: 3, activity_title: "Acclimatisation day", activity_description: "Short acclimatisation hike around the valley.", included_meals: "full board", accommodation_hint: "Shipton's Camp" },
        { day_number: 4, activity_title: "Summit Point Lenana", activity_description: "Pre-dawn summit push, descend to Chogoria.", included_meals: "full board", accommodation_hint: "Chogoria bandas" },
        { day_number: 5, activity_title: "Descent through forest", activity_description: "Descend through bamboo and montane forest.", included_meals: "full board", accommodation_hint: "Chogoria gate" },
        { day_number: 6, activity_title: "Departure", activity_description: "Transfer back to Nairobi.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 45000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 58000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 980, currency: "USD" },
      ],
    },
    {
      slug: "lamu-heritage-escape-4d",
      title: "Lamu Heritage Escape",
      description:
        "A 4-day cultural escape to Lamu's UNESCO-listed old town with dhow sailing and Swahili cuisine.",
      duration_days: 4,
      is_active: true,
      hero_image: pick(20),
      highlights: ["Old Town walking tour", "Dhow sailing", "Swahili cooking class"],
      destinations: [{ destination_id: destIds["lamu-island"], name: "Lamu Island", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Arrival & Old Town tour", activity_description: "Fly in, guided walking tour of the old town.", included_meals: "dinner", accommodation_hint: "Lamu guesthouse" },
        { day_number: 2, activity_title: "Dhow sailing trip", activity_description: "Full-day dhow sailing and snorkeling trip.", included_meals: "full board", accommodation_hint: "Lamu guesthouse" },
        { day_number: 3, activity_title: "Swahili cooking class", activity_description: "Cooking class and free time to explore.", included_meals: "full board", accommodation_hint: "Lamu guesthouse" },
        { day_number: 4, activity_title: "Departure", activity_description: "Morning at leisure, transfer to airstrip.", included_meals: "breakfast", accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 30000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 38000, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 680, currency: "USD" },
      ],
    },
    {
      slug: "nairobi-park-half-day",
      title: "Nairobi National Park Half-Day Safari",
      description:
        "A half-day safari inside Nairobi National Park, ideal for travellers with a short layover in the city.",
      duration_days: 1,
      is_active: true,
      hero_image: pick(23),
      highlights: ["City-skyline safari", "Rhino sanctuary", "Short layover friendly"],
      destinations: [{ destination_id: destIds["nairobi-national-park"], name: "Nairobi National Park", stop_order: 1 }],
      itinerary: [
        { day_number: 1, activity_title: "Half-day game drive", activity_description: "Morning or afternoon game drive with a professional guide.", included_meals: null, accommodation_hint: null },
      ],
      pricing: [
        { tier: "citizen", season: "regular", price_per_person: 5000, currency: "KES" },
        { tier: "resident", season: "regular", price_per_person: 6500, currency: "KES" },
        { tier: "international", season: "regular", price_per_person: 120, currency: "USD" },
      ],
    },
  ];
}

async function seedPackages(destIds) {
  const defs = buildPackages(destIds);
  const refs = defs.map(() => db.collection("packages").doc());
  const ids = {};

  await commitAll(refs, (ref, i) => {
    const p = defs[i];
    ids[p.slug] = ref.id;
    return {
      title: p.title,
      slug: p.slug,
      description: p.description,
      duration_days: p.duration_days,
      is_active: p.is_active,
      hero_image: p.hero_image,
      highlights: p.highlights,
      destinations: p.destinations,
      itinerary: p.itinerary,
      pricing: p.pricing,
      created_at: now,
      updated_at: now,
      created_by: ADMIN_UID,
      updated_by: ADMIN_UID,
    };
  });

  console.log(`Seeded packages/ (${refs.length} docs)`);
  return ids;
}

function isoDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function seedBookingsAndPayments(pkgIds) {
  const bookingDefs = [
    {
      type: "safari",
      status: "confirmed",
      total_amount: 84000,
      currency: "KES",
      payment_status: "fully_paid",
      paid_amount: 84000,
      pay: true,
      detail: {
        safari: {
          package_id: pkgIds["mara-migration-safari-4d"],
          travel_date: isoDaysFromNow(30),
          party_size: 2,
          tier_applied: "citizen",
          season_applied: "regular",
        },
      },
    },
    {
      type: "safari",
      status: "pending",
      total_amount: 28000,
      currency: "KES",
      payment_status: "partially_paid",
      paid_amount: 10000,
      pay: true,
      detail: {
        safari: {
          package_id: pkgIds["amboseli-kilimanjaro-3d"],
          travel_date: isoDaysFromNow(45),
          party_size: 1,
          tier_applied: "citizen",
          season_applied: "regular",
        },
      },
    },
    {
      type: "safari",
      status: "completed",
      total_amount: 9000,
      currency: "KES",
      payment_status: "fully_paid",
      paid_amount: 9000,
      pay: true,
      detail: {
        safari: {
          package_id: pkgIds["nakuru-flamingo-day-trip"],
          travel_date: isoDaysFromNow(-14),
          party_size: 1,
          tier_applied: "citizen",
          season_applied: "regular",
        },
      },
    },
    {
      type: "hotel",
      status: "confirmed",
      total_amount: null,
      currency: "KES",
      payment_status: "unpaid",
      paid_amount: 0,
      pay: false,
      detail: {
        hotel: {
          hotel_name: "Diani Beach Resort",
          room_category: "Deluxe Sea View",
          check_in: isoDaysFromNow(20),
          check_out: isoDaysFromNow(25),
          number_of_rooms: 1,
        },
      },
    },
    {
      type: "sgr_transfer",
      status: "pending",
      total_amount: null,
      currency: "KES",
      payment_status: "unpaid",
      paid_amount: 0,
      pay: false,
      detail: {
        transfer: {
          pickup_location: "Nairobi SGR Terminus",
          dropoff_location: "Diani Beach Resort",
          pickup_time: `${isoDaysFromNow(20)}T09:00:00`,
          vehicle_type: "van",
          flight_or_train_number: "SGR-102",
        },
      },
    },
    {
      type: "event",
      status: "pending",
      total_amount: null,
      currency: "KES",
      payment_status: "unpaid",
      paid_amount: 0,
      pay: false,
      detail: {
        event: {
          event_name: "Voi Tours Corporate Retreat",
          event_type: "corporate",
          venue_name: "Amboseli Serena Lodge",
          event_date: isoDaysFromNow(60),
          estimated_attendees: 40,
        },
      },
    },
  ];

  const bookingRefs = bookingDefs.map(() => db.collection("bookings").doc());

  await commitAll(bookingRefs, (ref, i) => {
    const b = bookingDefs[i];
    return {
      user_id: MEMBER_UID,
      type: b.type,
      status: b.status,
      total_amount: b.total_amount,
      currency: b.currency,
      payment_status: b.payment_status,
      paid_amount: b.paid_amount,
      internal_notes: null,
      created_at: now,
      updated_at: now,
      ...b.detail,
    };
  });

  console.log(`Seeded bookings/ (${bookingRefs.length} docs)`);

  const paymentDefs = bookingDefs
    .map((b, i) => ({ b, ref: bookingRefs[i] }))
    .filter((x) => x.b.pay);

  const paymentRefs = paymentDefs.map(() => db.collection("payments").doc());

  await commitAll(paymentRefs, (ref, i) => {
    const { b, ref: bookingRef } = paymentDefs[i];
    return {
      paymentId: ref.id,
      userId: MEMBER_UID,
      amount: b.paid_amount,
      phone: "0712000002",
      description: `Payment for booking ${bookingRef.id}`,
      status: "paid",
      checkoutRequestID: `seed-${ref.id.slice(0, 8)}`,
      confirmedVia: "callback",
      confirmedAt: now,
      metadata: { bookingId: bookingRef.id },
      createdAt: now,
      appliedToBooking: true,
    };
  });

  console.log(`Seeded payments/ (${paymentRefs.length} docs)`);

  return bookingRefs.map((r) => r.id);
}

async function seedReviews(pkgIds, destIds) {
  const reviewDefs = [
    { package_id: pkgIds["mara-migration-safari-4d"], destination_id: null, rating: 5, comment: "Witnessing the river crossing was the experience of a lifetime. Our guide knew exactly where to position us.", user_name: "Sam Member" },
    { package_id: pkgIds["amboseli-kilimanjaro-3d"], destination_id: null, rating: 5, comment: "Kilimanjaro at sunrise with elephants in the foreground - unforgettable. Lodge food was excellent too.", user_name: "Sam Member" },
    { package_id: null, destination_id: destIds["diani-beach"], rating: 4, comment: "Beautiful white sand and calm water. The dhow cruise at sunset was a highlight of our trip.", user_name: "Sam Member" },
    { package_id: pkgIds["nakuru-flamingo-day-trip"], destination_id: null, rating: 4, comment: "Saw both black and white rhino plus thousands of flamingos in a single day trip. Great value.", user_name: "Ivar Admin" },
    { package_id: null, destination_id: destIds["mount-kenya"], rating: 5, comment: "Tough but incredibly rewarding trek. Point Lenana at sunrise is worth every step.", user_name: "Sam Member" },
    { package_id: pkgIds["lamu-heritage-escape-4d"], destination_id: null, rating: 5, comment: "Lamu Old Town felt like stepping back in time. The cooking class was a fun surprise.", user_name: "Ivar Admin" },
    { package_id: null, destination_id: destIds["nairobi-national-park"], rating: 4, comment: "Hard to believe this is inside a capital city. Saw lions within an hour of arriving.", user_name: "Sam Member" },
    { package_id: pkgIds["tsavo-east-explorer-3d"], destination_id: null, rating: 4, comment: "The red-dust elephants at Lugard Falls were unlike anything we'd seen elsewhere in Kenya.", user_name: "Sam Member" },
  ];

  const refs = reviewDefs.map(() => db.collection("reviews").doc());

  await commitAll(refs, (ref, i) => {
    const r = reviewDefs[i];
    return {
      user_id: r.user_name === "Ivar Admin" ? ADMIN_UID : MEMBER_UID,
      user_name: r.user_name,
      package_id: r.package_id,
      destination_id: r.destination_id,
      rating: r.rating,
      comment: r.comment,
      is_visible_on_homepage: true,
      created_at: now,
    };
  });

  console.log(`Seeded reviews/ (${refs.length} docs)`);
}

async function seedInquiries() {
  const inquiryDefs = [
    { customer_name: "Grace Wanjiru", customer_email: "grace.wanjiru@example.com", customer_phone: "0722111222", requested_service: "safari", message: "Hi, I'm planning a 5-day safari for a family of 4 in August, budget around 200,000 KES total. Can you recommend a package and check availability?", is_converted: false, assigned_agent_id: null },
    { customer_name: "David Otieno", customer_email: "david.otieno@example.com", customer_phone: "0733222333", requested_service: "hotel", message: "Looking for a beachfront hotel in Diani for a week in December, 2 rooms, sea view preferred. What options do you have?", is_converted: true, assigned_agent_id: ADMIN_UID },
    { customer_name: "Amina Hassan", customer_email: "amina.hassan@example.com", customer_phone: "0744333444", requested_service: "event", message: "We're organizing a 40-person corporate retreat near Amboseli in October. Need venue, catering and transport quotes please.", is_converted: false, assigned_agent_id: ADMIN_UID },
    { customer_name: "John Mwangi", customer_email: "john.mwangi@example.com", customer_phone: "0755444555", requested_service: "sgr_transfer", message: "Need a private transfer from Nairobi SGR terminus to Diani Beach for 6 people next month, arriving on the morning train.", is_converted: false, assigned_agent_id: null },
    { customer_name: "Emily Carter", customer_email: "emily.carter@example.com", customer_phone: "+14155550142", requested_service: "safari", message: "Visiting from the US in September, interested in a Maasai Mara migration safari for 2 people, 4-5 days. What's the best time this year?", is_converted: true, assigned_agent_id: ADMIN_UID },
  ];

  const refs = inquiryDefs.map(() => db.collection("inquiries").doc());

  await commitAll(refs, (ref, i) => {
    const q = inquiryDefs[i];
    return { ...q, created_at: now };
  });

  console.log(`Seeded inquiries/ (${refs.length} docs)`);
}

(async () => {
  console.log(`Seeding project "${serviceAccount.project_id}"...`);
  await seedUsers();
  const destIds = await seedDestinations();
  const pkgIds = await seedPackages(destIds);
  await seedBookingsAndPayments(pkgIds);
  await seedReviews(pkgIds, destIds);
  await seedInquiries();
  console.log("Seeding complete.");
  process.exit(0);
})().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
