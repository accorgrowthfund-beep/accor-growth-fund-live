const MESSAGES = {
    METHOD_NOT_ALLOWED: "Method not allowed",
    INVALID_CREDENTIALS: "Invalid username or password",
    LOGIN_SUCCESS: "Login successful",
    TOKEN_ERROR: "Failed to create authentication token",
    ERROR_UPDATING_VACANCY: "Error updating vacancy",
    dashBannerIdRequired: "'id' is required to update fund data",
    fundDataNotFound: "Fund data not found",
    notAllowedToEditData: "You are not allowed to edit this data",
    nonEmptyDataArray: "'data' must be a non-empty array of fund items",
    fundDataAdded: "Fund data added successfully!",
    fundDataUpdated: "Fund data updated successfully",
    fundDataFetched: "Fund data fetched successfully",
    fundDataUpdateFailed: "Failed to update fund data",
    invalidUpdateData: "'id' and 'updatedData' are required to update fund data",
    fundDataAddFailed: "Failed to add fund data",
    fundDataFetchFailed: "Failed to fetch fund data",
    NoTokenProvided: "No Token Provided",
    TokenExpired: "Token Expired",
    InvalidToken: "Invalid Token",
    Unauthorized: "Unauthorized",
    TokenVerificationFailed: "Token verification failed:",

    chartDataFetched: "Chart data fetched successfully",
        chartDataFetchFailed: "Failed to Chart data",
        tableListFetch:"ipo data Fetch SuccessFully"
};

const STATUS_CODES = {
    OK: 200,
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
};

const apiMethods = {
    post: "POST",
    get: "GET",
    put: "PUT",
    delete: "DELETE",
}

const DB_COLLECTIONS = {
    USERS: "users",
    VACANCIES: "vacancies",
    APPLICATIONS: "applications",
    DASH_BANNER: "dashBanner",
    FUND_DATA: "fundData",
    CHART_DATA: "chartData",
    TABLE_DATA:"tableData",
    BLOGS:"blogData"
};





module.exports = { STATUS_CODES, MESSAGES, apiMethods, DB_COLLECTIONS };