const { STATUS_CODES, DB_COLLECTIONS, apiMethods, MESSAGES } = require("../../utils/com_var");
const { sendResponse } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { checkMethod } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;
  if (!checkMethod(req, res, apiMethods.get)) return;

  try {
    const snapshot = await db.collection(DB_COLLECTIONS.TABLE_DATA).get();

    if (snapshot.empty)
      return sendResponse(res, STATUS_CODES.SUCCESS, MESSAGES.tableListFetch);

    const today = new Date();

    const data = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(item => item.listing_date) // make sure date exists
      .sort((a, b) => {
        const dateA = new Date(a.listing_date);
        const dateB = new Date(b.listing_date);
        // Sort by which listing date is closer to today
        const diffA = Math.abs(dateA - today);
        const diffB = Math.abs(dateB - today);
        return diffA - diffB; // smaller diff = closer to today
      });

    return sendResponse(res, STATUS_CODES.OK, "IPO Data list fetched successfully", data);
  } catch (err) {
    console.error("Error fetching IPO data:", err);
    return sendResponse(res, STATUS_CODES.INTERNAL_ERROR, "Failed to fetch IPO data", null, err.message || err);
  }
};


// const { STATUS_CODES, DB_COLLECTIONS, apiMethods, MESSAGES } = require("../../utils/com_var");
// const { sendResponse } = require("../../utils/com_fun");
// const { db } = require("../../utils/firebase");
// const { checkMethod } = require("../../utils/middleware");
// const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

// module.exports = async (req, res) => {
//   setCorsHeaders(res);
//   if (handlePreflight(req, res)) return;
//   if (!checkMethod(req, res, apiMethods.get)) return;

//   try {
//     const snapshot = await db.collection(DB_COLLECTIONS.TABLE_DATA)
//       .orderBy("createdAt", "desc")
//       .get();

//     if (snapshot.empty) return sendResponse(res, STATUS_CODES.SUCCESS, MESSAGES.tableListFetch);

//     const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));

//     return sendResponse(res, STATUS_CODES.OK, "IPO Data list fetched successfully", data);
//   } catch (err) {
//     console.error("Error fetching IPO data:", err);
//     return sendResponse(res, STATUS_CODES.INTERNAL_ERROR, "Failed to fetch IPO data", null, err.message || err);
//   }
// };
