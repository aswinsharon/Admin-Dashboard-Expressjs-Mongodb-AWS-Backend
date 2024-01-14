export abstract class Constants {
  //<--- status codes --->
  static readonly HTTP_OK_STATUS_CODE = 200;
  static readonly HTTP_CREATED_STATUS_CODE = 201;
  static readonly HTTP_SUCCESS_NO_CONTENT_STATUS_CODE = 204;
  static readonly HTTP_BAD_REQUEST_STATUS_CODE = 400;
  static readonly HTTP_UNAUTHORIZED_STATUS_CODE = 401;
  static readonly HTTP_FORBIDDEN_STATUS_CODE = 403;
  static readonly HTTP_NOT_FOUND_STATUS_CODE = 404;
  static readonly HTTP_CONFLICT_STATUS_CODE = 409;
  static readonly HTTP_SERVER_ERROR_STATUS_CODE = 500;

  //<--- status --->
  static readonly AUTHORIZED = "AUTHORIZED";
  static readonly UNAUTHORIZED = "UNAUTHORIZED";
  static readonly FORBIDDEN = "FORBIDDEN";
  static readonly INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";


  //success messages
  static readonly SUCCESS_MSG_AUTHORIZED_SUCCESSFULLY = "User authorized successfully";

  //error messages
  static readonly ERROR_MSG_UNAUTHORIZED_USER = "Unauthorized user";
  static readonly ERROR_MSG_FORBIDDEN_USER = "User not found or forbidden";
  static readonly ERROR_MSG_INTERNAL_SERVER_ERROR = "Internal server error";

}
