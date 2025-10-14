import { MESSAGES, STATUS_CODES } from "../utils/com_var.js";
import { sendResponse } from "../utils/com_fun.js";

const USERNAME = process.env.ADMIN_USER;
const PASSWORD = process.env.ADMIN_PASS;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendResponse(
      res,
      STATUS_CODES.METHOD_NOT_ALLOWED,
      MESSAGES.METHOD_NOT_ALLOWED
    );
  }

  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    // ✅ Valid credentials → tell frontend to continue
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, {});
  } else {
    return sendResponse(
      res,
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.INVALID_CREDENTIALS
    );
  }
}
