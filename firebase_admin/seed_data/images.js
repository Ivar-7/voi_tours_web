// Pool of verified-live Unsplash CDN URLs (checked via HEAD request before
// use). Destinations/packages store externally-hosted image URLs directly —
// see src/config/firebase/storage.rules — so no Storage upload is needed.
// Verified live AND checked for on-theme content (safari wildlife, Kenyan
// savanna/coast/mountain scenery) — earlier candidates that resolved fine
// but showed unrelated stock content (perfume ad, food, non-African
// landmarks, a tiger) were dropped after visual review.
const IDS = [
  "photo-1516426122078-c23e76319801", // safari jeep at sunset
  "photo-1521651201144-634f700b36ef", // elephants, savanna
  "photo-1523805009345-7448845a9e53", // giraffe silhouette
  "photo-1518709594023-6eab9bab7b23", // zebras in grass
  "photo-1544979590-37e9b47eb705", // leopard close-up
  "photo-1547970810-dc1eac37d174", // rhinos, savanna
  "photo-1535338454770-8be927b5a00b", // rhinos, savanna (2)
  "photo-1547471080-7cc2caa01a7e", // acacia tree, savanna sunset
  "photo-1489493887464-892be6d1daae", // acacia tree by river, sunset
  "photo-1547036967-23d11aacaee0", // aerial turquoise beach coastline
  "photo-1500375592092-40eb2168fd21", // ocean waves, aerial
  "photo-1523978591478-c753949ff840", // aerial coastal cliffs at dusk
  "photo-1516815231560-8f41ec531527", // overwater bungalows, tropical beach
  "photo-1483168527879-c66136b56105", // palm trees, sunset silhouette
  "photo-1590523278191-995cbcda646b", // palm tree, beach sunset
  "photo-1490682143684-14369e18dce8", // sunset mountain ridge silhouette
  "photo-1441716844725-09cedc13a4e7", // person with reflection, lake + mountain
  "photo-1589553416260-f586c8f1514f", // hiker crossing open savanna/highland plain
  "photo-1523712999610-f77fbcfc3843", // sunbeams through forest
  "photo-1517824806704-9040b037703b", // night sky, stars, camping tent
  "photo-1504432842672-1a79f78e4084", // person on hilltop bluff
];

function img(id, w = 1600, h = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

function pick(index) {
  return img(IDS[index % IDS.length]);
}

module.exports = { pick, img, IDS };
