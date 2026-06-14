export class HttpError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
export function createHttpError(statusCode, message) {
    return new HttpError(statusCode, message);
}
