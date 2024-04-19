export class Response {
    statusCode: number;
    status: string;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    invalidFields?: string[];
    response: any;

    constructor(statusCode: number, status: string, message: string, accessToken?: string, refreshToken?: string, invalidFields?: string[], response?: any) {
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
        if (response) {
            this.response = response;
        }
    }
}

// export class ErrorResponse extends Response {
//     constructor(statusCode: number, status: string, message: string, invalidFields?: string[]) {
//         super(statusCode, status, message);
//         this.invalidFields = invalidFields;
//     }
// }
