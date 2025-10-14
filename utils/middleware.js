const { STATUS_CODES, MESSAGES, apiMethods } = require("./com_var");
const { sendResponse, verifyToken } = require("./com_fun");
const { admin } = require("./firebase");

function checkMethod(req, res, method = apiMethods.post) {
  if (req.method !== method) {
    sendResponse(res, STATUS_CODES.METHOD_NOT_ALLOWED, MESSAGES.METHOD_NOT_ALLOWED);
    return false;
  }
  return true;
}
function checkTwoMethod(req, res, methods = [apiMethods.post]) {
  if (!Array.isArray(methods)) methods = [methods];
  if (!methods.includes(req.method)) {
    sendResponse(res, STATUS_CODES.METHOD_NOT_ALLOWED, MESSAGES.METHOD_NOT_ALLOWED);
    return false;
  }
  return true;
}
async function verifyRequestToken(req, res) {
  const tkn = req.headers.authorization || req.headers.Authorization;
  if (!tkn) {
    sendResponse(res, STATUS_CODES.UNAUTHORIZED, MESSAGES.NoTokenProvided);
    return null;
  }
  if (tkn.startsWith("Bearer ")) {
    tkn = tkn.split(" ")[1];
  }
  
  const result = await verifyToken(tkn, admin);

  if (!result.valid) {
    const msg = result.expired ? MESSAGES.TokenExpired : MESSAGES.InvalidToken;
    sendResponse(res, STATUS_CODES.UNAUTHORIZED, msg);
    return null;
  }

  return result.uid;
}

module.exports = { checkMethod, verifyRequestToken ,checkTwoMethod};
