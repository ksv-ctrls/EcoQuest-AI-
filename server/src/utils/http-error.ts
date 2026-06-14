export class HttpError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export function createHttpError(statusCode: number, message: string) {
  return new HttpError(statusCode, message)
}
