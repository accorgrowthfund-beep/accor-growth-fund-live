const { STATUS_CODES, DB_COLLECTIONS, apiMethods } = require("../../utils/com_var");
const { sendResponse, validateBlogPayload } = require("../../utils/com_fun");
const { db, storage } = require("../../utils/firebase");
const { checkTwoMethod, verifyRequestToken } = require("../../utils/middleware");
const { setCorsHeaders, handlePreflight } = require("../../utils/cors");

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;

  if (!checkTwoMethod(req, res, [apiMethods.post, apiMethods.put, apiMethods.delete])) return;

  // Verify token
  const uid = await verifyRequestToken(req, res);
  if (!uid) return;

  const { id, thumbnail, detail_image, author, short_desc_list, short_desc_detail, description } = req.body;

  try {
    if (req.method === apiMethods.post) {
      if (!validateBlogPayload(req.body, res)) return;

      const created_date = new Date().toISOString();
      const updated_date = created_date;

      const docRef = db.collection(DB_COLLECTIONS.BLOGS).doc();
      await docRef.set({
        thumbnail,
        detail_image,
        author,
        short_desc_list,
        short_desc_detail: short_desc_detail || "",
        description,
        created_date,
        updated_date,
        uid,
      });

      return sendResponse(res, STATUS_CODES.CREATED, "Blog created successfully", { id: docRef.id });

    }
    // else if (req.method === apiMethods.put) {
    //   if (!validateBlogPayload(req.body, res, true)) return;

    //   const docRef = db.collection(DB_COLLECTIONS.BLOGS).doc(id);
    //   const docSnapshot = await docRef.get();
    //   if (!docSnapshot.exists) {
    //     return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
    //   }

    //   const updated_date = new Date().toISOString();

    //   await docRef.update({
    //     thumbnail,
    //     detail_image,
    //     author,
    //     short_desc_list,
    //     short_desc_detail: short_desc_detail || "",
    //     description,
    //     updated_date,
    //   });

    //   const updatedSnapshot = await docRef.get();
    //   return sendResponse(res, STATUS_CODES.OK, "Blog updated successfully", { id: updatedSnapshot.id, ...updatedSnapshot.data() });

    // }
    else if (req.method === apiMethods.put) {
      if (!validateBlogPayload(req.body, res, true)) return;

      const docRef = db.collection(DB_COLLECTIONS.BLOGS).doc(id);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
      }

      const oldData = docSnapshot.data();
      const oldThumbnail = oldData.thumbnail;
      const oldDetailImage = oldData.detail_image;
      console.log(oldDetailImage,"oldDetailImage",  oldThumbnail, "oldThumbnail");

      const updated_date = new Date().toISOString();

      // Update Firestore with new data
      await docRef.update({
        thumbnail,
        detail_image,
        author,
        short_desc_list,
        short_desc_detail: short_desc_detail || "",
        description,
        updated_date,
      });

      // Delete old images from Firebase Storage if changed
      const bucket = storage.bucket();
      console.log(bucket);
      
      // try {
      //   if (thumbnail !== oldThumbnail && oldThumbnail) {
      //     const path = oldThumbnail.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
      //     if (path) await bucket.file(path).delete();
      //   }
      // } catch (err) {
      //   console.error("Failed to delete old thumbnail:", err);
      // }
      // gs://accor-growth-fund-e14e3.firebasestorage.app
      // try {
      //   if (detail_image !== oldDetailImage && oldDetailImage) {
      //     const path = detail_image.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
      //     if (path) await bucket.file(path).delete();
      //   }
      // } catch (err) {
      //   console.error("Failed to delete old detail image:", err);
      // }

      const updatedSnapshot = await docRef.get();
      return sendResponse(res, STATUS_CODES.OK, "Blog updated successfully", { id: updatedSnapshot.id, ...updatedSnapshot.data() });
    }

    // else if (req.method === apiMethods.delete) {
    //   if (!id) {
    //     return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Blog ID is required for delete");
    //   }

    //   const docRef = db.collection(DB_COLLECTIONS.BLOGS).doc(id);
    //   const docSnapshot = await docRef.get();
    //   if (!docSnapshot.exists) {
    //     return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
    //   }

    //   await docRef.delete();
    //   return sendResponse(res, STATUS_CODES.OK, "Blog deleted successfully", { id });
    // }

    else if (req.method === apiMethods.delete) {
      if (!id) {
        return sendResponse(res, STATUS_CODES.BAD_REQUEST, "Blog ID is required for delete");
      }

      const docRef = db.collection(DB_COLLECTIONS.BLOGS).doc(id);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, "Blog not found");
      }

      const blogData = docSnapshot.data();
      const oldThumbnail = blogData.thumbnail;
      const oldDetailImage = blogData.detail_image;

      // Delete Firestore document
      await docRef.delete();

      // Delete images from Firebase Storage
      const bucket = storage.bucket();

      try {
        if (oldThumbnail) {
          const path = oldThumbnail.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
          if (path) await bucket.file(path).delete();
        }
      } catch (err) {
        console.error("Failed to delete thumbnail on blog delete:", err);
      }

      try {
        if (oldDetailImage) {
          const path = oldDetailImage.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
          if (path) await bucket.file(path).delete();
        }
      } catch (err) {
        console.error("Failed to delete detail image on blog delete:", err);
      }

      return sendResponse(res, STATUS_CODES.OK, "Blog deleted successfully", { id });
    }


  } catch (err) {
    console.error("Error managing blog data:", err);
    return sendResponse(res, STATUS_CODES.INTERNAL_ERROR, "Failed to process blog", null, err.message || err);
  }
};
