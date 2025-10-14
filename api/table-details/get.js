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
    const snapshot = await db.collection(DB_COLLECTIONS.TABLE_DATA)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return sendResponse(res, STATUS_CODES.SUCCESS, MESSAGES.tableListFetch);

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));

    return sendResponse(res, STATUS_CODES.OK, "IPO Data list fetched successfully", data);
  } catch (err) {
    console.error("Error fetching IPO data:", err);
    return sendResponse(res, STATUS_CODES.INTERNAL_ERROR, "Failed to fetch IPO data", null, err.message || err);
  }
};
