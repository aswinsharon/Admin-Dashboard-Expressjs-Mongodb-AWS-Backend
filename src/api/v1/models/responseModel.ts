export class Response {
    statusCode: number;
    status: string;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    invalidFields?: string[];

    constructor(statusCode: number, status: string, message: string, accessToken?: string, refreshToken?: string, invalidFields?: string[]) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        if (accessToken) {
            this.accessToken = accessToken;
        }
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
        if (invalidFields) {
            this.invalidFields = invalidFields;
        }
    }
}

// export class ErrorResponse extends Response {
//     constructor(statusCode: number, status: string, message: string, invalidFields?: string[]) {
//         super(statusCode, status, message);
//         this.invalidFields = invalidFields;
//     }
// }
