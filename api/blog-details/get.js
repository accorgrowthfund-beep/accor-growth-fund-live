// const { STATUS_CODES, MESSAGES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
// const { sendResponse } = require("../../utils/com_fun");
// const { db } = require("../../utils/firebase");
// const { checkMethod, verifyRequestToken } = require("../../utils/middleware");
// const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

// module.exports = async (req, res) => {
//   setCorsHeaders(res);
//   if (handlePreflight(req, res)) return;

//   // Only allow GET method
//   if (!checkMethod(req, res, apiMethods.get)) return;

//   // Verify auth token (optional)
//   // const uid = await verifyRequestToken(req, res);
//   // if (!uid) return;

//   try {
//     const { id } = req.query;

//     // 🔹 Case 1: Get single blog by ID
//     if (id) {
//       const snapshot = await db
//         .collection(DB_COLLECTIONS.BLOGS)
//         .orderBy("created_date", "desc")
//         .get();

//       const blogs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const index = blogs.findIndex(b => b.id === id);
//       if (index === -1) {
//         return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
//       }

//       const singleBlog = blogs[index];
//       const next = blogs[index - 1]?.id || null; // Next newer blog
//       const previous = blogs[index + 1]?.id || null; // Previous older blog

//       return sendResponse(res, STATUS_CODES.OK, "Blog fetched successfully", {
//         data: singleBlog,
//         next,
//         previous,
//       });
//     }

//     // 🔹 Case 2: Get all blogs
//     const snapshot = await db
//       .collection(DB_COLLECTIONS.BLOGS)
//       .orderBy("created_date", "desc")
//       .get();

//     const blogs = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // You can later extend pagination (limit, startAfter, etc.)
//     return sendResponse(res, STATUS_CODES.OK, "Blogs fetched successfully", {
//       data: blogs,
//       next: null,
//       previous: null,
//     });
//   } catch (err) {
//     console.error("Error fetching blogs:", err);
//     return sendResponse(
//       res,
//       STATUS_CODES.INTERNAL_ERROR,
//       "Failed to fetch blogs",
//       null,
//       err.message || err
//     );
//   }
// };









const { STATUS_CODES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse } = require("../../utils/com_fun");
const { db } = require("../../utils/firebase");
const { checkMethod } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;

  if (!checkMethod(req, res, apiMethods.get)) return;

  try {
    const { id } = req.query;

    const snapshot = await db
      .collection(DB_COLLECTIONS.BLOGS)
      .orderBy("created_date", "desc")
      .get();

    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      short_desc_list: doc.data().short_desc_list || "",
      thumbnail: doc.data().thumbnail || "",
      ...doc.data(),
    }));

    // 🔹 Case 1: Get single blog by ID
    if (id) {
      const index = blogs.findIndex(b => b.id === id);
      if (index === -1) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
      }

      const singleBlog = blogs[index];

      const next = blogs[index - 1]
        ? {
            id: blogs[index - 1].id,
            short_desc_list: blogs[index - 1].short_desc_list,
            thumbnail: blogs[index - 1].thumbnail,
          }
        : null;

      const previous = blogs[index + 1]
        ? {
            id: blogs[index + 1].id,
            short_desc_list: blogs[index + 1].short_desc_list,
            thumbnail: blogs[index + 1].thumbnail,
          }
        : null;

      return sendResponse(res, STATUS_CODES.OK, "Blog fetched successfully", {
        data: singleBlog,
        next,
        previous,
      });
    }

    // 🔹 Case 2: Get all blogs
    return sendResponse(res, STATUS_CODES.OK, "Blogs fetched successfully", {
      data: blogs,
      next: null,
      previous: null,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return sendResponse(
      res,
      STATUS_CODES.INTERNAL_ERROR,
      "Failed to fetch blogs",
      null,
      err.message || err
    );
  }
};

