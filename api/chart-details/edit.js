const { STATUS_CODES, MESSAGES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse, validateChartPayload } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { checkMethod } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
      setCorsHeaders(res);
       if (handlePreflight(req, res)) return;
    if (!checkMethod(req, res, apiMethods.put)) return;

    try {
        const { id, data } = req.body;
        const {
            nav,
            date,
            GrowthSinceInception,
            series,
            categories,
            colors,
            lines
        } = data;

        if (!id) return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Chart ID is required");
         if (!validateChartPayload(data, res)) return;
        // Update document
        const docRef = db.collection(DB_COLLECTIONS.CHART_DATA).doc(id);
        await docRef.update({
            nav,
            date,
            GrowthSinceInception,
            series,
            categories,
            colors,
            lines,
            updatedAt: new Date().toISOString()
        });

        return sendResponse(res, STATUS_CODES.OK, "Chart data updated successfully", { id });

    } catch (err) {
        console.error("Error updating chart data:", err);
        return sendResponse(
            res,
            STATUS_CODES.INTERNAL_ERROR,
            "Failed to update chart data",
            null,
            err.message || err
        );
    }
};



// const { STATUS_CODES, MESSAGES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
// const { sendResponse } = require("../../utils/com_fun");
// const { db } = require("../../utils/firebase");
// const { checkMethod } = require("../../utils/middleware");
// const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

// module.exports = async (req, res) => {
//     setCorsHeaders(res);
//      if (handlePreflight(req, res)) return;
//   if (!checkMethod(req, res, apiMethods.post)) return;

//   try {
//     const {
//       nav,
//       date,
//       GrowthSinceInception,
//       series,
//       categories,
//       colors,
//       lines 
//     } = req.body;

//     // Basic validation
//     if (!nav || !date || !GrowthSinceInception) {
//       return sendResponse(res, STATUS_CODES.BAD_REQUEST, "NAV, Date, and GrowthSinceInception are required");
//     }

//     if (!Array.isArray(series) || series.length < 2) {
//       return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Minimum 2 series required");
//     }

//     if (!Array.isArray(colors) || colors.length !== series.length) {
//       return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Number of colors must match series length");
//     }

//     if (!Array.isArray(lines) || lines.length < 1) {
//       return sendResponse(res, STATUS_CODES.BAD_REQUEST, "At least 1 note is required");
//     }

//     if (!Array.isArray(categories) || categories.length < 1) {
//       return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Categories are required");
//     }

//     // Create document
//     const docRef = await db.collection(DB_COLLECTIONS.CHART_DATA).add({
//       nav,
//       date,
//       GrowthSinceInception,
//       series,
//       categories,
//       colors,
//       lines,
//       createdAt: new Date().toISOString()
//     });

//     return sendResponse(res, STATUS_CODES.OK, "Chart data added successfully", { id: docRef.id });
//   } catch (err) {
//     console.error("Error adding chart data:", err);
//     return sendResponse(
//       res,
//       STATUS_CODES.INTERNAL_ERROR,
//       "Failed to add chart data",
//       null,
//       err.message || err
//     );
//   }
// };
