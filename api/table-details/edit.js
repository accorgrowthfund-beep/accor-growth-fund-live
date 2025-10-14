const { STATUS_CODES, MESSAGES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse, validateTableDetailsPayload } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;

  // Allow POST (add) and PUT (edit)
  if (![apiMethods.post, apiMethods.put].includes(req.method)) {
    return sendResponse(res, STATUS_CODES.METHOD_NOT_ALLOWED, "Only POST and PUT methods are allowed");
  }

  try {
    const { id, data, company_name, issue_type, lead_manager, listing_date, amount_invested } = req.body;

    // If `data` is sent (for PUT), destructure from it; else use top-level fields (for POST)
    const payload = data || { company_name, issue_type, lead_manager, listing_date, amount_invested };

    // Validate input fields
    if (!validateTableDetailsPayload(payload, res)) return;

    // If `id` is present → Update
    if (id) {
      const docRef = db.collection(DB_COLLECTIONS.TABLE_DATA).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, "IPO data not found");
      }

      await docRef.update({
        ...payload,
        updatedAt: new Date().toISOString(),
      });

      return sendResponse(res, STATUS_CODES.OK, "IPO data updated successfully", { id });
    }

    // Else → Add new record
    const newDoc = await db.collection(DB_COLLECTIONS.TABLE_DATA).add({
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return sendResponse(res, STATUS_CODES.CREATED, "IPO data added successfully", { id: newDoc.id });
  } catch (err) {
    console.error("Error in IPO Add/Edit:", err);
    return sendResponse(
      res,
      STATUS_CODES.INTERNAL_ERROR,
      "Error adding or updating IPO data",
      null,
      err.message || err
    );
  }
};
