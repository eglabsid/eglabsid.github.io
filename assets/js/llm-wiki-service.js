/**
 * LLM Wiki Service — Firebase v9 client-side module
 * Provides CRUD operations for the llm_wiki Firestore collection.
 * Used by the EGLab knowledge vault to persist and retrieve wiki entries.
 *
 * Collection: llm_wiki
 * Firebase project: saas-of-funqa
 */

// ── Firestore operation helpers ───────────────────────────────
// These functions expect the Firebase v9 SDK to be loaded via CDN.
// They are called from admin panel and knowledge vault pages.

/**
 * Fetch all wiki entries of a given type.
 * @param {import('firebase/firestore').Firestore} db
 * @param {'source'|'entity'|'concept'|'query'|'report'} type
 * @returns {Promise<Array>}
 */
async function llmWikiQueryByType(db, type) {
  const { collection, query, where, orderBy, getDocs } = window.firestoreSDK;
  const ref = collection(db, DB_COLLECTIONS.LLM_WIKI);
  const q = query(ref, where('type', '==', type), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetch a single wiki entry by ID.
 * @param {import('firebase/firestore').Firestore} db
 * @param {string} entryId
 * @returns {Promise<Object|null>}
 */
async function llmWikiGetEntry(db, entryId) {
  const { doc, getDoc } = window.firestoreSDK;
  const ref = doc(db, DB_COLLECTIONS.LLM_WIKI, entryId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Save (create or update) a wiki entry. Requires admin auth.
 * @param {import('firebase/firestore').Firestore} db
 * @param {Object} entry - { id, type, title, content, tags, path, sourceFile, createdBy }
 * @returns {Promise<string>} entry ID
 */
async function llmWikiSaveEntry(db, entry) {
  const { doc, setDoc, serverTimestamp } = window.firestoreSDK;
  const entryId = entry.id || entry.title.toLowerCase().replace(/\s+/g, '-');
  const ref = doc(db, DB_COLLECTIONS.LLM_WIKI, entryId);
  await setDoc(ref, {
    type:       entry.type,
    title:      entry.title,
    content:    entry.content     || '',
    tags:       entry.tags        || [],
    path:       entry.path        || '',
    sourceFile: entry.sourceFile  || '',
    createdBy:  entry.createdBy   || '',
    updatedAt:  serverTimestamp(),
    createdAt:  entry.createdAt   || serverTimestamp()
  }, { merge: true });
  return entryId;
}

/**
 * Delete a wiki entry. Requires admin auth.
 * @param {import('firebase/firestore').Firestore} db
 * @param {string} entryId
 * @returns {Promise<void>}
 */
async function llmWikiDeleteEntry(db, entryId) {
  const { doc, deleteDoc } = window.firestoreSDK;
  const ref = doc(db, DB_COLLECTIONS.LLM_WIKI, entryId);
  await deleteDoc(ref);
}

// Export for non-module environments
if (typeof module !== 'undefined') {
  module.exports = {
    llmWikiQueryByType,
    llmWikiGetEntry,
    llmWikiSaveEntry,
    llmWikiDeleteEntry
  };
}
