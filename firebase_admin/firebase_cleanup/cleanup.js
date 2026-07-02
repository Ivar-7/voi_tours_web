// Deletes ALL documents in ALL Firestore collections and ALL objects in the
// default Storage bucket. Auth users are intentionally left untouched.
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(
  path.join(__dirname, "..", "react-abcederian-firebase-adminsdk.json")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function deleteCollection(collectionRef, batchSize = 300) {
  const snapshot = await collectionRef.limit(batchSize).get();
  if (snapshot.empty) return 0;

  let deleted = 0;
  const batch = db.batch();
  for (const doc of snapshot.docs) {
    // Recurse into subcollections before deleting the parent doc.
    const subcollections = await doc.ref.listCollections();
    for (const sub of subcollections) {
      await deleteCollection(sub, batchSize);
    }
    batch.delete(doc.ref);
    deleted++;
  }
  await batch.commit();

  if (snapshot.size >= batchSize) {
    deleted += await deleteCollection(collectionRef, batchSize);
  }
  return deleted;
}

async function wipeFirestore() {
  const collections = await db.listCollections();
  if (collections.length === 0) {
    console.log("Firestore: no top-level collections found.");
    return;
  }
  for (const col of collections) {
    const count = await deleteCollection(col);
    console.log(`Firestore: deleted ${count} docs from "${col.id}"`);
  }
}

async function wipeStorage() {
  const [files] = await bucket.getFiles();
  if (files.length === 0) {
    console.log("Storage: no objects found.");
    return;
  }
  await Promise.all(files.map((f) => f.delete({ ignoreNotFound: true })));
  console.log(`Storage: deleted ${files.length} objects.`);
}

(async () => {
  console.log(`Wiping Firestore + Storage for project "${serviceAccount.project_id}" (Auth untouched)...`);
  await wipeFirestore();
  await wipeStorage();
  console.log("Cleanup complete.");
  process.exit(0);
})().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
