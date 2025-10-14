const { STATUS_CODES, MESSAGES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { checkMethod } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
    setCorsHeaders(res);
     if (handlePreflight(req, res)) return;
  if (!checkMethod(req, res, apiMethods.get)) return;

  try {
    const chartRef = db.collection(DB_COLLECTIONS.CHART_DATA);

    // Get only the latest document
    const snapshot = await chartRef.orderBy("createdAt", "desc").limit(1).get();

    if (snapshot.empty) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, "No Chart data found");
    }

    const doc = snapshot.docs[0];
    const fundData = { id: doc.id, ...doc.data() };

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.chartDataFetched, fundData);
  } catch (err) {
    console.error("Error fetching fund data:", err);
    return sendResponse(
      res,
      STATUS_CODES.INTERNAL_ERROR,
      MESSAGES.chartDataFetchFailed,
      null,
      err.message || err
    );
  }
};
