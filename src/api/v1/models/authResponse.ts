export class AuthResponse {
    statusCode: number;
    status: string;
    message: string;
    accessToken?: string;
    refreshToken?: string;

    constructor(statusCode: number, status: string, message: string, accessToken?: string, refreshToken?: string) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

export class ErrorResponse {
    statusCode: number;
    status: string;
    message: string;
    invalidFields: string;

    constructor(statusCode: number, status: string, message: string, invalidFields: string) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.invalidFields = invalidFields;
    }
}