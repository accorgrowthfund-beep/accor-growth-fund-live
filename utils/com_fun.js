import { MESSAGES, STATUS_CODES } from "./com_var";

export const sendResponse = (res, statusCode, message, data = null, error = null) => {
    const success = statusCode >= 200 && statusCode < 300;

    return res.status(statusCode).json({
        success,
        statusCode,
        message,
        ...(data && { data }),
        ...(error && { error }),
    });
};

export const  verifyToken = async(tkn, admin) => {
  try {
    const decoded = await admin.auth().verifyIdToken(tkn);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return { valid: false, expired: true };
    }
    return { valid: true, uid: decoded.uid };
  } catch (err) {
    console.error(MESSAGES.TokenVerificationFailed, err);
    return { valid: false, expired: false };
  }
}

export const validateChartPayload = (reqBody, res) => {
  const { nav, date, GrowthSinceInception, series, categories, colors, lines } = reqBody;

  if (!nav || !date || !GrowthSinceInception) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "NAV, Date, and GrowthSinceInception are required");
    return false;
  }

  if (!Array.isArray(series) || series.length < 2) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Minimum 2 series required");
    return false;
  }

  if (!Array.isArray(colors) || colors.length !== series.length) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Number of colors must match series length");
    return false;
  }

  if (!Array.isArray(lines) || lines.length < 1) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "At least 1 note is required");
    return false;
  }

  if (!Array.isArray(categories) || categories.length < 1) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Categories are required");
    return false;
  }

  return true; 
}
export const validateBlogPayload = (reqBody, res, isUpdate = false) => {
  const { id, thumbnail, author, short_desc_list, short_desc_detail, description,detail_image } = reqBody;

  // For updates, id is required
  if (isUpdate && !id) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Blog ID is required for update");
    return false;
  }

  // Required fields
  if (!thumbnail || !author || !short_desc_list || !description) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Thumbnail URL, Author, Short Description List, and Description are required");
    return false;
  }

  // Optional: validate thumbnail as URL
  try {
    new URL(thumbnail);
  } catch (err) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Thumbnail must be a valid URL");
    return false;
  }

  return true;
};
export const validateTableDetailsPayload = (reqBody, res) => {
  const { company_name, issue_type, lead_manager, listing_date, amount_invested } = reqBody;

  // Check required fields
  // if (!company_name || !issue_type || !lead_manager || !listing_date ) {
  //   sendResponse(res, STATUS_CODES.BAD_REQUEST, "All fields are required: company_name, issue_type, lead_manager and listing_date");
  //   return false;
  // }
  
if (!amount_invested || typeof amount_invested !== "string" ) {
  sendResponse(res, STATUS_CODES.BAD_REQUEST, "amount_invested is required and must be a string");
  return false;
}

  // Validate data types
  if (typeof company_name !== "string" || company_name.trim() === "") {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Invalid company_name");
    return false;
  }

  if (typeof issue_type !== "string" || issue_type.trim() === "") {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Invalid issue_type");
    return false;
  }

  if (typeof lead_manager !== "string" || lead_manager.trim() === "") {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Invalid lead_manager");
    return false;
  }

  // Check valid date format
  if (isNaN(Date.parse(listing_date))) {
    sendResponse(res, STATUS_CODES.BAD_REQUEST, "Invalid listing_date");
    return false;
  }



  return true;
};

export const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}