const { STATUS_CODES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { checkMethod } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;
  if (!checkMethod(req, res, apiMethods.delete)) return;

  try {
    const { id } = req.body;
    if (!id) return sendResponse(res, STATUS_CODES.BAD_REQUEST, "IPO ID is required");

    const docRef = db.collection(DB_COLLECTIONS.TABLE_DATA).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return sendResponse(res, STATUS_CODES.NOT_FOUND, "IPO data not found");

    await docRef.delete();
    return sendResponse(res, STATUS_CODES.OK, "IPO data deleted successfully");
  } catch (err) {
    console.error("Error deleting IPO data:", err);
    return sendResponse(res, STATUS_CODES.INTERNAL_ERROR, "Failed to delete IPO data", null, err.message || err);
  }
};
