// /api/banner-details/edit.js

const { STATUS_CODES, MESSAGES, apiMethods, DB_COLLECTIONS } = require("../../utils/com_var");
const { sendResponse } = require("../../utils/com_fun");
const { db, admin } = require("../../utils/firebase");
const { checkMethod, verifyRequestToken } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
    setCorsHeaders(res);
     if (handlePreflight(req, res)) return;
  // Only allow PUT requests
  if (!checkMethod(req, res, apiMethods.put)) return;

  // Verify token
  const uid = await verifyRequestToken(req, res);
  if (!uid) return;

  const { id, data } = req.body;

  // Validate input
  if (!id) {
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Fund document ID is required");
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Data array is required and cannot be empty");
  } 

  try {
    const docRef = db.collection(DB_COLLECTIONS.FUND_DATA).doc(id);

    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.fundDataNotFound);
    }

    await docRef.update({
      data, 
      uid, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.fundDataUpdated,
      { id: updatedSnapshot.id, ...updatedSnapshot.data() }
    );
  } catch (err) {
    console.error("Error updating fund data:", err);
    return sendResponse(
      res,
      STATUS_CODES.INTERNAL_ERROR,
      MESSAGES.fundDataUpdateFailed,
      null,
      err.message || err
    );
  }
};


// const { STATUS_CODES, MESSAGES, apiMethods, DB_COLLECTIONS } = require("../../utils/com_var");
// const { sendResponse } = require("../../utils/com_fun");
// const { db, admin } = require("../../utils/firebase");
// const { checkMethod, verifyRequestToken } = require("../../utils/middleware");
// const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

// module.exports = async (req, res) => {
//     setCorsHeaders(res);
//      if (handlePreflight(req, res)) return;
//   if (!checkMethod(req, res, apiMethods.post)) return;

//   const uid = await verifyRequestToken(req, res);
//   if (!uid) return;

//   const { data } = req.body;

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return sendResponse(res, STATUS_CODES.BAD_REQUEST, MESSAGES.nonEmptyDataArray);
//   }

//   try {
//     const docRef = db.collection(DB_COLLECTIONS.FUND_DATA).doc();
//     await docRef.set({
//       data,   
//       uid,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.fundDataAdded, { id: docRef.id });
//   } catch (err) {
//     console.error("Error adding fund data:", err);
//     return sendResponse(
//       res,
//       STATUS_CODES.INTERNAL_ERROR,
//       MESSAGES.fundDataAddFailed,
//       null,
//       err.message || err
//     );
//   }
// };
